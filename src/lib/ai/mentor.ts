// src/lib/ai/mentor.ts
// Context-aware AI mentor that knows user's learning history

import { openai, AI_MODEL } from './client'
import { RANK_CONFIG } from '@/types'
import type { MentorContext, AdventureTopic } from '@/types'
import type { MessageRole } from '@prisma/client'

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
}

const TOPIC_LABELS: Record<AdventureTopic, string> = {
  PHISHING: 'Phishing Attacks',
  PASSWORD_SECURITY: 'Password Security',
  ONLINE_PRIVACY: 'Online Privacy',
  CYBERBULLYING: 'Cyberbullying',
  SCAM_DETECTION: 'Scam Detection',
  SAFE_BROWSING: 'Safe Browsing',
  SOCIAL_ENGINEERING: 'Social Engineering',
}

export function buildMentorSystemPrompt(context: MentorContext): string {
  const rankLabel = RANK_CONFIG[context.rank].label
  const weakTopicLabels = context.weakTopics.map(t => TOPIC_LABELS[t]).join(', ')

  return `You are Cipher, an AI cybersecurity mentor on the Cyber Tales AI platform. You are knowledgeable, encouraging, and a little witty — like a brilliant older sibling who happens to be a cybersecurity expert.

YOUR PERSONALITY:
- Use conversational, friendly language — never condescending
- Give concrete, specific advice — not vague platitudes  
- Use real examples and analogies to explain concepts
- Celebrate progress genuinely but briefly
- Be direct: if something is dangerous, say so clearly
- Occasionally use cybersecurity terminology, but always explain it

CURRENT LEARNER CONTEXT:
- Rank: ${rankLabel} (${context.xp} XP earned)
- Recent adventures completed: ${context.recentAdventures.length > 0 ? context.recentAdventures.join(', ') : 'None yet'}
- Recent challenges completed: ${context.recentChallenges.length > 0 ? context.recentChallenges.join(', ') : 'None yet'}
- Areas needing improvement: ${weakTopicLabels || 'Still being assessed'}

GUIDANCE RULES:
1. If the learner asks about a topic they've already covered in adventures, reinforce and extend — don't repeat basics
2. If they ask about weak topics, be extra thorough and use multiple examples
3. Always end responses with either: a specific next action, a challenge recommendation, or a thought-provoking question
4. Keep responses concise: 3-5 paragraphs maximum
5. Format responses with occasional **bold** for key terms, but don't over-format
6. When explaining threats, always include what the SAFE action is, not just what the danger is
7. Never make the learner feel stupid for not knowing something

FORBIDDEN:
- Don't say "Great question!" or "Absolutely!" at the start of responses
- Don't use bullet lists for everything — use natural prose when explaining concepts
- Don't be preachy or lecture-y
- Don't repeat information you just said in the same response`
}

export async function generateMentorResponse(
  userMessage: string,
  history: Array<{ role: MessageRole; content: string }>,
  context: MentorContext,
): Promise<string> {
  const systemPrompt = buildMentorSystemPrompt(context)

  // Convert DB message format to OpenAI format
  const conversationHistory: ConversationMessage[] = history.map(msg => ({
    role: msg.role === 'USER' ? 'user' : 'assistant',
    content: msg.content,
  }))

  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 600,
    temperature: 0.7,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
  })

  return completion.choices[0]?.message?.content ?? 'I had trouble processing that. Could you rephrase your question?'
}

// Streaming version for real-time responses
export async function streamMentorResponse(
  userMessage: string,
  history: Array<{ role: MessageRole; content: string }>,
  context: MentorContext,
) {
  const systemPrompt = buildMentorSystemPrompt(context)

  const conversationHistory: ConversationMessage[] = history.map(msg => ({
    role: msg.role === 'USER' ? 'user' : 'assistant',
    content: msg.content,
  }))

  return openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 600,
    temperature: 0.7,
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
  })
}

// ─── GENERATE CHALLENGE HINT ───────────────────────────────────────────────────
export async function generateChallengeHint(
  challengeTitle: string,
  challengeType: string,
  userStrugglingWith: string,
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 150,
    messages: [
      {
        role: 'system',
        content: 'You are Cipher, a cybersecurity mentor. Give a helpful hint that guides without spoiling. Be concise (2-3 sentences max).',
      },
      {
        role: 'user',
        content: `The learner is stuck on a ${challengeType} challenge called "${challengeTitle}". They are struggling with: ${userStrugglingWith}. Give them a hint.`,
      },
    ],
  })
  return completion.choices[0]?.message?.content ?? 'Look carefully at the details — something small is often the biggest clue.'
}

// ─── GENERATE LEARNING RECOMMENDATION ─────────────────────────────────────────
export async function generateRecommendation(context: MentorContext): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: AI_MODEL,
    max_tokens: 200,
    messages: [
      {
        role: 'system',
        content: 'You are Cipher, a cybersecurity mentor. Give a personalized learning recommendation in 2-3 sentences. Be specific and action-oriented.',
      },
      {
        role: 'user',
        content: `Based on this learner's profile: Rank ${RANK_CONFIG[context.rank].label}, ${context.xp} XP, weak in ${context.weakTopics.join(', ')}, recently completed ${context.recentAdventures.length} adventures. What should they focus on next?`,
      },
    ],
  })
  return completion.choices[0]?.message?.content ?? 'Try a phishing detection challenge to sharpen your threat-spotting skills.'
}
