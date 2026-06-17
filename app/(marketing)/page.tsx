"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import appConfig from "@/app.config";
import { Icon } from "@/components/ui/icon";
import { LogoMark } from "@/components/ui/logo";
import { Waveform } from "@/components/app/waveform";
import { useLang } from "@/components/i18n/language-provider";
import {
  TICKER,
  MARKETING_LOGOS,
  TESTIMONIALS,
  METRICS,
  USE_CASES,
  COMPARE,
  HOW_STEPS,
  DEMO_SCRIPT,
  OUTCOME_TINT,
  type CompareRow,
} from "@/lib/demo/data";
import { cn } from "@/lib/utils";

type LL = { tr: string; en: string };

export default function LandingPage() {
  const { t, lang } = useLang();
  const m = appConfig.marketing;
  const tt = (v: LL) => v[lang];

  return (
    <>
      <Hero t={t} tt={tt} m={m} lang={lang} />
      <MarqueeTicker lang={lang} />
      <TrustedBy lang={lang} />
      <LiveDemo lang={lang} />
      <Features t={t} m={m} />
      <VoiceShowcase lang={lang} />
      <HowItWorks lang={lang} t={t} />
      <BuilderShowcase lang={lang} />
      <UseCases lang={lang} t={t} />
      <Comparison lang={lang} t={t} />
      <IntegrationsBand lang={lang} />
      <Testimonials t={t} lang={lang} />
      <MetricsBand t={t} />
      <Pricing t={t} tt={tt} m={m} lang={lang} />
      <Faq t={t} lang={lang} />
      <FinalCta lang={lang} />
    </>
  );
}

/* ════════════════════════════════ HERO ════════════════════════════════ */
function Hero({ t, tt, m, lang }: { t: (v: LL) => string; tt: (v: LL) => string; m: typeof appConfig.marketing; lang: string }) {
  const benefits: LL[] = [
    { tr: "Numara veya kart gerekmez — demo modda anında başla", en: "No number or card needed — start instantly in demo mode" },
    { tr: "İlk çalışta açar, randevu alır, nitelendirir, yönlendirir", en: "Answers on the first ring — books, qualifies and routes" },
    { tr: "30+ dilde insan gibi sesler, <700ms gecikme", en: "Human-like voices in 30+ languages, <700ms latency" },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} />
      <div className="cockpit-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.35]" />
      <span className="blob -left-20 top-0 -z-10 h-80 w-80 bg-violet/25" aria-hidden />
      <span className="blob -right-16 top-40 -z-10 h-72 w-72 bg-cyan/15" aria-hidden />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        {/* Left copy */}
        <div>
          {/* trusted-by pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[12.5px] backdrop-blur">
            <span className="flex items-center gap-0.5 text-violet">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" /></svg>
              ))}
            </span>
            <span className="font-mono font-semibold">4.9</span>
            <span className="text-muted-foreground">{lang === "tr" ? "· 1.200+ ekibin güveniyle" : "· Trusted by 1,200+ teams"}</span>
          </div>

          <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.04] tracking-tight sm:text-[54px]">
            {t(m.heroTitle)}<br />
            <span className="display-accent">{t(m.heroAccent)}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">{t(m.heroSubtitle)}</p>

          <ul className="mt-6 space-y-2.5">
            {benefits.map((b) => (
              <li key={b.en} className="flex items-start gap-2.5 text-[14px]">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-soft text-violet">
                  <Icon name="check" className="h-3 w-3" />
                </span>
                <span className="text-foreground/90">{tt(b)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-[15px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}>
              <Icon name="phone" className="h-4 w-4" />
              {t(m.heroCtaPrimary)}
            </Link>
            <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-[15px] font-semibold transition-colors hover:bg-muted">
              <Icon name="play" className="h-4 w-4" />
              {t(m.heroCtaSecondary)}
            </a>
          </div>

          {/* mini stats */}
          <div className="mt-10 grid max-w-md grid-cols-4 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {m.stats.map((s) => (
              <div key={s.value} className="bg-card/60 px-3 py-4 text-center">
                <div className="font-mono text-[15px] font-bold tabular-nums text-violet">{s.value}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: floating product preview — a live call */}
        <div className="relative">
          <CallPreview lang={lang} />
        </div>
      </div>
    </section>
  );
}

