// src/lib/ai/adventure-generator.ts
// Generates branching cybersecurity stories using OpenAI

import { openai, AI_MODEL } from './client'
import type { AdventureTopic, Difficulty, AgeGroup, StoryTree } from '@/types'

const TOPIC_DESCRIPTIONS: Record<AdventureTopic, string> = {
  PHISHING: 'phishing emails, fake websites, and credential theft attempts',
  PASSWORD_SECURITY: 'password strength, reuse, manager tools, and account security',
  ONLINE_PRIVACY: 'data privacy, app permissions, tracking, and personal information sharing',
  CYBERBULLYING: 'online harassment, blocking tools, reporting mechanisms, and supporting others',
  SCAM_DETECTION: 'online scams, fake offers, impersonation, and too-good-to-be-true scenarios',
  SAFE_BROWSING: 'safe web browsing, HTTPS, browser security, and malicious downloads',
  SOCIAL_ENGINEERING: 'manipulation tactics, pretexting, urgency exploitation, and trust verification',
}

const AGE_CONTEXT: Record<AgeGroup, string> = {
  AGES_8_10: 'Use simple language, relatable scenarios (games, school, family). Short sentences. Avoid jargon. Examples should involve games like Minecraft/Roblox, school email, or family situations.',
  AGES_11_13: 'Use conversational language, scenarios involving social media, online gaming, and messaging apps. Some technical terms are fine if explained. Reference apps they use like Discord, YouTube, TikTok.',
  AGES_14_15: 'Use mature, informative language. Include technical context. Scenarios can involve social media, online jobs, cryptocurrency scams, and identity theft. Treat them as young adults.',
}

const DIFFICULTY_CONTEXT: Record<Difficulty, string> = {
  BEGINNER: 'Make the threat obvious. The wrong choices have clear red flags. The correct path is identifiable with basic common sense.',
  INTERMEDIATE: 'Include some subtle deception. One or two choices may seem reasonable but have hidden consequences. Require critical thinking.',
  ADVANCED: 'Create sophisticated scenarios where even cautious people could be fooled. Include multi-step attacks, highly convincing fakes, and non-obvious threats.',
}

export async function generateAdventureStory(
  topic: AdventureTopic,
  difficulty: Difficulty,
  ageGroup: AgeGroup,
): Promise<StoryTree> {
  const prompt = buildStoryPrompt(topic, difficulty, ageGroup)

  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 3000,
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an expert cybersecurity educator and interactive storyteller. You create engaging, branching cybersecurity awareness stories for young learners. Your stories are realistic, educational, and genuinely teach security skills through narrative consequence.

Always respond with valid JSON matching the StoryTree schema exactly. Never include markdown, only raw JSON.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('No content returned from OpenAI')

  const parsed = JSON.parse(content) as StoryTree
  return validateStoryTree(parsed)
}

function buildStoryPrompt(
  topic: AdventureTopic,
  difficulty: Difficulty,
  ageGroup: AgeGroup,
): string {
  return `Generate a branching cybersecurity awareness story about: ${TOPIC_DESCRIPTIONS[topic]}

Age group context: ${AGE_CONTEXT[ageGroup]}
Difficulty: ${DIFFICULTY_CONTEXT[difficulty]}

Return a JSON object with this EXACT structure:
{
  "scenes": [
    {
      "id": "scene_001",
      "content": "Narrative text (2-4 sentences, engaging, present tense)",
      "choices": [
        {
          "id": "choice_001a",
          "text": "Choice text (1 sentence, action-oriented)",
          "sceneId": "scene_002",
          "isCorrect": true,
          "consequence": "Brief preview of what happens (1 sentence)",
          "securityLesson": "Educational note about why this is right/wrong"
        }
      ]
    }
  ],
  "metadata": {
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "ageGroup": "${ageGroup}",
    "estimatedMinutes": 5,
    "learningObjectives": ["objective 1", "objective 2", "objective 3"]
  }
}

Requirements:
- Create exactly 1 opening scene, 3-4 middle scenes (branching), and 3 ending scenes (success, failure, partial)
- Scene IDs: "scene_001", "scene_002", etc.
- Choice IDs: "choice_001a", "choice_001b", etc.
- Each non-ending scene has 2-3 choices
- Ending scenes have isEnding: true, endingType: "success"|"failure"|"partial", and a feedback string
- The story should feel like a real situation the child could encounter
- Good choices lead to safety; bad choices lead to realistic negative consequences
- Always include at least one "ask an adult" or "report it" path
- Make it genuinely dramatic and engaging, not preachy
- Include specific details (fake URLs, actual phishing phrases, realistic platform names)

Generate the complete story now:`
}

function validateStoryTree(tree: unknown): StoryTree {
  const t = tree as StoryTree
  if (!t.scenes || !Array.isArray(t.scenes) || t.scenes.length === 0) {
    throw new Error('Invalid story tree: missing scenes')
  }
  if (!t.metadata) {
    throw new Error('Invalid story tree: missing metadata')
  }
  // Validate all scene references exist
  const sceneIds = new Set(t.scenes.map(s => s.id))
  for (const scene of t.scenes) {
    for (const choice of scene.choices ?? []) {
      if (!sceneIds.has(choice.sceneId)) {
        throw new Error(`Invalid scene reference: ${choice.sceneId}`)
      }
    }
  }
  return t
}

// ─── GENERATE ADVENTURE TITLE ──────────────────────────────────────────────────
export async function generateAdventureTitle(
  topic: AdventureTopic,
  storyContent: string,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 50,
    messages: [
      {
        role: 'user',
        content: `Generate a short, engaging title (5-8 words) for this cybersecurity story. Topic: ${topic}. Story starts: "${storyContent.slice(0, 200)}". Return only the title, no quotes.`,
      },
    ],
  })
  return completion.choices[0]?.message?.content?.trim() ?? `${topic} Adventure`
}
