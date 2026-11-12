import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasSupabase } from "@/lib/supabase/config";
import { supabaseServer } from "@/lib/supabase/server";
import { signOut } from "../actions";
import Sidebar from "./Sidebar";
import "../admin.css";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!hasSupabase) {
    return <main className="login"><div className="card"><h1 style={{ fontSize: "1.4rem" }}>Base de données non connectée</h1><p style={{ color: "var(--mute-d)", marginTop: 10 }}>Ajoutez les variables NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans Vercel, puis redéployez le site.</p></div></main>;
  }
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) redirect("/admin/connexion");
  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) {
    return <main className="login"><div className="card form"><h1 style={{ fontSize: "1.4rem" }}>Accès refusé</h1><p style={{ color: "var(--mute-d)" }}>Le compte {user.email} n’est pas administrateur. Ajoutez-le dans la table « admins » de Supabase.</p><form action={signOut}><button className="btn btn-ghost">Se déconnecter</button></form></div></main>;
  }
  const { count } = await sb.from("demandes").select("id", { count: "exact", head: true }).eq("status", "nouvelle");
  return (
    <div className="ad">
      <Sidebar fresh={count ?? 0} />
      <div className="ad-main">{children}</div>
    </div>
  );
}
