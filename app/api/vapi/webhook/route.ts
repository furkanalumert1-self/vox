import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const db = createServerClient();

  const { message } = body;
  if (!message) return NextResponse.json({ ok: true });

  const type = message.type;
  const call = message.call;

  if (!call) return NextResponse.json({ ok: true });

  if (type === "end-of-call-report") {
    const transcript: { role: string; content: string }[] = [];
    for (const msg of message.transcript?.split("\n") ?? []) {
      const aiMatch = msg.match(/^AI: (.+)/);
      const userMatch = msg.match(/^User: (.+)/);
      if (aiMatch) transcript.push({ role: "agent", content: aiMatch[1] });
      else if (userMatch) transcript.push({ role: "caller", content: userMatch[1] });
    }

    const duration = call.endedAt && call.startedAt
      ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
      : null;

    const outcome = detectOutcome(message.summary ?? "");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.from("calls") as any).upsert({
      vapi_call_id: call.id,
      agent_name: call.assistantId ?? null,
      caller_number: call.customer?.number ?? null,
      caller_name: call.customer?.name ?? null,
      started_at: call.startedAt ?? new Date().toISOString(),
      ended_at: call.endedAt ?? null,
      duration_s: duration,
      outcome,
      sentiment: detectSentiment(message.summary ?? ""),
      transcript: transcript.length > 0 ? transcript : message.artifact?.messages ?? null,
      summary: message.summary ?? null,
      recording_url: message.artifact?.recordingUrl ?? null,
    }, { onConflict: "vapi_call_id" });

    // increment calls_today on agent
    if (call.assistantId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: agent } = await (db.from("agents") as any)
        .select("id, calls_today")
        .eq("vapi_assistant_id", call.assistantId)
        .single() as { data: { id: string; calls_today: number } | null };
      if (agent) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (db.from("agents") as any).update({ calls_today: (agent.calls_today ?? 0) + 1 }).eq("id", agent.id);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

function detectOutcome(summary: string): string {
  const s = summary.toLowerCase();
  if (s.includes("book") || s.includes("appoint") || s.includes("schedul")) return "booked";
  if (s.includes("transfer") || s.includes("forward")) return "transferred";
  if (s.includes("voicemail")) return "voicemail";
  if (s.includes("miss") || s.includes("no answer")) return "missed";
  return "resolved";
}

function detectSentiment(summary: string): string {
  const s = summary.toLowerCase();
  if (s.includes("happy") || s.includes("satisfied") || s.includes("great") || s.includes("thank")) return "positive";
  if (s.includes("frustrat") || s.includes("angry") || s.includes("upset") || s.includes("disappoint")) return "negative";
  return "neutral";
}
