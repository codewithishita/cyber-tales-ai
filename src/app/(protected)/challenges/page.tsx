// src/app/(protected)/challenges/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface Challenge {
  id: string; type: string; difficulty: string; title: string;
  payload: any; explanation: string; xpReward: number;
}
interface SubmitResult {
  score: number; xpEarned: number; isPerfect: boolean;
  feedback: Record<string, boolean>; explanation: string; newlyUnlocked: string[];
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((j) => { setChallenges(j.data ?? []); setLoading(false); });
  }, []);

  if (loading) return <div style={styles.page}><div style={styles.loadingMsg}>Loading challenges...</div></div>;

  if (result && selected) {
    return <ResultScreen result={result} challenge={selected} onNext={() => { setResult(null); setSelected(null); }} />;
  }

  if (selected) {
    return (
      <ChallengeScreen
        challenge={selected}
        onSubmit={(answers, timeTaken) => {
          fetch("/api/challenges/submit", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ challengeId: selected.id, answers, timeTaken }),
          }).then((r) => r.json()).then((j) => { if (j.success) setResult(j.data); });
        }}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.listWrap}>
        <div style={styles.listHeader}>
          <h1 style={styles.listTitle}>Cyber Challenges</h1>
          <p style={styles.listSub}>Hands-on simulations. Every mistake is explained.</p>
        </div>
        <div style={styles.challengeGrid}>
          {challenges.map((c) => (
            <button key={c.id} style={styles.challengeCard} onClick={() => setSelected(c)}>
              <div style={styles.challengeCardTop}>
                <span style={{ ...styles.typeBadge, background: typeColor(c.type) + "14", color: typeColor(c.type), borderColor: typeColor(c.type) + "30" }}>
                  {typeIcon(c.type)} {c.type.replace(/_/g, " ")}
                </span>
                <span style={{ ...styles.diffBadge, color: diffColor(c.difficulty) }}>{c.difficulty}</span>
              </div>
              <div style={styles.challengeCardTitle}>{c.title}</div>
              <div style={styles.challengeCardXp}>+{c.xpReward} XP on completion</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Challenge Router (renders correct challenge UI by type) ───────────────────
function ChallengeScreen({ challenge, onSubmit, onBack }: { challenge: Challenge; onSubmit: (a: any, t: number) => void; onBack: () => void }) {
  switch (challenge.type) {
    case "PHISHING_EMAIL": case "SCAM_MESSAGE":
      return <FlagChallenge challenge={challenge} onSubmit={onSubmit} onBack={onBack} />;
    case "URL_ANALYSIS":
      return <UrlChallenge challenge={challenge} onSubmit={onSubmit} onBack={onBack} />;
    case "PASSWORD_STRENGTH":
      return <PasswordChallenge challenge={challenge} onSubmit={onSubmit} onBack={onBack} />;
    default:
      return <FlagChallenge challenge={challenge} onSubmit={onSubmit} onBack={onBack} />;
  }
}

// ── Flag-selection challenge (Phishing / Scam) ────────────────────────────────
function FlagChallenge({ challenge, onSubmit, onBack }: { challenge: Challenge; onSubmit: (a: any, t: number) => void; onBack: () => void }) {
  const p = challenge.payload;
  const allFlags: string[] = [...(p.redFlags ?? p.correctFlags ?? []), "legitimate_sender", "correct_link"];
  const uniqueFlags = [...new Set(allFlags)];
  const [selected, setSelected] = useState<string[]>([]);
  const startRef = useRef(Date.now());

  const toggle = (f: string) => setSelected((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  return (
    <div style={styles.page}>
      <div style={styles.challengeWrap}>
        <div style={styles.challengeTopBar}>
          <button onClick={onBack} style={styles.backBtn}>← Back</button>
          <span style={styles.challengeTypeLabel}>{challenge.type.replace(/_/g, " ")}</span>
        </div>
        <h2 style={styles.challengeTitle}>{challenge.title}</h2>
        <p style={styles.challengeInstruct}>Identify all red flags in this {challenge.type === "SCAM_MESSAGE" ? "message" : "email"}.</p>

        {/* Email / Message display */}
        <div style={styles.emailCard}>
          <div style={styles.emailFrom}>
            <span style={styles.emailFromLabel}>FROM</span>
            <span style={styles.emailFromVal}>{p.from}</span>
          </div>
          {p.subject && <div style={styles.emailSubject}>{p.subject}</div>}
          <div style={styles.emailBody}>{p.body ?? p.message}</div>
        </div>

        {/* Flag selection */}
        <div style={styles.flagSection}>
          <div style={styles.flagLabel}>Select all red flags you can identify:</div>
          <div style={styles.flagGrid}>
            {uniqueFlags.map((f) => (
              <button key={f} onClick={() => toggle(f)}
                style={{ ...styles.flagBtn, ...(selected.includes(f) ? styles.flagBtnActive : {}) }}>
                {selected.includes(f) ? "✓ " : ""}{f.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onSubmit({ selectedFlags: selected }, Math.round((Date.now() - startRef.current) / 1000))}
          style={styles.submitBtn} disabled={selected.length === 0}>
          Submit Analysis
        </button>
      </div>
    </div>
  );
}

// ── URL Analysis challenge ────────────────────────────────────────────────────
function UrlChallenge({ challenge, onSubmit, onBack }: { challenge: Challenge; onSubmit: (a: any, t: number) => void; onBack: () => void }) {
  const p = challenge.payload;
  const [isMalicious, setIsMalicious] = useState<boolean | null>(null);
  const [selectedThreats, setSelectedThreats] = useState<string[]>([]);
  const startRef = useRef(Date.now());

  const toggleThreat = (t: string) =>
    setSelectedThreats((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  return (
    <div style={styles.page}>
      <div style={styles.challengeWrap}>
        <div style={styles.challengeTopBar}>
          <button onClick={onBack} style={styles.backBtn}>← Back</button>
          <span style={styles.challengeTypeLabel}>URL ANALYSIS</span>
        </div>
        <h2 style={styles.challengeTitle}>{challenge.title}</h2>
        <p style={styles.challengeInstruct}>Analyze this URL and identify the threat signals.</p>

        <div style={styles.urlDisplay}>
          <span style={styles.urlProtocol}>{p.url.split("://")[0]}://</span>
          <span style={styles.urlDomain}>{p.url.split("://")[1]?.split("/")[0]}</span>
          <span style={styles.urlPath}>/{p.url.split("://")[1]?.split("/").slice(1).join("/")}</span>
        </div>

        <div style={styles.verdictRow}>
          <div style={styles.verdictLabel}>Your verdict:</div>
          <div style={styles.verdictBtns}>
            <button onClick={() => setIsMalicious(true)}
              style={{ ...styles.verdictBtn, ...(isMalicious === true ? styles.verdictBtnDanger : {}) }}>
              ⚠ Malicious
            </button>
            <button onClick={() => setIsMalicious(false)}
              style={{ ...styles.verdictBtn, ...(isMalicious === false ? styles.verdictBtnSafe : {}) }}>
              ✓ Safe
            </button>
          </div>
        </div>

        <div style={styles.flagSection}>
          <div style={styles.flagLabel}>Select all threat signals present:</div>
          <div style={styles.flagGrid}>
            {p.threats.map((t: any) => (
              <button key={t.type} onClick={() => toggleThreat(t.type)}
                style={{ ...styles.flagBtn, ...(selectedThreats.includes(t.type) ? styles.flagBtnActive : {}) }}>
                {selectedThreats.includes(t.type) ? "✓ " : ""}{t.description}
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => onSubmit({ isMalicious, selectedThreats }, Math.round((Date.now() - startRef.current) / 1000))}
          style={styles.submitBtn} disabled={isMalicious === null}>
          Submit Analysis
        </button>
      </div>
    </div>
  );
}

// ── Password Strength challenge ───────────────────────────────────────────────
function PasswordChallenge({ challenge, onSubmit, onBack }: { challenge: Challenge; onSubmit: (a: any, t: number) => void; onBack: () => void }) {
  const p = challenge.payload;
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const startRef = useRef(Date.now());

  const allWeaknesses = ["common_word", "sequential_numbers", "keyboard_pattern", "too_short", "no_symbols", "no_numbers", "no_uppercase", "dictionary_word", "predictable_year", "personal_info_pattern"];

  const toggle = (pwd: string, w: string) => {
    setAnswers((prev) => {
      const cur = prev[pwd] ?? [];
      return { ...prev, [pwd]: cur.includes(w) ? cur.filter((x) => x !== w) : [...cur, w] };
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.challengeWrap}>
        <div style={styles.challengeTopBar}>
          <button onClick={onBack} style={styles.backBtn}>← Back</button>
          <span style={styles.challengeTypeLabel}>PASSWORD STRENGTH</span>
        </div>
        <h2 style={styles.challengeTitle}>{challenge.title}</h2>
        <p style={styles.challengeInstruct}>For each password, identify all weaknesses.</p>

        {p.weakPasswords.map((pwd: string) => (
          <div key={pwd} style={styles.passwordBlock}>
            <div style={styles.passwordDisplay}>{pwd}</div>
            <div style={styles.weaknessGrid}>
              {allWeaknesses.map((w) => (
                <button key={w} onClick={() => toggle(pwd, w)}
                  style={{ ...styles.flagBtn, ...(answers[pwd]?.includes(w) ? styles.flagBtnActive : {}) }}>
                  {answers[pwd]?.includes(w) ? "✓ " : ""}{w.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button onClick={() => onSubmit(answers, Math.round((Date.now() - startRef.current) / 1000))}
          style={styles.submitBtn}>
          Submit Analysis
        </button>
      </div>
    </div>
  );
}

// ── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ result, challenge, onNext }: { result: SubmitResult; challenge: Challenge; onNext: () => void }) {
  const scoreColor = result.score >= 80 ? "#22c55e" : result.score >= 50 ? "#fbbf24" : "#f87171";
  return (
    <div style={styles.page}>
      <div style={styles.resultCard}>
        <div style={{ ...styles.scoreBig, color: scoreColor }}>{result.score}%</div>
        <div style={styles.resultLabel}>
          {result.isPerfect ? "Perfect Score! 🎉" : result.score >= 80 ? "Great work!" : result.score >= 50 ? "Good effort" : "Keep learning"}
        </div>
        <div style={styles.xpEarned}>+{result.xpEarned} XP</div>
        {result.newlyUnlocked.length > 0 && (
          <div style={styles.achievementsBanner}>🏆 {result.newlyUnlocked.join(", ")}</div>
        )}
        <div style={styles.explanationBlock}>
          <div style={styles.explanationLabel}>EXPLANATION</div>
          <div style={styles.explanationText}>{result.explanation}</div>
        </div>
        <div style={styles.feedbackGrid}>
          {Object.entries(result.feedback).map(([key, correct]) => (
            <div key={key} style={{ ...styles.feedbackItem, borderColor: correct ? "rgba(34,197,94,.2)" : "rgba(248,113,113,.2)", background: correct ? "rgba(34,197,94,.05)" : "rgba(248,113,113,.05)" }}>
              <span style={{ color: correct ? "#22c55e" : "#f87171" }}>{correct ? "✓" : "✗"}</span>
              {key.replace(/_/g, " ")}
            </div>
          ))}
        </div>
        <button onClick={onNext} style={styles.submitBtn}>Next Challenge →</button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function typeColor(t: string) { return { PHISHING_EMAIL: "#f87171", URL_ANALYSIS: "#60a5fa", PASSWORD_STRENGTH: "#a78bfa", SCAM_MESSAGE: "#fbbf24", FAKE_SITE: "#34d399" }[t] ?? "#9ca3af"; }
function typeIcon(t: string) { return { PHISHING_EMAIL: "📧", URL_ANALYSIS: "🔗", PASSWORD_STRENGTH: "🔑", SCAM_MESSAGE: "💬", FAKE_SITE: "🌐" }[t] ?? "🎯"; }
function diffColor(d: string) { return { BEGINNER: "#22c55e", INTERMEDIATE: "#fbbf24", ADVANCED: "#f87171" }[d] ?? "#9ca3af"; }

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0c0a09", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 32px", fontFamily: "'Geist', sans-serif" },
  loadingMsg: { color: "rgba(255,255,255,.4)", fontSize: 14, marginTop: 80 },
  listWrap: { maxWidth: 820, width: "100%" },
  listHeader: { marginBottom: 36 },
  listTitle: { fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 36, color: "rgba(255,255,255,.9)", fontWeight: 400, letterSpacing: "-.5px", marginBottom: 8 },
  listSub: { color: "rgba(255,255,255,.4)", fontSize: 15 },
  challengeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 },
  challengeCard: { background: "#111318", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: 22, cursor: "pointer", textAlign: "left" as const, transition: "all .15s", fontFamily: "'Geist',sans-serif" },
  challengeCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  typeBadge: { fontSize: 10, padding: "3px 8px", borderRadius: 5, border: "1px solid", fontFamily: "'Geist Mono',monospace", fontWeight: 600 },
  diffBadge: { fontSize: 10, fontFamily: "'Geist Mono',monospace", fontWeight: 600 },
  challengeCardTitle: { fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.85)", marginBottom: 10, lineHeight: 1.4 },
  challengeCardXp: { fontSize: 11, color: "rgba(255,255,255,.3)", fontFamily: "'Geist Mono',monospace" },
  challengeWrap: { maxWidth: 680, width: "100%", paddingTop: 8 },
  challengeTopBar: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  backBtn: { background: "transparent", border: "none", color: "rgba(255,255,255,.4)", cursor: "pointer", fontSize: 13, fontFamily: "'Geist',sans-serif" },
  challengeTypeLabel: { fontSize: 11, color: "rgba(255,255,255,.25)", fontFamily: "'Geist Mono',monospace", letterSpacing: "1.5px" },
  challengeTitle: { fontFamily: "'Instrument Serif',Georgia,serif", fontSize: 28, color: "rgba(255,255,255,.9)", fontWeight: 400, marginBottom: 8, letterSpacing: "-.3px" },
  challengeInstruct: { color: "rgba(255,255,255,.45)", fontSize: 14, marginBottom: 24 },
  emailCard: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderLeft: "3px solid #f87171", borderRadius: 12, padding: 20, marginBottom: 24 },
  emailFrom: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  emailFromLabel: { fontSize: 10, fontFamily: "'Geist Mono',monospace", color: "rgba(255,255,255,.3)", letterSpacing: "1px" },
  emailFromVal: { fontSize: 12, color: "#f87171", fontFamily: "'Geist Mono',monospace" },
  emailSubject: { fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,.9)", marginBottom: 10 },
  emailBody: { fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.65 },
  flagSection: { marginBottom: 28 },
  flagLabel: { fontSize: 11, color: "rgba(255,255,255,.35)", fontFamily: "'Geist Mono',monospace", letterSpacing: "1px", textTransform: "uppercase" as const, marginBottom: 12 },
  flagGrid: { display: "flex", flexWrap: "wrap" as const, gap: 8 },
  flagBtn: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 7, padding: "8px 12px", cursor: "pointer", color: "rgba(255,255,255,.55)", fontSize: 12, fontFamily: "'Geist',sans-serif", transition: "all .15s" },
  flagBtnActive: { background: "rgba(34,197,94,.08)", borderColor: "rgba(34,197,94,.3)", color: "#4ade80" },
  submitBtn: { width: "100%", background: "#fff", color: "#111", border: "none", padding: "13px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Geist',sans-serif", marginTop: 8 },
  urlDisplay: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, padding: "16px 20px", marginBottom: 24, fontFamily: "'Geist Mono',monospace", fontSize: 14, wordBreak: "break-all" as const },
  urlProtocol: { color: "#f87171" },
  urlDomain: { color: "#fbbf24" },
  urlPath: { color: "rgba(255,255,255,.5)" },
  verdictRow: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 },
  verdictLabel: { fontSize: 13, color: "rgba(255,255,255,.5)" },
  verdictBtns: { display: "flex", gap: 8 },
  verdictBtn: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 7, padding: "8px 16px", cursor: "pointer", color: "rgba(255,255,255,.6)", fontSize: 13, fontFamily: "'Geist',sans-serif" },
  verdictBtnDanger: { background: "rgba(248,113,113,.1)", borderColor: "rgba(248,113,113,.3)", color: "#f87171" },
  verdictBtnSafe: { background: "rgba(34,197,94,.1)", borderColor: "rgba(34,197,94,.3)", color: "#4ade80" },
  passwordBlock: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: 20, marginBottom: 16 },
  passwordDisplay: { fontFamily: "'Geist Mono',monospace", fontSize: 18, color: "#fbbf24", marginBottom: 14, letterSpacing: "1px" },
  weaknessGrid: { display: "flex", flexWrap: "wrap" as const, gap: 8 },
  resultCard: { background: "#111318", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 48, maxWidth: 560, width: "100%", textAlign: "center" as const },
  scoreBig: { fontSize: 64, fontWeight: 800, fontFamily: "'Geist',sans-serif", letterSpacing: "-3px", lineHeight: 1, marginBottom: 8 },
  resultLabel: { color: "rgba(255,255,255,.7)", fontSize: 18, marginBottom: 12 },
  xpEarned: { fontFamily: "'Geist Mono',monospace", fontSize: 20, color: "#4ade80", marginBottom: 16 },
  achievementsBanner: { background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.2)", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#fbbf24", marginBottom: 24 },
  explanationBlock: { background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: 20, marginBottom: 20, textAlign: "left" as const },
  explanationLabel: { fontSize: 10, color: "rgba(255,255,255,.3)", fontFamily: "'Geist Mono',monospace", letterSpacing: "1.5px", marginBottom: 10 },
  explanationText: { color: "rgba(255,255,255,.65)", fontSize: 13, lineHeight: 1.65 },
  feedbackGrid: { display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 24, justifyContent: "center" },
  feedbackItem: { display: "flex", alignItems: "center", gap: 7, fontSize: 12, border: "1px solid", borderRadius: 6, padding: "6px 10px", color: "rgba(255,255,255,.6)" },
};
