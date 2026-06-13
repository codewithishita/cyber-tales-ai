// src/app/api/progress/route.ts
// GET — return full dashboard stats for the authenticated user

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { resolveUserId } from "@/lib/auth";
import { xpToNextRank, RANK_LABELS, RANK_ICONS, calculateCyberSafetyScore } from "@/lib/xp";
import type { UserStats, WeeklyXp, TopicProgress } from "@/types";
import type { AdventureTopic } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const userId = await resolveUserId(clerkId);

    const [user, completedAdventures, userChallenges, achievements, xpEvents] = await Promise.all([
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.userAdventure.findMany({
        where: { userId, status: "COMPLETED" },
        include: { adventure: { select: { topic: true } } },
        orderBy: { completedAt: "desc" },
      }),
      prisma.userChallenge.findMany({
        where: { userId },
        include: { challenge: { select: { type: true, title: true } } },
        orderBy: { completedAt: "desc" },
      }),
      prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
      }),
      prisma.xpEvent.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    ]);

    // ── Core stats ───────────────────────────────────────────
    const { next: nextRank, needed: xpNeeded, progress } = xpToNextRank(user.xp);
    const avgChallengeScore = userChallenges.length > 0
      ? Math.round(userChallenges.reduce((sum, c) => sum + c.score, 0) / userChallenges.length)
      : 0;

    const safeAdventures = completedAdventures.filter((a) => a.outcome === "SAFE").length;
    const topicsCovered = new Set(completedAdventures.map((a) => a.adventure.topic)).size;

    const cyberSafetyScore = calculateCyberSafetyScore({
      totalChallenges: userChallenges.length,
      avgChallengeScore,
      totalAdventures: completedAdventures.length,
      safeAdventures,
      topicsCovered,
    });

    // Update safety score if changed
    if (cyberSafetyScore !== user.cyberSafetyScore) {
      await prisma.user.update({ where: { id: userId }, data: { cyberSafetyScore } });
    }

    // ── Weekly XP (last 7 days) ──────────────────────────────
    const weeklyXp: WeeklyXp[] = buildWeeklyXp(xpEvents);

    // ── Recent activity (last 5 XP events with labels) ──────
    const recentXpEvents = xpEvents.slice(0, 8).map((e) => ({
      amount: e.amount,
      source: e.source,
      label: formatXpSource(e.source),
      createdAt: e.createdAt.toISOString(),
    }));

    // ── Topic progress ───────────────────────────────────────
    const topics: AdventureTopic[] = [
      "PHISHING", "PASSWORD_SECURITY", "ONLINE_PRIVACY",
      "CYBERBULLYING", "SCAM_DETECTION", "SAFE_BROWSING", "SOCIAL_ENGINEERING",
    ];
    const topicProgress: TopicProgress[] = topics.map((topic) => {
      const topicAdventures = completedAdventures.filter((a) => a.adventure.topic === topic);
      return {
        topic,
        label: topic.replace(/_/g, " "),
        adventuresCompleted: topicAdventures.length,
        avgScore: 0, // Would need a score field on UserAdventure for full accuracy
      };
    });

    const stats: UserStats & { achievements: any[]; weeklyXp: WeeklyXp[] } = {
      xp: user.xp,
      rank: user.rank,
      cyberSafetyScore,
      streakDays: user.streakDays,
      totalAdventures: completedAdventures.length,
      totalChallenges: userChallenges.length,
      avgChallengeScore,
      xpToNextRank: xpNeeded,
      progressToNextRank: progress,
      nextRank,
      recentXpEvents,
      topicProgress,
      achievements: achievements.map((ua) => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt.toISOString(),
      })),
      weeklyXp,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("[progress]", error);
    return NextResponse.json({ success: false, error: "Failed to fetch progress" }, { status: 500 });
  }
}

function buildWeeklyXp(xpEvents: { amount: number; createdAt: Date }[]): WeeklyXp[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const result: WeeklyXp[] = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const dayStr = days[day.getDay()];
    const dayXp = xpEvents
      .filter((e) => {
        const eDay = new Date(e.createdAt);
        return eDay.toDateString() === day.toDateString();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    result.push({ day: dayStr, xp: dayXp });
  }
  return result;
}

function formatXpSource(source: string): string {
  const labels: Record<string, string> = {
    ADVENTURE_COMPLETE: "Completed an adventure",
    ADVENTURE_PERFECT: "Perfect adventure run",
    CHALLENGE_COMPLETE: "Completed a challenge",
    CHALLENGE_PERFECT: "Perfect challenge score",
    ACHIEVEMENT_UNLOCKED: "Achievement unlocked",
    STREAK_BONUS: "Daily streak bonus",
    MENTOR_SESSION: "Mentor session",
  };
  return labels[source] ?? source;
}
