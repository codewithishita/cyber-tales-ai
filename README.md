# Cyber Tales AI

An AI-powered cybersecurity learning platform for children, built as a portfolio-quality full-stack project.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, React 18 |
| Styling | Tailwind CSS, Shadcn UI |
| Auth | Clerk |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| AI | OpenAI GPT-4o |
| Charts | Recharts |
| Deployment | Vercel |

## Features

- **AI Cyber Adventures** — GPT-4o generates unique branching cybersecurity stories. Every run is different. Choices have real consequences.
- **Challenge Simulator** — Interactive phishing email analysis, URL threat detection, password strength evaluation, scam message detection.
- **AI Mentor (Cipher)** — Streaming AI chat with full user context. Explains concepts, hints at challenges, tracks learning history.
- **Progress Dashboard** — XP system, 6 rank tiers, achievement badges, weekly XP chart, Cyber Safety Score.

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/yourusername/cyber-tales-ai
cd cyber-tales-ai
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:
- `DATABASE_URL` + `DIRECT_URL` — from Supabase project settings
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — from clerk.com
- `OPENAI_API_KEY` — from platform.openai.com

### 3. Set up Clerk

1. Create app at [clerk.com](https://clerk.com)
2. Add redirect URLs in Clerk Dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

### 4. Set up database

```bash
# Push schema to Supabase
npm run db:push

# Seed achievements and starter challenges
npm run db:seed

# (Optional) Open Prisma Studio to inspect data
npm run db:studio
```

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   └── sign-up/[[...sign-up]]/page.tsx
│   ├── (protected)/
│   │   ├── layout.tsx            ← auto user-sync on every load
│   │   ├── dashboard/page.tsx    ← server component, prefetches all data
│   │   ├── adventures/page.tsx   ← AI story engine
│   │   ├── challenges/page.tsx   ← interactive challenge simulator
│   │   └── mentor/page.tsx       ← streaming AI chat
│   ├── api/
│   │   ├── adventures/
│   │   │   ├── generate/route.ts ← POST: OpenAI story generation
│   │   │   └── choice/route.ts   ← POST: record choice, return next scene
│   │   ├── challenges/
│   │   │   ├── route.ts          ← GET: list challenges
│   │   │   └── submit/route.ts   ← POST: score answers, award XP
│   │   ├── mentor/
│   │   │   └── chat/route.ts     ← POST: SSE streaming chat
│   │   ├── progress/route.ts     ← GET: full dashboard stats
│   │   └── user/sync/route.ts    ← POST: Clerk → DB sync
│   ├── layout.tsx                ← ClerkProvider, fonts
│   └── globals.css
├── components/
│   └── dashboard/DashboardClient.tsx
├── hooks/
│   ├── useAdventure.ts           ← adventure session state machine
│   ├── useMentor.ts              ← SSE streaming chat state
│   └── useProgress.ts            ← SWR dashboard data hook
├── lib/
│   ├── auth.ts                   ← Clerk helpers
│   ├── db.ts                     ← Prisma singleton
│   ├── openai.ts                 ← OpenAI singleton + model constants
│   ├── xp.ts                     ← XP/rank calculation (pure functions)
│   └── achievements.ts           ← Achievement unlock engine
├── types/index.ts                ← Shared TypeScript types
└── middleware.ts                 ← Clerk route protection
prisma/
├── schema.prisma                 ← Full DB schema
└── seed.ts                       ← Achievements + starter challenges
```

## Database Schema

```
User ──┬── UserAdventure ── Adventure
       ├── UserChallenge  ── Challenge
       ├── UserAchievement ─ Achievement
       ├── MentorChat
       └── XpEvent (append-only log)
```

Key design decisions:
- `storyTree` stored as JSONB — avoids a complex normalized graph schema while staying queryable
- `XpEvent` is append-only — enables time-series charts without aggregation tables
- `choicePath` stored as JSONB array — full decision history without extra joins
- Clerk is source of truth for identity; local `User` table enables efficient DB joins

## Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or:
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add CLERK_SECRET_KEY
# ... etc
```

### Post-deployment

After deploying, run migrations against production DB:

```bash
DATABASE_URL="your-production-url" npx prisma db push
DATABASE_URL="your-production-url" npm run db:seed
```

## Resume Description

> **Cyber Tales AI** — Full-stack AI-powered cybersecurity learning platform (Next.js 15, TypeScript, OpenAI, PostgreSQL/Supabase, Clerk)
>
> Built AI story engine using GPT-4o with structured JSON outputs and branching narrative state machine. Implemented real-time streaming chat (SSE) for AI mentor with context-aware prompt engineering. Designed PostgreSQL schema with Prisma ORM featuring append-only XP event log for time-series analytics. Gamification system with XP tracking, 6 rank tiers, achievement engine, and Recharts dashboard visualizations. Deployed on Vercel with Supabase backend.

## Architecture Decisions

**Why JSONB for story trees?**
Adventures are a directed graph — normalizing it into `scenes` and `choices` tables would require complex recursive queries for traversal. JSONB lets us store and retrieve the full tree in one query while still being indexable.

**Why append-only XP events?**
Rather than updating a `weeklyXp` aggregate, every XP earn is a row. This enables flexible queries: weekly charts, source breakdowns, streak detection — all without schema changes.

**Why SSE over WebSockets for the mentor?**
Server-Sent Events are unidirectional (server → client) which matches the chat streaming pattern exactly. They work over standard HTTP, have built-in reconnection, and don't require a WebSocket server — Vercel Edge Functions handle them natively.

**Why Clerk over Auth.js?**
For a portfolio project, Clerk's hosted UI + webhook system eliminates ~300 lines of auth boilerplate and adds production-grade features (MFA, social login, session management) for free on the hobby tier.