function CallPreview({ lang }: { lang: string }) {
  return (
    <div className="glow-pulse relative rounded-2xl border border-border bg-card/70 p-2 shadow-pop backdrop-blur">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-missed)" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-voicemail)" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-booked)" }} />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">vox.ai/live</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded border border-violet/30 bg-violet-soft px-1.5 py-0.5 font-mono text-[9px] font-semibold text-violet">
          <span className="h-1 w-1 rounded-full bg-violet pulse-dot" />LIVE
        </span>
      </div>

      <div className="rounded-xl border border-border bg-background/60 p-3">
        {/* caller header */}
        <div className="flex items-center gap-2.5 border-b border-border pb-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-soft font-mono text-[11px] font-bold text-violet">MG</span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold leading-none">Maria Gomez</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">+1 (415) 555-0182 · 0:37</p>
          </div>
          <Waveform data={[0.4, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.5, 0.7]} animated width={90} height={24} className="ml-auto" />
        </div>

        {/* transcript snippet */}
        <ul className="space-y-2.5 py-3">
          <li className="flex flex-col items-start">
            <span className="mb-0.5 font-mono text-[8.5px] uppercase tracking-wider text-muted-foreground">Vox</span>
            <span className="max-w-[88%] rounded-xl rounded-tl-sm bg-violet-soft px-2.5 py-1.5 text-[11.5px] leading-snug">{lang === "tr" ? "Salı sabahı 10:00 uygun mu?" : "Would Tuesday morning at 10:00 work?"}</span>
          </li>
          <li className="flex flex-col items-end">
            <span className="mb-0.5 font-mono text-[8.5px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Arayan" : "Caller"}</span>
            <span className="max-w-[88%] rounded-xl rounded-tr-sm bg-muted px-2.5 py-1.5 text-[11.5px] leading-snug">{lang === "tr" ? "Evet, salı 10 harika." : "Yes, Tuesday at 10 is great."}</span>
          </li>
        </ul>

        {/* outcome chip */}
        <div className="flex items-center gap-2 rounded-lg border px-2.5 py-2" style={{ borderColor: "color-mix(in oklch, var(--color-booked) 35%, transparent)", background: "color-mix(in oklch, var(--color-booked) 10%, transparent)" }}>
          <span className="grid h-6 w-6 place-items-center rounded-md" style={{ background: "color-mix(in oklch, var(--color-booked) 18%, transparent)" }}>
            <Icon name="calendar-check" className="h-3.5 w-3.5" style={{ color: "var(--color-booked)" }} />
          </span>
          <span className="font-mono text-[11px] font-semibold" style={{ color: "var(--color-booked)" }}>{lang === "tr" ? "✓ Randevu alındı · Sal 10:00" : "✓ Appointment booked · Tue 10:00"}</span>
        </div>
      </div>

      {/* floating chip */}
      <div className="animate-float-up absolute -bottom-4 -left-4 hidden items-center gap-2 rounded-lg border border-violet/40 bg-card px-3 py-2 shadow-pop sm:flex">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-violet-soft text-violet"><Icon name="check" className="h-3.5 w-3.5" /></span>
        <div>
          <p className="font-mono text-[11px] font-semibold text-violet">{lang === "tr" ? "Takvime yazıldı" : "Synced to calendar"}</p>
          <p className="font-mono text-[9.5px] text-muted-foreground">{lang === "tr" ? "Onay SMS'i gönderildi" : "Confirmation SMS sent"}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════ MARQUEE TICKER ═══════════════════════════ */
