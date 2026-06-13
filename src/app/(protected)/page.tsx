// src/app/(protected)/layout.tsx
// Shared layout for all authenticated pages — ensures user is synced on load

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/sign-in");

  // Auto-create user record if it doesn't exist (handles post sign-up)
  const existing = await prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
  if (!existing) {
    // Fetch from Clerk and create
    try {
      const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkId}`, {
        headers: { Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}` },
      });
      if (clerkRes.ok) {
        const cu = await clerkRes.json();
        await prisma.user.create({
          data: {
            clerkId,
            email: cu.email_addresses[0]?.email_address ?? "",
            firstName: cu.first_name,
            lastName: cu.last_name,
            imageUrl: cu.image_url,
            username: cu.username,
          },
        });
      }
    } catch (e) {
      console.error("Failed to auto-create user", e);
    }
  }

  return <>{children}</>;
}
