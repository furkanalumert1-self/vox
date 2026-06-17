"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/i18n/language-provider";
import { cn } from "@/lib/utils";

/** Footer status bar: "● Live | V1.0 | 2 active calls" + Recording toggle + links. */
export function StatusBar() {
  const { lang } = useLang();
  const [recording, setRecording] = useState(true);

  return (
    <footer className="z-20 flex h-9 shrink-0 items-center gap-3 border-t border-border bg-background/90 px-3 font-mono text-[11px] text-muted-foreground backdrop-blur sm:px-4">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full pulse-dot" style={{ background: "var(--color-booked)" }} />
        <span style={{ color: "var(--color-booked)" }}>{lang === "tr" ? "Çalışıyor" : "Live"}</span>
      </span>
      <span className="text-border">|</span>
      <span>V1.0</span>
      <span className="text-border">|</span>
      <span className="inline-flex items-center gap-1 tabular-nums">
        <span className="text-violet">2</span> {lang === "tr" ? "aktif arama" : "active calls"}
      </span>
      <span className="text-border hidden sm:inline">|</span>
      <span className="hidden tabular-nums sm:inline">{lang === "tr" ? "Gecikme" : "Latency"} 612ms</span>

      <div className="ml-auto flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          {lang === "tr" ? "Kayıt" : "Recording"}
          <button
            onClick={() => setRecording((p) => !p)}
            aria-pressed={recording}
            className={cn("relative h-4 w-7 rounded-full transition-colors", recording ? "bg-violet/40" : "bg-muted")}
          >
            <span
              className={cn(
                "absolute top-0.5 h-3 w-3 rounded-full bg-foreground transition-all",
                recording ? "left-[14px] bg-violet" : "left-0.5",
              )}
            />
          </button>
        </span>
        <Link href="/" className="hidden transition-colors hover:text-foreground sm:inline">{lang === "tr" ? "Şartlar" : "Terms"}</Link>
        <Link href="/" className="hidden transition-colors hover:text-foreground sm:inline">{lang === "tr" ? "Gizlilik" : "Privacy"}</Link>
        <span className="hidden items-center gap-2 sm:flex">
          {["X", "TG", "GH"].map((s) => (
            <button key={s} className="grid h-5 w-5 place-items-center rounded border border-border text-[9px] font-semibold transition-colors hover:border-violet/50 hover:text-foreground">{s}</button>
          ))}
        </span>
      </div>
    </footer>
  );
}
