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
    const dbUpdates: Record<string, unknown> = {};
    if ("active" in updates) dbUpdates.is_active = updates.active;
    if ("voice" in updates) dbUpdates.voice = updates.voice;
    if ("name" in updates) dbUpdates.name = updates.name;
    if ("greeting" in updates) {
      const g = updates.greeting;
      dbUpdates.greeting = g && typeof g === "object" ? (g as { en: string }).en : String(g ?? "");
    }
    await fetch("/api/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...dbUpdates }),
    });
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }

  async function createAgent(fields: { name: string; greeting: string; voice: string }) {
    const res = await fetch("/api/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    const d = await res.json();
    if (d.agent) {
      const a = d.agent;
      setAgents((prev) => [...prev, {
        id: String(a.id),
        name: a.name,
        voice: a.voice,
        purpose: { tr: (a.greeting ?? "").slice(0, 60), en: (a.greeting ?? "").slice(0, 60) },
        greeting: { tr: a.greeting ?? "", en: a.greeting ?? "" },
        callsToday: 0,
        active: a.is_active ?? true,
        actions: [],
      }]);
    }
    return d;
  }

  return { agents, source, saveAgent, createAgent };
}

export function useLiveStats() {
  return { kpis, callVolume, outcomes, minutes, source: "demo" as const };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTranscript(raw: unknown): any[] {
  if (!Array.isArray(raw)) return [];
  return (raw as Record<string, unknown>[]).map((turn) => ({
    side: (turn.role === "agent" || turn.role === "assistant") ? "agent" : "caller",
    text: { tr: String(turn.content ?? turn.text ?? ""), en: String(turn.content ?? turn.text ?? "") },
  }));
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
    transcript: mapTranscript(c.transcript),
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
