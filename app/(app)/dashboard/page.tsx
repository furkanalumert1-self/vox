"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Waveform } from "@/components/app/waveform";
import { AreaChart, Donut } from "@/components/app/charts";
import { useLang } from "@/components/i18n/language-provider";
import {
  kpis,
  CALLS,
  LIVE_CALLS,
  AGENTS,
  VOICES,
  BUILDER_ACTIONS,
  outcomes,
  callVolume,
  volumeMeta,
  minutes,
  OUTCOME_LABEL,
  OUTCOME_TINT,
  SENTIMENT_LABEL,
  type CallRow,
  type Outcome,
  type Agent,
} from "@/lib/demo/data";
import { cn } from "@/lib/utils";

const SENTIMENT_TINT: Record<string, string> = {
  positive: "var(--color-booked)",
  neutral: "var(--color-muted-foreground)",
  negative: "var(--color-missed)",
};

export default function DashboardPage() {
  const { lang, t } = useLang();
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [openCall, setOpenCall] = useState<CallRow | null>(null);
  const [livePlaying, setLivePlaying] = useState(true);

  const L = {
    cockpit: lang === "tr" ? "Sesli ajan kokpiti" : "Voice agent cockpit",
    live: lang === "tr" ? "Canlı" : "Live",
    recentCalls: lang === "tr" ? "Son aramalar" : "Recent calls",
    liveCalls: lang === "tr" ? "Aktif aramalar" : "Live calls",
    agents: lang === "tr" ? "Sesli ajanlar" : "Voice agents",
    builder: lang === "tr" ? "Ajan oluşturucu" : "Agent builder",
    outcomes: lang === "tr" ? "Sonuç dağılımı" : "Outcomes breakdown",
    all: lang === "tr" ? "Tüm ajanlar" : "All agents",
    caller: lang === "tr" ? "Arayan" : "Caller",
    time: lang === "tr" ? "Saat" : "Time",
    duration: lang === "tr" ? "Süre" : "Duration",
    outcome: lang === "tr" ? "Sonuç" : "Outcome",
    sentiment: lang === "tr" ? "Duygu" : "Sentiment",
    none: lang === "tr" ? "Aktif arama yok." : "No live calls.",
    callsToday: lang === "tr" ? "bugün" : "today",
  };

  const agentName = (id: string) => AGENTS.find((a) => a.id === id)?.name ?? "—";

  const rows = useMemo(() => {
    if (agentFilter === "all") return CALLS;
    return CALLS.filter((c) => c.agentId === agentFilter);
  }, [agentFilter]);

  const donutSegments = outcomes.map((o) => ({ key: o.key, value: o.value, tint: OUTCOME_TINT[o.key] }));
  const totalCalls = outcomes.reduce((s, o) => s + o.value, 0);
  const minutesPct = Math.round((minutes.used / minutes.cap) * 100);

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 gap-4 p-3 sm:p-4 xl:grid-cols-[1fr_340px]">
        {/* ════════════════ MAIN COLUMN ════════════════ */}
        <div className="min-w-0 space-y-3">
          {/* Header + agent filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-[18px] font-bold tracking-tight">{L.cockpit}</h1>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-violet/30 bg-violet-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-violet">
                <span className="h-1.5 w-1.5 rounded-full bg-violet pulse-dot" />
                {L.live}
              </span>
            </div>
            <div className="ml-auto">
              <AgentFilter value={agentFilter} onChange={setAgentFilter} allLabel={L.all} />
            </div>
          </div>

          {/* KPI summary strip */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label.en} className="rounded-lg border border-border bg-card/30 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k.label[lang]}</p>
                  {k.icon && <Icon name={k.icon} className="h-3.5 w-3.5 text-muted-foreground/60" />}
                </div>
                <p className="mt-1 font-mono text-[17px] font-semibold tabular-nums">{k.value}</p>
                {k.delta !== undefined && (
                  <p className={cn("font-mono text-[10.5px] tabular-nums", k.delta >= 0 ? "text-violet" : "text-muted-foreground")}>
                    {k.delta > 0 ? "+" : ""}{k.delta}% <span className="text-muted-foreground">{k.hint?.[lang]}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Recent calls log */}
          <section className="rounded-lg border border-border bg-card/30">
            <header className="flex items-center justify-between border-b border-border px-3 py-2">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Icon name="phone-incoming" className="h-3.5 w-3.5 text-violet" />
                {L.recentCalls}
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{rows.length} {lang === "tr" ? "arama" : "calls"}</span>
            </header>

            {/* column headers */}
            <div className="hidden grid-cols-[1.4fr_0.7fr_0.7fr_1fr_0.9fr] gap-2 border-b border-border/60 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground sm:grid">
              <span>{L.caller}</span>
              <span>{L.time}</span>
              <span>{L.duration}</span>
              <span>{L.outcome}</span>
              <span className="text-right">{L.sentiment}</span>
            </div>

            <ul className="divide-y divide-border/60">
              {rows.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setOpenCall(c)}
                    className="grid w-full grid-cols-[1.4fr_0.7fr_0.7fr_1fr_0.9fr] items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-card/70"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-violet-soft font-mono text-[10px] font-bold text-violet">
                        {avatarInitials(c.caller)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium leading-tight">{c.caller}</p>
                        <p className="truncate font-mono text-[10.5px] text-muted-foreground">{c.number}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[12px] tabular-nums text-muted-foreground">{c.time}</span>
                    <div className="flex items-center gap-2">
                      <Waveform data={c.wave} width={40} height={18} color="var(--color-muted-foreground)" className="hidden md:block" />
                      <span className="font-mono text-[12px] tabular-nums">{c.duration}</span>
                    </div>
                    <OutcomePill outcome={c.outcome} lang={lang} />
                    <span className="flex items-center justify-end gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: SENTIMENT_TINT[c.sentiment] }} />
                      <span className="hidden font-mono text-[10.5px] text-muted-foreground sm:inline">{t(SENTIMENT_LABEL[c.sentiment])}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Charts row: call volume + outcomes donut */}
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
            <section className="rounded-lg border border-border bg-card/30 p-3">
              <div className="mb-1 flex items-center justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t(volumeMeta.title)}</p>
                  <p className="font-mono text-[18px] font-semibold tabular-nums">342 <span className="text-[11px] font-normal text-violet">{volumeMeta.delta}</span></p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t(volumeMeta.subtitle)}</span>
              </div>
              <AreaChart data={callVolume} height={172} />
            </section>

            <section className="rounded-lg border border-border bg-card/30 p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{L.outcomes}</p>
              <div className="flex items-center gap-4">
                <Donut segments={donutSegments} size={150} thickness={20} centerTop={String(totalCalls)} centerLabel={lang === "tr" ? "ARAMA" : "CALLS"} />
                <ul className="flex-1 space-y-1.5">
                  {outcomes.map((o) => {
                    const pct = Math.round((o.value / totalCalls) * 100);
                    return (
                      <li key={o.key} className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="h-2 w-2 rounded-[3px]" style={{ background: OUTCOME_TINT[o.key] }} />
                        <span className="flex-1 text-muted-foreground">{t(OUTCOME_LABEL[o.key])}</span>
                        <span className="tabular-nums text-foreground">{pct}%</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </div>

          {/* Minutes-used meter */}
          <section className="rounded-lg border border-border bg-card/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t(minutes.label)}</p>
              <p className="font-mono text-[12px] font-semibold tabular-nums">{minutes.used.toLocaleString()} / {minutes.cap.toLocaleString()}</p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full" style={{ width: `${minutesPct}%`, background: "var(--grad-brand)" }} />
            </div>
            <p className="mt-2 font-mono text-[10.5px] text-muted-foreground">{t(minutes.sub)}</p>
          </section>
        </div>

        {/* ════════════════ RIGHT RAIL ════════════════ */}
        <aside className="space-y-3">
          {/* Live calls panel */}
          <section className="rounded-lg border border-violet/30 bg-card/30">
            <header className="flex items-center justify-between border-b border-border px-3 py-2">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <span className="relative grid h-4 w-4 place-items-center">
                  <span className="absolute h-3.5 w-3.5 rounded-full bg-violet/40 ping-ring" />
                  <span className="h-1.5 w-1.5 rounded-full bg-violet" />
                </span>
                {L.liveCalls}
              </h2>
              <button
                onClick={() => setLivePlaying((p) => !p)}
                aria-pressed={livePlaying}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon name={livePlaying ? "pause" : "play"} className="h-3 w-3" />
                {livePlaying ? (lang === "tr" ? "Duraklat" : "Pause") : (lang === "tr" ? "Oynat" : "Play")}
              </button>
            </header>
            {LIVE_CALLS.length === 0 ? (
              <div className="grid place-items-center py-8 text-[12px] text-muted-foreground">{L.none}</div>
            ) : (
              <ul className="divide-y divide-border/60">
                {LIVE_CALLS.map((lc) => (
                  <li key={lc.id} className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{lc.number}</span>
                      <span className="ml-auto font-mono text-[11px] font-semibold tabular-nums text-violet">{lc.elapsed}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Waveform data={[0.4, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.9]} animated playing={livePlaying} width={150} height={22} />
                      <span className="ml-auto rounded bg-violet-soft px-1.5 py-0.5 font-mono text-[9.5px] text-violet">{agentName(lc.agentId)}</span>
                    </div>
                    <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground">
                      <Icon name="loader" className={cn("h-3 w-3", livePlaying && "animate-spin")} />
                      {t(lc.stage)}…
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Voice agents list */}
          <AgentsPanel lang={lang} t={t} title={L.agents} callsTodayLabel={L.callsToday} />

          {/* Agent-builder preview */}
          <AgentBuilder lang={lang} t={t} title={L.builder} />
        </aside>
      </div>

      {/* Transcript drawer */}
      {openCall && <TranscriptDrawer call={openCall} onClose={() => setOpenCall(null)} lang={lang} t={t} agentName={agentName(openCall.agentId)} />}
    </div>
  );
}

/* ────────────────────────── sub-components ────────────────────────── */

function avatarInitials(name: string) {
  if (name === "Unknown" || name === "Incoming") return "?";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2);
}

function OutcomePill({ outcome, lang }: { outcome: Outcome; lang: "tr" | "en" }) {
  const tint = OUTCOME_TINT[outcome];
  return (
    <span
      className="inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 font-mono text-[10.5px] font-semibold"
      style={{ color: tint, background: `color-mix(in oklch, ${tint} 14%, transparent)` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: tint }} />
      {OUTCOME_LABEL[outcome][lang]}
    </span>
  );
}

function AgentFilter({ value, onChange, allLabel }: { value: string; onChange: (v: string) => void; allLabel: string }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5">
      <FilterBtn active={value === "all"} onClick={() => onChange("all")} label={allLabel} />
      {AGENTS.filter((a) => a.active).map((a) => (
        <FilterBtn key={a.id} active={value === a.id} onClick={() => onChange(a.id)} label={a.name} />
      ))}
    </div>
  );
}

function FilterBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded px-2 py-1 text-[11.5px] font-medium transition-colors",
        active ? "bg-violet-soft text-violet" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function AgentsPanel({ lang, t, title, callsTodayLabel }: { lang: "tr" | "en"; t: (v: { tr: string; en: string }) => string; title: string; callsTodayLabel: string }) {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  return (
    <section className="rounded-lg border border-border bg-card/30">
      <header className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
          <Icon name="bot" className="h-3.5 w-3.5 text-cyan" />
          {title}
        </h2>
        <button className="font-mono text-[10px] uppercase tracking-wider text-violet transition-opacity hover:opacity-70">+ {lang === "tr" ? "Yeni" : "New"}</button>
      </header>
      <ul className="divide-y divide-border/60">
        {agents.map((a) => (
          <li key={a.id} className="flex items-center gap-2.5 px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-cyan-soft text-cyan">
              <Icon name="bot" className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold leading-tight">{a.name}</p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">{a.voice}</p>
              <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">{t(a.purpose)}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="font-mono text-[11px] font-semibold tabular-nums">{a.callsToday} <span className="text-[9px] font-normal text-muted-foreground">{callsTodayLabel}</span></span>
              <button
                onClick={() => setAgents((list) => list.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x)))}
                aria-pressed={a.active}
                className={cn("relative h-4 w-7 rounded-full transition-colors", a.active ? "bg-violet/40" : "bg-muted")}
              >
                <span className={cn("absolute top-0.5 h-3 w-3 rounded-full transition-all", a.active ? "left-[14px] bg-violet" : "left-0.5 bg-foreground/60")} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AgentBuilder({ lang, t, title }: { lang: "tr" | "en"; t: (v: { tr: string; en: string }) => string; title: string }) {
  const [voice, setVoice] = useState(VOICES[0]);
  const [actions, setActions] = useState(BUILDER_ACTIONS);
  const [greeting, setGreeting] = useState(
    lang === "tr" ? "Briteline'a hoş geldiniz, ben Vox. Size nasıl yardımcı olabilirim?" : "Thanks for calling Brightline, this is Vox. How can I help?",
  );

  return (
    <section className="rounded-lg border border-border bg-card/30">
      <header className="flex items-center justify-between border-b border-border px-3 py-2">
        <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
          <Icon name="sliders-horizontal" className="h-3.5 w-3.5 text-violet" />
          {title}
        </h2>
        <span className="font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Önizleme" : "Preview"}</span>
      </header>
      <div className="space-y-3 p-3">
        {/* Greeting prompt */}
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Karşılama" : "Greeting prompt"}</label>
          <textarea
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            rows={2}
            className="mt-1 w-full resize-none rounded-md border border-border bg-background/60 px-2.5 py-2 text-[12px] leading-snug text-foreground outline-none focus:border-violet/60"
          />
        </div>

        {/* Voice select */}
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Ses" : "Voice"}</label>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {VOICES.slice(0, 3).map((v) => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-[10.5px] transition-colors",
                  voice === v ? "border-violet/50 bg-violet-soft text-violet" : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {v.split(" · ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Action toggles */}
        <div>
          <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Eylemler" : "Actions"}</label>
          <ul className="mt-1 space-y-1">
            {actions.map((a) => (
              <li key={a.id} className="flex items-center gap-2">
                <span className="text-[11.5px]">{t(a.label)}</span>
                <button
                  onClick={() => setActions((list) => list.map((x) => (x.id === a.id ? { ...x, on: !x.on } : x)))}
                  aria-pressed={a.on}
                  className={cn("relative ml-auto h-4 w-7 rounded-full transition-colors", a.on ? "bg-violet/40" : "bg-muted")}
                >
                  <span className={cn("absolute top-0.5 h-3 w-3 rounded-full transition-all", a.on ? "left-[14px] bg-violet" : "left-0.5 bg-foreground/60")} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={{ color: "var(--color-primary-foreground)", background: "var(--color-violet)" }}
        >
          <Icon name="rocket" className="h-3.5 w-3.5" />
          {lang === "tr" ? "Ajanı yayına al" : "Deploy agent"}
        </button>
      </div>
    </section>
  );
}

function TranscriptDrawer({
  call,
  onClose,
  lang,
  t,
  agentName,
}: {
  call: CallRow;
  onClose: () => void;
  lang: "tr" | "en";
  t: (v: { tr: string; en: string }) => string;
  agentName: string;
}) {
  const [scrub, setScrub] = useState(0);
  const tint = OUTCOME_TINT[call.outcome];
  const pct = (scrub / call.durationSec) * 100;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="animate-float-up relative flex h-full w-full max-w-md flex-col border-l border-border bg-popover shadow-pop">
        {/* header */}
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-violet-soft font-mono text-[11px] font-bold text-violet">
            {avatarInitials(call.caller)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold leading-tight">{call.caller}</p>
            <p className="truncate font-mono text-[11px] text-muted-foreground">{call.number} · {call.time}</p>
          </div>
          <OutcomePill outcome={call.outcome} lang={lang} />
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </header>

        {/* recording scrubber */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <button className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}>
              <Icon name="play" className="h-3.5 w-3.5" />
            </button>
            <input
              type="range"
              min={0}
              max={call.durationSec}
              value={scrub}
              onChange={(e) => setScrub(Number(e.target.value))}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full"
              style={{ background: `linear-gradient(to right, ${tint} ${pct}%, var(--color-muted) ${pct}%)` }}
            />
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{fmt(scrub)} / {call.duration}</span>
          </div>
          <Waveform data={call.wave.concat(call.wave)} width={420} height={28} color="var(--color-muted-foreground)" className="mt-2 w-full" />
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {lang === "tr" ? "Ajan" : "Agent"}: <span className="text-violet">{agentName}</span>
          </p>
        </div>

        {/* transcript turn-by-turn */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Transkript" : "Transcript"}</p>
          <ul className="space-y-3">
            {call.transcript.map((turn, i) => (
              <li key={i} className={cn("flex flex-col", turn.who === "agent" ? "items-start" : "items-end")}>
                <span className="mb-0.5 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                  {turn.who === "agent" ? <Icon name="bot" className="h-2.5 w-2.5 text-violet" /> : <Icon name="user" className="h-2.5 w-2.5" />}
                  {turn.who === "agent" ? "Vox" : (lang === "tr" ? "Arayan" : "Caller")} · {fmt(turn.at)}
                </span>
                <span
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-[12.5px] leading-snug",
                    turn.who === "agent" ? "rounded-tl-sm bg-violet-soft text-foreground" : "rounded-tr-sm bg-muted text-foreground",
                  )}
                >
                  {t(turn.text)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* extracted action items */}
        <footer className="border-t border-border px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <Icon name="list-checks" className="h-3 w-3 text-violet" />
            {lang === "tr" ? "Çıkarılan eylemler" : "Extracted action items"}
          </p>
          <ul className="space-y-1.5">
            {call.actions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-[12px]">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{ background: "color-mix(in oklch, var(--color-booked) 16%, transparent)" }}>
                  <Icon name="check" className="h-2.5 w-2.5" style={{ color: "var(--color-booked)" }} />
                </span>
                <span className="text-foreground/90">{t(a)}</span>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
