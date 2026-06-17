import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { CALLS } from "@/lib/demo/data";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ calls: CALLS, source: "demo" });
  }

  try {
    const db = createServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (db.from("calls") as any)
      .select("*")
      .order("started_at", { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ calls: CALLS, source: "demo" });
    }

    return NextResponse.json({ calls: data, source: "live" });
  } catch {
    return NextResponse.json({ calls: CALLS, source: "demo" });
  }
}
