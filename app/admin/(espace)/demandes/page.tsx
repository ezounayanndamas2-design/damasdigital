import { supabaseServer } from "@/lib/supabase/server";
import { fcfa } from "@/lib/format";
import { STATUS_LABEL, type Demande, type DemandeStatus } from "@/lib/types";
import { deleteDemande, updateDemande } from "../../actions";
import Flash from "../Flash";

const ORDER: DemandeStatus[] = ["nouvelle", "contactee", "payee", "active", "annulee"];

export default async function Demandes({ searchParams }: { searchParams: Promise<{ statut?: string; q?: string; erreur?: string }> }) {
  const sp = await searchParams;
  const sb = await supabaseServer();
  let q = sb.from("demandes").select("*").order("created_at", { ascending: false }).limit(500);
  if (sp.statut && ORDER.includes(sp.statut as DemandeStatus)) q = q.eq("status", sp.statut);
  if (sp.q) q = q.or(`name.ilike.%${sp.q.replace(/[%,()]/g, "")}%,phone.ilike.%${sp.q.replace(/[%,()]/g, "")}%`);
  const { data } = await q;
  const rows = (data ?? []) as Demande[];
  return (
    <>
      <div className="ad-head"><div><h1>Demandes</h1><p>Chaque clic sur « Continuer sur WhatsApp » crée une demande ici. Mettez son statut à jour au fil de l’échange.</p></div>
        <form className="f" style={{ minWidth: 240 }}><input name="q" defaultValue={sp.q} placeholder="Rechercher un nom ou un numéro" /></form></div>
      <Flash sp={sp} />
      <div className="filters">
        <a href="/admin/demandes" className={!sp.statut ? "on" : ""}>Toutes</a>
        {ORDER.map((s) => <a key={s} href={`/admin/demandes?statut=${s}`} className={sp.statut === s ? "on" : ""}>{STATUS_LABEL[s]}</a>)}
      </div>
      {!rows.length && <div className="card empty">Aucune demande {sp.statut ? `« ${STATUS_LABEL[sp.statut as DemandeStatus]} »` : ""} pour l’instant.</div>}
      {rows.map((d) => {
        const wa = `https://wa.me/${d.phone.replace(/\D/g, "")}`;
        return (
          <div className="card dem" key={d.id}>
            <div>
              <h3>{d.name} <span className={`st st-${d.status}`} style={{ marginLeft: 6 }}>{STATUS_LABEL[d.status]}</span></h3>
              <div className="meta">{new Date(d.created_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })} · {d.country || "Pays non précisé"}</div>
              <div className="actions" style={{ marginTop: 10 }}><a className="btn btn-primary btn-sm" href={wa} target="_blank" rel="noopener">Écrire sur WhatsApp</a><span style={{ color: "var(--mute-d)", fontSize: ".88rem" }}>{d.phone}</span></div>
            </div>
            <div>
              <div className="lab">Pack demandé</div>
              <div style={{ fontWeight: 700, marginTop: 2 }}>{d.pack_name} · {fcfa(d.pack_price)}</div>
              {d.extras.length > 0 && <><div className="lab" style={{ marginTop: 10 }}>Prestations supplémentaires</div><ul>{d.extras.map((x) => <li key={x}>{x}</li>)}</ul></>}
            </div>
            <form action={updateDemande} className="form" style={{ gap: 10 }}>
              <input type="hidden" name="id" value={d.id} />
              <div className="f"><label htmlFor={`s-${d.id}`}>Statut</label><select id={`s-${d.id}`} name="status" defaultValue={d.status}>{ORDER.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></div>
              <div className="f"><label htmlFor={`n-${d.id}`}>Notes</label><textarea id={`n-${d.id}`} name="notes" defaultValue={d.notes} rows={2} placeholder="Ex. paiement prévu vendredi" style={{ minHeight: 60 }} /></div>
              <div className="actions"><button className="btn btn-primary btn-sm">Enregistrer</button><button formAction={deleteDemande} className="btn btn-danger btn-sm">Supprimer</button></div>
            </form>
          </div>
        );
      })}
    </>
  );
}
