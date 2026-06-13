// src/app/api/adventures/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { groq, MODELS } from "@/lib/ai";
import { resolveUserId } from "@/lib/auth";
import type { AdventureGenerationRequest, StoryTree } from "@/types";
import type { AdventureTopic, Difficulty, AgeGroup } from "@prisma/client";

const TOPIC_CONTEXTS: Record<AdventureTopic, string> = {
  PHISHING: "phishing emails and fake websites designed to steal login credentials",
  PASSWORD_SECURITY: "weak passwords, password reuse, and credential stuffing attacks",
  ONLINE_PRIVACY: "oversharing personal information online, privacy settings, data collection",
  CYBERBULLYING: "online harassment, hurtful messages, how to respond safely",
  SCAM_DETECTION: "prize scams, fake tech support, social engineering over text or phone",
  SAFE_BROWSING: "suspicious downloads, browser security, public Wi-Fi risks",
  SOCIAL_ENGINEERING: "manipulation tactics used by attackers to bypass good judgment",
};

const AGE_GUIDANCE: Record<AgeGroup, string> = {
  AGE_8_10: "Simple vocabulary, short sentences, relatable scenarios like gaming or cartoons.",
  AGE_11_13: "Clear language with occasional technical terms explained in context. Social media, gaming.",
  AGE_14_15: "Technical vocabulary acceptable. Scenarios involving social media, financial accounts, jobs.",
};

const DIFFICULTY_GUIDANCE: Record<Difficulty, string> = {
  BEGINNER: "Obvious threat. One clear red flag. Safe choice feels intuitive.",
  INTERMEDIATE: "2-3 subtle red flags. Dangerous choice is tempting.",
  ADVANCED: "Sophisticated, well-disguised threat. Multiple plausible options.",
};

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body: AdventureGenerationRequest = await req.json();
    const { topic, difficulty, ageGroup } = body;
    if (!topic || !difficulty || !ageGroup) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const userId = await resolveUserId(clerkId);

    const prompt = `Create a 3-scene interactive cybersecurity adventure.
Topic: ${TOPIC_CONTEXTS[topic]}
Age: ${AGE_GUIDANCE[ageGroup]}
Difficulty: ${DIFFICULTY_GUIDANCE[difficulty]}

Return ONLY valid JSON with this exact structure:
{
  "firstSceneId": "scene_1",
  "scenes": {
    "scene_1": {
      "id": "scene_1",
      "narrative": "2-3 paragraph engaging story setup placing user in realistic situation",
      "setting": "Short location e.g. Your bedroom Saturday afternoon",
      "isEnding": false,
      "choices": [
        {"id":"c_1a","text":"Safe action 1 sentence","risk":"safe","nextSceneId":"scene_2a","xpReward":30,"outcome":"Immediate result","lesson":"Cybersecurity lesson"},
        {"id":"c_1b","text":"Risky but tempting action","risk":"risky","nextSceneId":"scene_2b","xpReward":0,"outcome":"Immediate result","lesson":"What this mistake teaches"},
        {"id":"c_1c","text":"Cautious neutral option","risk":"neutral","nextSceneId":"scene_2c","xpReward":15,"outcome":"Immediate result","lesson":"Lesson"}
      ]
    },
    "scene_2a": {"id":"scene_2a","narrative":"Safe path outcome 2 paragraphs","setting":"Setting","isEnding":true,"endingType":"safe","choices":[]},
    "scene_2b": {"id":"scene_2b","narrative":"Risky path consequence dramatic real impact 2 paragraphs","setting":"Setting","isEnding":true,"endingType":"unsafe","choices":[]},
    "scene_2c": {"id":"scene_2c","narrative":"Neutral path outcome partial success 2 paragraphs","setting":"Setting","isEnding":true,"endingType":"partial","choices":[]}
  }
}`;

    const completion = await groq.chat.completions.create({
      model: MODELS.adventure,
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity education expert. Respond with valid JSON only — no markdown fences, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 2500,
    });

    const rawContent = completion.choices[0].message.content ?? "";

    // Clean the response — remove markdown fences and control characters
    const cleaned = rawContent
      .replace(/```json|```/g, "")
      .replace(/[\x00-\x1F\x7F]/g, " ")
      .trim();

    if (!cleaned) throw new Error("No content returned from Groq");

    const storyTree = JSON.parse(cleaned) as StoryTree;
    if (!storyTree.firstSceneId || !storyTree.scenes) throw new Error("Invalid story tree structure");

    const firstScene = storyTree.scenes[storyTree.firstSceneId];
    const title = `${topic.replace(/_/g, " ")} -- ${difficulty} Adventure`;

    const [adventure, userAdventure] = await prisma.$transaction(async (tx) => {
      const adv = await tx.adventure.create({
        data: { topic, difficulty, ageGroup, title, storyTree: storyTree as any },
      });
      const ua = await tx.userAdventure.create({
        data: { userId, adventureId: adv.id, status: "IN_PROGRESS" },
      });
      return [adv, ua];
    });

    return NextResponse.json({
      success: true,
      data: {
        adventureId: adventure.id,
        userAdventureId: userAdventure.id,
        title: adventure.title,
        firstScene,
      },
    });
  } catch (error) {
    console.error("[adventures/generate]", error);
    return NextResponse.json({ success: false, error: "Failed to generate adventure" }, { status: 500 });
  }
}