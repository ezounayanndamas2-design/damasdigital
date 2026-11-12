import { supabaseServer } from "@/lib/supabase/server";
import { fcfa, num } from "@/lib/format";
import { STATUS_LABEL, type Demande } from "@/lib/types";

export default async function Dashboard() {
  const sb = await supabaseServer();
  const [{ data: dem }, { count: packsOn }, { count: extrasOn }] = await Promise.all([
    sb.from("demandes").select("*").order("created_at", { ascending: false }).limit(2000),
    sb.from("packs").select("id", { count: "exact", head: true }).eq("is_active", true),
    sb.from("extras").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);
  const all = (dem ?? []) as Demande[];
  const sold = all.filter((d) => d.status === "payee" || d.status === "active");
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const thisMonth = all.filter((d) => d.created_at >= monthStart);
  const revenue = sold.reduce((s, d) => s + d.pack_price, 0);
  const byPack = Object.entries(all.reduce<Record<string, number>>((m, d) => ((m[d.pack_name] = (m[d.pack_name] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...byPack.map(([, n]) => n));
  const byCountry = Object.entries(all.reduce<Record<string, number>>((m, d) => ((m[d.country || "Non précisé"] = (m[d.country || "Non précisé"] || 0) + 1), m), {})).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxC = Math.max(1, ...byCountry.map(([, n]) => n));
  const conv = all.length ? Math.round((sold.length / all.length) * 100) : 0;

  return (
    <>
      <div className="ad-head"><div><h1>Tableau de bord</h1><p>Vue d’ensemble de vos demandes et de vos ventes.</p></div><a className="btn btn-primary btn-sm" href="/admin/demandes?statut=nouvelle">Traiter les nouvelles demandes</a></div>
      <div className="grid4">
        <div className="card kpi"><small>Demandes reçues</small><b>{num(all.length)}</b><span>dont {num(thisMonth.length)} ce mois-ci</span></div>
        <div className="card kpi"><small>Packs vendus</small><b>{num(sold.length)}</b><span>{conv} % des demandes</span></div>
        <div className="card kpi"><small>Chiffre mensuel des packs vendus</small><b style={{ fontSize: "1.6rem" }}>{fcfa(revenue)}</b><span>statuts « Payée » et « En cours »</span></div>
        <div className="card kpi"><small>Offre en ligne</small><b>{packsOn ?? 0}</b><span>packs actifs · {extrasOn ?? 0} prestations</span></div>
      </div>
      <div className="grid2" style={{ marginTop: 14 }}>
        <div className="card"><h2 style={{ fontSize: "1.05rem" }}>Répartition des demandes par pack</h2>
          {byPack.length ? <div className="bars">{byPack.map(([n, c]) => <div className="bar" key={n}><span>{n}</span><i style={{ width: `${(c / max) * 100}%` }} /><em>{c}</em></div>)}</div> : <p className="empty">Aucune demande pour l’instant.</p>}
        </div>
        <div className="card"><h2 style={{ fontSize: "1.05rem" }}>D’où viennent vos clients</h2>
          {byCountry.length ? <div className="bars">{byCountry.map(([n, c]) => <div className="bar" key={n}><span>{n}</span><i style={{ width: `${(c / maxC) * 100}%` }} /><em>{c}</em></div>)}</div> : <p className="empty">Aucune demande pour l’instant.</p>}
        </div>
      </div>
      <div className="card" style={{ marginTop: 14 }}>
        <h2 style={{ fontSize: "1.05rem", marginBottom: 8 }}>Dernières demandes</h2>
        {all.length ? <div className="scroll"><table className="tbl"><thead><tr><th>Date</th><th>Client</th><th>Pays</th><th>Pack</th><th>Statut</th></tr></thead><tbody>
          {all.slice(0, 8).map((d) => <tr key={d.id}><td>{new Date(d.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td><td>{d.name}<br /><span style={{ color: "var(--mute-d)" }}>{d.phone}</span></td><td>{d.country}</td><td>{d.pack_name}</td><td><span className={`st st-${d.status}`}>{STATUS_LABEL[d.status]}</span></td></tr>)}
        </tbody></table></div> : <p className="empty">Les demandes envoyées depuis le site apparaîtront ici.</p>}
      </div>
    </>
  );
}