function MarqueeTicker({ lang }: { lang: "tr" | "en" }) {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="border-y border-border bg-card/30 py-2.5">
      <div className="marquee-track">
        {items.map((it, i) => {
          const tint = OUTCOME_TINT[it.tone];
          return (
            <span key={i} className="mx-4 inline-flex items-center gap-2 font-mono text-[12px]">
              <span className="rounded px-1.5 py-0.5 text-[9.5px] font-bold uppercase" style={{ color: tint, background: `color-mix(in oklch, ${tint} 14%, transparent)` }}>{it.symbol}</span>
              <span className="text-muted-foreground">{it.text[lang]}</span>
              <span className="text-border">·</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════ TRUSTED BY ═══════════════════════════ */
function TrustedBy({ lang }: { lang: "tr" | "en" }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {lang === "tr" ? "Önde gelen ekiplerin tercihi" : "Trusted by teams everywhere"}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {MARKETING_LOGOS.map((name) => (
          <span key={name} className="font-display text-[16px] font-bold tracking-tight text-muted-foreground/60 transition-colors hover:text-foreground">
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════ INTERACTIVE LIVE DEMO ═══════════════════════════ */
function LiveDemo({ lang }: { lang: "tr" | "en" }) {
  const [calling, setCalling] = useState(false);
  const [shown, setShown] = useState(0);     // how many turns revealed
  const [typed, setTyped] = useState("");    // current turn being typed
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearAll() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function start() {
    clearAll();
    setCalling(true);
    setDone(false);
    setShown(0);
    setTyped("");
    // Reveal each turn sequentially; type the latest, then commit it.
    let acc = 600;
    DEMO_SCRIPT.forEach((turn, idx) => {
      const full = turn.text[lang];
      timers.current.push(
        setTimeout(() => {
          setShown(idx);
          // type char by char
          let ci = 0;
          const typeStep = () => {
            ci++;
            setTyped(full.slice(0, ci));
            if (ci < full.length) timers.current.push(setTimeout(typeStep, 22));
            else {
              timers.current.push(
                setTimeout(() => {
                  setShown(idx + 1);
                  setTyped("");
                  if (idx === DEMO_SCRIPT.length - 1) {
                    setDone(true);
                    setCalling(false);
                  }
                }, 380),
              );
            }
          };
          typeStep();
        }, acc),
      );
      acc += full.length * 22 + 900;
    });
  }

  useEffect(() => () => clearAll(), []);

  return (
    <section id="demo" className="relative overflow-hidden border-y border-border bg-card/20 py-20">
      <span className="blob left-1/3 top-0 -z-10 h-72 w-72 bg-violet/15" aria-hidden />
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Canlı demo" : "Live demo"}</p>
        <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
          {lang === "tr" ? "“Ara” bas ve dinle." : "Press “call” and listen in."}
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          {lang === "tr" ? "Vox aramayı açar, doğal konuşur ve sonucu canlı çıkarır — tıpkı müşterilerinde olduğu gibi." : "Vox answers, speaks naturally and lands the outcome live — exactly like it does for your customers."}
        </p>

        <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-border bg-background/70 p-4 text-left shadow-pop backdrop-blur">
          {/* call control */}
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <span className="relative grid h-10 w-10 place-items-center">
              {calling && <span className="absolute h-9 w-9 rounded-full bg-violet/40 ping-ring" />}
              <span className="grid h-10 w-10 place-items-center rounded-full" style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}>
                <Icon name="phone" className="h-4 w-4" />
              </span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-semibold leading-none">Vox · Reception</p>
              <p className="mt-1 font-mono text-[10.5px] text-muted-foreground">
                {calling ? (lang === "tr" ? "Konuşuyor…" : "On the call…") : done ? (lang === "tr" ? "Arama bitti" : "Call ended") : (lang === "tr" ? "Aramaya hazır" : "Ready to call")}
              </p>
            </div>
            <Waveform data={[0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.3, 0.7, 0.5]} animated playing={calling} width={70} height={22} color={calling ? "var(--color-violet)" : "var(--color-muted-foreground)"} />
          </div>

          {/* transcript */}
          <div className="min-h-[180px] space-y-2.5 py-3">
            {DEMO_SCRIPT.slice(0, shown).map((turn, i) => (
              <Bubble key={i} who={turn.who} text={turn.text[lang]} lang={lang} />
            ))}
            {calling && shown < DEMO_SCRIPT.length && typed && (
              <Bubble who={DEMO_SCRIPT[shown].who} text={typed} lang={lang} typing />
            )}
            {shown === 0 && !calling && (
              <p className="grid h-[160px] place-items-center text-center text-[12.5px] text-muted-foreground">
                {lang === "tr" ? "Demoyu başlatmak için “Ara”ya bas." : "Hit “Call” to start the demo."}
              </p>
            )}
            {done && (
              <div className="animate-float-up flex items-center gap-2 rounded-lg border px-2.5 py-2" style={{ borderColor: "color-mix(in oklch, var(--color-booked) 35%, transparent)", background: "color-mix(in oklch, var(--color-booked) 10%, transparent)" }}>
                <Icon name="calendar-check" className="h-4 w-4" style={{ color: "var(--color-booked)" }} />
                <span className="font-mono text-[11.5px] font-semibold" style={{ color: "var(--color-booked)" }}>{lang === "tr" ? "✓ Randevu alındı · Sal 10:00" : "✓ Appointment booked · Tue 10:00"}</span>
              </div>
            )}
          </div>

          <button
            onClick={start}
            disabled={calling}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}
          >
            <Icon name={calling ? "loader" : "phone-call"} className={cn("h-4 w-4", calling && "animate-spin")} />
            {calling ? (lang === "tr" ? "Konuşuyor…" : "Calling…") : done ? (lang === "tr" ? "Tekrar ara" : "Call again") : (lang === "tr" ? "Ara" : "Call")}
          </button>
        </div>
      </div>
    </section>
  );
}

function Bubble({ who, text, lang, typing }: { who: "agent" | "caller"; text: string; lang: "tr" | "en"; typing?: boolean }) {
  return (
    <div className={cn("flex flex-col", who === "agent" ? "items-start" : "items-end")}>
      <span className="mb-0.5 font-mono text-[8.5px] uppercase tracking-wider text-muted-foreground">
        {who === "agent" ? "Vox" : lang === "tr" ? "Arayan" : "Caller"}
      </span>
      <span className={cn("max-w-[86%] rounded-xl px-3 py-2 text-[12.5px] leading-snug", who === "agent" ? "rounded-tl-sm bg-violet-soft" : "rounded-tr-sm bg-muted")}>
        {text}
        {typing && <span className="cursor-blink ml-0.5 inline-block h-3 w-px align-middle bg-violet" />}
      </span>
    </div>
  );
}

/* ═══════════════════════════ FEATURES ═══════════════════════════ */
function Features({ t, m }: { t: (v: LL) => string; m: typeof appConfig.marketing }) {
  const { lang } = useLang();
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Özellikler" : "Features"}</p>
        <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
          {lang === "tr" ? "Tam donanımlı bir resepsiyon ekibi," : "A full reception team,"}{" "}
          <span className="display-accent">{lang === "tr" ? "yapay zekâdan." : "powered by AI."}</span>
        </h2>
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {m.features.map((f) => (
          <div key={f.title.en} className="group rounded-xl border border-border bg-card/30 p-5 transition-colors hover:border-violet/40">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-soft text-violet transition-transform group-hover:scale-110">
              <Icon name={f.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold">{t(f.title)}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{t(f.body)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */
function HowItWorks({ lang, t }: { lang: "tr" | "en"; t: (v: LL) => string }) {
  return (
    <section id="how" className="relative overflow-hidden border-y border-border bg-card/20 py-20">
      <div className="cockpit-grid pointer-events-none absolute inset-0 -z-10 opacity-[0.25]" />
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Nasıl çalışır" : "How it works"}</p>
          <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
            {lang === "tr" ? "Üç adımda yayında." : "Live in three steps."}
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {HOW_STEPS.map((s, i) => (
            <div key={s.title.en} className="relative rounded-xl border border-border bg-background/50 p-6">
              <span className="absolute right-4 top-4 font-mono text-[28px] font-bold text-violet/20">{i + 1}</span>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-violet-soft text-violet">
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold">{t(s.title)}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{t(s.body)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════ USE CASES ═══════════════════════════ */
function UseCases({ lang, t }: { lang: "tr" | "en"; t: (v: LL) => string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Kullanım alanları" : "Use cases"}</p>
        <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
          {lang === "tr" ? "Telefonu çalan her işletme için." : "For every business with a phone."}
        </h2>
      </div>
      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {USE_CASES.map((u) => (
          <div key={u.title.en} className="rounded-xl border border-border bg-card/30 p-5 transition-colors hover:border-cyan/40">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-soft text-cyan">
              <Icon name={u.icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold">{t(u.title)}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{t(u.body)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════ COMPARISON ═══════════════════════════ */
function Comparison({ lang, t }: { lang: "tr" | "en"; t: (v: LL) => string }) {
  const cols = [
    { key: "callCenter", label: lang === "tr" ? "Çağrı merkezi" : "Call center" },
    { key: "voicemail", label: lang === "tr" ? "Sesli mesaj" : "Voicemail" },
    { key: "vox", label: "Vox", featured: true },
  ] as const;

  function cell(v: boolean | LL) {
    if (typeof v === "boolean") {
      return v ? (
        <Icon name="check" className="mx-auto h-4 w-4" style={{ color: "var(--color-booked)" }} />
      ) : (
        <Icon name="x" className="mx-auto h-4 w-4 text-muted-foreground/40" />
      );
    }
    return <span className="font-mono text-[12px] text-muted-foreground">{t(v)}</span>;
  }

  return (
    <section className="border-y border-border bg-card/20 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Karşılaştırma" : "Comparison"}</p>
          <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
            {lang === "tr" ? "Neden Vox?" : "Why Vox?"}
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="px-4 py-3 text-left text-[12px] font-medium text-muted-foreground"> </th>
                {cols.map((c) => (
                  <th key={c.key} className={cn("px-4 py-3 text-center text-[13px] font-semibold", "featured" in c && c.featured ? "text-violet" : "text-foreground")}>
                    {"featured" in c && c.featured ? (
                      <span className="inline-flex items-center gap-1.5">
                        <LogoMark className="h-4 w-4" />
                        {c.label}
                      </span>
                    ) : c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row: CompareRow, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-3 text-[12.5px] text-foreground/90">{t(row.label)}</td>
                  <td className="px-4 py-3 text-center">{cell(row.callCenter)}</td>
                  <td className="px-4 py-3 text-center">{cell(row.voicemail)}</td>
                  <td className="px-4 py-3 text-center" style={{ background: "color-mix(in oklch, var(--color-violet) 6%, transparent)" }}>{cell(row.vox)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════ TESTIMONIALS ═══════════════════════════ */
function Testimonials({ t, lang }: { t: (v: LL) => string; lang: "tr" | "en" }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Müşteriler" : "Testimonials"}</p>
        <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
          {lang === "tr" ? "Ekipler Vox'u seviyor." : "Teams love Vox."}
        </h2>
      </div>
      <div className="mt-12 columns-1 gap-3 sm:columns-2 lg:columns-3">
        {TESTIMONIALS.map((tm) => (
          <figure key={tm.name} className="mb-3 break-inside-avoid rounded-xl border border-border bg-card/30 p-5">
            <div className="flex items-center gap-0.5 text-violet">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" /></svg>
              ))}
            </div>
            <blockquote className="mt-3 text-[13.5px] leading-relaxed text-foreground/90">“{t(tm.quote)}”</blockquote>
            <figcaption className="mt-4 flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-soft font-mono text-[10px] font-bold text-violet">{tm.initials}</span>
              <div>
                <p className="text-[12.5px] font-semibold leading-none">{tm.name}</p>
                <p className="mt-0.5 font-mono text-[10.5px] text-muted-foreground">{t(tm.role)}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════ METRICS BAND ═══════════════════════════ */
function MetricsBand({ t }: { t: (v: LL) => string }) {
  return (
    <section className="relative overflow-hidden border-y border-border bg-card/30 py-14">
      <span className="blob left-1/4 top-0 -z-10 h-60 w-60 bg-violet/15" aria-hidden />
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border px-0 sm:grid-cols-4">
        {METRICS.map((mt) => (
          <div key={mt.value} className="bg-background/60 px-4 py-7 text-center">
            <p className="font-mono text-[28px] font-bold tabular-nums text-violet">{mt.value}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">{t(mt.label)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════ PRICING ═══════════════════════════ */
function Pricing({ t, tt, m, lang }: { t: (v: LL) => string; tt: (v: LL) => string; m: typeof appConfig.marketing; lang: "tr" | "en" }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Fiyatlar" : "Pricing"}</p>
        <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
          {lang === "tr" ? "Dakikaya göre, basit." : "Simple, by the minute."}
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          {lang === "tr" ? "Ücretsiz başla, büyüdükçe ölçeklendir. Kurulum ücreti yok." : "Start free, scale as you grow. No setup fees."}
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {m.pricing.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card/30 p-6",
              tier.featured ? "border-violet/60 shadow-pop" : "border-border",
            )}
          >
            {tier.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider" style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}>
                {lang === "tr" ? "En popüler" : "Most popular"}
              </span>
            )}
            <h3 className="font-display text-[17px] font-bold">{tier.name}</h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{t(tier.tagline)}</p>
            <p className="mt-4 flex items-end gap-1">
              <span className="font-mono text-[34px] font-bold tabular-nums">{tier.price}</span>
              {tier.period && <span className="mb-1.5 font-mono text-[13px] text-muted-foreground">{tier.period}</span>}
            </p>
            <ul className="mt-5 space-y-2.5">
              {tier.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <span className="text-foreground/90">{t(f)}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={cn(
                "mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]",
                tier.featured ? "" : "border border-border bg-card hover:bg-muted",
              )}
              style={tier.featured ? { background: "var(--color-violet)", color: "var(--color-primary-foreground)" } : undefined}
            >
              {t(tier.cta)}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════ FAQ ═══════════════════════════ */
function Faq({ t, lang }: { t: (v: LL) => string; lang: "tr" | "en" }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-border py-20">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "S.S.S." : "FAQ"}</p>
          <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
            {lang === "tr" ? "Sık sorulan sorular" : "Frequently asked"}
          </h2>
        </div>
        <div className="mt-10 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {appConfig.marketing.faq.map((item, i) => (
            <div key={i} className="bg-card/30">
              <button
                onClick={() => setOpen((o) => (o === i ? null : i))}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-[14px] font-medium">{t(item.q)}</span>
                <Icon name="chevron-down" className={cn("ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && (
                <p className="animate-float-up px-4 pb-4 text-[13px] leading-relaxed text-muted-foreground">{t(item.a)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════ VOICE SHOWCASE ═══════════════════════════ */
function VoiceShowcase({ lang }: { lang: "tr" | "en" }) {
  const [active, setActive] = useState(0);
  const voices = [
    { name: "Nova", desc: lang === "tr" ? "Sıcak, kadın · resepsiyon" : "Warm female · reception", seed: [0.4, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9, 0.5, 0.7] },
    { name: "Atlas", desc: lang === "tr" ? "Güçlü, erkek · satış" : "Confident male · sales", seed: [0.6, 0.4, 0.8, 0.5, 0.3, 0.7, 0.9, 0.4, 0.6, 0.5, 0.8, 0.3, 0.7, 0.5] },
    { name: "Sage", desc: lang === "tr" ? "Sakin, nötr · klinik" : "Calm neutral · clinic", seed: [0.3, 0.6, 0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7, 0.5, 0.6, 0.3, 0.8] },
    { name: "Echo", desc: lang === "tr" ? "Yumuşak, kadın · mesai dışı" : "Soft female · after hours", seed: [0.5, 0.7, 0.3, 0.8, 0.5, 0.6, 0.4, 0.9, 0.5, 0.3, 0.7, 0.5, 0.8, 0.4] },
  ];
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative overflow-hidden border-y border-border bg-card/20 py-20">
      <span className="blob -right-10 top-10 -z-10 h-72 w-72 bg-cyan/12" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Sesler" : "Voices"}</p>
          <h2 className="mt-2 font-display text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
            {lang === "tr" ? "Markana yakışan bir ses seç," : "Pick a voice that fits your brand,"}{" "}
            <span className="display-accent">{lang === "tr" ? "bot gibi değil." : "not a robot."}</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {lang === "tr"
              ? "Düşük gecikmeli akışlı sesler, doğal duraklamalar ve araya girme desteğiyle gerçek bir konuşma gibi hissettirir. Birini seç, önizle ve yayına al."
              : "Low-latency streaming voices with natural pauses and barge-in make it feel like a real conversation. Pick one, preview it, and ship."}
          </p>
          <ul className="mt-6 space-y-2">
            {[
              { tr: "Araya girilebilir — arayan ajanın sözünü kesebilir", en: "Barge-in — callers can interrupt the agent" },
              { tr: "Arayanın dilini algılar ve aynı dilde devam eder", en: "Detects the caller's language and continues in it" },
              { tr: "Tonu, hızı ve kişiliği ayarlanabilir", en: "Tunable tone, pace and persona" },
            ].map((b) => (
              <li key={b.en} className="flex items-start gap-2.5 text-[14px]">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                <span className="text-foreground/90">{b[lang]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* voice picker card */}
        <div className="rounded-2xl border border-border bg-background/60 p-4 shadow-pop">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}>
              <Icon name="audio-lines" className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold">{lang === "tr" ? "Ses kütüphanesi" : "Voice library"}</p>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon name={playing ? "pause" : "play"} className="h-3 w-3" />
              {playing ? (lang === "tr" ? "Duraklat" : "Pause") : (lang === "tr" ? "Dinle" : "Play")}
            </button>
          </div>
          <ul className="mt-2 space-y-1.5">
            {voices.map((v, i) => (
              <li key={v.name}>
                <button
                  onClick={() => { setActive(i); setPlaying(true); }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    active === i ? "border-violet/50 bg-violet-soft" : "border-border hover:border-violet/30",
                  )}
                >
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-[11px] font-bold", active === i ? "" : "bg-muted text-muted-foreground")} style={active === i ? { background: "var(--color-violet)", color: "var(--color-primary-foreground)" } : undefined}>
                    {v.name[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold leading-none">{v.name}</p>
                    <p className="mt-1 font-mono text-[10.5px] text-muted-foreground">{v.desc}</p>
                  </div>
                  <Waveform data={v.seed} animated playing={playing && active === i} width={84} height={24} color={active === i ? "var(--color-violet)" : "var(--color-muted-foreground)"} className="ml-auto" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════ BUILDER SHOWCASE ═══════════════════════════ */
function BuilderShowcase({ lang }: { lang: "tr" | "en" }) {
  const lines = lang === "tr"
    ? [
        "Sen bir diş kliniğinin resepsiyonistisin.",
        "Arayanları sıcak karşıla ve randevu al.",
        "Uygunluğu takvimden oku, slot teklif et.",
        "Acil durumları doktora canlı transfer et.",
        "Her aramayı CRM'e özetle.",
      ]
    : [
        "You are the receptionist for a dental clinic.",
        "Greet callers warmly and book appointments.",
        "Read availability from the calendar, offer slots.",
        "Warm-transfer emergencies to the on-call doctor.",
        "Summarize every call into the CRM.",
      ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* prompt editor mock */}
        <div className="order-2 rounded-2xl border border-border bg-background/60 p-2 shadow-pop lg:order-1">
          <div className="flex items-center gap-1.5 px-2 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-missed)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-voicemail)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--color-booked)" }} />
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">agent.prompt</span>
          </div>
          <div className="rounded-xl border border-border bg-background/80 p-4">
            <ol className="space-y-1.5 font-mono text-[12.5px] leading-relaxed">
              {lines.map((l, i) => (
                <li key={i} className="flex gap-3">
                  <span className="select-none text-muted-foreground/40">{i + 1}</span>
                  <span className={cn(i === 0 ? "text-violet" : "text-foreground/90")}>{l}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <span className="select-none text-muted-foreground/40">{lines.length + 1}</span>
                <span className="cursor-blink inline-block h-4 w-2 bg-violet" />
              </li>
            </ol>
          </div>
          <div className="flex flex-wrap gap-1.5 px-2 py-2">
            {(lang === "tr" ? ["Takvime al", "Transfer", "SMS", "CRM"] : ["Book", "Transfer", "SMS", "CRM"]).map((a) => (
              <span key={a} className="inline-flex items-center gap-1 rounded-md border border-violet/30 bg-violet-soft px-2 py-0.5 font-mono text-[10.5px] text-violet">
                <Icon name="zap" className="h-3 w-3" />{a}
              </span>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Ajan oluşturucu" : "Agent builder"}</p>
          <h2 className="mt-2 font-display text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
            {lang === "tr" ? "Düz cümlelerle tarif et," : "Describe it in plain words,"}{" "}
            <span className="display-accent">{lang === "tr" ? "kodla değil." : "not code."}</span>
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {lang === "tr"
              ? "Ajanın ne yapacağını yaz, sesini seç ve eylemleri aç. Vox gerisini halleder — takvim, transfer, SMS ve CRM tek tıkla bağlı."
              : "Write what the agent should do, pick its voice and switch on actions. Vox handles the rest — calendar, transfer, SMS and CRM are one toggle away."}
          </p>
          <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-[14px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}>
            {lang === "tr" ? "Ajanını oluştur" : "Build your agent"}
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════ INTEGRATIONS BAND ═══════════════════════════ */
function IntegrationsBand({ lang }: { lang: "tr" | "en" }) {
  const tools = [
    { name: "Twilio", icon: "phone" },
    { name: "Google Calendar", icon: "calendar" },
    { name: "Cal.com", icon: "calendar-clock" },
    { name: "HubSpot", icon: "workflow" },
    { name: "Salesforce", icon: "cloud" },
    { name: "Slack", icon: "message-square" },
    { name: "Webhooks", icon: "webhook" },
    { name: "REST API", icon: "code" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-violet">{lang === "tr" ? "Entegrasyonlar" : "Integrations"}</p>
        <h2 className="mt-2 font-display text-[30px] font-bold tracking-tight sm:text-[38px]">
          {lang === "tr" ? "Kullandığın araçlara bağlanır." : "Plugs into the tools you use."}
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          {lang === "tr" ? "Her arama; takvimine, CRM'ine ve ekibine otomatik akar." : "Every call flows automatically into your calendar, CRM and team."}
        </p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tools.map((tool) => (
          <div key={tool.name} className="flex items-center gap-2.5 rounded-xl border border-border bg-card/30 px-4 py-3.5 transition-colors hover:border-violet/40">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-soft text-violet">
              <Icon name={tool.icon} className="h-[18px] w-[18px]" />
            </span>
            <span className="text-[13px] font-medium">{tool.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════ FINAL CTA ═══════════════════════════ */
function FinalCta({ lang }: { lang: "tr" | "en" }) {
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "var(--grad-hero)" }} />
      <span className="blob left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 bg-violet/20" aria-hidden />
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="relative mx-auto grid h-16 w-16 place-items-center">
          <span className="absolute h-14 w-14 rounded-full bg-violet/30 ping-ring" />
          <span className="grid h-16 w-16 place-items-center rounded-full border border-violet/40 bg-violet-soft">
            <LogoMark className="h-9 w-9" />
          </span>
        </div>
        <h2 className="mt-6 font-display text-[32px] font-bold tracking-tight sm:text-[42px]">
          {lang === "tr" ? "Bir sonraki aramayı kaçırma." : "Never miss another call."}
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground">
          {lang === "tr" ? "Dakikalar içinde bir numara al ve ilk ajanını yayına ver. Kart gerekmez." : "Get a number and launch your first agent in minutes. No card required."}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 text-[15px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}>
            <Icon name="phone" className="h-4 w-4" />
            {lang === "tr" ? "Bir numara al" : "Get a number"}
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-7 py-3 text-[15px] font-semibold transition-colors hover:bg-muted">
            {lang === "tr" ? "Giriş yap" : "Sign in"}
          </Link>
        </div>
      </div>
    </section>
  );
}
