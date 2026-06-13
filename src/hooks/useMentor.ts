// src/hooks/useMentor.ts
// Manages the AI mentor chat state with streaming support

"use client";
import { useState, useCallback, useRef } from "react";
import type { MentorMessage } from "@/types";

export function useMentor() {
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (content: string) => {
    if (isStreaming) return;

    const userMsg: MentorMessage = { role: "user", content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setIsStreaming(true);

    // Optimistic: add empty assistant message to stream into
    const assistantMsg: MentorMessage = { role: "assistant", content: "", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, assistantMsg]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, chatId }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("Mentor API failed");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6));
          if (payload.delta) {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last.role === "assistant") {
                updated[updated.length - 1] = { ...last, content: last.content + payload.delta };
              }
              return updated;
            });
          }
          if (payload.done && payload.chatId) {
            setChatId(payload.chatId);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: "Sorry, I had trouble connecting. Please try again.",
          };
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, chatId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setChatId(null);
  }, []);

  return { messages, send, isStreaming, clearChat, chatId };
}
