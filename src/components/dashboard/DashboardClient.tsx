// src/components/dashboard/DashboardClient.tsx
// Client component that renders the full dashboard UI
// Receives pre-fetched server data as props

"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { RANK_LABELS, RANK_ICONS } from "@/lib/xp";
import type { Rank } from "@prisma/client";
import Link from "next/link";

interface Props {
  user: {
    id: string; firstName: string | null; rank: Rank; xp: number;
    streakDays: number; cyberSafetyScore: number;
    nextRank: Rank | null; xpToNextRank: number; progressToNextRank: number;
  };
  stats: { totalAdventures: number; totalChallenges: number; avgChallengeScore: number };
  achievements: { id: string; name: string; icon: string; description: string; unlockedAt: string }[];
  recentActivity: { type: "adventure" | "challenge"; label: string; xp: number; time: string }[];
  weeklyXp: { day: string; xp: number }[];
}

export function DashboardClient({ user, stats, achievements, recentActivity, weeklyXp }: Props) {
  const maxXp = Math.max(...weeklyXp.map((d) => d.xp), 50);
  const displayName = user.firstName ?? "Explorer";
  const rankLabel = RANK_LABELS[user.rank];
  const rankIcon = RANK_ICONS[user.rank];

  return (
    <div style={styles.shell}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarUser}>
          <div style={styles.avatarCircle}>{displayName[0].toUpperCase()}</div>
          <div>
            <div style={styles.sidebarName}>{displayName}</div>
            <div style={styles.sidebarRankPill}>
              <span style={styles.rankDot}></span>
              {rankIcon} {rankLabel}
            </div>
          </div>
        </div>
        <nav style={styles.sidebarNav}>
          {[
            { label: "Overview", href: "/dashboard", icon: "⊞", active: true },
            { label: "Adventures", href: "/adventures", icon: "⚡" },
            { label: "Challenges", href: "/challenges", icon: "🎯" },
            { label: "Mentor", href: "/mentor", icon: "🤖" },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ ...styles.navItem, ...(item.active ? styles.navItemActive : {}) }}>
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Header */}
        <div style={styles.mainHeader}>
          <div>
            <h1 style={styles.greeting}>Good morning, {displayName}.</h1>
            <p style={styles.greetingSub}>
              {user.xpToNextRank > 0
                ? `You're ${user.xpToNextRank.toLocaleString()} XP away from ${RANK_LABELS[user.nextRank!]}.`
                : "You've reached the maximum rank. Congratulations!"}
            </p>
          </div>
          <Link href="/adventures" style={styles.startBtn}>Start Adventure →</Link>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow}>
          {[
            { label: "TOTAL XP", value: user.xp.toLocaleString(), color: "#22c55e" },
            { label: "CYBER SAFETY SCORE", value: `${user.cyberSafetyScore}%`, color: "#60a5fa" },
            { label: "CHALLENGES", value: String(stats.totalChallenges), color: "#fbbf24" },
            { label: "AVG SCORE", value: `${stats.avgChallengeScore}%`, color: "#a78bfa" },
          ].map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* XP Progress */}
        <div style={styles.xpBlock}>
          <div style={styles.xpTop}>
            <span style={styles.xpRankName}>{rankIcon} {rankLabel}</span>
            {user.nextRank && (
              <span style={styles.xpNextLabel}>
                {user.xp.toLocaleString()} / {(user.xp + user.xpToNextRank).toLocaleString()} XP
              </span>
            )}
          </div>
          <div style={styles.xpBarBg}>
            <div style={{ ...styles.xpBarFill, width: `${user.progressToNextRank}%` }} />
          </div>
          <div style={styles.xpBarLabel}>
            {user.nextRank
              ? `${user.xpToNextRank.toLocaleString()} XP to ${RANK_LABELS[user.nextRank]}`
              : "Maximum rank achieved!"}
          </div>
        </div>

        {/* Bottom grid: chart + activity + achievements */}
        <div style={styles.bottomGrid}>
          {/* Weekly XP chart */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Weekly XP</span>
              <span style={styles.cardSub}>last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={weeklyXp} barSize={24}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, maxXp * 1.2]} />
                <Tooltip
                  contentStyle={{ background: "#1c1917", border: "1px solid #2a2927", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#f0f2f8" }}
                  formatter={(v: number) => [`${v} XP`, ""]}
                />
                <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                  {weeklyXp.map((_, i) => (
                    <Cell key={i} fill={i === 6 ? "#22c55e" : "#2a2927"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent activity */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Recent activity</span>
              <span style={styles.cardSub}>{recentActivity.length} events</span>
            </div>
            <div>
              {recentActivity.length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: 13, padding: "16px 0" }}>No activity yet. Start an adventure!</p>
              )}
              {recentActivity.map((item, i) => (
                <div key={i} style={styles.activityRow}>
                  <div style={{ ...styles.activityDot, background: item.type === "adventure" ? "#22c55e" : "#60a5fa" }} />
                  <div style={styles.activityLabel}>{item.label}</div>
                  <div style={styles.activityXp}>+{item.xp} XP</div>
                  <div style={styles.activityTime}>{formatRelativeTime(item.time)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardTitle}>Achievements</span>
              <span style={styles.cardSub}>{achievements.length} earned</span>
            </div>
            <div style={styles.badgeGrid}>
              {achievements.slice(0, 6).map((a) => (
                <div key={a.id} style={styles.badgePill} title={a.description}>
                  {a.icon} {a.name}
                </div>
              ))}
              {achievements.length === 0 && (
                <p style={{ color: "#9ca3af", fontSize: 12, padding: "8px 0" }}>Complete adventures to earn achievements.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatRelativeTime(iso: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

const styles: Record<string, React.CSSProperties> = {
  shell: { display: "flex", minHeight: "100vh", background: "#0c0a09", color: "#f0f2f8", fontFamily: "'Geist', sans-serif" },
  sidebar: { width: 220, borderRight: "1px solid rgba(255,255,255,.06)", padding: "24px 12px", flexShrink: 0 },
  sidebarUser: { padding: "0 8px 20px", marginBottom: 16, borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 12 },
  avatarCircle: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 },
  sidebarName: { fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,.9)" },
  sidebarRankPill: { display: "flex", alignItems: "center", gap: 6, marginTop: 4, fontSize: 11, color: "#4ade80", fontFamily: "'Geist Mono', monospace" },
  rankDot: { width: 5, height: 5, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 4px #4ade80", display: "inline-block" },
  sidebarNav: { display: "flex", flexDirection: "column", gap: 2 },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, fontSize: 13, color: "rgba(255,255,255,.4)", fontWeight: 500, textDecoration: "none", transition: "all .15s" },
  navItemActive: { background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.9)" },
  navIcon: { fontSize: 14, width: 18, textAlign: "center" },
  main: { flex: 1, padding: "32px 32px", overflow: "auto" },
  mainHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 },
  greeting: { fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 28, fontWeight: 400, color: "rgba(255,255,255,.9)", letterSpacing: "-.5px", marginBottom: 6 },
  greetingSub: { fontSize: 13, color: "rgba(255,255,255,.35)" },
  startBtn: { background: "#fff", color: "#111", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-block" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 },
  statCard: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: "16px" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,.35)", fontFamily: "'Geist Mono',monospace", letterSpacing: ".3px", marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: 600, letterSpacing: "-1px", lineHeight: 1 },
  xpBlock: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: 16, marginBottom: 20 },
  xpTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  xpRankName: { fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.9)" },
  xpNextLabel: { fontSize: 11, color: "rgba(255,255,255,.35)", fontFamily: "'Geist Mono',monospace" },
  xpBarBg: { height: 4, background: "rgba(255,255,255,.08)", borderRadius: 4, overflow: "hidden", marginBottom: 8 },
  xpBarFill: { height: "100%", background: "linear-gradient(90deg,#22c55e,#86efac)", borderRadius: 4, transition: "width .8s ease" },
  xpBarLabel: { fontSize: 11, color: "rgba(255,255,255,.3)", fontFamily: "'Geist Mono',monospace" },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  card: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 10, padding: 16 },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  cardTitle: { fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.9)" },
  cardSub: { fontSize: 11, color: "rgba(255,255,255,.3)", fontFamily: "'Geist Mono',monospace" },
  activityRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.04)" },
  activityDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  activityLabel: { fontSize: 12, color: "rgba(255,255,255,.55)", flex: 1, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  activityXp: { fontSize: 11, fontFamily: "'Geist Mono',monospace", color: "#4ade80", flexShrink: 0 },
  activityTime: { fontSize: 10, color: "rgba(255,255,255,.25)", flexShrink: 0, fontFamily: "'Geist Mono',monospace" },
  badgeGrid: { display: "flex", flexDirection: "column", gap: 8 },
  badgePill: { background: "rgba(34,197,94,.06)", border: "1px solid rgba(34,197,94,.2)", borderRadius: 6, padding: "7px 10px", fontSize: 12, color: "rgba(255,255,255,.8)", cursor: "default" },
};
