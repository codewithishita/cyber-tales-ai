// src/lib/achievements.ts
// Achievement check engine. Called after any XP-earning action.

import { prisma } from "./db";
import type { XpSource } from "@prisma/client";

// Check and unlock any newly earned achievements for a user.
// Returns array of newly unlocked achievement names.
export async function checkAndUnlockAchievements(userId: string): Promise<string[]> {
  const [user, allAchievements, userAchievements, stats] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
    getUserStats(userId),
  ]);

  const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));
  const newlyUnlocked: string[] = [];

  for (const achievement of allAchievements) {
    if (unlockedIds.has(achievement.id)) continue;

    const condition = achievement.condition as Record<string, unknown>;
    const earned = await evaluateCondition(condition, userId, user, stats);

    if (earned) {
      await prisma.$transaction([
        prisma.userAchievement.create({ data: { userId, achievementId: achievement.id } }),
        prisma.user.update({ where: { id: userId }, data: { xp: { increment: achievement.xpReward } } }),
        prisma.xpEvent.create({
          data: { userId, amount: achievement.xpReward, source: "ACHIEVEMENT_UNLOCKED", sourceId: achievement.id },
        }),
      ]);
      newlyUnlocked.push(achievement.name);
    }
  }

  return newlyUnlocked;
}

async function getUserStats(userId: string) {
  const [adventures, challenges] = await Promise.all([
    prisma.userAdventure.findMany({
      where: { userId, status: "COMPLETED" },
      include: { adventure: { select: { topic: true } } },
    }),
    prisma.userChallenge.findMany({
      where: { userId },
      include: { challenge: { select: { type: true } } },
    }),
  ]);

  return { adventures, challenges };
}

async function evaluateCondition(
  condition: Record<string, unknown>,
  userId: string,
  user: { rank: string; streakDays: number },
  stats: { adventures: any[]; challenges: any[] }
): Promise<boolean> {
  switch (condition.type) {
    case "adventures_completed":
      return stats.adventures.length >= (condition.count as number);
    case "adventures_by_topic":
      return stats.adventures.filter((a) => a.adventure.topic === condition.topic).length >= (condition.count as number);
    case "perfect_challenge_score":
      return stats.challenges.some((c) => c.score === 100);
    case "perfect_challenge_type":
      return stats.challenges.some((c) => c.score === 100 && c.challenge.type === condition.challengeType);
    case "challenges_by_type":
      return stats.challenges.filter((c) => c.challenge.type === condition.challengeType).length >= (condition.count as number);
    case "reach_rank":
      return user.rank === condition.rank;
    case "streak_days":
      return user.streakDays >= (condition.count as number);
    default:
      return false;
  }
}
