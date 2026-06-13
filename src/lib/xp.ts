// src/lib/xp.ts
// XP + rank calculation engine. Pure functions — no DB calls.
// These are called by API routes after writing XP events to the DB.

import type { Rank, XpSource } from "@prisma/client";

// XP required to reach each rank
export const RANK_THRESHOLDS: Record<Rank, number> = {
  INTERNET_EXPLORER: 0,
  CYBER_ROOKIE: 500,
  SECURITY_SCOUT: 1500,
  THREAT_HUNTER: 4500,
  CYBER_GUARDIAN: 10000,
  CYBER_MASTER: 25000,
};

export const RANK_LABELS: Record<Rank, string> = {
  INTERNET_EXPLORER: "Internet Explorer",
  CYBER_ROOKIE: "Cyber Rookie",
  SECURITY_SCOUT: "Security Scout",
  THREAT_HUNTER: "Threat Hunter",
  CYBER_GUARDIAN: "Cyber Guardian",
  CYBER_MASTER: "Cyber Master",
};

export const RANK_ICONS: Record<Rank, string> = {
  INTERNET_EXPLORER: "🌐",
  CYBER_ROOKIE: "🥋",
  SECURITY_SCOUT: "🔭",
  THREAT_HUNTER: "🎯",
  CYBER_GUARDIAN: "🛡",
  CYBER_MASTER: "⚡",
};

// Derive rank from total XP
export function getRankFromXp(xp: number): Rank {
  const ranks = Object.entries(RANK_THRESHOLDS) as [Rank, number][];
  // Sort descending by threshold, return first rank the user qualifies for
  return ranks
    .sort((a, b) => b[1] - a[1])
    .find(([, threshold]) => xp >= threshold)![0];
}

// XP needed for next rank (returns null at max rank)
export function xpToNextRank(currentXp: number): { next: Rank | null; needed: number; progress: number } {
  const currentRank = getRankFromXp(currentXp);
  const ranks = (Object.keys(RANK_THRESHOLDS) as Rank[]);
  const currentIndex = ranks.indexOf(currentRank);

  if (currentIndex === ranks.length - 1) {
    return { next: null, needed: 0, progress: 100 };
  }

  const nextRank = ranks[currentIndex + 1];
  const currentThreshold = RANK_THRESHOLDS[currentRank];
  const nextThreshold = RANK_THRESHOLDS[nextRank];
  const needed = nextThreshold - currentXp;
  const progress = Math.round(((currentXp - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  return { next: nextRank, needed, progress };
}

// XP rewards by source type
export const XP_REWARDS: Record<XpSource, number> = {
  ADVENTURE_COMPLETE: 80,
  ADVENTURE_PERFECT: 150,
  CHALLENGE_COMPLETE: 40,
  CHALLENGE_PERFECT: 75,
  ACHIEVEMENT_UNLOCKED: 50,
  STREAK_BONUS: 25,
  MENTOR_SESSION: 20,
};

// Cyber Safety Score calculation (0–100)
// Based on: accuracy on challenges + adventure outcomes + variety of topics
export function calculateCyberSafetyScore(stats: {
  totalChallenges: number;
  avgChallengeScore: number; // 0–100
  totalAdventures: number;
  safeAdventures: number;
  topicsCovered: number; // out of 7 total topics
}): number {
  if (stats.totalChallenges === 0 && stats.totalAdventures === 0) return 0;

  const challengeWeight = 0.5;
  const adventureWeight = 0.3;
  const coverageWeight = 0.2;

  const challengeScore = stats.avgChallengeScore;
  const adventureScore = stats.totalAdventures > 0
    ? (stats.safeAdventures / stats.totalAdventures) * 100
    : 0;
  const coverageScore = (stats.topicsCovered / 7) * 100;

  return Math.round(
    challengeScore * challengeWeight +
    adventureScore * adventureWeight +
    coverageScore * coverageWeight
  );
}
