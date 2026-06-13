import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export const MODELS = {
  adventure: "llama-3.3-70b-versatile",
  mentor: "llama-3.3-70b-versatile",
  analysis: "llama-3.3-70b-versatile",
};