// src/app/api/challenges/route.ts
// GET — list active challenges for the challenges page

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const challenges = await prisma.challenge.findMany({
      where: { isActive: true },
      orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
      select: { id: true, type: true, difficulty: true, title: true, payload: true, explanation: true, xpReward: true },
    });

    return NextResponse.json({ success: true, data: challenges });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch challenges" }, { status: 500 });
  }
}
