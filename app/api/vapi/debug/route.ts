import { NextResponse } from "next/server";

export async function GET() {
  const vapiKey = process.env.VAPI_API_KEY;
  if (!vapiKey) return NextResponse.json({ error: "VAPI_API_KEY not set" });

  try {
    // Test 1: list assistants
    const listRes = await fetch("https://api.vapi.ai/assistant?limit=5", {
      headers: { Authorization: `Bearer ${vapiKey}` },
    });
    const listData = await listRes.json();

    // Test 2: create a minimal test assistant
    const createRes = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: { Authorization: `Bearer ${vapiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "__debug_test__",
        firstMessage: "Test",
        model: { provider: "openai", model: "gpt-4o-mini", messages: [{ role: "system", content: "Test" }] },
        voice: { provider: "11labs", voiceId: "21m00Tcm4TlvDq8ikWAM" },
        transcriber: { provider: "deepgram", model: "nova-2", language: "tr" },
      }),
    });
    const createData = await createRes.json();

    return NextResponse.json({
      list_status: listRes.status,
      list_count: Array.isArray(listData) ? listData.length : listData,
      create_status: createRes.status,
      create_result: createData,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
