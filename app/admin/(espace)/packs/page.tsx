import { supabaseServer } from "@/lib/supabase/server";
import { fcfa } from "@/lib/format";
import type { Pack } from "@/lib/types";
import { togglePack } from "../../actions";
import Flash from "../Flash";

export default async function Packs({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const sp = await searchParams;
  const sb = await supabaseServer();
  const { data } = await sb.from("packs").select("*").order("position");
  const packs = (data ?? []) as Pack[];
  return (
    <>
      <div className="ad-head"><div><h1>Packs</h1><p>Prix, contenu et ordre d’affichage de vos formules. Un pack désactivé disparaît du site.</p></div><a className="btn btn-primary btn-sm" href="/admin/packs/nouveau">+ Ajouter un pack</a></div>
      <Flash sp={sp} />
      <div className="plist">
        {packs.map((p) => (
          <div className={"card prow" + (p.is_active ? "" : " off")} key={p.id}>
            <span className="pos">{p.position}</span>
            <div><h3>{p.name}{p.is_featured && <span className="badge-s">Le plus choisi</span>}</h3><p>{fcfa(p.price)} / {p.period} · {p.items.length} prestations incluses{p.is_active ? "" : " · désactivé"}</p></div>
            <form action={togglePack}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="value" value={p.is_active ? "0" : "1"} /><button className="btn btn-ghost btn-sm">{p.is_active ? "Désactiver" : "Activer"}</button></form>
            <a className="btn btn-primary btn-sm" href={`/admin/packs/${p.id}`}>Modifier</a>
          </div>
        ))}
        {!packs.length && <div className="card empty">Aucun pack. Ajoutez votre première formule.</div>}
      </div>
    </>
  );
}
