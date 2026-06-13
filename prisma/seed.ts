// prisma/seed.ts — Run: npx ts-node prisma/seed.ts
// Seeds achievement definitions and starter challenges

import { PrismaClient, ChallengeType, Difficulty } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ── Achievements ──────────────────────────────────────────────
  const achievements = [
    { slug: "first_adventure", name: "First Steps", description: "Complete your first adventure", icon: "🌐", xpReward: 50, condition: { type: "adventures_completed", count: 1 } },
    { slug: "phishing_pro", name: "Phishing Pro", description: "Complete 3 phishing adventures", icon: "🛡", xpReward: 100, condition: { type: "adventures_by_topic", topic: "PHISHING", count: 3 } },
    { slug: "password_master", name: "Password Master", description: "Score 100% on a password challenge", icon: "🔑", xpReward: 75, condition: { type: "perfect_challenge_type", challengeType: "PASSWORD_STRENGTH" } },
    { slug: "link_detective", name: "Link Detective", description: "Complete 5 URL analysis challenges", icon: "🔍", xpReward: 75, condition: { type: "challenges_by_type", challengeType: "URL_ANALYSIS", count: 5 } },
    { slug: "cyber_rookie", name: "Cyber Rookie", description: "Reach Cyber Rookie rank", icon: "🥋", xpReward: 100, condition: { type: "reach_rank", rank: "CYBER_ROOKIE" } },
    { slug: "security_scout", name: "Security Scout", description: "Reach Security Scout rank", icon: "🔭", xpReward: 150, condition: { type: "reach_rank", rank: "SECURITY_SCOUT" } },
    { slug: "threat_hunter", name: "Threat Hunter", description: "Reach Threat Hunter rank", icon: "🎯", xpReward: 250, condition: { type: "reach_rank", rank: "THREAT_HUNTER" } },
    { slug: "perfect_score", name: "Perfectionist", description: "Score 100% on any challenge", icon: "⭐", xpReward: 100, condition: { type: "perfect_challenge_score", count: 1 } },
    { slug: "week_streak", name: "Week Warrior", description: "Maintain a 7-day learning streak", icon: "🔥", xpReward: 200, condition: { type: "streak_days", count: 7 } },
    { slug: "privacy_guardian", name: "Privacy Guardian", description: "Complete all privacy adventures", icon: "👁", xpReward: 150, condition: { type: "adventures_by_topic", topic: "ONLINE_PRIVACY", count: 3 } },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { slug: a.slug }, update: a, create: a });
  }
  console.log(`✓ Seeded ${achievements.length} achievements`);

  // ── Starter Challenges ────────────────────────────────────────
  const challenges = [
    {
      type: "PHISHING_EMAIL" as ChallengeType,
      difficulty: "BEGINNER" as Difficulty,
      title: "The Roblox Account Warning",
      payload: {
        from: "support@roblox-security-team.net",
        subject: "Your account will be deleted in 24 hours",
        body: "We detected suspicious activity on your Roblox account. Click here to verify: http://roblox-verify-now.ru/secure/login",
        redFlags: ["domain_spoofing", "urgency_tactics", "suspicious_link", "http_not_https"],
        correctFlags: ["domain_spoofing", "urgency_tactics", "suspicious_link", "http_not_https"],
      },
      explanation: "This email used 4 classic phishing tactics: (1) a domain that looks like Roblox but isn't — roblox-security-team.net is not owned by Roblox, (2) urgency to make you act without thinking, (3) a suspicious .ru link, and (4) no HTTPS encryption.",
      xpReward: 40,
    },
    {
      type: "URL_ANALYSIS" as ChallengeType,
      difficulty: "INTERMEDIATE" as Difficulty,
      title: "The PayPal Login Page",
      payload: {
        url: "http://paypa1-secure-login.com/verify",
        threats: [
          { type: "homograph", description: "paypa1 uses numeral '1' instead of letter 'l'", severity: "high" },
          { type: "no_https", description: "HTTP not HTTPS — no encryption", severity: "high" },
          { type: "suspicious_path", description: "/verify is an urgency tactic", severity: "medium" },
          { type: "new_domain", description: "Domain registered 3 days ago", severity: "high" },
        ],
        isMalicious: true,
        riskScore: 96,
      },
      explanation: "Four threat signals make this URL extremely dangerous. The most critical is the homograph attack — 'paypa1' with a number 1 looks identical to 'paypal' at a glance. Never click payment links in emails; always type the URL manually.",
      xpReward: 50,
    },
    {
      type: "PASSWORD_STRENGTH" as ChallengeType,
      difficulty: "BEGINNER" as Difficulty,
      title: "Build the Uncrackable Password",
      payload: {
        weakPasswords: ["password123", "qwerty", "liverpool2020", "MyDog2015!"],
        weaknesses: {
          password123: ["common_word", "sequential_numbers", "no_symbols"],
          qwerty: ["keyboard_pattern", "too_short", "no_numbers", "no_symbols"],
          liverpool2020: ["dictionary_word", "predictable_year", "no_symbols"],
          "MyDog2015!": ["personal_info_pattern", "predictable_year"],
        },
        requirements: {
          minLength: 12,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSymbols: true,
          noCommonWords: true,
          noPersonalInfo: true,
        },
      },
      explanation: "Strong passwords have 4 properties: length (12+ chars), complexity (upper, lower, number, symbol), randomness (no dictionary words or patterns), and uniqueness (never reused across sites). A password manager lets you use truly random passwords everywhere.",
      xpReward: 35,
    },
    {
      type: "SCAM_MESSAGE" as ChallengeType,
      difficulty: "BEGINNER" as Difficulty,
      title: "The iPhone Winner Text",
      payload: {
        platform: "SMS",
        from: "+1 (323) 555-0198",
        message: "Congratulations! You've been selected as our weekly winner. Claim your FREE iPhone 15 Pro at: http://prize-claim-now.site/winner?id=83721. Offer expires in 2 hours! Reply STOP to unsubscribe.",
        redFlags: ["unsolicited_prize", "urgency_timer", "suspicious_link", "unknown_sender", "too_good_to_be_true"],
        correctFlags: ["unsolicited_prize", "urgency_timer", "suspicious_link", "unknown_sender", "too_good_to_be_true"],
      },
      explanation: "Classic prize scam. You can't win a prize you didn't enter. The 2-hour urgency prevents you from thinking clearly. The .site TLD is commonly used by scammers. Legitimate companies don't text from random numbers.",
      xpReward: 35,
    },
  ];

  for (const c of challenges) {
    await prisma.challenge.upsert({
      where: { id: `seed_${c.type}_${c.difficulty}` },
      update: {},
      create: { ...c, id: `seed_${c.type}_${c.difficulty}` },
    });
  }
  console.log(`✓ Seeded ${challenges.length} challenges`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
