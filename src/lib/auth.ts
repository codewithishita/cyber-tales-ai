// src/lib/auth.ts
// Server-side auth helpers — wraps Clerk for consistent usage across API routes.

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";
import type { User } from "@prisma/client";

// Get the current Clerk user and ensure they exist in our database.
// Creates the user record on first call (post sign-up webhook alternative).
export async function getOrCreateUser(): Promise<User> {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Unauthorized");

  const existing = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });
  if (existing) return existing;

  // First time — create local user record
  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      username: clerkUser.username,
    },
  });
}

// Lightweight version for API routes — just verifies auth and returns clerkId
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// Resolve clerkId → internal userId (caches per request via prisma)
export async function resolveUserId(clerkId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) throw new Error("User not found");
  return user.id;
}
