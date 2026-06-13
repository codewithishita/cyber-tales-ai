// src/app/(protected)/mentor/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useMentor } from "@/hooks/useMentor";

const STARTER_PROMPTS = [
  "How do I spot a phishing email?",
  "What makes a password strong?",
  "What is social engineering?",
  "How do I protect my privacy online?",
  "What should I do if I think I've been hacked?",
  "Explain two-factor authentication simply",
];

export default function MentorPage() {
  const { messages, send, isStreaming } = useMentor();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const val = input.trim();
    if (!val || isStreaming) return;
    setInput("");
    send(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.cipherAvatar}>
          <div style={styles.avatarRing}>
            <div style={styles.avatarInner}>AI</div>
          </div>
          <div>
            <div style={styles.cipherName}>Cipher</div>
            <div style={styles.cipherStatus}>
              <span style={styles.onlineDot} />
              Online
            </div>
          </div>
        </div>
        <div style={styles.cipherDesc}>
          Your AI cybersecurity mentor. Ask anything — concepts, hints for challenges, or advice on staying safe online.
        </div>
        <div style={styles.topicsHeader}>SUGGESTED TOPICS</div>
        <div style={styles.topicsList}>
          {STARTER_PROMPTS.map((p) => (
            <button key={p} style={styles.topicBtn} onClick={() => { setInput(p); inputRef.current?.focus(); }}>
              {p}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <div style={styles.chatArea}>
        <div style={styles.chatMessages}>
          {isEmpty && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🤖</div>
              <div style={styles.emptyTitle}>Ask Cipher anything</div>
              <div style={styles.emptySub}>Your AI cybersecurity mentor is ready. Pick a topic on the left or type your question below.</div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ ...styles.messageRow, ...(msg.role === "user" ? styles.messageRowUser : {}) }}>
              {msg.role === "assistant" && (
                <div style={styles.msgAvatar}>AI</div>
              )}
              <div style={{ ...styles.bubble, ...(msg.role === "user" ? styles.bubbleUser : styles.bubbleAssistant) }}>
                {msg.content}
                {isStreaming && i === messages.length - 1 && msg.role === "assistant" && msg.content === "" && (
                  <span style={styles.typingDot}>●●●</span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={styles.inputRow}>
          <div style={styles.inputWrap}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Cipher a question..."
              style={styles.textarea}
              rows={1}
              disabled={isStreaming}
            />
            <button onClick={handleSend} disabled={!input.trim() || isStreaming} style={{ ...styles.sendBtn, ...((!input.trim() || isStreaming) ? styles.sendBtnDisabled : {}) }}>
              {isStreaming ? "●" : "↑"}
            </button>
          </div>
          <div style={styles.inputHint}>Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: { display: "flex", height: "100vh", background: "#0c0a09", color: "#f0f2f8", fontFamily: "'Geist', sans-serif", overflow: "hidden" },
  sidebar: { width: 260, borderRight: "1px solid rgba(255,255,255,.06)", padding: "28px 16px", flexShrink: 0, overflowY: "auto" as const },
  cipherAvatar: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  avatarRing: { width: 44, height: 44, borderRadius: "50%", padding: 2, background: "linear-gradient(135deg,#2563eb,#7c3aed)", flexShrink: 0 },
  avatarInner: { width: "100%", height: "100%", borderRadius: "50%", background: "#111318", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#60a5fa" },
  cipherName: { fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.9)" },
  cipherStatus: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,.4)", marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 4px #22c55e", display: "inline-block" },
  cipherDesc: { fontSize: 12, color: "rgba(255,255,255,.35)", lineHeight: 1.6, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,.06)" },
  topicsHeader: { fontSize: 10, color: "rgba(255,255,255,.25)", fontFamily: "'Geist Mono',monospace", letterSpacing: "1.5px", marginBottom: 10 },
  topicsList: { display: "flex", flexDirection: "column" as const, gap: 6 },
  topicBtn: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 7, padding: "8px 12px", cursor: "pointer", color: "rgba(255,255,255,.5)", fontSize: 12, textAlign: "left" as const, fontFamily: "'Geist',sans-serif", transition: "all .15s", lineHeight: 1.4 },
  chatArea: { flex: 1, display: "flex", flexDirection: "column" as const, overflow: "hidden" },
  chatMessages: { flex: 1, overflowY: "auto" as const, padding: "32px 40px", display: "flex", flexDirection: "column" as const, gap: 20 },
  emptyState: { flex: 1, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, padding: 60, marginTop: "15vh" },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 26, color: "rgba(255,255,255,.8)", fontWeight: 400, marginBottom: 10 },
  emptySub: { color: "rgba(255,255,255,.35)", fontSize: 14, maxWidth: 380, lineHeight: 1.65 },
  messageRow: { display: "flex", gap: 12, alignItems: "flex-start", maxWidth: 700 },
  messageRowUser: { flexDirection: "row-reverse" as const, marginLeft: "auto" },
  msgAvatar: { width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff", flexShrink: 0 },
  bubble: { borderRadius: 14, padding: "12px 16px", fontSize: 14, lineHeight: 1.65, maxWidth: "80%" },
  bubbleAssistant: { background: "#111318", border: "1px solid rgba(255,255,255,.07)", color: "rgba(255,255,255,.8)", borderTopLeftRadius: 4 },
  bubbleUser: { background: "#fff", color: "#111", borderTopRightRadius: 4, fontWeight: 500 },
  typingDot: { color: "rgba(255,255,255,.3)", letterSpacing: "2px", animation: "pulse 1.5s infinite" },
  inputRow: { padding: "16px 40px 24px", borderTop: "1px solid rgba(255,255,255,.06)" },
  inputWrap: { display: "flex", gap: 10, alignItems: "flex-end" },
  textarea: { flex: 1, background: "#111318", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "12px 16px", color: "rgba(255,255,255,.9)", fontSize: 14, fontFamily: "'Geist',sans-serif", resize: "none" as const, outline: "none", lineHeight: 1.5 },
  sendBtn: { width: 40, height: 40, borderRadius: 10, background: "#fff", color: "#111", border: "none", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sendBtnDisabled: { background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.3)", cursor: "not-allowed" },
  inputHint: { fontSize: 11, color: "rgba(255,255,255,.2)", marginTop: 8, fontFamily: "'Geist Mono',monospace" },
};
