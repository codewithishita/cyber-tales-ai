// src/lib/db/users.ts
// All user-related database operations

import { db } from './client'
import { getRankFromXp, RANK_CONFIG } from '@/types'
import type { Rank, XpSource } from '@/types'

// ─── GET OR CREATE USER ────────────────────────────────────────────────────────
export async function getOrCreateUser(clerkId: string, email: string, name?: string) {
  return db.user.upsert({
    where: { clerkId },
    update: { lastActiveAt: new Date() },
    create: {
      clerkId,
      email,
      name: name ?? email.split('@')[0],
      xp: 0,
      level: 1,
      rank: 'INTERNET_EXPLORER',
      cyberSafetyScore: 0,
      streak: 0,
    },
  })
}

// ─── GET USER WITH STATS ───────────────────────────────────────────────────────
export async function getUserWithStats(clerkId: string) {
  const user = await db.user.findUnique({
    where: { clerkId },
    include: {
      adventures: {
        where: { isCompleted: true },
        orderBy: { completedAt: 'desc' },
        take: 5,
        include: { adventure: { select: { title: true, topic: true } } },
      },
      challenges: {
        where: { isCompleted: true },
        orderBy: { completedAt: 'desc' },
        take: 5,
        include: { challenge: { select: { title: true, type: true } } },
      },
      achievements: {
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      },
      xpTransactions: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) return null

  const [totalAdventures, totalChallenges, mentorSessions] = await Promise.all([
    db.userAdventure.count({ where: { userId: user.id } }),
    db.userChallenge.count({ where: { userId: user.id } }),
    db.mentorSession.count({ where: { userId: user.id } }),
  ])

  const xpThisWeek = user.xpTransactions.reduce((sum, t) => sum + t.amount, 0)

  return {
    ...user,
    stats: {
      totalAdventures,
      completedAdventures: user.adventures.length,
      totalChallenges,
      completedChallenges: user.challenges.length,
      achievementsUnlocked: user.achievements.length,
      xpThisWeek,
      mentorSessions,
    },
  }
}

// ─── AWARD XP ──────────────────────────────────────────────────────────────────
export async function awardXp(
  userId: string,
  amount: number,
  source: XpSource,
  description: string,
  referenceId?: string,
) {
  const [user] = await Promise.all([
    db.user.update({
      where: { id: userId },
      data: { xp: { increment: amount } },
    }),
    db.xpTransaction.create({
      data: { userId, amount, source, description, referenceId },
    }),
  ])

  // Check if rank should be updated
  const newRank = getRankFromXp(user.xp)
  if (newRank !== user.rank) {
    await db.user.update({
      where: { id: userId },
      data: { rank: newRank },
    })
    return { xpAwarded: amount, rankUp: { from: user.rank, to: newRank } }
  }

  return { xpAwarded: amount, rankUp: null }
}

// ─── UPDATE CYBER SAFETY SCORE ─────────────────────────────────────────────────
export async function updateCyberSafetyScore(userId: string) {
  // Calculate score based on recent performance
  const recentChallenges = await db.userChallenge.findMany({
    where: { userId, isCompleted: true },
    orderBy: { completedAt: 'desc' },
    take: 20,
    select: { score: true },
  })

  if (recentChallenges.length === 0) return 0

  const avgScore = recentChallenges.reduce((sum, c) => sum + c.score, 0) / recentChallenges.length
  const safetyScore = Math.round(avgScore)

  await db.user.update({
    where: { id: userId },
    data: { cyberSafetyScore: safetyScore },
  })

  return safetyScore
}

// ─── CHECK AND AWARD ACHIEVEMENTS ──────────────────────────────────────────────
export async function checkAndAwardAchievements(userId: string) {
  const [user, allAchievements, userAchievementIds] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.achievement.findMany(),
    db.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
  ])

  if (!user) return []

  const earnedIds = new Set(userAchievementIds.map(ua => ua.achievementId))
  const newlyEarned: typeof allAchievements = []

  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue

    const condition = achievement.condition as Record<string, unknown>
    let earned = false

    switch (condition.type) {
      case 'adventures_completed': {
        const count = await db.userAdventure.count({ where: { userId, isCompleted: true } })
        earned = count >= (condition.threshold as number)
        break
      }
      case 'xp_total': {
        earned = user.xp >= (condition.threshold as number)
        break
      }
      case 'streak_days': {
        earned = user.streak >= (condition.threshold as number)
        break
      }
      case 'perfect_challenge_score': {
        const count = await db.userChallenge.count({
          where: { userId, score: 100, isCompleted: true },
        })
        earned = count >= (condition.threshold as number)
        break
      }
    }

    if (earned) {
      await db.userAchievement.create({
        data: { userId, achievementId: achievement.id },
      })
      if (achievement.xpReward > 0) {
        await awardXp(userId, achievement.xpReward, 'ACHIEVEMENT_UNLOCKED', `Achievement: ${achievement.name}`, achievement.id)
      }
      newlyEarned.push(achievement)
    }
  }

  return newlyEarned
}

// ─── GET XP HISTORY FOR CHART ──────────────────────────────────────────────────
export async function getXpHistory(userId: string, days = 14) {
  const transactions = await db.xpTransaction.findMany({
    where: {
      userId,
      createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
    },
    orderBy: { createdAt: 'asc' },
  })

  // Group by day
  const grouped = transactions.reduce<Record<string, number>>((acc, t) => {
    const day = t.createdAt.toISOString().split('T')[0]
    acc[day] = (acc[day] ?? 0) + t.amount
    return acc
  }, {})

  // Fill in missing days with 0
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const day = date.toISOString().split('T')[0]
    result.push({
      date: day,
      xp: grouped[day] ?? 0,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
  }

  return result
}
