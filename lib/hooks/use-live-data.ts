"use client";

import { useEffect, useState } from "react";
import { CALLS, AGENTS, kpis, callVolume, outcomes, minutes } from "@/lib/demo/data";
import type { CallRow, Agent } from "@/lib/demo/data";

interface Stats {
  kpis: typeof kpis;
  callVolume: typeof callVolume;
  outcomes: typeof outcomes;
  minutes: typeof minutes;
  source: "demo" | "live";
}

export function useLiveCalls() {
  const [calls, setCalls] = useState<CallRow[]>(CALLS);
  const [source, setSource] = useState<"demo" | "live">("demo");

  useEffect(() => {
    fetch("/api/calls")
      .then((r) => r.json())
      .then((d) => {
        if (d.source === "live" && d.calls?.length > 0) {
          setCalls(mapApiCalls(d.calls));
          setSource("live");
        }
      })
      .catch(() => {});
  }, []);

  return { calls, source };
}

export function useLiveAgents() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [source, setSource] = useState<"demo" | "live">("demo");

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((d) => {
        if (d.source === "live" && d.agents?.length > 0) {
          setAgents(mapApiAgents(d.agents));
          setSource("live");
        }
      })
      .catch(() => {});
  }, []);

  async function saveAgent(id: string, updates: Partial<Agent>) {
    await fetch("/api/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }

  return { agents, source, saveAgent };
}

export function useLiveStats() {
  const [stats, setStats] = useState<Stats>({ kpis, callVolume, outcomes, minutes, source: "demo" });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.source === "live") setStats(d);
      })
      .catch(() => {});
  }, []);

  return stats;
}

function mapApiCalls(data: Record<string, unknown>[]): CallRow[] {
  return data.map((c) => ({
    id: String(c.id ?? ""),
    agentId: String(c.agent_id ?? ""),
    agentName: String(c.agent_name ?? "Agent"),
    caller: String(c.caller_name ?? c.caller_number ?? "Unknown"),
    number: String(c.caller_number ?? ""),
    time: c.started_at ? new Date(c.started_at as string).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
    duration: c.duration_s ? `${Math.floor(Number(c.duration_s) / 60)}m ${Number(c.duration_s) % 60}s` : "—",
    outcome: (c.outcome as CallRow["outcome"]) ?? "resolved",
    sentiment: (c.sentiment as CallRow["sentiment"]) ?? "neutral",
    transcript: Array.isArray(c.transcript) ? (c.transcript as CallRow["transcript"]) : [],
    actions: [],
    waveform: Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.1),
    wave: Array.from({ length: 40 }, () => Math.random() * 0.8 + 0.1),
    durationSec: Number(c.duration_s ?? 0),
    recordingUrl: c.recording_url ? String(c.recording_url) : undefined,
    summary: c.summary ? { tr: String(c.summary), en: String(c.summary) } : { tr: "", en: "" },
  }));
}

function mapApiAgents(data: Record<string, unknown>[]): Agent[] {
  const voices = ["Nova", "Atlas", "Sage", "Echo", "Ridge"];
  return data.map((a, i) => ({
    id: String(a.id ?? ""),
    name: String(a.name ?? "Agent"),
    voice: String(a.voice ?? voices[i % voices.length]),
    purpose: { tr: String(a.greeting ?? "").slice(0, 60), en: String(a.greeting ?? "").slice(0, 60) },
    greeting: { tr: String(a.greeting ?? ""), en: String(a.greeting ?? "") },
    callsToday: Number(a.calls_today ?? 0),
    active: Boolean(a.is_active ?? true),
    actions: Array.isArray(a.actions) ? (a.actions as Agent["actions"]) : [],
  }));
}
