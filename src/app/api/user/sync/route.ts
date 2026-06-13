// src/app/api/user/sync/route.ts
// POST — Clerk webhook handler to sync user creation/updates to our DB
// Also called client-side after sign-in to ensure user record exists

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get user from Clerk API
    const clerkApiUrl = `https://api.clerk.com/v1/users/${clerkId}`;
    const clerkResponse = await fetch(clerkApiUrl, {
      headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
    });

    if (!clerkResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch Clerk user" }, { status: 500 });
    }

    const clerkUser = await clerkResponse.json();

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email: clerkUser.email_addresses[0]?.email_address ?? "",
        firstName: clerkUser.first_name,
        lastName: clerkUser.last_name,
        imageUrl: clerkUser.image_url,
        username: clerkUser.username,
      },
      create: {
        clerkId,
        email: clerkUser.email_addresses[0]?.email_address ?? "",
        firstName: clerkUser.first_name,
        lastName: clerkUser.last_name,
        imageUrl: clerkUser.image_url,
        username: clerkUser.username,
      },
    });

    return NextResponse.json({ success: true, data: { userId: user.id } });
  } catch (error) {
    console.error("[user/sync]", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
