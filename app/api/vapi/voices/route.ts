import { NextResponse } from "next/server";

// Fallback voices when Vapi is unavailable
const FALLBACK_VOICES = [
  { id: "nova-fallback", name: "Nova", description: "warm female", provider: "11labs", voiceId: "21m00Tcm4TlvDq8ikWAM" },
  { id: "atlas-fallback", name: "Atlas", description: "confident male", provider: "11labs", voiceId: "VR6AewLTigWG4xSOukaG" },
  { id: "sage-fallback", name: "Sage", description: "calm neutral", provider: "11labs", voiceId: "AZnzlk1XvdvUeBnXmlld" },
  { id: "echo-fallback", name: "Echo", description: "soft female", provider: "11labs", voiceId: "MF3mGyEYCl7XYWbV9V6O" },
  { id: "ridge-fallback", name: "Ridge", description: "deep male", provider: "11labs", voiceId: "TxGEqnHWrfWFTfGW9XjX" },
];

export async function GET() {
  const vapiKey = process.env.VAPI_API_KEY;
  if (!vapiKey) {
    return NextResponse.json({ voices: FALLBACK_VOICES, source: "fallback" });
  }

  try {
    const res = await fetch("https://api.vapi.ai/voice-library?limit=50", {
      headers: { Authorization: `Bearer ${vapiKey}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ voices: FALLBACK_VOICES, source: "fallback" });
    }

    const raw = await res.json();
    const items: { id: string; name: string; description?: string; providerId?: string; provider?: string; voiceId?: string }[] = Array.isArray(raw) ? raw : (raw.voices ?? raw.results ?? []);

    const voices = items.slice(0, 20).map((v) => ({
      id: v.id,
      name: v.name,
      description: v.description ?? "",
      provider: v.provider ?? v.providerId ?? "11labs",
      voiceId: v.voiceId ?? v.id,
    }));

    return NextResponse.json({ voices: voices.length > 0 ? voices : FALLBACK_VOICES, source: voices.length > 0 ? "live" : "fallback" });
  } catch {
    return NextResponse.json({ voices: FALLBACK_VOICES, source: "fallback" });
  }
}
