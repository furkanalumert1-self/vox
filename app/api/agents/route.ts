import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { AGENTS } from "@/lib/demo/data";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ agents: AGENTS, source: "demo" });
  }

  try {
    const db = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db.from("agents") as any)
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ agents: AGENTS, source: "demo" });
    }

    return NextResponse.json({ agents: data, source: "live" });
  } catch {
    return NextResponse.json({ agents: AGENTS, source: "demo" });
  }
}

// Map display voice names to 11labs voice IDs (matching existing Callypso Reception setup)
const VOICE_MAP: Record<string, { provider: string; voiceId: string }> = {
  "nova": { provider: "11labs", voiceId: "21m00Tcm4TlvDq8ikWAM" },
  "atlas": { provider: "11labs", voiceId: "VR6AewLTigWG4xSOukaG" },
  "sage": { provider: "11labs", voiceId: "AZnzlk1XvdvUeBnXmlld" },
  "echo": { provider: "11labs", voiceId: "MF3mGyEYCl7XYWbV9V6O" },
  "ridge": { provider: "11labs", voiceId: "TxGEqnHWrfWFTfGW9XjX" },
};

function vapiVoice(displayVoice: string) {
  const key = displayVoice.split(" · ")[0].toLowerCase();
  return VOICE_MAP[key] ?? VOICE_MAP["nova"];
}

export async function POST(req: Request) {
  const body = await req.json();
  const db = createServerClient();

  const vapiKey = process.env.VAPI_API_KEY;
  let vapiAssistantId: string | null = null;

  if (vapiKey) {
    try {
      // Use directly passed voiceProvider/voiceId if available (from real Vapi voices list)
      const voiceCfg = (body.voiceProvider && body.voiceId)
        ? { provider: body.voiceProvider as string, voiceId: body.voiceId as string }
        : vapiVoice(body.voice || "nova");
      const res = await fetch("https://api.vapi.ai/assistant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vapiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.name,
          voice: { provider: voiceCfg.provider, voiceId: voiceCfg.voiceId },
          firstMessage: body.greeting,
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: `Sen ${body.name} adlı bir AI telefon asistanısın. Arayanları kibarca karşıla ve yardımcı ol.\n\n${body.greeting}` }],
          },
          transcriber: { provider: "deepgram", model: "nova-2", language: "tr" },
        }),
      });
      const vapiData = await res.json();
      if (vapiData.id) {
        vapiAssistantId = vapiData.id;
      } else {
        console.error("Vapi assistant creation failed:", JSON.stringify(vapiData));
      }
    } catch (e) {
      console.error("Vapi fetch error:", e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (db.from("agents") as any).insert({
    name: body.name,
    voice: body.voice || "nova",
    greeting: body.greeting || "",
    actions: body.actions || [],
    is_active: true,
    calls_today: 0,
    vapi_assistant_id: vapiAssistantId,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ agent: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;
  const db = createServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (db.from("agents") as any)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ agent: data });
}
