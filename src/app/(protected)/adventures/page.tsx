// src/app/(protected)/adventures/page.tsx
"use client";
import { useState } from "react";
import { useAdventure } from "@/hooks/useAdventure";
import type { AdventureTopic, Difficulty, AgeGroup } from "@prisma/client";

const TOPICS: { value: AdventureTopic; label: string; icon: string; desc: string }[] = [
  { value: "PHISHING", label: "Phishing", icon: "🎣", desc: "Fake emails and websites" },
  { value: "PASSWORD_SECURITY", label: "Passwords", icon: "🔑", desc: "Building strong defenses" },
  { value: "ONLINE_PRIVACY", label: "Privacy", icon: "👁", desc: "Protecting your data" },
  { value: "SCAM_DETECTION", label: "Scams", icon: "⚠", desc: "Spotting deception" },
  { value: "SAFE_BROWSING", label: "Safe Browsing", icon: "🌐", desc: "Web security basics" },
  { value: "SOCIAL_ENGINEERING", label: "Social Eng.", icon: "🎭", desc: "Manipulation tactics" },
];

export default function AdventuresPage() {
  const { state, generate, makeChoice, reset } = useAdventure();
  const [topic, setTopic] = useState<AdventureTopic>("PHISHING");
  const [difficulty, setDifficulty] = useState<Difficulty>("INTERMEDIATE");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("AGE_11_13");

  if (state.phase === "idle" || state.phase === "error") {
    return (
      <div style={styles.page}>
        <div style={styles.setupCard}>
          <div style={styles.setupHeader}>
            <h1 style={styles.setupTitle}>Choose Your Adventure</h1>
            <p style={styles.setupSub}>AI will generate a unique cybersecurity scenario based on your selections.</p>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionLabel}>SELECT TOPIC</div>
            <div style={styles.topicGrid}>
              {TOPICS.map((t) => (
                <button key={t.value} onClick={() => setTopic(t.value)}
                  style={{ ...styles.topicBtn, ...(topic === t.value ? styles.topicBtnActive : {}) }}>
                  <span style={styles.topicIcon}>{t.icon}</span>
                  <span style={styles.topicLabel}>{t.label}</span>
                  <span style={styles.topicDesc}>{t.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <div style={styles.sectionLabel}>DIFFICULTY</div>
              {(["BEGINNER", "INTERMEDIATE", "ADVANCED"] as Difficulty[]).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  style={{ ...styles.optBtn, ...(difficulty === d ? styles.optBtnActive : {}), marginRight: 8, marginTop: 8 }}>
                  {d.charAt(0) + d.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <div style={styles.sectionLabel}>AGE GROUP</div>
              {([["AGE_8_10","8-10"], ["AGE_11_13","11-13"], ["AGE_14_15","14-15"]] as [AgeGroup, string][]).map(([v, l]) => (
                <button key={v} onClick={() => setAgeGroup(v)}
                  style={{ ...styles.optBtn, ...(ageGroup === v ? styles.optBtnActive : {}), marginRight: 8, marginTop: 8 }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {state.phase === "error" && (
            <div style={styles.errorBar}>{state.message}</div>
          )}

          <button onClick={() => generate({ topic, difficulty, ageGroup })} style={styles.generateBtn}>
            Generate Adventure →
          </button>
        </div>
      </div>
    );
  }

  if (state.phase === "loading") {
    return (
      <div style={styles.page}>
        <div style={styles.loadingCard}>
          <div style={styles.loadingIcon}>⚡</div>
          <div style={styles.loadingTitle}>Generating your adventure...</div>
          <div style={styles.loadingBar}><div style={styles.loadingFill} /></div>
          <div style={styles.loadingSub}>AI is crafting a unique cybersecurity scenario for you</div>
        </div>
      </div>
    );
  }

  if (state.phase === "complete") {
    const outcomeColors = { SAFE: "#22c55e", PARTIAL: "#fbbf24", UNSAFE: "#f87171" };
    const outcomeLabels = { SAFE: "Mission Success", PARTIAL: "Partial Success", UNSAFE: "Learning Moment" };
    const color = outcomeColors[state.outcome];
    return (
      <div style={styles.page}>
        <div style={styles.resultCard}>
          <div style={{ ...styles.resultBadge, color, borderColor: color + "40", background: color + "10" }}>
            {outcomeLabels[state.outcome]}
          </div>
          <h2 style={styles.resultTitle} dangerouslySetInnerHTML={{ __html: state.scene.narrative.replace(/\n/g, "<br/>") }} />
          <div style={{ ...styles.xpEarned, color }}>+{state.xpEarned} XP earned</div>
          {state.newlyUnlocked.length > 0 && (
            <div style={styles.achievementsBanner}>
              🏆 Achievement{state.newlyUnlocked.length > 1 ? "s" : ""} unlocked: {state.newlyUnlocked.join(", ")}
            </div>
          )}
          <div style={styles.resultActions}>
            <button onClick={reset} style={styles.generateBtn}>Play Again</button>
            <a href="/dashboard" style={styles.dashLink}>View Dashboard →</a>
          </div>
        </div>
      </div>
    );
  }

  // Active adventure (phase = "active" | "choice_loading")
  const scene = state.scene;
  const isLoading = state.phase === "choice_loading";

  return (
    <div style={styles.page}>
      <div style={styles.adventureCard}>
        <div style={styles.adventureHeader}>
          <span style={styles.adventureLabel}>⚡ {state.title}</span>
          <button onClick={reset} style={styles.exitBtn}>✕ Exit</button>
        </div>
        <div style={styles.narrative} dangerouslySetInnerHTML={{ __html: scene.narrative.replace(/\n/g, "<br/><br/>") }} />
        {!scene.isEnding && (
          <div>
            <div style={styles.choiceLabel}>What do you do?</div>
            <div style={styles.choices}>
              {scene.choices.map((choice) => (
                <button key={choice.id} disabled={isLoading}
                  onClick={() => makeChoice(choice.id)}
                  style={{ ...styles.choiceBtn, ...(choice.risk === "safe" ? styles.choiceSafe : choice.risk === "risky" ? styles.choiceDanger : {}) }}>
                  <span style={{ ...styles.riskBadge,
                    background: choice.risk === "safe" ? "rgba(34,197,94,.1)" : choice.risk === "risky" ? "rgba(248,113,113,.1)" : "rgba(156,163,175,.1)",
                    color: choice.risk === "safe" ? "#22c55e" : choice.risk === "risky" ? "#f87171" : "#9ca3af",
                  }}>{choice.risk.toUpperCase()}</span>
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        )}
        {isLoading && <div style={styles.choiceLoadingMsg}>Processing your choice...</div>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0c0a09", display: "flex", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "'Geist', sans-serif" },
  setupCard: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 40, width: "100%", maxWidth: 700 },
  setupHeader: { marginBottom: 32 },
  setupTitle: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 32, color: "rgba(255,255,255,.9)", fontWeight: 400, letterSpacing: "-.5px", marginBottom: 8 },
  setupSub: { color: "rgba(255,255,255,.45)", fontSize: 14 },
  section: { marginBottom: 28 },
  sectionLabel: { fontSize: 10, color: "rgba(255,255,255,.3)", fontFamily: "'Geist Mono',monospace", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 },
  topicGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  topicBtn: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "14px 12px", cursor: "pointer", textAlign: "left" as const, transition: "all .15s", display: "flex", flexDirection: "column" as const, gap: 4 },
  topicBtnActive: { background: "rgba(34,197,94,.06)", borderColor: "rgba(34,197,94,.25)" },
  topicIcon: { fontSize: 20 },
  topicLabel: { color: "rgba(255,255,255,.9)", fontWeight: 600, fontSize: 13 },
  topicDesc: { color: "rgba(255,255,255,.4)", fontSize: 11 },
  row: { display: "flex", gap: 32, marginBottom: 28 },
  optBtn: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 6, padding: "7px 14px", cursor: "pointer", color: "rgba(255,255,255,.55)", fontSize: 13, fontFamily: "'Geist',sans-serif" },
  optBtnActive: { background: "rgba(255,255,255,.08)", borderColor: "rgba(255,255,255,.2)", color: "rgba(255,255,255,.9)" },
  errorBar: { background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.2)", borderRadius: 8, padding: "12px 16px", color: "#f87171", fontSize: 13, marginBottom: 20 },
  generateBtn: { width: "100%", background: "#fff", color: "#111", border: "none", padding: "13px 24px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'Geist',sans-serif" },
  loadingCard: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 60, textAlign: "center" as const, maxWidth: 500, width: "100%" },
  loadingIcon: { fontSize: 40, marginBottom: 20 },
  loadingTitle: { color: "rgba(255,255,255,.9)", fontSize: 18, fontWeight: 600, marginBottom: 24 },
  loadingBar: { height: 3, background: "rgba(255,255,255,.08)", borderRadius: 3, overflow: "hidden", marginBottom: 16, position: "relative" as const },
  loadingFill: { position: "absolute" as const, left: 0, top: 0, height: "100%", width: "40%", background: "#22c55e", animation: "loading-slide 1.5s ease-in-out infinite", borderRadius: 3 },
  loadingSub: { color: "rgba(255,255,255,.35)", fontSize: 13 },
  adventureCard: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 40, maxWidth: 680, width: "100%" },
  adventureHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,.06)" },
  adventureLabel: { fontSize: 12, color: "rgba(255,255,255,.45)", fontFamily: "'Geist Mono',monospace" },
  exitBtn: { background: "transparent", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer", fontSize: 13, fontFamily: "'Geist',sans-serif" },
  narrative: { color: "rgba(255,255,255,.8)", fontSize: 15, lineHeight: 1.75, marginBottom: 32 },
  choiceLabel: { fontSize: 11, color: "rgba(255,255,255,.35)", fontFamily: "'Geist Mono',monospace", letterSpacing: "1px", textTransform: "uppercase" as const, marginBottom: 12 },
  choices: { display: "flex", flexDirection: "column" as const, gap: 10 },
  choiceBtn: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "14px 16px", cursor: "pointer", textAlign: "left" as const, color: "rgba(255,255,255,.7)", fontSize: 14, lineHeight: 1.5, fontFamily: "'Geist',sans-serif", display: "flex", alignItems: "flex-start", gap: 12 },
  choiceSafe: { borderColor: "rgba(34,197,94,.2)", background: "rgba(34,197,94,.04)" },
  choiceDanger: { borderColor: "rgba(248,113,113,.2)", background: "rgba(248,113,113,.04)" },
  riskBadge: { fontSize: 9, padding: "2px 7px", borderRadius: 4, fontFamily: "'Geist Mono',monospace", fontWeight: 700, flexShrink: 0, marginTop: 2, letterSpacing: ".5px" },
  choiceLoadingMsg: { textAlign: "center" as const, color: "rgba(255,255,255,.35)", fontSize: 13, marginTop: 20 },
  resultCard: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 48, maxWidth: 600, width: "100%", textAlign: "center" as const },
  resultBadge: { display: "inline-block", padding: "5px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700, border: "1px solid", fontFamily: "'Geist Mono',monospace", marginBottom: 24 },
  resultTitle: { fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 22, color: "rgba(255,255,255,.85)", fontWeight: 400, lineHeight: 1.6, marginBottom: 24 },
  xpEarned: { fontSize: 28, fontWeight: 700, fontFamily: "'Geist Mono',monospace", marginBottom: 16 },
  achievementsBanner: { background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#fbbf24", marginBottom: 24 },
  resultActions: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" as const },
  dashLink: { color: "rgba(255,255,255,.5)", fontSize: 14, textDecoration: "none", padding: "13px 24px", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, display: "inline-block" },
};
