// src/app/api/adventures/choice/route.ts
// POST — record a user's choice and return the next scene (or complete the adventure)

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { resolveUserId } from "@/lib/auth";
import { getRankFromXp, XP_REWARDS } from "@/lib/xp";
import { checkAndUnlockAchievements } from "@/lib/achievements";
import type { StoryTree, StoryChoice } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { userAdventureId, choiceId, sceneId } = await req.json();
    if (!userAdventureId || !choiceId || !sceneId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const userId = await resolveUserId(clerkId);

    // Load the user adventure + the full story tree
    const userAdventure = await prisma.userAdventure.findUnique({
      where: { id: userAdventureId, userId },
      include: { adventure: true },
    });
    if (!userAdventure) return NextResponse.json({ success: false, error: "Adventure not found" }, { status: 404 });
    if (userAdventure.status === "COMPLETED") {
      return NextResponse.json({ success: false, error: "Adventure already completed" }, { status: 400 });
    }

    const storyTree = userAdventure.adventure.storyTree as unknown as StoryTree;
    const currentScene = storyTree.scenes[sceneId];
    if (!currentScene) return NextResponse.json({ success: false, error: "Scene not found" }, { status: 404 });

    const choice = currentScene.choices.find((c: StoryChoice) => c.id === choiceId);
    if (!choice) return NextResponse.json({ success: false, error: "Choice not found" }, { status: 404 });

    // Append to choice path
    const existingPath = userAdventure.choicePath as { sceneId: string; choiceId: string; timestamp: string }[];
    const newPath = [...existingPath, { sceneId, choiceId, timestamp: new Date().toISOString() }];

    // Check if next scene is an ending
    const nextScene = choice.nextSceneId ? storyTree.scenes[choice.nextSceneId] : null;
    const isComplete = !nextScene || nextScene.isEnding;

    if (isComplete && nextScene) {
      // Adventure complete — calculate final XP and outcome
      const allChoices = newPath.map((p) => {
        const scene = storyTree.scenes[p.sceneId];
        return scene?.choices.find((c: StoryChoice) => c.id === p.choiceId);
      }).filter(Boolean) as StoryChoice[];

      // Add the final choice
      allChoices.push(choice);

      const safeChoices = allChoices.filter((c) => c.risk === "safe").length;
      const totalChoices = allChoices.length;
      const safeRatio = safeChoices / totalChoices;

      const outcome = safeRatio >= 0.8 ? "SAFE" : safeRatio >= 0.5 ? "PARTIAL" : "UNSAFE";
      const xpSource = outcome === "SAFE" ? "ADVENTURE_PERFECT" : "ADVENTURE_COMPLETE";
      const xpEarned = outcome === "SAFE" ? XP_REWARDS.ADVENTURE_PERFECT : XP_REWARDS.ADVENTURE_COMPLETE;

      const updatedUser = await prisma.$transaction(async (tx) => {
        await tx.userAdventure.update({
          where: { id: userAdventureId },
          data: {
            status: "COMPLETED",
            choicePath: newPath,
            outcome: outcome as any,
            xpEarned,
            completedAt: new Date(),
          },
        });
        const user = await tx.user.update({
          where: { id: userId },
          data: { xp: { increment: xpEarned }, lastActivityAt: new Date() },
        });
        await tx.xpEvent.create({
          data: { userId, amount: xpEarned, source: xpSource, sourceId: userAdventure.adventureId },
        });
        // Update rank
        const newRank = getRankFromXp(user.xp);
        if (newRank !== user.rank) {
          await tx.user.update({ where: { id: userId }, data: { rank: newRank } });
        }
        return user;
      });

      const newlyUnlocked = await checkAndUnlockAchievements(userId);

      return NextResponse.json({
        success: true,
        data: { complete: true, scene: nextScene, outcome, xpEarned, newlyUnlocked },
      });
    }

    // Adventure continues — save choice and return next scene
    await prisma.userAdventure.update({
      where: { id: userAdventureId },
      data: { choicePath: newPath },
    });

    return NextResponse.json({
      success: true,
      data: { complete: false, scene: nextScene, choice },
    });
  } catch (error) {
    console.error("[adventures/choice]", error);
    return NextResponse.json({ success: false, error: "Failed to process choice" }, { status: 500 });
  }
}
