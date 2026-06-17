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

export async function POST(req: Request) {
  const body = await req.json();
  const db = createServerClient();

  const vapiKey = process.env.VAPI_API_KEY;
  let vapiAssistantId: string | null = null;

  if (vapiKey) {
    try {
      const res = await fetch("https://api.vapi.ai/assistant", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vapiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.name,
          voice: { provider: "playht", voiceId: body.voice || "nova" },
          firstMessage: body.greeting,
          model: {
            provider: "openai",
            model: "gpt-4o-mini",
            messages: [{ role: "system", content: body.greeting }],
          },
        }),
      });
      const vapiData = await res.json();
      vapiAssistantId = vapiData.id ?? null;
    } catch {
      // Vapi creation failed, continue without it
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
