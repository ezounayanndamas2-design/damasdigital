"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/config";

/* ---------- helpers ---------- */
const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? "").trim().slice(0, max);
const int = (f: FormData, k: string) => Math.max(0, Math.round(Number(String(f.get(k) ?? "0").replace(/[^\d]/g, "")) || 0));
const lines = (f: FormData, k: string) => str(f, k, 8000).split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean).slice(0, 40);
const bool = (f: FormData, k: string) => f.get(k) === "on";
const slugify = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "pack";

async function admin() {
  if (!hasSupabase) throw new Error("Base de données non configurée.");
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/connexion");
  const { data: ok } = await sb.rpc("is_admin");
  if (!ok) throw new Error("Accès réservé à l’administrateur.");
  return sb;
}
function refresh(path: string) {
  revalidateTag("site");
  revalidatePath("/", "layout");
  revalidatePath(path);
}
function fail(path: string, e: { message: string } | null) {
  if (e) redirect(`${path}?erreur=${encodeURIComponent(e.message)}`);
}

/* ---------- connexion ---------- */
export async function signIn(_: unknown, f: FormData) {
  if (!hasSupabase) return { error: "La base de données n’est pas encore connectée (variables Supabase manquantes)." };
  const sb = await supabaseServer();
  const { error } = await sb.auth.signInWithPassword({ email: str(f, "email", 200), password: String(f.get("password") ?? "") });
  if (error) return { error: "E-mail ou mot de passe incorrect." };
  redirect("/admin");
}
export async function signOut() {
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/admin/connexion");
}

/* ---------- demandes ---------- */
export async function updateDemande(f: FormData) {
  const sb = await admin();
  const id = str(f, "id", 40);
  const { error } = await sb.from("demandes").update({ status: str(f, "status", 20), notes: str(f, "notes", 2000), updated_at: new Date().toISOString() }).eq("id", id);
  fail("/admin/demandes", error);
  revalidatePath("/admin/demandes"); revalidatePath("/admin");
}
export async function deleteDemande(f: FormData) {
  const sb = await admin();
  const { error } = await sb.from("demandes").delete().eq("id", str(f, "id", 40));
  fail("/admin/demandes", error);
  revalidatePath("/admin/demandes"); revalidatePath("/admin");
}

/* ---------- packs ---------- */
export async function savePack(f: FormData) {
  const sb = await admin();
  const id = str(f, "id", 40);
  const name = str(f, "name", 60);
  const row = {
    name, slug: slugify(str(f, "slug", 60) || name), price: int(f, "price"), period: str(f, "period", 20) || "mois",
    level: str(f, "level", 60), tagline: str(f, "tagline", 300), networks: str(f, "networks", 60), contents: str(f, "contents", 60),
    items: lines(f, "items"), audience: lines(f, "audience"), is_featured: bool(f, "is_featured"), is_active: bool(f, "is_active"),
    position: int(f, "position"), updated_at: new Date().toISOString(),
  };
  if (!name) redirect(`/admin/packs/${id || "nouveau"}?erreur=${encodeURIComponent("Le nom du pack est obligatoire.")}`);
  if (row.is_featured) await sb.from("packs").update({ is_featured: false }).neq("id", id || "00000000-0000-0000-0000-000000000000");
  const { error } = id ? await sb.from("packs").update(row).eq("id", id) : await sb.from("packs").insert(row);
  fail(`/admin/packs/${id || "nouveau"}`, error);
  refresh("/admin/packs");
  redirect("/admin/packs?ok=1");
}
export async function deletePack(f: FormData) {
  const sb = await admin();
  const { error } = await sb.from("packs").delete().eq("id", str(f, "id", 40));
  fail("/admin/packs", error);
  refresh("/admin/packs");
  redirect("/admin/packs?ok=1");
}
export async function togglePack(f: FormData) {
  const sb = await admin();
  const { error } = await sb.from("packs").update({ is_active: f.get("value") === "1" }).eq("id", str(f, "id", 40));
  fail("/admin/packs", error);
  refresh("/admin/packs");
}

/* ---------- listes simples : prestations, services, FAQ ---------- */
type Table = "extras" | "services" | "faqs";
const PATHS: Record<Table, string> = { extras: "/admin/prestations", services: "/admin/services", faqs: "/admin/faq" };
function rowFor(t: Table, f: FormData) {
  const base = { is_active: bool(f, "is_active"), position: int(f, "position") };
  if (t === "extras") return { ...base, name: str(f, "name", 160), price_label: str(f, "price_label", 120) };
  if (t === "services") return { ...base, name: str(f, "name", 120), description: str(f, "description", 400), icon: str(f, "icon", 2) || "cm", points: lines(f, "points") };
  return { ...base, question: str(f, "question", 300), answer: str(f, "answer", 3000) };
}
export async function saveRow(f: FormData) {
  const sb = await admin();
  const t = str(f, "table", 20) as Table;
  if (!(t in PATHS)) return;
  const id = str(f, "id", 40);
  const row = rowFor(t, f);
  const { error } = id ? await sb.from(t).update(row).eq("id", id) : await sb.from(t).insert(row);
  fail(PATHS[t], error);
  refresh(PATHS[t]);
  redirect(`${PATHS[t]}?ok=1`);
}
export async function deleteRow(f: FormData) {
  const sb = await admin();
  const t = str(f, "table", 20) as Table;
  if (!(t in PATHS)) return;
  const { error } = await sb.from(t).delete().eq("id", str(f, "id", 40));
  fail(PATHS[t], error);
  refresh(PATHS[t]);
  redirect(`${PATHS[t]}?ok=1`);
}

/* ---------- paramètres ---------- */
export async function saveSettings(f: FormData) {
  const sb = await admin();
  const keys = ["brand_name", "slogan", "hero_title", "hero_accent", "hero_text", "hero_punch", "stat1_label", "stat2_label", "founder_name", "founder_role", "founder_bio", "about_text", "facebook", "instagram", "tiktok", "email"];
  const row: Record<string, string | number> = { updated_at: new Date().toISOString() };
  keys.forEach((k) => (row[k] = str(f, k, 1200)));
  row.whatsapp = str(f, "whatsapp", 30).replace(/\D/g, "");
  row.stat1_value = int(f, "stat1_value");
  row.stat2_value = int(f, "stat2_value");
  if (String(row.whatsapp).length < 8) redirect(`/admin/parametres?erreur=${encodeURIComponent("Numéro WhatsApp invalide : indiquez l’indicatif, par ex. 242068522857.")}`);
  const { error } = await sb.from("settings").update(row).eq("id", 1);
  fail("/admin/parametres", error);
  refresh("/admin/parametres");
  redirect("/admin/parametres?ok=1");
}

/* ---------- mon compte ---------- */
export async function changePassword(_: unknown, f: FormData) {
  const sb = await admin();
  const p1 = String(f.get("password") ?? ""), p2 = String(f.get("confirm") ?? "");
  if (p1.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  if (p1 !== p2) return { error: "Les deux mots de passe ne sont pas identiques." };
  const { error } = await sb.auth.updateUser({ password: p1 });
  if (error) return { error: "Impossible de changer le mot de passe : " + error.message };
  return { ok: true };
}
