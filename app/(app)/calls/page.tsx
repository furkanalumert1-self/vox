"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Waveform } from "@/components/app/waveform";
import { useLang } from "@/components/i18n/language-provider";
import {
  AGENTS,
  outcomes as demoOutcomes,
  OUTCOME_LABEL,
  OUTCOME_TINT,
  SENTIMENT_LABEL,
  type CallRow,
  type Outcome,
} from "@/lib/demo/data";
import { useLiveCalls } from "@/lib/hooks/use-live-data";
import { cn } from "@/lib/utils";

const SENTIMENT_TINT: Record<string, string> = {
  positive: "var(--color-booked)",
  neutral: "var(--color-muted-foreground)",
  negative: "var(--color-missed)",
};

const OUTCOME_KEYS: Outcome[] = ["booked", "resolved", "transferred", "voicemail", "missed"];

export default function CallsPage() {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState<Outcome | "all">("all");
  const [query, setQuery] = useState("");
  const { calls: CALLS } = useLiveCalls();
  const outcomes = demoOutcomes;
  const [openCall, setOpenCall] = useState<CallRow | null>(null);

  const agentName = (id: string) => AGENTS.find((a) => a.id === id)?.name ?? "—";

  const rows = useMemo(() => {
    let r = CALLS;
    if (filter !== "all") r = r.filter((c) => c.outcome === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter((c) => c.caller.toLowerCase().includes(q) || c.number.includes(q));
    }
    return r;
  }, [filter, query]);

  const L = {
    title: lang === "tr" ? "Aramalar" : "Calls",
    sub: lang === "tr" ? "Her aramanın kaydı, transkripti ve sonucu." : "A log, transcript and outcome for every call.",
    all: lang === "tr" ? "Tümü" : "All",
    search: lang === "tr" ? "Arayan veya numara ara…" : "Search caller or number…",
    caller: lang === "tr" ? "Arayan" : "Caller",
    agent: lang === "tr" ? "Ajan" : "Agent",
    time: lang === "tr" ? "Saat" : "Time",
    duration: lang === "tr" ? "Süre" : "Duration",
    outcome: lang === "tr" ? "Sonuç" : "Outcome",
    empty: lang === "tr" ? "Eşleşen arama yok." : "No matching calls.",
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 p-3 sm:p-4">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[20px] font-bold tracking-tight">{L.title}</h1>
          <p className="text-[13px] text-muted-foreground">{L.sub}</p>
        </div>
        <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[13px] text-muted-foreground">
          <Icon name="search" className="h-3.5 w-3.5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={L.search}
            className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* outcome stat chips */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {OUTCOME_KEYS.map((k) => {
          const stat = outcomes.find((o) => o.key === k);
          return (
            <button
              key={k}
              onClick={() => setFilter((f) => (f === k ? "all" : k))}
              className={cn(
                "rounded-lg border bg-card/30 px-3 py-2.5 text-left transition-colors",
                filter === k ? "border-violet/50" : "border-border hover:border-border",
              )}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: OUTCOME_TINT[k] }} />
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t(OUTCOME_LABEL[k])}</span>
              </span>
              <p className="mt-1 font-mono text-[18px] font-semibold tabular-nums">{stat?.value ?? 0}</p>
            </button>
          );
        })}
      </div>

      {/* filter row */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Filtre" : "Filter"}:</span>
        <button
          onClick={() => setFilter("all")}
          className={cn("rounded-md px-2 py-1 text-[11.5px] font-medium transition-colors", filter === "all" ? "bg-violet-soft text-violet" : "text-muted-foreground hover:text-foreground")}
        >
          {L.all}
        </button>
        {OUTCOME_KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn("rounded-md px-2 py-1 text-[11.5px] font-medium transition-colors", filter === k ? "bg-violet-soft text-violet" : "text-muted-foreground hover:text-foreground")}
          >
            {t(OUTCOME_LABEL[k])}
          </button>
        ))}
      </div>

      {/* table */}
      <section className="rounded-lg border border-border bg-card/30">
        <div className="hidden grid-cols-[1.6fr_0.9fr_0.7fr_0.8fr_1fr_0.8fr] gap-2 border-b border-border px-3 py-2 font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground md:grid">
          <span>{L.caller}</span>
          <span>{L.agent}</span>
          <span>{L.time}</span>
          <span>{L.duration}</span>
          <span>{L.outcome}</span>
          <span className="text-right">{t(SENTIMENT_LABEL.neutral).slice(0, 0)}{lang === "tr" ? "Duygu" : "Sentiment"}</span>
        </div>
        {rows.length === 0 ? (
          <div className="grid place-items-center py-16 text-[13px] text-muted-foreground">{L.empty}</div>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setOpenCall(c)}
                  className="grid w-full grid-cols-[1.6fr_0.9fr_0.7fr_0.8fr_1fr_0.8fr] items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-card/70"
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
                  <span className="truncate font-mono text-[11px] text-muted-foreground">{agentName(c.agentId)}</span>
                  <span className="font-mono text-[12px] tabular-nums text-muted-foreground">{c.time}</span>
                  <div className="flex items-center gap-2">
                    <Waveform data={c.wave} width={32} height={16} color="var(--color-muted-foreground)" className="hidden lg:block" />
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
        )}
      </section>

      {openCall && <TranscriptDrawer call={openCall} onClose={() => setOpenCall(null)} lang={lang} t={t} agentName={agentName(openCall.agentId)} />}
    </div>
  );
}

/* shared with dashboard's drawer pattern */
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
            {lang === "tr" ? "Ajan" : "Agent"}: <span className="text-violet">{agentName}</span> · {t(call.summary)}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Transkript" : "Transcript"}</p>
          <ul className="space-y-3">
            {call.transcript.map((turn, i) => (
              <li key={i} className={cn("flex flex-col", turn.who === "agent" ? "items-start" : "items-end")}>
                <span className="mb-0.5 flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                  {turn.who === "agent" ? <Icon name="bot" className="h-2.5 w-2.5 text-violet" /> : <Icon name="user" className="h-2.5 w-2.5" />}
                  {turn.who === "agent" ? "Vox" : (lang === "tr" ? "Arayan" : "Caller")} · {fmt(turn.at)}
                </span>
                <span className={cn("max-w-[85%] rounded-xl px-3 py-2 text-[12.5px] leading-snug", turn.who === "agent" ? "rounded-tl-sm bg-violet-soft text-foreground" : "rounded-tr-sm bg-muted text-foreground")}>
                  {t(turn.text)}
                </span>
              </li>
            ))}
          </ul>
        </div>

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
