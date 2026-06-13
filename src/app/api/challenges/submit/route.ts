// src/app/api/challenges/submit/route.ts
// POST — submit challenge answers, score them, award XP

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { resolveUserId } from "@/lib/auth";
import { getRankFromXp, XP_REWARDS } from "@/lib/xp";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import type { PhishingEmailPayload, UrlAnalysisPayload, ScamMessagePayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { challengeId, answers, timeTaken } = await req.json();
    if (!challengeId || !answers) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const userId = await resolveUserId(clerkId);

    const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) return NextResponse.json({ success: false, error: "Challenge not found" }, { status: 404 });

    // Score the answers based on challenge type
    const { score, feedback } = scoreChallenge(challenge.type, challenge.payload as any, answers);

    const isPerfect = score === 100;
    const xpEarned = Math.round(challenge.xpReward * (score / 100));
    const xpSource = isPerfect ? "CHALLENGE_PERFECT" : "CHALLENGE_COMPLETE";

    await prisma.$transaction(async (tx) => {
      await tx.userChallenge.create({
        data: { userId, challengeId, answers, score, xpEarned, timeTaken: timeTaken ?? 0 },
      });
      const user = await tx.user.update({
        where: { id: userId },
        data: { xp: { increment: xpEarned }, lastActivityAt: new Date() },
      });
      await tx.xpEvent.create({
        data: { userId, amount: xpEarned, source: xpSource, sourceId: challengeId },
      });
      const newRank = getRankFromXp(user.xp);
      if (newRank !== user.rank) {
        await tx.user.update({ where: { id: userId }, data: { rank: newRank } });
      }
    });

    const newlyUnlocked = await checkAndUnlockAchievements(userId);

    return NextResponse.json({
      success: true,
      data: { score, xpEarned, isPerfect, feedback, explanation: challenge.explanation, newlyUnlocked },
    });
  } catch (error) {
    console.error("[challenges/submit]", error);
    return NextResponse.json({ success: false, error: "Failed to submit challenge" }, { status: 500 });
  }
}

function scoreChallenge(
  type: string,
  payload: PhishingEmailPayload | UrlAnalysisPayload | ScamMessagePayload | any,
  answers: any
): { score: number; feedback: Record<string, boolean> } {
  switch (type) {
    case "PHISHING_EMAIL":
    case "SCAM_MESSAGE": {
      const p = payload as PhishingEmailPayload;
      const selected: string[] = answers.selectedFlags ?? [];
      const correct = p.correctFlags;
      const feedback: Record<string, boolean> = {};
      for (const flag of correct) {
        feedback[flag] = selected.includes(flag);
      }
      // Penalize false positives
      const correctHits = selected.filter((f) => correct.includes(f)).length;
      const falsePositives = selected.filter((f) => !correct.includes(f)).length;
      const score = Math.max(0, Math.round(((correctHits - falsePositives * 0.5) / correct.length) * 100));
      return { score, feedback };
    }
    case "URL_ANALYSIS": {
      // User must identify whether URL is malicious and select threat signals
      const p = payload as UrlAnalysisPayload;
      const isMaliciousAnswer: boolean = answers.isMalicious ?? false;
      const selectedThreats: string[] = answers.selectedThreats ?? [];
      const correctThreats = p.threats.filter((t) => t.severity === "high").map((t) => t.type);

      let points = 0;
      if (isMaliciousAnswer === p.isMalicious) points += 40;
      const threatHits = selectedThreats.filter((t) => correctThreats.includes(t)).length;
      points += Math.round((threatHits / correctThreats.length) * 60);

      const feedback: Record<string, boolean> = {};
      for (const t of correctThreats) {
        feedback[t] = selectedThreats.includes(t);
      }
      return { score: Math.min(100, points), feedback };
    }
    case "PASSWORD_STRENGTH": {
      // User selects weaknesses for each password
      const p = payload as any;
      let totalCorrect = 0;
      let totalPossible = 0;
      const feedback: Record<string, boolean> = {};
      for (const [pwd, weaknesses] of Object.entries(p.weaknesses) as [string, string[]][]) {
        const selected: string[] = answers[pwd] ?? [];
        for (const w of weaknesses) {
          totalPossible++;
          if (selected.includes(w)) { totalCorrect++; feedback[`${pwd}_${w}`] = true; }
          else { feedback[`${pwd}_${w}`] = false; }
        }
      }
      return { score: Math.round((totalCorrect / totalPossible) * 100), feedback };
    }
    default:
      return { score: 50, feedback: {} };
  }
}
