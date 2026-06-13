"use client";
// src/components/LandingClient.tsx
// Original premium landing page design preserved exactly.
// Auth buttons ("Sign in", "Get started") are wired to Clerk routes via Next.js Link.

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LandingClient() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
useEffect(() => {
    // Inject CSS
    const style = document.createElement("style");
    style.id = "landing-styles";
    style.textContent = `...css...`;
    document.head.appendChild(style);

    // Wire nav buttons — AFTER style is defined
    document.querySelector<HTMLElement>(".btn-ghost")?.addEventListener("click", () => router.push(isSignedIn ? "/dashboard" : "/sign-in"));
    document.querySelector<HTMLElement>(".btn-primary.btn-large")?.addEventListener("click", () => router.push(isSignedIn ? "/dashboard" : "/sign-up"));

    // Wire all CTA buttons
    document.querySelectorAll<HTMLElement>("button, .btn-white").forEach(btn => {
      const text = btn.textContent?.toLowerCase() ?? "";
      if (text.includes("begin") || text.includes("quest") || text.includes("start")) {
        btn.addEventListener("click", () => router.push(isSignedIn ? "/dashboard" : "/sign-up"));
      }
});
    style.id = "landing-styles";
    style.textContent = `
/* ─── RESET & ROOT ─────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --white: #ffffff;
  --off-white: #fafaf9;
  --stone-50: #f5f5f4;
  --stone-100: #e7e5e4;
  --stone-200: #d6d3d1;
  --stone-300: #a8a29e;
  --stone-400: #78716c;
  --stone-500: #57534e;
  --stone-600: #44403c;
  --stone-700: #292524;
  --stone-800: #1c1917;
  --stone-900: #0c0a09;

  --ink: #111110;
  --ink-2: #1e1d1c;
  --ink-3: #2a2927;

  --accent: #1a6b4a;
  --accent-light: #22c55e;
  --accent-glow: rgba(34,197,94,.12);
  --accent-border: rgba(34,197,94,.2);

  --blue: #2563eb;
  --blue-light: #60a5fa;
  --blue-glow: rgba(96,165,250,.1);

  --amber: #d97706;
  --amber-light: #fbbf24;

  --red-light: #f87171;

  --serif: 'Instrument Serif', Georgia, serif;
  --sans: 'Geist', system-ui, sans-serif;
  --mono: 'Geist Mono', 'Fira Code', monospace;

  --radius-sm: 6px;
  --radius: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06);
  --shadow-lg: 0 4px 6px rgba(0,0,0,.05), 0 10px 40px rgba(0,0,0,.1);
  --shadow-xl: 0 20px 60px rgba(0,0,0,.12), 0 4px 20px rgba(0,0,0,.08);
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--sans);
  background: var(--white);
  color: var(--ink);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* ─── SCROLLBAR ────────────────────────────────────────────── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--stone-50); }
::-webkit-scrollbar-thumb { background: var(--stone-200); border-radius: 3px; }

/* ─── NAV ──────────────────────────────────────────────────── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 60px;
  background: rgba(255,255,255,.9);
  backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--stone-100);
}

.nav-logo {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--sans); font-size: 15px; font-weight: 600;
  color: var(--ink); text-decoration: none; letter-spacing: -.3px;
}
.nav-logo-mark {
  width: 28px; height: 28px; border-radius: 7px;
  background: var(--ink);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.nav-logo-mark::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(34,197,94,.4));
}
.nav-logo-mark span { color: #fff; font-size: 13px; font-weight: 600; z-index: 1; }

.nav-links {
  display: flex; align-items: center; gap: 4px;
  list-style: none;
}
.nav-links a {
  color: var(--stone-500); text-decoration: none;
  font-size: 13.5px; font-weight: 500;
  padding: 6px 12px; border-radius: var(--radius-sm);
  transition: all .15s;
}
.nav-links a:hover { color: var(--ink); background: var(--stone-50); }

.nav-actions { display: flex; align-items: center; gap: 10px; }

.btn {
  font-family: var(--sans); font-weight: 500; font-size: 13.5px;
  cursor: pointer; border: none; border-radius: var(--radius-sm);
  transition: all .15s ease; display: inline-flex; align-items: center; gap: 7px;
}
.btn-ghost {
  background: transparent; color: var(--stone-500);
  padding: 7px 14px; border: 1px solid var(--stone-200);
}
.btn-ghost:hover { background: var(--stone-50); color: var(--ink); border-color: var(--stone-300); }
.btn-primary {
  background: var(--ink); color: #fff;
  padding: 7px 16px; border: 1px solid transparent;
  box-shadow: 0 1px 2px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.06);
}
.btn-primary:hover { background: var(--ink-2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.2); }
.btn-primary:active { transform: translateY(0); }
.btn-large {
  font-size: 14px; padding: 11px 22px; border-radius: var(--radius);
}

/* ─── HERO ─────────────────────────────────────────────────── */
.hero {
  padding: 140px 40px 100px;
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
  align-items: center;
}

.hero-content { animation: fadeUp .6s ease both; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: var(--stone-50); border: 1px solid var(--stone-200);
  border-radius: 100px; padding: 4px 12px 4px 4px;
  font-size: 12px; color: var(--stone-500); margin-bottom: 28px;
}
.hero-badge-dot {
  width: 20px; height: 20px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px;
}

.hero h1 {
  font-family: var(--serif);
  font-size: clamp(38px, 4.5vw, 58px);
  line-height: 1.1; letter-spacing: -.5px;
  color: var(--ink); margin-bottom: 20px;
  font-weight: 400;
}
.hero h1 em { font-style: italic; color: var(--stone-400); }

.hero-desc {
  color: var(--stone-500); font-size: 16px; line-height: 1.7;
  margin-bottom: 36px; max-width: 440px;
  font-weight: 400;
}

.hero-actions { display: flex; align-items: center; gap: 12px; }

.hero-social-proof {
  display: flex; align-items: center; gap: 12px;
  margin-top: 44px; padding-top: 28px;
  border-top: 1px solid var(--stone-100);
}
.hero-avatars { display: flex; }
.hero-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  border: 2px solid var(--white);
  margin-right: -8px; font-size: 11px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; color: #fff;
}
.hero-social-text { font-size: 13px; color: var(--stone-400); }
.hero-social-text strong { color: var(--stone-600); }

/* ─── HERO CARD ────────────────────────────────────────────── */
.hero-visual { animation: fadeUp .6s .15s ease both; }

.hero-card {
  background: var(--white);
  border: 1px solid var(--stone-100);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  position: relative;
}

.hero-card-header {
  background: var(--stone-50); border-bottom: 1px solid var(--stone-100);
  padding: 14px 18px; display: flex; align-items: center; gap: 12px;
}
.window-dots { display: flex; gap: 6px; }
.window-dot {
  width: 10px; height: 10px; border-radius: 50%;
}
.hero-card-title {
  font-size: 12px; color: var(--stone-400); font-family: var(--mono);
  margin-left: auto; padding-right: 4px;
}

.hero-card-body { padding: 20px; }

.scenario-label {
  font-size: 11px; font-family: var(--mono); color: var(--stone-400);
  text-transform: uppercase; letter-spacing: .5px; margin-bottom: 12px;
  display: flex; align-items: center; gap: 6px;
}
.scenario-dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--amber-light);
  box-shadow: 0 0 6px var(--amber-light);
  animation: pulse-amber 2s infinite;
}

.phish-email {
  background: var(--white); border: 1px solid var(--stone-100);
  border-radius: var(--radius); padding: 16px;
  margin-bottom: 16px; position: relative;
}
.phish-email::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
  background: linear-gradient(to bottom, #f87171, #ef4444);
  border-radius: 3px 0 0 3px;
}

.email-meta { margin-bottom: 10px; }
.email-from {
  font-size: 11px; font-family: var(--mono);
  color: var(--red-light); margin-bottom: 3px;
  display: flex; align-items: center; gap: 6px;
}
.threat-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(248,113,113,.1); border: 1px solid rgba(248,113,113,.2);
  border-radius: 4px; padding: 1px 6px;
  font-size: 10px; color: var(--red-light); font-weight: 600;
  font-family: var(--mono); letter-spacing: .3px;
}
.email-subject { font-size: 13px; font-weight: 600; color: var(--ink); }
.email-body { font-size: 13px; color: var(--stone-500); line-height: 1.5; }
.email-body strong { color: var(--ink); }
.email-link {
  color: var(--blue-light); text-decoration: underline;
  font-family: var(--mono); font-size: 11px;
}

.choice-label {
  font-size: 12px; font-weight: 600; color: var(--stone-400);
  text-transform: uppercase; letter-spacing: .5px; margin-bottom: 10px;
}
.choices { display: flex; flex-direction: column; gap: 8px; }
.choice-card {
  background: var(--stone-50); border: 1px solid var(--stone-100);
  border-radius: var(--radius); padding: 12px 14px;
  cursor: pointer; transition: all .2s ease;
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 13px; color: var(--stone-600);
}
.choice-card:hover { background: var(--white); border-color: var(--stone-300); color: var(--ink); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.choice-card.correct { border-color: var(--accent-border); background: var(--accent-glow); color: var(--ink); }
.choice-card.danger-choice { border-color: rgba(248,113,113,.25); background: rgba(248,113,113,.05); color: var(--ink); }

.choice-icon {
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; flex-shrink: 0; margin-top: 1px;
}
.icon-safe { background: rgba(34,197,94,.12); color: var(--accent-light); }
.icon-danger { background: rgba(248,113,113,.12); color: var(--red-light); }
.icon-neutral { background: var(--stone-100); color: var(--stone-400); }

.mentor-strip {
  margin-top: 14px; padding: 12px 14px;
  background: linear-gradient(135deg, var(--blue-glow), rgba(96,165,250,.05));
  border: 1px solid rgba(96,165,250,.15);
  border-radius: var(--radius);
  display: flex; gap: 10px; align-items: flex-start;
}
.mentor-icon {
  width: 26px; height: 26px; border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #fff; font-weight: 700;
  flex-shrink: 0;
}
.mentor-text { font-size: 12px; color: var(--stone-500); line-height: 1.5; }
.mentor-text strong { color: var(--ink); }

/* ─── SECTION WRAPPER ──────────────────────────────────────── */
.section { padding: 100px 40px; }
.section-inner { max-width: 1200px; margin: 0 auto; }

.section-header { margin-bottom: 56px; }
.section-kicker {
  font-family: var(--mono); font-size: 11px; color: var(--stone-400);
  text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.section-kicker::before {
  content: ''; display: block; width: 20px; height: 1px; background: var(--stone-300);
}
.section-h { font-family: var(--serif); font-size: clamp(28px, 3.5vw, 42px); line-height: 1.15; letter-spacing: -.3px; color: var(--ink); font-weight: 400; margin-bottom: 16px; }
.section-sub { font-size: 16px; color: var(--stone-500); max-width: 480px; line-height: 1.7; }

/* ─── FEATURES GRID ────────────────────────────────────────── */
.features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: var(--stone-100); border: 1px solid var(--stone-100); border-radius: var(--radius-xl); overflow: hidden; }
.feature-cell { background: var(--white); padding: 36px 40px; transition: background .2s; }
.feature-cell:hover { background: var(--stone-50); }
.feature-number { font-family: var(--mono); font-size: 11px; color: var(--stone-300); margin-bottom: 20px; display: block; }
.feature-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  background: var(--stone-50); border: 1px solid var(--stone-100);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px; font-size: 18px;
}
.feature-cell h3 { font-family: var(--sans); font-size: 16px; font-weight: 600; color: var(--ink); margin-bottom: 10px; letter-spacing: -.2px; }
.feature-cell p { font-size: 14px; color: var(--stone-500); line-height: 1.65; }
.feature-tags { display: flex; gap: 6px; margin-top: 20px; flex-wrap: wrap; }
.feature-tag {
  font-family: var(--mono); font-size: 10.5px; color: var(--stone-400);
  background: var(--stone-50); border: 1px solid var(--stone-100);
  border-radius: 4px; padding: 3px 8px;
}

/* ─── DASHBOARD SECTION ────────────────────────────────────── */
.dashboard-bg {
  background: var(--stone-900);
  padding: 80px 40px; margin: 0;
}
.dashboard-inner { max-width: 1200px; margin: 0 auto; }

.dash-kicker { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
.dash-kicker::before { content:''; width:20px; height:1px; background: rgba(255,255,255,.2); }
.dash-h { font-family: var(--serif); font-size: clamp(26px,3vw,40px); color: #fff; font-weight: 400; margin-bottom: 48px; line-height: 1.15; letter-spacing: -.3px; }
.dash-h em { font-style: italic; color: rgba(255,255,255,.4); }

.dashboard-shell {
  background: var(--ink-2); border: 1px solid rgba(255,255,255,.08);
  border-radius: var(--radius-xl); overflow: hidden;
  box-shadow: 0 40px 80px rgba(0,0,0,.4);
}
.dash-topbar {
  background: var(--ink-3); border-bottom: 1px solid rgba(255,255,255,.06);
  padding: 12px 20px; display: flex; align-items: center; gap: 16px;
}
.dash-topbar-dots { display: flex; gap: 6px; }
.dash-topbar-dot { width: 10px; height: 10px; border-radius: 50%; }
.dash-nav-items { display: flex; gap: 4px; margin-left: 12px; }
.dash-nav-item {
  font-size: 12px; color: rgba(255,255,255,.4); padding: 5px 12px;
  border-radius: var(--radius-sm); cursor: pointer; transition: .15s;
  font-weight: 500;
}
.dash-nav-item.active { background: rgba(255,255,255,.08); color: rgba(255,255,255,.9); }
.dash-nav-item:hover { color: rgba(255,255,255,.7); }
.dash-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.dash-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff;
}
.dash-user-name { font-size: 12px; color: rgba(255,255,255,.5); }

.dash-layout { display: grid; grid-template-columns: 220px 1fr; }
.dash-sidebar {
  border-right: 1px solid rgba(255,255,255,.06);
  padding: 20px 12px;
}
.dash-sidebar-user { padding: 0 8px 20px; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,.06); }
.dash-sidebar-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,.9); margin-bottom: 2px; }
.dash-sidebar-rank { font-size: 11px; color: rgba(255,255,255,.35); font-family: var(--mono); }
.dash-rank-pill {
  display: inline-flex; align-items: center; gap: 5px;
  margin-top: 8px;
  background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.2);
  border-radius: 100px; padding: 3px 10px;
  font-size: 10px; font-family: var(--mono); color: #4ade80; font-weight: 600;
}
.dash-rank-dot { width: 5px; height: 5px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 4px #4ade80; }

.dash-menu { display: flex; flex-direction: column; gap: 2px; margin-top: 16px; }
.dash-menu-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: var(--radius-sm);
  font-size: 13px; color: rgba(255,255,255,.45); cursor: pointer;
  transition: all .15s; font-weight: 500;
}
.dash-menu-item svg { width: 15px; height: 15px; opacity: .6; }
.dash-menu-item:hover { background: rgba(255,255,255,.05); color: rgba(255,255,255,.8); }
.dash-menu-item.active { background: rgba(255,255,255,.07); color: rgba(255,255,255,.9); }
.dash-menu-item.active svg { opacity: 1; }

.dash-main { padding: 24px; overflow: hidden; }

.dash-greeting {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 24px;
}
.dash-greeting h2 { font-family: var(--serif); font-size: 22px; color: rgba(255,255,255,.9); font-weight: 400; letter-spacing: -.2px; }
.dash-greeting p { font-size: 12px; color: rgba(255,255,255,.35); margin-top: 3px; }
.dash-date { font-size: 11px; color: rgba(255,255,255,.3); font-family: var(--mono); text-align: right; }

.dash-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
.stat-card {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
  border-radius: var(--radius); padding: 16px;
}
.stat-label { font-size: 11px; color: rgba(255,255,255,.35); margin-bottom: 8px; font-family: var(--mono); letter-spacing: .3px; }
.stat-value { font-size: 26px; font-weight: 600; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
.stat-sub { font-size: 11px; color: rgba(255,255,255,.35); }
.stat-sub .up { color: #4ade80; }
.stat-sub .down { color: #f87171; }

.stat-value.green { color: #4ade80; }
.stat-value.blue { color: #60a5fa; }
.stat-value.amber { color: #fbbf24; }

.xp-block {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
  border-radius: var(--radius); padding: 16px;
  margin-bottom: 20px;
}
.xp-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.xp-rank-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,.9); }
.xp-next { font-size: 11px; color: rgba(255,255,255,.35); font-family: var(--mono); }
.xp-bar-bg { height: 4px; background: rgba(255,255,255,.08); border-radius: 4px; position: relative; overflow: hidden; }
.xp-bar-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #86efac); border-radius: 4px; width: 62%; position: relative; }
.xp-bar-fill::after { content:''; position: absolute; right: 0; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; background: #86efac; border-radius: 50%; box-shadow: 0 0 8px #86efac; margin-right: -4px; }
.xp-markers { display: flex; justify-content: space-between; margin-top: 8px; }
.xp-marker { font-size: 10px; color: rgba(255,255,255,.25); font-family: var(--mono); }

.dash-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.activity-card {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
  border-radius: var(--radius); padding: 16px;
}
.activity-card h4 { font-size: 12px; font-weight: 600; color: rgba(255,255,255,.9); margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; }
.activity-card h4 span { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,.3); font-weight: 400; }

.activity-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,.04); }
.activity-row:last-child { border-bottom: none; padding-bottom: 0; }
.activity-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.activity-text { font-size: 12px; color: rgba(255,255,255,.55); flex: 1; line-height: 1.4; }
.activity-xp { font-size: 11px; font-family: var(--mono); color: #4ade80; flex-shrink: 0; }
.activity-time { font-size: 10px; font-family: var(--mono); color: rgba(255,255,255,.25); flex-shrink: 0; }

.badge-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.badge-pill {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
  border-radius: var(--radius-sm); padding: 8px 10px;
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: rgba(255,255,255,.6);
}
.badge-pill.earned { border-color: rgba(34,197,94,.2); background: rgba(34,197,94,.06); color: rgba(255,255,255,.8); }
.badge-pill.locked { opacity: .4; }

/* ─── RANKS ────────────────────────────────────────────────── */
.ranks-section { padding: 100px 40px; background: var(--stone-50); }
.ranks-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 2px; background: var(--stone-200); border: 1px solid var(--stone-200); border-radius: var(--radius-xl); overflow: hidden; margin-top: 48px; }
.rank-cell { background: var(--white); padding: 28px 20px; transition: background .2s; }
.rank-cell:hover { background: var(--stone-50); }
.rank-cell.current { background: var(--ink); }
.rank-num-label { font-family: var(--mono); font-size: 10px; color: var(--stone-300); margin-bottom: 16px; display: block; }
.rank-cell.current .rank-num-label { color: rgba(255,255,255,.3); }
.rank-icon-label { font-size: 24px; margin-bottom: 10px; }
.rank-cell-name { font-size: 13px; font-weight: 600; color: var(--ink); letter-spacing: -.2px; }
.rank-cell.current .rank-cell-name { color: #fff; }
.rank-cell-desc { font-size: 12px; color: var(--stone-400); margin-top: 4px; line-height: 1.4; }
.rank-cell.current .rank-cell-desc { color: rgba(255,255,255,.45); }
.rank-cell.current .rank-num-label::after { content: ' ← you'; color: #4ade80; }
.rank-xp { font-family: var(--mono); font-size: 10px; color: var(--stone-300); margin-top: 12px; }
.rank-cell.current .rank-xp { color: rgba(255,255,255,.3); }

/* ─── TECH STACK ────────────────────────────────────────────── */
.tech-section { padding: 80px 40px; border-top: 1px solid var(--stone-100); }
.tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; background: var(--stone-100); border: 1px solid var(--stone-100); border-radius: var(--radius-xl); overflow: hidden; margin-top: 48px; }
.tech-cell { background: var(--white); padding: 28px; }
.tech-cell-label { font-size: 11px; font-family: var(--mono); color: var(--stone-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }
.tech-pills { display: flex; flex-direction: column; gap: 6px; }
.tech-pill { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: var(--stone-50); border: 1px solid var(--stone-100); border-radius: var(--radius-sm); font-size: 13px; color: var(--stone-700); font-weight: 500; }
.tech-pill-dot { width: 6px; height: 6px; border-radius: 50%; }

/* ─── CHALLENGE PREVIEW ────────────────────────────────────── */
.challenge-section { padding: 100px 40px; }
.challenge-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

.phishing-checker {
  background: var(--white); border: 1px solid var(--stone-100);
  border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-xl);
}
.checker-header { background: var(--stone-50); border-bottom: 1px solid var(--stone-100); padding: 14px 20px; }
.checker-header-title { font-size: 13px; font-weight: 600; color: var(--ink); }
.checker-header-sub { font-size: 11px; color: var(--stone-400); margin-top: 2px; font-family: var(--mono); }

.checker-body { padding: 20px; }
.url-input-wrap { position: relative; margin-bottom: 16px; }
.url-bar {
  width: 100%; background: var(--stone-50); border: 1px solid var(--stone-200);
  border-radius: var(--radius); padding: 10px 14px 10px 36px;
  font-family: var(--mono); font-size: 12px; color: var(--stone-600);
  outline: none;
}
.url-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 13px; }

.analysis-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.analysis-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px; background: var(--stone-50); border: 1px solid var(--stone-100); border-radius: var(--radius-sm); }
.analysis-status { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-top: 1px; }
.status-fail { background: rgba(248,113,113,.12); color: var(--red-light); border: 1px solid rgba(248,113,113,.2); }
.status-pass { background: rgba(34,197,94,.1); color: var(--accent-light); border: 1px solid rgba(34,197,94,.2); }
.status-warn { background: rgba(251,191,36,.1); color: var(--amber-light); border: 1px solid rgba(251,191,36,.2); }
.analysis-text { font-size: 12.5px; color: var(--stone-600); line-height: 1.4; flex: 1; }
.analysis-text strong { color: var(--ink); display: block; margin-bottom: 2px; font-size: 12px; }

.verdict-bar {
  background: rgba(248,113,113,.06); border: 1px solid rgba(248,113,113,.2);
  border-radius: var(--radius); padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
}
.verdict-icon { font-size: 20px; }
.verdict-text { flex: 1; }
.verdict-title { font-size: 13px; font-weight: 600; color: #dc2626; }
.verdict-sub { font-size: 12px; color: var(--stone-500); margin-top: 2px; }
.verdict-score { font-family: var(--mono); font-size: 22px; font-weight: 600; color: #dc2626; }

/* ─── CTA ──────────────────────────────────────────────────── */
.cta-section {
  padding: 80px 40px;
  background: var(--ink);
}
.cta-inner { max-width: 700px; margin: 0 auto; text-align: center; }
.cta-kicker { font-family: var(--mono); font-size: 11px; color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 20px; }
.cta-h { font-family: var(--serif); font-size: clamp(30px, 4vw, 46px); color: #fff; font-weight: 400; line-height: 1.1; letter-spacing: -.5px; margin-bottom: 16px; }
.cta-h em { font-style: italic; color: rgba(255,255,255,.4); }
.cta-sub { color: rgba(255,255,255,.45); font-size: 15px; line-height: 1.7; margin-bottom: 36px; }
.cta-actions { display: flex; gap: 12px; justify-content: center; }
.btn-white { background: #fff; color: var(--ink); padding: 11px 24px; border-radius: var(--radius); font-size: 14px; font-weight: 600; border: none; cursor: pointer; font-family: var(--sans); transition: all .15s; }
.btn-white:hover { background: var(--stone-100); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,.3); }
.btn-outline-white { background: transparent; color: rgba(255,255,255,.7); padding: 11px 24px; border-radius: var(--radius); font-size: 14px; font-weight: 500; border: 1px solid rgba(255,255,255,.15); cursor: pointer; font-family: var(--sans); transition: all .15s; }
.btn-outline-white:hover { border-color: rgba(255,255,255,.3); color: #fff; background: rgba(255,255,255,.05); }

/* ─── FOOTER ───────────────────────────────────────────────── */
footer {
  background: var(--stone-900); border-top: 1px solid rgba(255,255,255,.05);
  padding: 28px 40px;
  display: flex; align-items: center; justify-content: space-between;
}
.footer-logo { font-size: 14px; font-weight: 600; color: rgba(255,255,255,.8); display: flex; align-items: center; gap: 8px; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { font-size: 13px; color: rgba(255,255,255,.3); text-decoration: none; transition: color .15s; }
.footer-links a:hover { color: rgba(255,255,255,.6); }
.footer-copy { font-size: 12px; color: rgba(255,255,255,.2); font-family: var(--mono); }

/* ─── ANIMATIONS ───────────────────────────────────────────── */
@keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse-amber { 0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--amber-light); } 50% { opacity: .5; box-shadow: 0 0 2px var(--amber-light); } }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
@keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
@keyframes xp-count { from { opacity: 0; transform: translateY(8px) scale(.85); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes badge-reveal { 0% { transform: scale(0.6) rotate(-8deg); opacity: 0; } 70% { transform: scale(1.1) rotate(2deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
@keyframes confetti-fall { 0% { opacity: 1; transform: translateY(0) rotate(0deg); } 100% { opacity: 0; transform: translateY(60px) rotate(360deg); } }
@keyframes rank-up { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,.4); } 50% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(34,197,94,0); } 100% { transform: scale(1); } }
@keyframes world-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,.15); } 50% { box-shadow: 0 0 0 8px rgba(34,197,94,.0); } }
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes cipher-bounce { 0%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-4px) scale(1.05); } 70% { transform: translateY(-2px) scale(1.02); } }
@keyframes star-twinkle { 0%, 100% { opacity: .4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
@keyframes orbit { from { transform: rotate(0deg) translateX(30px) rotate(0deg); } to { transform: rotate(360deg) translateX(30px) rotate(-360deg); } }
@keyframes xp-bar-anim { from { width: 0; } to { width: 62%; } }
@keyframes progress-glow { 0%, 100% { box-shadow: 0 0 8px rgba(34,197,94,.4); } 50% { box-shadow: 0 0 16px rgba(34,197,94,.8); } }

.cursor-blink { display: inline-block; width: 2px; height: 14px; background: var(--stone-400); margin-left: 2px; animation: blink 1s infinite; vertical-align: middle; }

/* Scroll reveal */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity .55s ease, transform .55s ease; }
.reveal.visible { opacity: 1; transform: none; }

/* ─── CIPHER COMPANION ──────────────────────────────────────── */
.cipher-hint {
  display: flex; align-items: flex-start; gap: 10px;
  background: linear-gradient(135deg, rgba(37,99,235,.06), rgba(96,165,250,.04));
  border: 1px solid rgba(96,165,250,.18);
  border-radius: var(--radius); padding: 12px 14px;
  margin-top: 12px;
  animation: fadeUp .4s ease both;
}
.cipher-avatar {
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; color: #fff; font-weight: 700;
  animation: cipher-bounce 3s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(37,99,235,.25);
}
.cipher-text { font-size: 12.5px; color: var(--stone-500); line-height: 1.5; }
.cipher-text strong { color: var(--ink); }

/* ─── WORLD CARDS ───────────────────────────────────────────── */
.worlds-section { padding: 100px 40px; background: var(--white); }
.worlds-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 48px; }
.world-card {
  background: var(--white); border: 1px solid var(--stone-100);
  border-radius: var(--radius-lg); padding: 28px 24px;
  cursor: pointer; transition: all .25s ease;
  position: relative; overflow: hidden;
}
.world-card::before {
  content: ''; position: absolute; inset: 0; opacity: 0;
  transition: opacity .3s ease;
}
.world-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--stone-200); }
.world-card:hover::before { opacity: 1; }
.world-card.unlocked { border-color: var(--accent-border); }
.world-card.locked { opacity: .65; }
.world-card.locked:hover { transform: none; box-shadow: none; }

.world-card[data-world="kingdom"]::before { background: linear-gradient(135deg, rgba(251,191,36,.04), transparent); }
.world-card[data-world="forest"]::before { background: linear-gradient(135deg, rgba(34,197,94,.05), transparent); }
.world-card[data-world="planet"]::before { background: linear-gradient(135deg, rgba(96,165,250,.05), transparent); }
.world-card[data-world="city"]::before { background: linear-gradient(135deg, rgba(248,113,113,.04), transparent); }
.world-card[data-world="valley"]::before { background: linear-gradient(135deg, rgba(167,139,250,.05), transparent); }
.world-card[data-world="citadel"]::before { background: linear-gradient(135deg, rgba(34,197,94,.06), transparent); }

.world-icon {
  font-size: 32px; margin-bottom: 14px; display: block;
  transition: transform .3s ease;
  animation: float 4s ease-in-out infinite;
}
.world-card:hover .world-icon { transform: scale(1.15); }
.world-card[data-world="forest"] .world-icon { animation-delay: .5s; }
.world-card[data-world="planet"] .world-icon { animation-delay: 1s; }
.world-card[data-world="city"] .world-icon { animation-delay: 1.5s; }
.world-card[data-world="valley"] .world-icon { animation-delay: 2s; }
.world-card[data-world="citadel"] .world-icon { animation-delay: 2.5s; }

.world-name { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 5px; letter-spacing: -.2px; }
.world-desc { font-size: 13px; color: var(--stone-400); line-height: 1.5; margin-bottom: 14px; }
.world-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.world-missions { font-size: 11px; font-family: var(--mono); color: var(--stone-400); }
.world-badge {
  font-size: 10px; font-family: var(--mono); font-weight: 600;
  padding: 2px 8px; border-radius: 100px;
}
.world-badge.active { background: var(--accent-glow); color: #16a34a; border: 1px solid var(--accent-border); }
.world-badge.locked-badge { background: var(--stone-50); color: var(--stone-400); border: 1px solid var(--stone-200); }
.world-badge.completed { background: rgba(96,165,250,.1); color: #2563eb; border: 1px solid rgba(96,165,250,.2); }
.world-progress-bar { height: 2px; background: var(--stone-100); border-radius: 2px; margin-top: 14px; }
.world-progress-fill { height: 100%; border-radius: 2px; transition: width .8s ease; }

/* ─── QUEST CARDS ───────────────────────────────────────────── */
.quests-section { padding: 100px 40px; background: var(--stone-50); }
.quests-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 48px; }
.quest-card {
  background: var(--white); border: 1px solid var(--stone-100);
  border-radius: var(--radius-lg); overflow: hidden;
  cursor: pointer; transition: all .2s ease; position: relative;
}
.quest-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.quest-card.quest-completed { border-color: var(--accent-border); }
.quest-card.quest-locked { opacity: .6; pointer-events: none; }

.quest-header {
  padding: 16px 18px 12px;
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 10px;
}
.quest-world-tag {
  font-size: 10px; font-family: var(--mono); font-weight: 600;
  padding: 3px 8px; border-radius: 4px;
  background: var(--stone-50); border: 1px solid var(--stone-100);
  color: var(--stone-500);
}
.quest-difficulty {
  display: flex; align-items: center; gap: 3px;
}
.diff-pip { width: 5px; height: 5px; border-radius: 50%; background: var(--stone-200); transition: background .2s; }
.diff-pip.active.easy { background: #22c55e; }
.diff-pip.active.medium { background: var(--amber-light); }
.diff-pip.active.hard { background: #f87171; }

.quest-body { padding: 0 18px 16px; }
.quest-title { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 6px; letter-spacing: -.2px; }
.quest-desc { font-size: 13px; color: var(--stone-400); line-height: 1.5; }
.quest-footer {
  padding: 12px 18px; border-top: 1px solid var(--stone-50);
  display: flex; align-items: center; justify-content: space-between;
}
.quest-xp {
  font-family: var(--mono); font-size: 12px; font-weight: 600;
  color: var(--accent-light);
  display: flex; align-items: center; gap: 4px;
}
.quest-xp-icon { font-size: 10px; }
.quest-status {
  font-size: 11px; font-family: var(--mono);
  padding: 3px 8px; border-radius: 4px; font-weight: 600;
}
.quest-status.cleared { background: var(--accent-glow); color: #16a34a; border: 1px solid var(--accent-border); }
.quest-status.available { background: var(--stone-50); color: var(--stone-500); border: 1px solid var(--stone-100); }
.quest-status.locked { background: var(--stone-50); color: var(--stone-300); border: 1px solid var(--stone-100); }

.quest-cleared-overlay {
  position: absolute; top: 10px; right: 10px;
  width: 22px; height: 22px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: #fff;
  animation: badge-reveal .4s ease both;
}

/* ─── ACHIEVEMENTS ──────────────────────────────────────────── */
.achievements-grid-enhanced { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 32px; }
.achievement-card {
  background: var(--white); border: 1px solid var(--stone-100);
  border-radius: var(--radius-lg); padding: 20px 16px; text-align: center;
  cursor: pointer; transition: all .25s ease; position: relative; overflow: hidden;
}
.achievement-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--stone-200); }
.achievement-card.earned { border-color: var(--accent-border); background: linear-gradient(135deg, var(--white), rgba(34,197,94,.02)); }
.achievement-card.locked { opacity: .5; }
.achievement-icon { font-size: 28px; margin-bottom: 10px; display: block; }
.achievement-card.earned .achievement-icon { animation: float 3.5s ease-in-out infinite; }
.achievement-name { font-size: 12px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
.achievement-card.locked .achievement-name { color: var(--stone-400); }
.achievement-flavor { font-size: 11px; color: var(--stone-400); line-height: 1.4; }
.achievement-earned-check {
  position: absolute; top: 8px; right: 8px;
  width: 16px; height: 16px; border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  display: flex; align-items: center; justify-content: center;
  font-size: 8px; color: #fff;
}

/* ─── HERO ENHANCEMENTS ─────────────────────────────────────── */
.hero-cyber-elements {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.cyber-particle {
  position: absolute; border-radius: 50%;
  background: rgba(34,197,94,.15);
}
.cyber-particle:nth-child(1) { width: 4px; height: 4px; top: 20%; left: 15%; animation: star-twinkle 2.2s ease-in-out infinite; }
.cyber-particle:nth-child(2) { width: 3px; height: 3px; top: 60%; left: 8%; animation: star-twinkle 3s ease-in-out infinite .5s; }
.cyber-particle:nth-child(3) { width: 5px; height: 5px; top: 35%; left: 25%; animation: star-twinkle 2.7s ease-in-out infinite 1s; background: rgba(96,165,250,.2); }
.cyber-particle:nth-child(4) { width: 3px; height: 3px; top: 75%; left: 20%; animation: star-twinkle 2.4s ease-in-out infinite 1.5s; }
.cyber-particle:nth-child(5) { width: 4px; height: 4px; top: 10%; left: 40%; animation: star-twinkle 3.2s ease-in-out infinite .8s; background: rgba(251,191,36,.2); }

/* ─── XP COUNTER ANIMATION ──────────────────────────────────── */
.xp-bar-fill { animation: xp-bar-anim 1.5s 1s ease both, progress-glow 2s 2.5s ease-in-out infinite !important; }

/* ─── CONFETTI ──────────────────────────────────────────────── */
.confetti-container { position: fixed; top: 0; left: 0; right: 0; pointer-events: none; z-index: 9999; height: 100px; overflow: hidden; }
.confetti-piece {
  position: absolute; width: 8px; height: 8px; border-radius: 2px;
  animation: confetti-fall .8s ease forwards;
  opacity: 0;
}

/* ─── MISSION PREVIEW FLOAT ─────────────────────────────────── */
.mission-preview-float {
  position: absolute; bottom: -8px; right: -8px;
  background: var(--white); border: 1px solid var(--stone-100);
  border-radius: var(--radius); padding: 10px 14px;
  box-shadow: var(--shadow-lg);
  animation: float-slow 5s ease-in-out infinite;
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; z-index: 10;
}
.mission-preview-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px #22c55e; animation: pulse-amber 1.5s infinite; }

/* ─── ACTIVITY COPY RENAME ──────────────────────────────────── */
.activity-card .mission-cleared-tag {
  font-size: 9px; font-family: var(--mono); font-weight: 600;
  background: var(--accent-glow); color: #16a34a;
  border: 1px solid var(--accent-border);
  padding: 1px 6px; border-radius: 3px;
}

/* ─── RESULT FEEDBACK ──────────────────────────────────────── */
#result-feedback { display: none; margin-top: 14px; border-radius: var(--radius); padding: 14px 16px; font-size: 13px; line-height: 1.5; }

/* ─── DAILY MISSION BANNER ─────────────────────────────────── */
.daily-banner { background: var(--stone-50); border-bottom: 1px solid var(--stone-100); padding: 0 40px; }
.daily-banner-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px; padding: 13px 0; }
.daily-streak { display: flex; align-items: center; gap: 8px; padding: 7px 12px; background: var(--white); border: 1px solid rgba(251,191,36,.3); border-radius: var(--radius); flex-shrink: 0; }
.daily-streak-fire { font-size: 16px; animation: float 2s ease-in-out infinite; }
.daily-streak-num { font-size: 18px; font-weight: 600; font-family: var(--mono); color: #b45309; line-height: 1; }
.daily-streak-label { font-size: 9px; color: var(--stone-400); font-family: var(--mono); text-transform: uppercase; letter-spacing: .5px; }
.daily-divider { width: 1px; height: 36px; background: var(--stone-200); flex-shrink: 0; }
.daily-mission-block { flex: 1; }
.daily-mission-tag { font-size: 9px; font-family: var(--mono); color: var(--stone-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
.daily-mission-title { font-size: 13px; font-weight: 600; color: var(--ink); }
.daily-mission-desc { font-size: 11.5px; color: var(--stone-400); margin-top: 1px; }
.daily-reward { display: flex; align-items: center; gap: 5px; padding: 5px 10px; background: var(--accent-glow); border: 1px solid var(--accent-border); border-radius: var(--radius-sm); font-size: 11.5px; font-family: var(--mono); font-weight: 600; color: #16a34a; flex-shrink: 0; white-space: nowrap; }
.daily-timer { font-size: 11px; font-family: var(--mono); color: var(--stone-400); display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; }
.daily-timer-val { font-size: 15px; font-weight: 600; color: var(--stone-600); line-height: 1; animation: countdown-tick 1s ease-in-out infinite; display: inline-block; }
.daily-progress-wrap { width: 90px; height: 2px; background: var(--stone-200); border-radius: 2px; margin-top: 4px; }
.daily-progress-fill { height: 100%; background: var(--accent-light); border-radius: 2px; width: 60%; }

/* ─── NEXT UNLOCK BAR ──────────────────────────────────────── */
.next-unlock-bar { background: linear-gradient(135deg, rgba(34,197,94,.04), rgba(96,165,250,.02)); border: 1px solid var(--accent-border); border-radius: var(--radius); padding: 14px 18px; display: flex; align-items: center; gap: 14px; }
.nub-icon { font-size: 20px; flex-shrink: 0; }
.nub-content { flex: 1; }
.nub-title { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
.nub-sub { font-size: 12px; color: var(--stone-400); line-height: 1.4; }
.nub-xp { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--accent-light); flex-shrink: 0; white-space: nowrap; }

/* ─── WORLD EXTRAS ─────────────────────────────────────────── */
.world-unlock-hint { font-size: 11px; color: var(--stone-400); font-family: var(--mono); margin-top: 8px; }
.world-reward-tag { font-size: 10px; font-family: var(--mono); color: var(--stone-400); background: var(--stone-50); border: 1px solid var(--stone-100); padding: 1px 6px; border-radius: 3px; margin-top: 8px; display: inline-block; }
.world-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }

/* ─── QUEST HOT TAG ────────────────────────────────────────── */
.quest-hot-tag { background: rgba(251,191,36,.07); border-bottom: 1px solid rgba(251,191,36,.18); padding: 4px 16px; font-size: 10px; font-family: var(--mono); font-weight: 600; color: #b45309; }
.quest-card.quest-hot { border-color: rgba(251,191,36,.3); }
.quest-header.has-hot { padding-top: 12px; }
.quest-reward-teaser { font-size: 10.5px; color: var(--stone-400); font-family: var(--mono); padding: 0 18px 10px; }
.quest-reward-teaser span { color: var(--amber); }
.checker-xp-reward { font-size: 11px; font-family: var(--mono); font-weight: 600; color: var(--accent-light); background: var(--accent-glow); border: 1px solid var(--accent-border); padding: 3px 8px; border-radius: 4px; }

/* ─── TROPHY CASE ──────────────────────────────────────────── */
.trophies-section { padding: 100px 40px; background: var(--white); border-top: 1px solid var(--stone-100); }
.trophies-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 36px; }
.trophy-card { background: var(--white); border: 1px solid var(--stone-100); border-radius: var(--radius-lg); padding: 20px 14px; text-align: center; cursor: pointer; transition: all .25s ease; position: relative; overflow: hidden; }
.trophy-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--stone-200); }
.trophy-card.earned { border-color: var(--accent-border); background: linear-gradient(160deg, var(--white) 70%, rgba(34,197,94,.03)); }
.trophy-card.earned:hover { box-shadow: 0 4px 20px rgba(34,197,94,.12); }
.trophy-card.locked-secret { background: var(--stone-50); border-style: dashed; }
.trophy-card.legendary { border-color: rgba(251,191,36,.3); background: linear-gradient(160deg, var(--white) 70%, rgba(251,191,36,.03)); }
.trophy-icon { font-size: 26px; margin-bottom: 10px; display: block; transition: transform .3s ease; }
.trophy-card.earned .trophy-icon { animation: float 3.5s ease-in-out infinite; }
.trophy-card:hover .trophy-icon { transform: scale(1.1); }
.trophy-card.locked-secret .trophy-icon { filter: grayscale(1); opacity: .35; }
.trophy-name { font-size: 11.5px; font-weight: 600; color: var(--ink); margin-bottom: 3px; }
.trophy-card.locked-secret .trophy-name { color: var(--stone-400); }
.trophy-flavor { font-size: 10.5px; color: var(--stone-400); line-height: 1.4; }
.trophy-earned-check { position: absolute; top: 7px; right: 7px; width: 16px; height: 16px; border-radius: 50%; background: linear-gradient(135deg, #22c55e, #16a34a); display: flex; align-items: center; justify-content: center; font-size: 8px; color: #fff; }
.trophy-secret-label { font-size: 10px; color: var(--stone-300); font-family: var(--mono); margin-top: 5px; letter-spacing: 2px; }
.trophy-progress { font-size: 10.5px; font-family: var(--mono); color: var(--accent-light); margin-top: 5px; }

/* ─── DASH ENHANCEMENTS ────────────────────────────────────── */
.dash-profile-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #7c3aed); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 8px; border: 2px solid rgba(255,255,255,.1); }
.dash-next-rank { margin-top: 10px; padding: 8px; background: rgba(251,191,36,.06); border: 1px solid rgba(251,191,36,.12); border-radius: var(--radius-sm); }
.dash-next-rank-label { font-size: 9px; font-family: var(--mono); color: rgba(255,255,255,.3); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 3px; }
.dash-next-rank-name { font-size: 11px; font-weight: 600; color: rgba(255,255,255,.7); }
.dash-next-rank-xp { font-size: 10px; font-family: var(--mono); color: #fbbf24; margin-top: 2px; }
.dash-anticipation { background: rgba(251,191,36,.06); border: 1px solid rgba(251,191,36,.12); border-radius: var(--radius); padding: 10px 14px; margin-bottom: 14px; display: flex; align-items: center; gap: 12px; }
.da-icon { font-size: 15px; flex-shrink: 0; }
.da-text { font-size: 12px; color: rgba(255,255,255,.5); flex: 1; line-height: 1.4; }
.da-text strong { color: #fbbf24; }
.da-action { font-size: 10.5px; font-family: var(--mono); color: rgba(255,255,255,.25); white-space: nowrap; }

/* ─── CTA GOALS ────────────────────────────────────────────── */
.cta-goals { display: flex; gap: 10px; justify-content: center; margin-bottom: 28px; flex-wrap: wrap; }
.cta-goal-chip { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 100px; padding: 5px 12px; font-size: 12px; color: rgba(255,255,255,.55); font-family: var(--mono); }

/* ─── NAV STREAK BADGE ─────────────────────────────────────── */
.nav-streak { display: flex; align-items: center; gap: 5px; background: rgba(251,191,36,.1); border: 1px solid rgba(251,191,36,.25); border-radius: 100px; padding: 4px 10px; font-size: 12px; font-weight: 600; color: #b45309; font-family: var(--mono); }

/* ─── RANK REWARDS ─────────────────────────────────────────── */
.rank-cell-reward { font-size: 10.5px; color: var(--stone-300); margin-top: 5px; font-family: var(--mono); }
.rank-cell.current .rank-cell-reward { color: rgba(255,255,255,.25); }
.rank-cell.legendary-rank .rank-cell-reward { color: var(--amber); }
.rank-cell.legendary-rank { background: linear-gradient(160deg, var(--white), rgba(251,191,36,.04)); border-top: 2px solid rgba(251,191,36,.3); }

/* ─── NEW ANIMATIONS ───────────────────────────────────────── */
@keyframes lock-shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-3px)} 40%,80%{transform:translateX(3px)} }
@keyframes xp-burst { 0%{opacity:1;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-42px) scale(.7)} }
@keyframes countdown-tick { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
.xp-float-text { position:fixed; font-family:var(--mono); font-size:13px; font-weight:700; color:#22c55e; pointer-events:none; z-index:9999; animation:xp-burst .85s ease forwards; text-shadow:0 0 8px rgba(34,197,94,.4); }
`;
    document.head.appendChild(style);

    // Scroll reveal
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.transitionDelay = (i * 0.05) + "s";
          e.target.classList.add("visible");
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => revObs.observe(el));

    // Countdown
    function updateCountdown() {
      const el = document.getElementById("daily-countdown");
      if (!el || !el.textContent) return;
      const parts = el.textContent.split(":").map(Number);
      let [h, m, s] = parts;
      if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) h = 0; } }
      el.textContent = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    }
    const countdownInterval = setInterval(updateCountdown, 1000);

    // XP counter
    function animateXP(el: HTMLElement, target: number, duration = 1400) {
      let n = 0;
      const step = target / (duration / 16);
      const t = setInterval(() => {
        n += step;
        if (n >= target) { clearInterval(t); el.textContent = target.toLocaleString(); return; }
        el.textContent = Math.floor(n).toLocaleString();
      }, 16);
    }
    const xpEl = document.getElementById("xp-counter");
    if (xpEl) {
      new IntersectionObserver((e) => {
        e.forEach(entry => { if (entry.isIntersecting) animateXP(xpEl as HTMLElement, 2840); });
      }, { threshold: 0.5 }).observe(xpEl);
    }

    // Confetti
    (window as any).triggerConfetti = (originY?: number) => {
      const colors = ["#22c55e","#60a5fa","#fbbf24","#f87171","#a78bfa","#34d399"];
      for (let i = 0; i < 30; i++) {
        const p = document.createElement("div");
        const sz = 5 + Math.random() * 6;
        p.style.cssText = `position:fixed;width:${sz}px;height:${sz}px;border-radius:${Math.random()>.5?"50%":"2px"};background:${colors[i%colors.length]};left:${8+Math.random()*84}%;top:${originY||60}px;pointer-events:none;z-index:9999;animation:confetti-fall ${0.5+Math.random()*0.9}s ${Math.random()*0.4}s ease forwards`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1600);
      }
    };

    (window as any).showXPBurst = (amount: number | string, x: number, y: number) => {
      const el = document.createElement("div");
      el.className = "xp-float-text";
      el.textContent = typeof amount === "number" ? "+" + amount + " XP" : String(amount);
      el.style.left = x + "px";
      el.style.top = y + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 950);
    };

    (window as any).showHeroResult = (type: string, event: MouseEvent) => {
      const fb = document.getElementById("result-feedback");
      if (!fb) return;
      const configs: Record<string, any> = {
        safe: { bg:"rgba(34,197,94,.06)", border:"rgba(34,197,94,.2)", icon:"🏆", titleColor:"#15803d", title:"Mission success! +80 XP earned", msg:"You correctly identified the domain spoofing. <strong>roblox-security-team.net</strong> is not owned by Roblox.", xp:80 },
        danger: { bg:"rgba(248,113,113,.05)", border:"rgba(248,113,113,.2)", icon:"💀", titleColor:"#dc2626", title:"Mission failed — you got phished.", msg:"The link led to a credential-harvesting page. Key red flags: <strong>.ru TLD</strong>, hyphenated domain, HTTP not HTTPS.", xp:0 },
        ask: { bg:"rgba(251,191,36,.05)", border:"rgba(251,191,36,.2)", icon:"🤝", titleColor:"#b45309", title:"Smart instinct — +30 XP", msg:"Asking a trusted adult is always safe.", xp:30 }
      };
      const c = configs[type];
      if (!c) return;
      fb.style.cssText = `display:block;margin-top:14px;border-radius:10px;padding:14px 16px;background:${c.bg};border:1px solid ${c.border}`;
      fb.innerHTML = `<div style="display:flex;align-items:flex-start;gap:10px"><span style="font-size:18px">${c.icon}</span><div><div style="font-size:13px;font-weight:600;color:${c.titleColor};margin-bottom:5px">${c.title}</div><div style="font-size:13px;color:#57534e;line-height:1.55">${c.msg}</div></div></div>`;
      document.querySelectorAll<HTMLElement>(".choice-card").forEach(el => { el.style.opacity=".4"; el.style.pointerEvents="none"; });
      (event.currentTarget as HTMLElement).style.opacity = "1";
      if (c.xp > 0) {
        const r = (event.currentTarget as HTMLElement).getBoundingClientRect();
        (window as any).showXPBurst(c.xp, r.right - 60, r.top - 8);
        (window as any).triggerConfetti(r.top - 30);
      }
    };

    (window as any).worldClick = (card: HTMLElement) => {
      const icon = card.querySelector<HTMLElement>(".world-icon");
      if (icon) { icon.style.transition = "transform .38s cubic-bezier(.34,1.56,.64,1)"; icon.style.transform = "scale(1.35)"; }
      (window as any).triggerConfetti(card.getBoundingClientRect().top);
      setTimeout(() => { if (icon) icon.style.transform = ""; }, 460);
    };

    (window as any).lockedWorldClick = (card: HTMLElement) => {
      card.style.animation = "lock-shake .4s ease";
      setTimeout(() => { card.style.animation = ""; }, 450);
    };

    (window as any).trophyClick = (card: HTMLElement) => {
      if (card.classList.contains("earned")) {
        const icon = card.querySelector<HTMLElement>(".trophy-icon");
        if (icon) { icon.style.transition = "transform .3s cubic-bezier(.34,1.56,.64,1)"; icon.style.transform = "scale(1.45)"; }
        const r = card.getBoundingClientRect();
        (window as any).showXPBurst("🏆", r.left + r.width/2 - 12, r.top - 5);
        setTimeout(() => { if (icon) icon.style.transform = ""; }, 360);
      } else {
        card.style.transform = "scale(.97)";
        setTimeout(() => { card.style.transform = ""; }, 180);
      }
    };

    (window as any).secretTrophyClick = (card: HTMLElement) => {
      const icon = card.querySelector<HTMLElement>(".trophy-icon");
      if (icon) { icon.style.transition = "transform .2s ease"; icon.style.transform = "scale(1.25) rotate(-10deg)"; setTimeout(() => { icon.style.transform = ""; }, 250); }
    };

    return () => {
      clearInterval(countdownInterval);
      revObs.disconnect();
      document.getElementById("landing-styles")?.remove();
    };
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `

<!-- NAV -->
<nav>
  <a class="nav-logo" href="#">
    <div class="nav-logo-mark"><span>CT</span></div>
    Cyber Tales AI
  </a>
  <ul class="nav-links">
    <li><a href="#features">Features</a></li>
    <li><a href="#worlds">Worlds</a></li>
    <li><a href="#dashboard">Command Center</a></li>
    <li><a href="#challenges">Challenges</a></li>
    <li><a href="#ranks">Ranks</a></li>
  </ul>
  <div class="nav-actions">
    <div class="nav-streak">🔥 7</div>
    <button class="btn btn-ghost" onclick="window.location.href='/sign-in'">Sign in</button>
    <button class="btn-white" onclick="window.location.href='/sign-up'">Begin your quest →</button>
  </div>
</nav>

<!-- DAILY MISSION BANNER -->
<div class="daily-banner" style="margin-top:60px">
  <div class="daily-banner-inner">
    <div class="daily-streak">
      <div class="daily-streak-fire">🔥</div>
      <div>
        <div class="daily-streak-num">7</div>
        <div class="daily-streak-label">Day streak</div>
      </div>
    </div>
    <div class="daily-divider"></div>
    <div class="daily-mission-block">
      <div class="daily-mission-tag">⚡ Today's Daily Mission</div>
      <div class="daily-mission-title">Spot 3 phishing clues hidden in a fake bank email</div>
      <div class="daily-mission-desc">🌲 Phishing Forest · Easy · Bonus XP today only</div>
    </div>
    <div class="daily-reward">+150 XP bonus</div>
    <div class="daily-timer">
      <div style="font-size:9px;color:var(--stone-400);margin-bottom:2px;font-family:var(--mono);text-transform:uppercase;letter-spacing:.5px">Resets in</div>
      <div class="daily-timer-val" id="daily-countdown">08:42:17</div>
      <div class="daily-progress-wrap"><div class="daily-progress-fill"></div></div>
    </div>
  </div>
</div>

<!-- HERO -->
<div class="hero">
  <div class="hero-content">
    <div class="hero-badge">
      <div class="hero-badge-dot">✦</div>
      AI-powered adventure platform
    </div>
    <h1>Become a Cyber Guardian.<br>One <em>mission</em> at a time.</h1>
    <p class="hero-desc">Cyber Tales AI sends you on personalized cybersecurity quests where every decision matters. No lectures. No static quizzes. Just high-stakes adventures that build real skills.</p>
    <div class="hero-actions">
      <button class="btn btn-primary btn-large" onclick="document.getElementById('demo-choice').scrollIntoView({behavior:'smooth'})">Begin your quest →</button>
      <button class="btn btn-ghost btn-large">Watch demo</button>
    </div>
    <div class="hero-social-proof">
      <div class="hero-avatars">
        <div class="hero-avatar" style="background:#2563eb">A</div>
        <div class="hero-avatar" style="background:#16a34a">J</div>
        <div class="hero-avatar" style="background:#d97706">M</div>
        <div class="hero-avatar" style="background:#7c3aed">S</div>
      </div>
      <div class="hero-social-text"><strong>2,400+ young heroes</strong> completed missions this week</div>
    </div>
  </div>

  <div class="hero-visual" id="demo-choice" style="position:relative">
    <div class="hero-cyber-elements">
      <div class="cyber-particle"></div>
      <div class="cyber-particle"></div>
      <div class="cyber-particle"></div>
      <div class="cyber-particle"></div>
      <div class="cyber-particle"></div>
    </div>
    <div class="hero-card" style="position:relative">
      <div class="hero-card-header">
        <div class="window-dots">
          <div class="window-dot" style="background:#ff5f57"></div>
          <div class="window-dot" style="background:#ffbd2e"></div>
          <div class="window-dot" style="background:#28c840"></div>
        </div>
        <div class="hero-card-title">phishing_scenario.tsx</div>
      </div>
      <div class="hero-card-body">
        <div class="scenario-label">
          <div class="scenario-dot"></div>
          Live scenario — Phishing · Age 12 · Advanced
        </div>
        <div class="phish-email">
          <div class="email-meta">
            <div class="email-from">
              ⚠ FROM: support@roblox-security-team.net
              <span class="threat-badge">⚡ THREAT</span>
            </div>
            <div class="email-subject">Your account will be deleted in 24 hours</div>
          </div>
          <div class="email-body">
            We've detected suspicious activity. <strong>Verify your password now</strong> or your account is permanently deleted.<br>
            <span class="email-link">http://roblox-verify-now.ru/secure/login</span>
          </div>
        </div>
        <div class="choice-label">What do you do?</div>
        <div class="choices">
          <div class="choice-card correct" onclick="showHeroResult('safe')">
            <div class="choice-icon icon-safe">✓</div>
            Check the sender's domain, then go directly to Roblox.com instead of clicking
          </div>
          <div class="choice-card danger-choice" onclick="showHeroResult('danger')">
            <div class="choice-icon icon-danger">!</div>
            Click the link — it looks official and you're worried about your account
          </div>
          <div class="choice-card" onclick="showHeroResult('ask')">
            <div class="choice-icon icon-neutral">?</div>
            Ask a parent before doing anything
          </div>
        </div>
        <div id="result-feedback"></div>
        <div class="cipher-hint">
          <div class="cipher-avatar">AI</div>
          <div class="cipher-text"><strong>Cipher says:</strong> Legitimate companies never use hyphens in their support domains or country-code TLDs like .ru. This is a textbook phishing attempt — you got this.</div>
        </div>
      </div>
    </div>
    <div class="mission-preview-float">
      <div class="mission-preview-dot"></div>
      <span style="font-size:11px;color:var(--stone-500)"><strong style="color:var(--ink)">Mission active:</strong> Phishing Forest · Stage 2</span>
    </div>
  </div>
</div>

<!-- FEATURES -->
<section class="section" id="features" style="background:var(--stone-50);border-top:1px solid var(--stone-100)">
  <div class="section-inner">
    <div class="section-header reveal">
      <div class="section-kicker">Your arsenal</div>
      <div class="section-h">Four powers. Zero filler.</div>
      <div class="section-sub">Every feature was chosen for technical depth and real-world impact. Quality over quantity — always.</div>
    </div>
    <div class="features-grid reveal">
      <div class="feature-cell">
        <span class="feature-number">01</span>
        <div class="feature-icon-wrap">⚡</div>
        <h3>AI Cyber Quests</h3>
        <p>OpenAI-powered branching narratives where choices have real consequences. Each quest is generated fresh — personalized by age, world, and difficulty tier.</p>
        <div class="feature-tags">
          <span class="feature-tag">OpenAI Streaming</span>
          <span class="feature-tag">State Machine</span>
          <span class="feature-tag">SSE</span>
        </div>
      </div>
      <div class="feature-cell">
        <span class="feature-number">02</span>
        <div class="feature-icon-wrap">🎯</div>
        <h3>Challenge Simulator</h3>
        <p>Hands-on cybersecurity training lab — spot phishing emails, analyze URLs, evaluate password strength. Detailed post-challenge breakdowns explain every mistake.</p>
        <div class="feature-tags">
          <span class="feature-tag">Interactive UI</span>
          <span class="feature-tag">Real-time Validation</span>
          <span class="feature-tag">Feedback Engine</span>
        </div>
      </div>
      <div class="feature-cell">
        <span class="feature-number">03</span>
        <div class="feature-icon-wrap">🤖</div>
        <h3>Cipher — Your AI Companion</h3>
        <p>Context-aware AI that tracks your full journey, explains concepts at your level, surfaces knowledge gaps, and always knows the next mission you should tackle.</p>
        <div class="feature-tags">
          <span class="feature-tag">Prompt Engineering</span>
          <span class="feature-tag">Context Window</span>
          <span class="feature-tag">RAG</span>
        </div>
      </div>
      <div class="feature-cell">
        <span class="feature-number">04</span>
        <div class="feature-icon-wrap">📊</div>
        <h3>Command Center</h3>
        <p>XP tracking, trophy collection, Cyber Safety Score, and six rank tiers — all visualized beautifully. Your journey persists across sessions via PostgreSQL.</p>
        <div class="feature-tags">
          <span class="feature-tag">Recharts</span>
          <span class="feature-tag">PostgreSQL</span>
          <span class="feature-tag">Prisma ORM</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ADVENTURE WORLDS -->
<section class="worlds-section" id="worlds">
  <div style="max-width:1200px;margin:0 auto">
    <div class="section-header reveal">
      <div class="section-kicker">Adventure map</div>
      <div class="section-h">Six worlds to conquer.</div>
      <div class="section-sub">Each world is a destination in your cyber journey — packed with missions, challenges, and secrets to unlock. Where will you go next?</div>
    </div>
    <div class="worlds-grid reveal">
      <div class="world-card unlocked" data-world="kingdom" onclick="worldClick(this)">
        <div class="world-top">
          <span class="world-icon">🏰</span>
          <span class="world-badge completed">Cleared ✓</span>
        </div>
        <div class="world-name">Password Kingdom</div>
        <div class="world-desc">Master the art of impenetrable passwords. Defend your digital castle from endless invaders.</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:0">
          <span class="world-missions">8 missions · 3 trophies</span>
        </div>
        <div class="world-progress-bar"><div class="world-progress-fill" style="width:100%;background:linear-gradient(90deg,#22c55e,#86efac)"></div></div>
        <div class="world-reward-tag">🏆 Trophy earned: Password Protector</div>
      </div>
      <div class="world-card unlocked" data-world="forest" onclick="worldClick(this)">
        <div class="world-top">
          <span class="world-icon">🌲</span>
          <span class="world-badge active">In progress</span>
        </div>
        <div class="world-name">Phishing Forest</div>
        <div class="world-desc">Navigate a dark forest of deceptive emails and fake links. One wrong click ends your run.</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="world-missions">10 missions · 4 trophies</span>
        </div>
        <div class="world-progress-bar"><div class="world-progress-fill" style="width:60%;background:linear-gradient(90deg,#22c55e,#86efac)"></div></div>
        <div class="world-unlock-hint">⚡ 4 missions to clear this world</div>
      </div>
      <div class="world-card unlocked" data-world="planet" onclick="worldClick(this)">
        <div class="world-top">
          <span class="world-icon">🪐</span>
          <span class="world-badge active">Unlocked</span>
        </div>
        <div class="world-name">Privacy Planet</div>
        <div class="world-desc">Explore a distant world where personal data is currency — and privacy is your greatest power.</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="world-missions">9 missions · 3 trophies</span>
        </div>
        <div class="world-progress-bar"><div class="world-progress-fill" style="width:0%;background:linear-gradient(90deg,#60a5fa,#93c5fd)"></div></div>
        <div class="world-reward-tag">🔓 Clear Phishing Forest to begin</div>
      </div>
      <div class="world-card" data-world="city" style="opacity:.65;cursor:pointer" onclick="lockedWorldClick(this)">
        <div class="world-top">
          <span class="world-icon" style="filter:grayscale(.6)">🏙</span>
          <span class="world-badge locked-badge">🔒 Locked</span>
        </div>
        <div class="world-name" style="color:var(--stone-400)">Scam City</div>
        <div class="world-desc">A neon-lit city full of social engineering schemes, fake deals, and digital hustlers. Trust no one.</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="world-missions" style="color:var(--stone-300)">12 missions · 5 trophies</span>
        </div>
        <div class="world-progress-bar"><div class="world-progress-fill" style="width:0%"></div></div>
        <div class="world-unlock-hint" style="color:var(--stone-300)">🔓 Unlock after clearing Privacy Planet</div>
      </div>
      <div class="world-card" data-world="valley" style="opacity:.55;cursor:pointer" onclick="lockedWorldClick(this)">
        <div class="world-top">
          <span class="world-icon" style="filter:grayscale(.7)">🧠</span>
          <span class="world-badge locked-badge">🔒 Locked</span>
        </div>
        <div class="world-name" style="color:var(--stone-400)">Social Engineering Valley</div>
        <div class="world-desc">Deep in the valley, manipulators prey on trust and emotion. Learn to spot the psychological tricks.</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="world-missions" style="color:var(--stone-300)">11 missions · 4 trophies</span>
        </div>
        <div class="world-progress-bar"><div class="world-progress-fill" style="width:0%"></div></div>
      </div>
      <div class="world-card" data-world="citadel" style="opacity:.4;cursor:pointer;border-color:rgba(251,191,36,.2)" onclick="lockedWorldClick(this)">
        <div class="world-top">
          <span class="world-icon" style="filter:grayscale(.5)">🏛</span>
          <span class="world-badge locked-badge" style="border-color:rgba(251,191,36,.2);color:#b45309">👑 Final World</span>
        </div>
        <div class="world-name" style="color:var(--stone-400)">Cyber Guardian Citadel</div>
        <div class="world-desc">The final fortress. Only those who have mastered all worlds may enter. Legends are made here.</div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="world-missions" style="color:var(--stone-300)">15 missions · 6 trophies</span>
        </div>
        <div class="world-progress-bar"><div class="world-progress-fill" style="width:0%"></div></div>
      </div>
    </div>
    <!-- Next unlock anticipation bar -->
    <div class="next-unlock-bar reveal" style="margin-top:20px">
      <div class="nub-icon">🏙</div>
      <div class="nub-content">
        <div class="nub-title">Scam City unlocks after 4 more missions</div>
        <div class="nub-sub">12 new quests, 5 exclusive trophies, and the Scam Detective badge are waiting. Complete your remaining Phishing Forest missions to reveal them.</div>
      </div>
      <div class="nub-xp">+480 XP waiting</div>
    </div>
  </div>
</section>

<!-- QUESTS -->
<section class="quests-section">
  <div style="max-width:1200px;margin:0 auto">
    <div class="section-header reveal">
      <div style="display:flex;align-items:flex-end;justify-content:space-between">
        <div>
          <div class="section-kicker">Active quests</div>
          <div class="section-h" style="margin-bottom:8px">Your next missions await.</div>
          <div class="section-sub">Each quest is a self-contained challenge with clear rewards. Complete them to earn XP, unlock trophies, and advance to the next world.</div>
        </div>
        <div style="text-align:right;flex-shrink:0;padding-bottom:4px">
          <div style="font-size:11px;font-family:var(--mono);color:var(--stone-400);margin-bottom:4px">CLEARED</div>
          <div style="font-family:var(--serif);font-size:28px;color:var(--ink);line-height:1">6 <span style="color:var(--stone-300);font-size:22px">/ 24</span></div>
        </div>
      </div>
    </div>
    <div class="quests-grid reveal">
      <div class="quest-card quest-completed">
        <div class="quest-cleared-overlay">✓</div>
        <div class="quest-header">
          <span class="quest-world-tag">🏰 Password Kingdom</span>
          <div class="quest-difficulty"><div class="diff-pip active easy"></div><div class="diff-pip active easy"></div><div class="diff-pip"></div></div>
        </div>
        <div class="quest-body">
          <div class="quest-title">The Weak Link</div>
          <div class="quest-desc">Analyze leaked password databases. Identify the patterns hackers exploit most.</div>
        </div>
        <div class="quest-reward-teaser">🏆 Unlocked: <span>Password Protector trophy</span></div>
        <div class="quest-footer">
          <div class="quest-xp">⚡ 60 XP earned</div>
          <span class="quest-status cleared">Mission Cleared</span>
        </div>
      </div>
      <div class="quest-card quest-hot">
        <div class="quest-hot-tag">🔥 Recommended — completes Phishing Forest progress</div>
        <div class="quest-header has-hot">
          <span class="quest-world-tag">🌲 Phishing Forest</span>
          <div class="quest-difficulty"><div class="diff-pip active medium"></div><div class="diff-pip active medium"></div><div class="diff-pip active medium"></div></div>
        </div>
        <div class="quest-body">
          <div class="quest-title">The Roblox Trap</div>
          <div class="quest-desc">A suspicious email claims your gaming account is at risk. Analyze the sender, URL, and urgency tactics.</div>
        </div>
        <div class="quest-reward-teaser">🔓 Unlocks: <span>next Phishing Forest stage</span></div>
        <div class="quest-footer">
          <div class="quest-xp">⚡ 80 XP reward</div>
          <span class="quest-status available">Start →</span>
        </div>
      </div>
      <div class="quest-card">
        <div class="quest-header">
          <span class="quest-world-tag">🌲 Phishing Forest</span>
          <div class="quest-difficulty"><div class="diff-pip active hard"></div><div class="diff-pip active hard"></div><div class="diff-pip active hard"></div></div>
        </div>
        <div class="quest-body">
          <div class="quest-title">Bank of Lies</div>
          <div class="quest-desc">A bank alert text message. Three red flags are hidden in plain sight. Find them all within 60 seconds.</div>
        </div>
        <div class="quest-reward-teaser">🏆 Earns: <span>Precision Strike trophy if you score 100%</span></div>
        <div class="quest-footer">
          <div class="quest-xp">⚡ 120 XP reward</div>
          <span class="quest-status available">Available</span>
        </div>
      </div>
      <div class="quest-card quest-completed">
        <div class="quest-cleared-overlay">✓</div>
        <div class="quest-header">
          <span class="quest-world-tag">🏰 Password Kingdom</span>
          <div class="quest-difficulty"><div class="diff-pip active easy"></div><div class="diff-pip"></div><div class="diff-pip"></div></div>
        </div>
        <div class="quest-body">
          <div class="quest-title">Fortress Builder</div>
          <div class="quest-desc">Construct the ultimate password. Learn entropy, special characters, and why "password123" is the enemy.</div>
        </div>
        <div class="quest-reward-teaser">✓ <span>Perfect score — full 40 XP earned</span></div>
        <div class="quest-footer">
          <div class="quest-xp">⚡ 40 XP earned</div>
          <span class="quest-status cleared">Mission Cleared</span>
        </div>
      </div>
      <div class="quest-card">
        <div class="quest-header">
          <span class="quest-world-tag">🪐 Privacy Planet</span>
          <div class="quest-difficulty"><div class="diff-pip active medium"></div><div class="diff-pip active medium"></div><div class="diff-pip"></div></div>
        </div>
        <div class="quest-body">
          <div class="quest-title">Data Trail Detective</div>
          <div class="quest-desc">Follow the data trail left by a typical app. Discover what's collected, sold, and how to limit exposure.</div>
        </div>
        <div class="quest-reward-teaser">🔓 Unlocks: <span>Privacy Guardian trophy</span></div>
        <div class="quest-footer">
          <div class="quest-xp">⚡ 70 XP reward</div>
          <span class="quest-status available">Available</span>
        </div>
      </div>
      <div class="quest-card quest-locked">
        <div class="quest-header">
          <span class="quest-world-tag">🏙 Scam City</span>
          <div class="quest-difficulty"><div class="diff-pip active hard"></div><div class="diff-pip active hard"></div><div class="diff-pip active hard"></div></div>
        </div>
        <div class="quest-body">
          <div class="quest-title">??? Hidden Mission</div>
          <div class="quest-desc" style="font-style:italic;color:var(--stone-300)">Unlock Scam City to reveal this mission and its secret reward. Complete 4 more missions.</div>
        </div>
        <div class="quest-reward-teaser" style="color:var(--stone-300)">🔒 Reward hidden until unlocked</div>
        <div class="quest-footer">
          <div class="quest-xp" style="color:var(--stone-300)">⚡ ??? XP</div>
          <span class="quest-status locked">🔒 Locked</span>
        </div>
      </div>
    </div>
    <div class="cipher-hint reveal" style="max-width:500px;margin-top:24px">
      <div class="cipher-avatar" style="width:32px;height:32px;font-size:12px">AI</div>
      <div class="cipher-text"><strong>Cipher says:</strong> Nice work spotting the phishing attempt in <em>The Roblox Trap</em>. Ready for a harder mission? Try <em>Bank of Lies</em> — it's worth 120 XP. 🔐</div>
    </div>
  </div>
</section>

<!-- TROPHY CASE -->
<section class="trophies-section" id="trophies">
  <div style="max-width:1200px;margin:0 auto">
    <div class="section-header reveal">
      <div style="display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:20px">
        <div>
          <div class="section-kicker">Trophy case</div>
          <div class="section-h" style="margin-bottom:8px">Collect them all.</div>
          <div class="section-sub">Hard-earned. Collectible. Worth showing off. Each trophy tells the story of a mission conquered.</div>
        </div>
        <div style="text-align:right;flex-shrink:0;padding-bottom:4px">
          <div style="font-size:11px;font-family:var(--mono);color:var(--stone-400);margin-bottom:4px">YOUR COLLECTION</div>
          <div style="font-family:var(--serif);font-size:28px;color:var(--ink);line-height:1">3 <span style="color:var(--stone-300);font-size:22px">/ 18</span></div>
          <div style="font-size:11px;color:var(--stone-400);margin-top:2px">trophies earned</div>
        </div>
      </div>
    </div>
    <div class="trophies-grid reveal">
      <div class="trophy-card earned" onclick="trophyClick(this)">
        <div class="trophy-earned-check">✓</div>
        <span class="trophy-icon">🛡</span>
        <div class="trophy-name">Password Protector</div>
        <div class="trophy-flavor">Created 10 unbreakable passwords</div>
      </div>
      <div class="trophy-card earned" onclick="trophyClick(this)">
        <div class="trophy-earned-check">✓</div>
        <span class="trophy-icon">🕵</span>
        <div class="trophy-name">Scam Detective</div>
        <div class="trophy-flavor">Identified 5 phishing attempts</div>
      </div>
      <div class="trophy-card earned" onclick="trophyClick(this)">
        <div class="trophy-earned-check">✓</div>
        <span class="trophy-icon">⚡</span>
        <div class="trophy-name">First Quest</div>
        <div class="trophy-flavor">Completed your very first mission</div>
      </div>
      <div class="trophy-card" onclick="trophyClick(this)">
        <span class="trophy-icon" style="filter:grayscale(1);opacity:.5">🔐</span>
        <div class="trophy-name" style="color:var(--stone-400)">Privacy Guardian</div>
        <div class="trophy-flavor">Master Privacy Planet world</div>
        <div class="trophy-progress">2 / 9 missions done</div>
      </div>
      <div class="trophy-card" onclick="trophyClick(this)">
        <span class="trophy-icon" style="filter:grayscale(1);opacity:.5">⚔</span>
        <div class="trophy-name" style="color:var(--stone-400)">Threat Hunter</div>
        <div class="trophy-flavor">Reach Threat Hunter rank</div>
        <div class="trophy-progress">1,660 XP needed</div>
      </div>
      <div class="trophy-card" onclick="trophyClick(this)">
        <span class="trophy-icon" style="filter:grayscale(1);opacity:.5">🧠</span>
        <div class="trophy-name" style="color:var(--stone-400)">Mind Reader</div>
        <div class="trophy-flavor">Complete Social Engineering Valley</div>
        <div class="trophy-progress" style="color:var(--stone-300)">World locked</div>
      </div>
      <div class="trophy-card" onclick="trophyClick(this)">
        <span class="trophy-icon" style="filter:grayscale(1);opacity:.5">🏹</span>
        <div class="trophy-name" style="color:var(--stone-400)">Precision Strike</div>
        <div class="trophy-flavor">Score 100% on 3 Hard missions</div>
        <div class="trophy-progress">1 / 3 perfect scores</div>
      </div>
      <div class="trophy-card" onclick="trophyClick(this)">
        <span class="trophy-icon" style="filter:grayscale(1);opacity:.5">🔥</span>
        <div class="trophy-name" style="color:var(--stone-400)">7-Day Streak</div>
        <div class="trophy-flavor">Train 7 days in a row</div>
        <div class="trophy-progress">7 / 7 🔥 Keep today's streak!</div>
      </div>
      <div class="trophy-card locked-secret" onclick="secretTrophyClick(this)">
        <span class="trophy-icon">🔒</span>
        <div class="trophy-name">Secret Badge</div>
        <div class="trophy-flavor" style="font-style:italic">Unlock requirement unknown</div>
        <div class="trophy-secret-label">???</div>
      </div>
      <div class="trophy-card locked-secret" onclick="secretTrophyClick(this)">
        <span class="trophy-icon">🔒</span>
        <div class="trophy-name">Secret Badge</div>
        <div class="trophy-flavor" style="font-style:italic">Complete more missions to reveal</div>
        <div class="trophy-secret-label">???</div>
      </div>
      <div class="trophy-card legendary" onclick="trophyClick(this)" style="opacity:.55;grid-column:span 5;display:flex;align-items:center;gap:20px;text-align:left;padding:16px 22px">
        <span class="trophy-icon" style="filter:grayscale(.4);font-size:32px;margin:0;animation:none">👑</span>
        <div>
          <div class="trophy-name" style="font-size:14px">Cyber Master</div>
          <div class="trophy-flavor" style="font-size:12px">Conquer all six worlds. The ultimate trophy. Only one player has earned this.</div>
          <div style="font-size:11px;font-family:var(--mono);color:var(--amber);margin-top:4px">Legendary · Requires 25,000 XP + all worlds cleared</div>
        </div>
      </div>
    </div>
    <div class="cipher-hint reveal" style="max-width:500px;margin-top:20px">
      <div class="cipher-avatar" style="width:28px;height:28px;font-size:11px">AI</div>
      <div class="cipher-text"><strong>Cipher says:</strong> Two secret trophies remain undiscovered. Keep completing missions in unexpected ways — they reveal themselves. 🔒 Also: your 7-day streak trophy is one day away. Don't break it.</div>
    </div>
  </div>
</section>

<!-- DASHBOARD -->
<section class="dashboard-bg" id="dashboard">
  <div class="dashboard-inner">
    <div class="dash-kicker">Feature 04 — Command Center</div>
    <div class="dash-h">Your journey,<br><em>beautifully visualized.</em></div>
    <div class="dashboard-shell reveal">
      <div class="dash-topbar">
        <div class="dash-topbar-dots">
          <div class="dash-topbar-dot" style="background:#ff5f57"></div>
          <div class="dash-topbar-dot" style="background:#ffbd2e"></div>
          <div class="dash-topbar-dot" style="background:#28c840"></div>
        </div>
        <div class="dash-nav-items">
          <div class="dash-nav-item active">Overview</div>
          <div class="dash-nav-item">Quests</div>
          <div class="dash-nav-item">Challenges</div>
          <div class="dash-nav-item">Cipher</div>
          <div class="dash-nav-item">Trophies</div>
        </div>
        <div class="dash-topbar-right">
          <div style="font-size:11px;color:rgba(255,255,255,.4);font-family:var(--mono)">🔥 7-day streak</div>
          <div class="dash-user-name">Alex Kim</div>
          <div class="dash-avatar">AK</div>
        </div>
      </div>
      <div class="dash-layout">
        <div class="dash-sidebar">
          <div class="dash-sidebar-user">
            <div class="dash-profile-avatar">AK</div>
            <div class="dash-sidebar-name">Alex Kim</div>
            <div class="dash-sidebar-rank">ID: usr_ak8823</div>
            <div class="dash-rank-pill"><div class="dash-rank-dot"></div>🔭 Security Scout</div>
            <div class="dash-next-rank">
              <div class="dash-next-rank-label">Next rank</div>
              <div class="dash-next-rank-name">🎯 Threat Hunter</div>
              <div class="dash-next-rank-xp">⚡ 1,660 XP away</div>
            </div>
          </div>
          <div class="dash-menu">
            <div class="dash-menu-item active">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="6" height="6" rx="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>
              Overview
            </div>
            <div class="dash-menu-item">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2L2 6v8h4v-4h4v4h4V6L8 2z"/></svg>
              Adventures
            </div>
            <div class="dash-menu-item">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>
              Challenges
            </div>
            <div class="dash-menu-item">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.31 2.686-6 6-6s6 2.686 6 6"/></svg>
              Mentor
            </div>
            <div class="dash-menu-item">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 4h12M2 8h8M2 12h10"/></svg>
              Achievements
            </div>
          </div>
        </div>
        <div class="dash-main">
          <div class="dash-greeting">
            <div>
              <h2>Welcome back, Alex. 🛡</h2>
              <p style="color:rgba(255,255,255,.35);font-size:12px;margin-top:4px">You're <strong style="color:#fbbf24">1,660 XP</strong> from Threat Hunter rank. <span style="color:#4ade80;font-weight:600">Keep going.</span></p>
            </div>
            <div class="dash-date">Sun, Jun 7<br>2026</div>
          </div>
          <!-- Anticipation bar -->
          <div class="dash-anticipation">
            <div class="da-icon">🏙</div>
            <div class="da-text"><strong>4 missions until Scam City unlocks</strong> — 12 new quests, 5 trophies, and the Scam Detective badge are waiting.</div>
            <div class="da-action">→ Next quest</div>
          </div>
          <div class="dash-stats">
            <div class="stat-card">
              <div class="stat-label">TOTAL XP EARNED</div>
              <div class="stat-value green" id="xp-counter">2,840</div>
              <div class="stat-sub"><span class="up">↑ 180</span> this week</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">CYBER SAFETY SCORE</div>
              <div class="stat-value blue">78%</div>
              <div class="stat-sub"><span class="up">↑ 12%</span> this month</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">MISSIONS CLEARED</div>
              <div class="stat-value amber">24</div>
              <div class="stat-sub">3 active streaks 🔥</div>
            </div>
          </div>
          <div class="xp-block">
            <div class="xp-top">
              <div class="xp-rank-name">🔭 Security Scout → 🎯 Threat Hunter</div>
              <div class="xp-next" style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.35)">2,840 / 4,500 XP</div>
            </div>
            <div class="xp-bar-bg"><div class="xp-bar-fill"></div></div>
            <div class="xp-markers">
              <span class="xp-marker">0</span>
              <span class="xp-marker">1,500</span>
              <span class="xp-marker">3,000</span>
              <span class="xp-marker">4,500</span>
            </div>
            <div style="margin-top:12px;padding:10px 12px;background:rgba(37,99,235,.08);border:1px solid rgba(96,165,250,.15);border-radius:8px;display:flex;align-items:center;gap:8px">
              <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;flex-shrink:0">AI</div>
              <div style="font-size:11.5px;color:rgba(255,255,255,.45);line-height:1.4"><span style="color:rgba(255,255,255,.7);font-weight:600">Cipher:</span> Only 1,660 XP until Threat Hunter. Complete the Scam City missions to get there fast. 🏆</div>
            </div>
          </div>
          <div class="dash-bottom">
            <div class="activity-card">
              <h4>Recent missions <span>last 7 days</span></h4>
              <div class="activity-row">
                <div class="activity-dot" style="background:#4ade80"></div>
                <div class="activity-text">Phishing Forest — Hard Mode <span class="mission-cleared-tag">Mission Cleared ✓</span></div>
                <div class="activity-xp">+80 XP</div>
                <div class="activity-time">2h ago</div>
              </div>
              <div class="activity-row">
                <div class="activity-dot" style="background:#60a5fa"></div>
                <div class="activity-text">URL Analysis Challenge — Score 94%</div>
                <div class="activity-xp">+40 XP</div>
                <div class="activity-time">Yesterday</div>
              </div>
              <div class="activity-row">
                <div class="activity-dot" style="background:#fbbf24"></div>
                <div class="activity-text">Cipher session: Social Engineering Valley</div>
                <div class="activity-xp">+20 XP</div>
                <div class="activity-time">2d ago</div>
              </div>
              <div class="activity-row">
                <div class="activity-dot" style="background:#4ade80"></div>
                <div class="activity-text">Password Kingdom — Perfect Score <span class="mission-cleared-tag">Mission Cleared ✓</span></div>
                <div class="activity-xp">+40 XP</div>
                <div class="activity-time">3d ago</div>
              </div>
            </div>
            <div class="activity-card">
              <h4>Trophy case <span>3 of 18 earned</span></h4>
              <div class="badge-grid">
                <div class="badge-pill earned">🛡 Password Protector</div>
                <div class="badge-pill earned">🕵 Scam Detective</div>
                <div class="badge-pill earned">⚡ First Quest</div>
                <div class="badge-pill" style="opacity:.4;font-size:11px;color:rgba(255,255,255,.3);font-style:italic">🔒 Secret Badge ???</div>
                <div class="badge-pill locked">🔐 Privacy Guardian</div>
                <div class="badge-pill locked">🏹 Threat Hunter</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CHALLENGE SIMULATOR -->
<section class="challenge-section" id="challenges">
  <div class="challenge-inner">
    <div>
      <div class="section-kicker reveal">Feature 02 — Challenge Simulator</div>
      <div class="section-h reveal">A pocket-sized<br>cybersecurity lab.</div>
      <div class="section-sub reveal" style="margin-bottom:32px">Hands-on challenges that test real instincts. Analyze suspicious URLs, spot fake sites, crack password patterns. Every wrong answer is turned into a learning moment.</div>
      <div class="feature-tags reveal" style="gap:8px;display:flex;flex-wrap:wrap">
        <span class="feature-tag" style="font-size:12px;padding:5px 12px">🔗 URL Analysis</span>
        <span class="feature-tag" style="font-size:12px;padding:5px 12px">📧 Email Detection</span>
        <span class="feature-tag" style="font-size:12px;padding:5px 12px">🔑 Password Strength</span>
        <span class="feature-tag" style="font-size:12px;padding:5px 12px">🌐 Fake Site Spotter</span>
        <span class="feature-tag" style="font-size:12px;padding:5px 12px">💬 Scam Detection</span>
      </div>
    </div>
    <div class="phishing-checker reveal">
      <div class="checker-header">
        <div class="checker-header-title">URL Threat Analyzer</div>
        <div class="checker-header-sub">Challenge #12 — Intermediate</div>
      </div>
      <div class="checker-body">
        <div class="url-input-wrap">
          <span class="url-icon">🔗</span>
          <input class="url-bar" type="text" value="http://paypa1-secure-login.com/verify" readonly>
        </div>
        <div class="analysis-items">
          <div class="analysis-item">
            <div class="analysis-status status-fail">✗</div>
            <div class="analysis-text">
              <strong>Domain spoofing detected</strong>
              "paypa1" uses a numeral "1" instead of the letter "l" — a classic homograph attack.
            </div>
          </div>
          <div class="analysis-item">
            <div class="analysis-status status-fail">✗</div>
            <div class="analysis-text">
              <strong>No HTTPS encryption</strong>
              Legitimate payment sites always use HTTPS. This site uses plain HTTP.
            </div>
          </div>
          <div class="analysis-item">
            <div class="analysis-status status-warn">!</div>
            <div class="analysis-text">
              <strong>Suspicious path: /verify</strong>
              Urgency-inducing paths like /verify or /confirm are common in phishing sites.
            </div>
          </div>
          <div class="analysis-item">
            <div class="analysis-status status-fail">✗</div>
            <div class="analysis-text">
              <strong>Domain registered 3 days ago</strong>
              Legitimate company domains are years old. This was registered recently.
            </div>
          </div>
        </div>
        <div class="verdict-bar">
          <div class="verdict-icon">⚠</div>
          <div class="verdict-text">
            <div class="verdict-title">High risk — Phishing URL</div>
            <div class="verdict-sub">4 threat signals detected. Do not visit this site.</div>
          </div>
          <div class="verdict-score">96%</div>
        </div>
        <div style="margin-top:12px;padding:10px 12px;background:rgba(34,197,94,.04);border:1px solid rgba(34,197,94,.15);border-radius:8px;display:flex;align-items:center;gap:8px">
          <span style="font-size:14px">🤖</span>
          <div style="font-size:12px;color:var(--stone-500);line-height:1.4"><strong style="color:var(--ink)">Cipher:</strong> Nice work! You spotted the homograph attack. +40 XP awarded. Ready for the next challenge? 🎯</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- RANKS -->
<section class="ranks-section" id="ranks">
  <div style="max-width:1200px;margin:0 auto">
    <div class="section-header reveal">
      <div class="section-kicker">Rank system</div>
      <div class="section-h">Six tiers. One destiny.</div>
      <div class="section-sub">Earn XP by clearing missions and challenges. Each rank unlocks harder quests, rarer trophies, and new adventure worlds.</div>
    </div>
    <div class="ranks-grid reveal">
      <div class="rank-cell">
        <span class="rank-num-label">01</span>
        <div class="rank-icon-label">🌐</div>
        <div class="rank-cell-name">Internet Explorer</div>
        <div class="rank-cell-desc">Beginning the journey</div>
        <div class="rank-xp">0 XP</div>
        <div class="rank-cell-reward">Unlocks: Tutorial worlds</div>
      </div>
      <div class="rank-cell">
        <span class="rank-num-label">02</span>
        <div class="rank-icon-label">🥋</div>
        <div class="rank-cell-name">Cyber Rookie</div>
        <div class="rank-cell-desc">Learning the fundamentals</div>
        <div class="rank-xp">500 XP</div>
        <div class="rank-cell-reward">Unlocks: Hard missions</div>
      </div>
      <div class="rank-cell current">
        <span class="rank-num-label">03</span>
        <div class="rank-icon-label">🔭</div>
        <div class="rank-cell-name">Security Scout</div>
        <div class="rank-cell-desc">Spotting threats in the wild</div>
        <div class="rank-xp">1,500 XP</div>
        <div class="rank-cell-reward">Unlocks: Expert challenges</div>
      </div>
      <div class="rank-cell">
        <span class="rank-num-label">04</span>
        <div class="rank-icon-label">🎯</div>
        <div class="rank-cell-name">Threat Hunter</div>
        <div class="rank-cell-desc">Actively tracking attackers</div>
        <div class="rank-xp">4,500 XP</div>
        <div class="rank-cell-reward">Unlocks: Scam City world</div>
      </div>
      <div class="rank-cell">
        <span class="rank-num-label">05</span>
        <div class="rank-icon-label">🛡</div>
        <div class="rank-cell-name">Cyber Guardian</div>
        <div class="rank-cell-desc">Defending the digital world</div>
        <div class="rank-xp">10,000 XP</div>
        <div class="rank-cell-reward">Unlocks: Final two worlds</div>
      </div>
      <div class="rank-cell legendary-rank">
        <span class="rank-num-label">06</span>
        <div class="rank-icon-label">👑</div>
        <div class="rank-cell-name">Cyber Master</div>
        <div class="rank-cell-desc">Elite status. Legend unlocked.</div>
        <div class="rank-xp">25,000 XP</div>
        <div class="rank-cell-reward">Unlocks: The Citadel</div>
      </div>
    </div>
  </div>
</section>

<!-- TECH STACK -->
<section class="tech-section">
  <div style="max-width:1200px;margin:0 auto">
    <div class="section-header reveal" style="margin-bottom:0">
      <div class="section-kicker">Architecture</div>
      <div class="section-h">Production-grade<br>from day one.</div>
    </div>
    <div class="tech-grid reveal">
      <div class="tech-cell">
        <div class="tech-cell-label">Frontend</div>
        <div class="tech-pills">
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#000"></div>Next.js 15</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#3178c6"></div>TypeScript</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#06b6d4"></div>Tailwind CSS</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#111"></div>Shadcn UI</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#ff4d4d"></div>Framer Motion</div>
        </div>
      </div>
      <div class="tech-cell">
        <div class="tech-cell-label">Backend & AI</div>
        <div class="tech-pills">
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#339933"></div>Node.js + Express</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#412991"></div>OpenAI API</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#000"></div>Streaming (SSE)</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#7c3aed"></div>Prompt Engineering</div>
        </div>
      </div>
      <div class="tech-cell">
        <div class="tech-cell-label">Data & Auth</div>
        <div class="tech-pills">
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#336791"></div>PostgreSQL</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#2d3748"></div>Prisma ORM</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#3ecf8e"></div>Supabase</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#6c47ff"></div>Clerk Auth</div>
        </div>
      </div>
      <div class="tech-cell">
        <div class="tech-cell-label">DevOps</div>
        <div class="tech-pills">
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#000"></div>Vercel</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#f05032"></div>Git + GitHub</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#e86c28"></div>Recharts</div>
          <div class="tech-pill"><div class="tech-pill-dot" style="background:#38bdf8"></div>REST / tRPC</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="cta-inner reveal">
    <div class="cta-kicker">Your adventure begins now</div>
    <div class="cta-h">Start the quest to<br><em>Cyber Master.</em></div>
    <div class="cta-sub">Join thousands of young heroes building real cybersecurity skills — one mission at a time. Six worlds. Eighteen trophies. One ultimate rank.</div>
    <div class="cta-goals">
      <div class="cta-goal-chip">⚡ 1,660 XP until Threat Hunter</div>
      <div class="cta-goal-chip">🔓 Unlock Privacy Planet in 4 missions</div>
      <div class="cta-goal-chip">🏆 Scam Detective badge waiting</div>
    </div>
    <div class="cta-actions">
      <button class="btn-white" onclick="triggerConfetti()">Begin your quest →</button>
      <button class="btn-outline-white">View on GitHub</button>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">
    <div class="nav-logo-mark" style="width:24px;height:24px;border-radius:6px"><span style="font-size:11px">CT</span></div>
    Cyber Tales AI
  </div>
  <div class="footer-links">
    <a href="#">Features</a>
    <a href="#">Architecture</a>
    <a href="#">GitHub</a>
    <a href="#">Portfolio</a>
  </div>
  <div class="footer-copy">Built with Next.js · OpenAI · Supabase</div>
</footer>

`
      }}
    />
  );
}
