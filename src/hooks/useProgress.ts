// src/hooks/useProgress.ts
// SWR hook for dashboard data — handles caching, revalidation, loading states

"use client";
import useSWR from "swr";
import type { UserStats, WeeklyXp } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((r) => r.data);

export type DashboardData = UserStats & {
  achievements: Achievement[];
  weeklyXp: WeeklyXp[];
};

interface Achievement {
  id: string; name: string; icon: string; description: string;
  xpReward: number; unlockedAt: string;
}

export function useProgress() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    "/api/progress",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
  return { data, error, isLoading, refresh: mutate };
}
