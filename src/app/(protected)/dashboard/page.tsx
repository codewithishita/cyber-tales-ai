// src/app/(protected)/dashboard/page.tsx
// Server component — fetches initial data, passes to client components

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { resolveUserId } from "@/lib/auth";
import { xpToNextRank, RANK_LABELS, RANK_ICONS, calculateCyberSafetyScore } from "@/lib/xp";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  let userId: string;
  try {
    userId = await resolveUserId(clerkId);
  } catch {
    // User not in DB yet — redirect to sync
    redirect("/api/user/sync");
  }

  const [user, completedAdventures, userChallenges, userAchievements, xpEvents] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.userAdventure.findMany({
      where: { userId, status: "COMPLETED" },
      include: { adventure: { select: { topic: true, title: true } } },
      orderBy: { completedAt: "desc" },
      take: 20,
    }),
    prisma.userChallenge.findMany({
      where: { userId },
      include: { challenge: { select: { type: true, title: true } } },
      orderBy: { completedAt: "desc" },
      take: 20,
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    }),
    prisma.xpEvent.findMany({
      where: { userId, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const { next: nextRank, needed: xpNeeded, progress } = xpToNextRank(user.xp);

  // Build weekly XP chart data
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const weeklyXp = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const dayXp = xpEvents
      .filter((e) => new Date(e.createdAt).toDateString() === day.toDateString())
      .reduce((sum, e) => sum + e.amount, 0);
    return { day: days[day.getDay()], xp: dayXp };
  });

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

  return (
    <DashboardClient
      user={{
        id: user.id,
        firstName: user.firstName,
        rank: user.rank,
        xp: user.xp,
        streakDays: user.streakDays,
        cyberSafetyScore,
        nextRank: nextRank ?? null,
        xpToNextRank: xpNeeded,
        progressToNextRank: progress,
      }}
      stats={{
        totalAdventures: completedAdventures.length,
        totalChallenges: userChallenges.length,
        avgChallengeScore,
      }}
      achievements={userAchievements.map((ua) => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt.toISOString(),
      }))}
      recentActivity={[
        ...completedAdventures.slice(0, 3).map((a) => ({
          type: "adventure" as const,
          label: a.adventure.title,
          xp: a.xpEarned,
          time: a.completedAt?.toISOString() ?? "",
        })),
        ...userChallenges.slice(0, 3).map((c) => ({
          type: "challenge" as const,
          label: c.challenge.title,
          xp: c.xpEarned,
          time: c.completedAt.toISOString(),
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 6)}
      weeklyXp={weeklyXp}
    />
  );
}
