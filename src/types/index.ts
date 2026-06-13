// src/types/index.ts
// Shared TypeScript types across the application.
// These extend Prisma types with UI-specific shapes.

import type { AdventureTopic, Difficulty, AgeGroup, ChallengeType, Rank } from "@prisma/client";

// ─── ADVENTURE TYPES ──────────────────────────────────────────────────────

export interface StoryChoice {
  id: string;
  text: string;
  risk: "safe" | "risky" | "neutral";
  nextSceneId: string | null; // null = end of story
  xpReward: number;
  outcome: string; // Shown after choice is made
  lesson: string;  // The cybersecurity lesson taught by this choice
}

export interface StoryScene {
  id: string;
  narrative: string; // The story text presented to the user
  setting: string;   // e.g. "Your bedroom", "School computer lab"
  choices: StoryChoice[];
  isEnding: boolean;
  endingType?: "safe" | "partial" | "unsafe";
}

export interface StoryTree {
  firstSceneId: string;
  scenes: Record<string, StoryScene>; // keyed by scene ID
}

export interface AdventureGenerationRequest {
  topic: AdventureTopic;
  difficulty: Difficulty;
  ageGroup: AgeGroup;
}

// ─── CHALLENGE TYPES ──────────────────────────────────────────────────────

export interface ThreatSignal {
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface PhishingEmailPayload {
  from: string;
  subject: string;
  body: string;
  redFlags: string[];
  correctFlags: string[];
}

export interface UrlAnalysisPayload {
  url: string;
  threats: ThreatSignal[];
  isMalicious: boolean;
  riskScore: number;
}

export interface PasswordStrengthPayload {
  weakPasswords: string[];
  weaknesses: Record<string, string[]>;
  requirements: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    noCommonWords: boolean;
    noPersonalInfo: boolean;
  };
}

export interface ScamMessagePayload {
  platform: string;
  from: string;
  message: string;
  redFlags: string[];
  correctFlags: string[];
}

// ─── DASHBOARD / PROGRESS TYPES ───────────────────────────────────────────

export interface UserStats {
  xp: number;
  rank: Rank;
  cyberSafetyScore: number;
  streakDays: number;
  totalAdventures: number;
  totalChallenges: number;
  avgChallengeScore: number;
  xpToNextRank: number;
  progressToNextRank: number; // 0–100
  nextRank: Rank | null;
  recentXpEvents: XpEventSummary[];
  topicProgress: TopicProgress[];
}

export interface XpEventSummary {
  amount: number;
  source: string;
  label: string;
  createdAt: string;
}

export interface TopicProgress {
  topic: AdventureTopic;
  label: string;
  adventuresCompleted: number;
  avgScore: number;
}

export interface WeeklyXp {
  day: string; // "Mon", "Tue" etc.
  xp: number;
}

// ─── MENTOR TYPES ─────────────────────────────────────────────────────────

export interface MentorMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// ─── API RESPONSE TYPES ───────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
