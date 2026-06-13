// src/app/api/mentor/chat/route.ts
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { groq, MODELS } from "@/lib/ai";
import { resolveUserId } from "@/lib/auth";
import type { MentorMessage } from "@/types";

const MENTOR_SYSTEM_PROMPT = `You are Cipher, an AI cybersecurity mentor for young learners aged 8-15.

Your personality:
- Encouraging and patient, never condescending
- Explains complex concepts with simple analogies
- Celebrates progress genuinely
- Points out mistakes constructively, never harshly
- Uses real-world examples kids relate to: gaming, social media, texting

Your knowledge covers: phishing, password security, online privacy, safe browsing, cyberbullying, scam detection.

Response style:
- Conversational, warm, clear
- Maximum 3 paragraphs per response
- End with an actionable tip or follow-up question when natural`;

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return new Response("Unauthorized", { status: 401 });

    const { message, chatId } = await req.json();
    if (!message) return new Response("Missing message", { status: 400 });

    const userId = await resolveUserId(clerkId);

    // Load or create chat session
    let chat = chatId
      ? await prisma.mentorChat.findUnique({ where: { id: chatId, userId } })
      : null;

    if (!chat) {
      const userContext = await getUserContext(userId);
      chat = await prisma.mentorChat.create({
        data: {
          userId,
          messages: [
            {
              role: "system",
              content: buildContextMessage(userContext),
              timestamp: new Date().toISOString(),
            },
          ],
        },
      });
    }

    const existingMessages = (chat.messages as any[]) as MentorMessage[];

    // Build messages for Groq
    const aiMessages = [
      { role: "system" as const, content: MENTOR_SYSTEM_PROMPT },
      ...existingMessages
        .filter((m) => m.role !== "system")
        .slice(-20)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      { role: "user" as const, content: message },
    ];

    // Groq streaming
    const stream = await groq.chat.completions.create({
      model: MODELS.mentor,
      messages: aiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 600,
    });

    let fullResponse = "";
    const currentChatId = chat.id;
    const userMsg: MentorMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...existingMessages, userMsg];

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            fullResponse += delta;
            if (delta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
              );
            }
          }

          // Save to DB
          const assistantMsg: MentorMessage = {
            role: "assistant",
            content: fullResponse,
            timestamp: new Date().toISOString(),
          };

          await prisma.$transaction([
            prisma.mentorChat.update({
              where: { id: currentChatId },
              data: { messages: [...updatedMessages, assistantMsg] as any },
            }),
            prisma.xpEvent.create({
              data: {
                userId,
                amount: 20,
                source: "MENTOR_SESSION",
                sourceId: currentChatId,
              },
            }),
            prisma.user.update({
              where: { id: userId },
              data: { xp: { increment: 20 }, lastActivityAt: new Date() },
            }),
          ]);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, chatId: currentChatId })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
          console.error("[mentor/chat stream]", err);
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[mentor/chat]", error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function getUserContext(userId: string) {
  const [user, recentAdventures, recentChallenges] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { rank: true, xp: true, cyberSafetyScore: true },
    }),
    prisma.userAdventure.findMany({
      where: { userId, status: "COMPLETED" },
      include: { adventure: { select: { topic: true } } },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
    prisma.userChallenge.findMany({
      where: { userId },
      include: { challenge: { select: { type: true } } },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
  ]);
  return { user, recentAdventures, recentChallenges };
}

function buildContextMessage(context: any): string {
  return `[User context]
Rank: ${context.user?.rank ?? "Unknown"}
XP: ${context.user?.xp ?? 0}
Cyber Safety Score: ${context.user?.cyberSafetyScore ?? 0}/100
Recent adventures: ${context.recentAdventures.map((a: any) => a.adventure.topic).join(", ") || "None yet"}
Recent challenges: ${context.recentChallenges.map((c: any) => c.challenge.type).join(", ") || "None yet"}`;
}