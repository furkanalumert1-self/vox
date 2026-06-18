"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Waveform } from "@/components/app/waveform";
import { useLang } from "@/components/i18n/language-provider";
import { VOICES, BUILDER_ACTIONS, type Agent } from "@/lib/demo/data";
import { useLiveAgents } from "@/lib/hooks/use-live-data";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const { lang, t } = useLang();
  const { agents, saveAgent, createAgent } = useLiveAgents();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [voice, setVoice] = useState<string>(VOICES[0]);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const greetingRef = useRef<HTMLTextAreaElement>(null);

  const selected = agents.find((a) => a.id === selectedId) ?? agents[0];

  const L = {
    title: lang === "tr" ? "Sesli ajanlar" : "Voice agents",
    sub: lang === "tr" ? "Telefonu kimin açtığını, nasıl konuştuğunu ve ne yaptığını yönet." : "Manage who answers, how they sound, and what they do.",
    newAgent: lang === "tr" ? "Yeni ajan" : "New agent",
    callsToday: lang === "tr" ? "bugün arama" : "calls today",
    active: lang === "tr" ? "Aktif" : "Active",
    paused: lang === "tr" ? "Duraklatıldı" : "Paused",
    greeting: lang === "tr" ? "Karşılama" : "Greeting prompt",
    voice: lang === "tr" ? "Ses" : "Voice",
    actions: lang === "tr" ? "Eylemler" : "Actions",
    preview: lang === "tr" ? "Sesi önizle" : "Preview voice",
    save: lang === "tr" ? "Değişiklikleri kaydet" : "Save changes",
  };

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    await saveAgent(selected.id, {
      voice,
      greeting: { tr: greetingRef.current?.value ?? "", en: greetingRef.current?.value ?? "" },
      active: selected.active,
    });
    setSaving(false);
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-4 p-3 sm:p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[20px] font-bold tracking-tight">{L.title}</h1>
          <p className="text-[13px] text-muted-foreground">{L.sub}</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}
        >
          <Icon name="plus" className="h-4 w-4" />
          {L.newAgent}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* agents list */}
        <div className="grid gap-3 sm:grid-cols-2">
          {agents.map((a) => (
            <button
              key={a.id}
              onClick={() => { setSelectedId(a.id); setVoice(a.voice); }}
              className={cn(
                "rounded-lg border bg-card/30 p-3 text-left transition-colors",
                (selected?.id === a.id) ? "border-violet/50 shadow-soft" : "border-border hover:border-violet/30",
              )}
            >
              <div className="flex items-start gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-violet-soft text-violet">
                  <Icon name="bot" className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold leading-tight">{a.name}</p>
                  <p className="truncate font-mono text-[10.5px] text-muted-foreground">{a.voice}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[9.5px] font-semibold"
                  style={{
                    color: a.active ? "var(--color-booked)" : "var(--color-muted-foreground)",
                    background: a.active ? "color-mix(in oklch, var(--color-booked) 14%, transparent)" : "var(--color-muted)",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.active ? "var(--color-booked)" : "var(--color-muted-foreground)" }} />
                  {a.active ? L.active : L.paused}
                </span>
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-muted-foreground">{t(a.purpose)}</p>
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
                <span className="font-mono text-[11px] tabular-nums">
                  <span className="font-semibold text-foreground">{a.callsToday}</span>{" "}
                  <span className="text-muted-foreground">{L.callsToday}</span>
                </span>
                <span
                  role="switch"
                  aria-checked={a.active}
                  onClick={(e) => { e.stopPropagation(); saveAgent(a.id, { active: !a.active }); }}
                  className={cn("relative h-4 w-7 cursor-pointer rounded-full transition-colors", a.active ? "bg-violet/40" : "bg-muted")}
                >
                  <span className={cn("absolute top-0.5 h-3 w-3 rounded-full transition-all", a.active ? "left-[14px] bg-violet" : "left-0.5 bg-foreground/60")} />
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* agent-builder detail */}
        {selected && (
          <aside className="rounded-lg border border-border bg-card/30">
            <header className="flex items-center justify-between border-b border-border px-3 py-2.5">
              <h2 className="flex items-center gap-1.5 text-[13px] font-semibold">
                <Icon name="sliders-horizontal" className="h-3.5 w-3.5 text-violet" />
                {selected.name}
              </h2>
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Düzenle" : "Edit"}</span>
            </header>
            <div className="space-y-3.5 p-3">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{L.greeting}</label>
                <textarea
                  key={selected.id}
                  ref={greetingRef}
                  defaultValue={t(selected.greeting)}
                  rows={3}
                  className="mt-1 w-full resize-none rounded-md border border-border bg-background/60 px-2.5 py-2 text-[12.5px] leading-snug text-foreground outline-none focus:border-violet/60"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{L.voice}</label>
                <div className="mt-1.5 space-y-1">
                  {VOICES.map((v) => (
                    <button
                      key={v}
                      onClick={() => setVoice(v)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left font-mono text-[11px] transition-colors",
                        voice === v ? "border-violet/50 bg-violet-soft text-violet" : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon name="audio-lines" className="h-3.5 w-3.5" />
                      {v}
                      {voice === v && <Icon name="check" className="ml-auto h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* voice preview */}
              <div className="rounded-md border border-border bg-background/60 p-2.5">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setPreviewPlaying((p) => !p)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                    style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}
                  >
                    <Icon name={previewPlaying ? "pause" : "play"} className="h-3.5 w-3.5" />
                  </button>
                  <Waveform data={[0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.3, 0.7, 0.5, 0.9, 0.4, 0.6, 0.8, 0.5]} animated playing={previewPlaying} width={220} height={26} className="flex-1" />
                </div>
                <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">{L.preview} · {voice.split(" · ")[0]}</p>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{L.actions}</label>
                <ul className="mt-1.5 space-y-1.5">
                  {BUILDER_ACTIONS.map((a) => (
                    <li key={a.id} className="flex items-center gap-2">
                      <Icon name="zap" className="h-3 w-3 text-violet" />
                      <span className="text-[12px]">{t(a.label)}</span>
                      <span
                        className={cn("relative ml-auto h-4 w-7 rounded-full", a.on ? "bg-violet/40" : "bg-muted")}
                      >
                        <span className={cn("absolute top-0.5 h-3 w-3 rounded-full", a.on ? "left-[14px] bg-violet" : "left-0.5 bg-foreground/60")} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={saving}
                onClick={handleSave}
                className="flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[12.5px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}
              >
                <Icon name={saving ? "loader-circle" : "save"} className={cn("h-3.5 w-3.5", saving && "animate-spin")} />
                {saving ? (lang === "tr" ? "Kaydediliyor…" : "Saving…") : L.save}
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* New Agent Modal */}
      {showNew && <NewAgentModal lang={lang} onClose={() => setShowNew(false)} onCreate={async (fields) => { await createAgent(fields); setShowNew(false); }} />}
    </div>
  );
}

function NewAgentModal({
  lang,
  onClose,
  onCreate,
}: {
  lang: "tr" | "en";
  onClose: () => void;
  onCreate: (fields: { name: string; greeting: string; voice: string }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [voice, setVoice] = useState(VOICES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim()) { setError(lang === "tr" ? "Ad gerekli" : "Name is required"); return; }
    if (!greeting.trim()) { setError(lang === "tr" ? "Karşılama metni gerekli" : "Greeting is required"); return; }
    setLoading(true);
    setError("");
    try {
      await onCreate({ name: name.trim(), greeting: greeting.trim(), voice });
    } catch {
      setError(lang === "tr" ? "Ajan oluşturulamadı" : "Failed to create agent");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-xl border border-border bg-popover p-5 shadow-pop">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[15px] font-bold">{lang === "tr" ? "Yeni ajan oluştur" : "Create new agent"}</h2>
          <button onClick={onClose} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted">
            <Icon name="x" className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Ajan adı" : "Agent name"}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === "tr" ? "ör. Randevu Asistanı" : "e.g. Appointment Assistant"}
              className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-2 text-[12.5px] text-foreground outline-none focus:border-violet/60"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Karşılama metni" : "Greeting prompt"}</label>
            <textarea
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              rows={3}
              placeholder={lang === "tr" ? "ör. Kliniğimize hoş geldiniz, size nasıl yardımcı olabilirim?" : "e.g. Thanks for calling, how can I help you today?"}
              className="mt-1 w-full resize-none rounded-md border border-border bg-background/60 px-2.5 py-2 text-[12.5px] leading-snug text-foreground outline-none focus:border-violet/60"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{lang === "tr" ? "Ses" : "Voice"}</label>
            <div className="mt-1.5 space-y-1">
              {VOICES.map((v) => (
                <button
                  key={v}
                  onClick={() => setVoice(v)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left font-mono text-[11px] transition-colors",
                    voice === v ? "border-violet/50 bg-violet-soft text-violet" : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon name="audio-lines" className="h-3.5 w-3.5" />
                  {v}
                  {voice === v && <Icon name="check" className="ml-auto h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[11.5px] text-red-400">{error}</p>}

          <button
            disabled={loading}
            onClick={submit}
            className="flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--color-violet)", color: "var(--color-primary-foreground)" }}
          >
            <Icon name={loading ? "loader-circle" : "plus"} className={cn("h-4 w-4", loading && "animate-spin")} />
            {loading ? (lang === "tr" ? "Oluşturuluyor…" : "Creating…") : (lang === "tr" ? "Ajan oluştur" : "Create agent")}
          </button>
        </div>
      </div>
    </div>
  );
}
