import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase/config";
import { supabasePublic } from "@/lib/supabase/public";

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");

/** Enregistre une demande d'accompagnement (visible dans l'admin > Demandes). */
export async function POST(req: Request) {
  if (!hasSupabase) return NextResponse.json({ ok: false, reason: "database-not-configured" }, { status: 503 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const row = {
    pack_id: /^[0-9a-f-]{36}$/i.test(String(b.pack_id)) ? String(b.pack_id) : null,
    pack_name: clip(b.pack_name, 80),
    pack_price: Math.max(0, Math.min(100_000_000, Math.round(Number(b.pack_price) || 0))),
    extras: Array.isArray(b.extras) ? b.extras.slice(0, 20).map((x) => clip(x, 160)).filter(Boolean) : [],
    name: clip(b.name, 120),
    country: clip(b.country, 60),
    phone: clip(b.phone, 30),
  };
  if (!row.pack_name || row.name.length < 2 || row.phone.replace(/\D/g, "").length < 6) return NextResponse.json({ ok: false }, { status: 422 });
  const { error } = await supabasePublic().from("demandes").insert(row);
  if (error) { console.error("Demande non enregistrée :", error.message); return NextResponse.json({ ok: false }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
