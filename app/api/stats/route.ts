import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { CALLS, callVolume, outcomes, minutes } from "@/lib/demo/data";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ kpis: buildDemoKpis(), callVolume, outcomes, minutes, source: "demo" });
  }

  try {
    const db = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: calls, error } = await (db.from("calls") as any).select("*") as { data: any[] | null; error: unknown };

    if (error || !calls || calls.length === 0) {
      return NextResponse.json({ kpis: buildDemoKpis(), callVolume, outcomes, minutes, source: "demo" });
    }

    const total = calls.length;
    const answered = calls.filter((c) => c.outcome !== "missed" && c.outcome !== "voicemail").length;
    const booked = calls.filter((c) => c.outcome === "booked").length;
    const durations = calls.filter((c) => c.duration_s).map((c) => c.duration_s as number);
    const avgDuration = durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;
    const totalMinutes = Math.round(durations.reduce((a, b) => a + b, 0) / 60);

    const outcomeMap: Record<string, number> = { booked: 0, resolved: 0, transferred: 0, voicemail: 0, missed: 0 };
    for (const c of calls) if (c.outcome && outcomeMap[c.outcome] !== undefined) outcomeMap[c.outcome]++;
    const outcomeTotal = Object.values(outcomeMap).reduce((a, b) => a + b, 0) || 1;

    const liveOutcomes = Object.entries(outcomeMap).map(([key, val]) => ({
      key,
      label: { tr: key, en: key },
      pct: Math.round((val / outcomeTotal) * 100),
      color: outcomeColor(key),
    }));

    const hourMap: Record<number, number> = {};
    for (const c of calls) {
      const h = new Date(c.started_at).getHours();
      hourMap[h] = (hourMap[h] ?? 0) + 1;
    }
    const liveVolume = Array.from({ length: 12 }, (_, i) => ({
      label: `${8 + i}:00`,
      value: hourMap[8 + i] ?? 0,
    }));

    return NextResponse.json({
      kpis: [
        { label: { tr: "Toplam arama", en: "Calls handled" }, value: String(answered), delta: "+live", hint: { tr: "Canlı veri", en: "Live data" } },
        { label: { tr: "Ort. süre", en: "Avg duration" }, value: `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`, delta: "", hint: { tr: "Dakika:saniye", en: "Min:sec" } },
        { label: { tr: "Randevu/nitelendirme", en: "Booked/qualified" }, value: String(booked), delta: "", hint: { tr: "Gerçek rezervasyon", en: "Real bookings" } },
        { label: { tr: "Toplam dakika", en: "Minutes used" }, value: `${totalMinutes}`, delta: "", hint: { tr: "Bu ay", en: "This month" } },
      ],
      callVolume: liveVolume,
      outcomes: liveOutcomes,
      minutes: { used: totalMinutes, cap: 2000 },
      source: "live",
      total,
    });
  } catch {
    return NextResponse.json({ kpis: buildDemoKpis(), callVolume, outcomes, minutes, source: "demo" });
  }
}

function outcomeColor(key: string) {
  const map: Record<string, string> = {
    booked: "var(--color-violet)",
    resolved: "#22d3ee",
    transferred: "#f59e0b",
    voicemail: "#6b7280",
    missed: "#ef4444",
  };
  return map[key] ?? "#6b7280";
}

function buildDemoKpis() {
  return CALLS.length > 0
    ? [
        { label: { tr: "Toplam arama", en: "Calls handled" }, value: String(CALLS.length), delta: "+demo", hint: { tr: "Demo veri", en: "Demo data" } },
        { label: { tr: "Ort. süre", en: "Avg duration" }, value: "2m 14s", delta: "", hint: { tr: "Demo", en: "Demo" } },
        { label: { tr: "Randevu/nitelendirme", en: "Booked/qualified" }, value: "3", delta: "", hint: { tr: "Demo", en: "Demo" } },
        { label: { tr: "Toplam dakika", en: "Minutes used" }, value: "1612", delta: "", hint: { tr: "Demo", en: "Demo" } },
      ]
    : [];
}
