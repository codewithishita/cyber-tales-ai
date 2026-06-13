// src/lib/ai/client.ts
// OpenAI client with typed helpers for adventure generation and mentor

import OpenAI from 'openai'

// Singleton pattern
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const AI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o'
