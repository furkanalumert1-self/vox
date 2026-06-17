# Working in this project (read me first)

This is **Vox** — a GoatStarter kit shaped into a real product: **AI voice phone
agents** that answer calls, book appointments, qualify leads and route — 24/7.
Production-grade Next.js 16, built to be rebranded fast.

**Design language:** a dark, dark-first AI-voice cockpit inspired by **bland.ai**
(mono, minimal, electric accent) and **synthflow.ai** (violet/purple gradient,
clean flow). Near-black surfaces, hairline borders, **JetBrains Mono** tabular
numbers + transcripts, an **electric violet** primary with a **cyan** secondary,
and a **waveform / phone-pulse** motif throughout. Dark is the default theme
(`html className="dark"`, `defaultTheme="dark"`). The app shell uses a **top tab
nav + footer status bar** (no left sidebar). UI text is in **Sora**
(`--font-sans`); numbers/transcripts in `--font-mono`.

## ⭐ If the user wants to set this up

When the user says anything like **"set up this project"**, **"bu projeyi kur"**,
**"make this mine"**, **"configure this"**, or runs **`/setup`** — do NOT start
editing files blindly. Open **`SETUP.md`** and follow it exactly. It is an
interview: you ask a short list of questions (brand, logo, colors, and the
specific API keys this app needs), then you apply the answers to:

- `app.config.ts` — name, tagline, copy, navigation
- `app/globals.css` — brand colors (`--color-primary` / `--color-violet`)
- `app/layout.tsx` — fonts (optional)
- `.env.local` — the API keys you collected
- `public/logo.svg` + `app/icon.svg` — the user's logo (if provided)

Ask **one question at a time**, accept "skip"/"keep default" for any of them, and
never invent API keys. When done, run `npm install` and `npm run dev` and report
the local URL.

## The single source of truth

`app.config.ts` drives the brand, the marketing page, the dashboard navigation,
and the list of integrations this kit expects (Vapi/Twilio voice, an LLM, a
calendar, Supabase). Read it before changing UI copy.

## Bilingual (TR + EN)

Every user-facing string is `{ tr: "…", en: "…" }`. When you edit copy, **keep
both languages**. Shared UI strings (auth, nav chrome, buttons) live in
`lib/i18n/dict.ts`. The default language is set in `lib/i18n/config.ts`
(`DEFAULT_LANG`). A live TR/EN toggle sits in the navbar, cockpit top-nav and
auth pages.

## Auth

`/login` and `/signup` are real screens but run a **demo bypass** — Supabase
isn't connected, so submitting (or "Continue with demo") just enters the cockpit.
Wiring Supabase via setup is what makes them do real auth.

## Demo mode

With no keys in `.env.local`, the cockpit renders from `lib/demo/data.ts`
(`CALLS`, `LIVE_CALLS`, `AGENTS`, `outcomes`, `callVolume`, `minutes`, plus
marketing data `TICKER`, `TESTIMONIALS`, `USE_CASES`, `COMPARE`, `DEMO_SCRIPT`).
That is intentional — it lets anyone boot the product instantly with realistic
calls and transcripts. Real integrations (Vapi / Twilio / an LLM / a calendar)
replace the demo data once their keys are present.

## Cockpit components (reuse these)

- `components/app/waveform.tsx` — inline-SVG voice equalizer (static or animated
  with a play/pause), the signature motif.
- `components/app/charts.tsx` — `AreaChart` (call volume) + `Donut` (outcomes),
  pure inline SVG.
- `components/app/top-nav.tsx` + `status-bar.tsx` — the app shell chrome.
- `components/ui/logo.tsx` — the bespoke voice-waveform `LogoMark`.

The **dashboard** (`app/(app)/dashboard`) is the voice cockpit: KPI row, recent
calls log → click a row to open the **transcript drawer** (turn-by-turn,
recording scrubber, extracted action items), a **live calls** panel with a
play/pause, a **voice agents** list with toggles, an **agent-builder preview**,
the **call-volume** area chart, the **outcomes** donut and a **minutes** meter.
`app/(app)/calls` and `app/(app)/agents` are the feature pages.

**No fake photos** anywhere — all visuals are inline SVG / CSS. lucide v1 has no
brand icons; use generic or inline SVG for tools/socials.

## This is NOT the Next.js you may know

This is Next.js 16 (App Router, React 19, Tailwind v4). APIs and conventions may
differ from older training data. If unsure about a Next.js API, check
`node_modules/next/dist/docs/` before writing code, and heed deprecation notices.
