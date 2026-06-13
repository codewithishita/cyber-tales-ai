// src/hooks/useAdventure.ts
// Manages the full adventure session state: current scene, choice path, completion

"use client";
import { useState, useCallback } from "react";
import type { StoryScene, AdventureGenerationRequest } from "@/types";

type AdventureState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "active"; scene: StoryScene; adventureId: string; userAdventureId: string; title: string }
  | { phase: "choice_loading"; scene: StoryScene; adventureId: string; userAdventureId: string; title: string }
  | { phase: "complete"; scene: StoryScene; outcome: "SAFE" | "PARTIAL" | "UNSAFE"; xpEarned: number; newlyUnlocked: string[] }
  | { phase: "error"; message: string };

export function useAdventure() {
  const [state, setState] = useState<AdventureState>({ phase: "idle" });

  const generate = useCallback(async (params: AdventureGenerationRequest) => {
    setState({ phase: "loading" });
    try {
      const res = await fetch("/api/adventures/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      setState({
        phase: "active",
        scene: json.data.firstScene,
        adventureId: json.data.adventureId,
        userAdventureId: json.data.userAdventureId,
        title: json.data.title,
      });
    } catch (err) {
      setState({ phase: "error", message: err instanceof Error ? err.message : "Generation failed" });
    }
  }, []);

  const makeChoice = useCallback(async (choiceId: string) => {
    if (state.phase !== "active") return;
    const { userAdventureId, scene, adventureId, title } = state;

    setState({ phase: "choice_loading", scene, adventureId, userAdventureId, title });
    try {
      const res = await fetch("/api/adventures/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAdventureId, choiceId, sceneId: scene.id }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      if (json.data.complete) {
        setState({
          phase: "complete",
          scene: json.data.scene,
          outcome: json.data.outcome,
          xpEarned: json.data.xpEarned,
          newlyUnlocked: json.data.newlyUnlocked ?? [],
        });
      } else {
        setState({ phase: "active", scene: json.data.scene, adventureId, userAdventureId, title });
      }
    } catch (err) {
      setState({ phase: "error", message: err instanceof Error ? err.message : "Choice failed" });
    }
  }, [state]);

  const reset = useCallback(() => setState({ phase: "idle" }), []);

  return { state, generate, makeChoice, reset };
}
