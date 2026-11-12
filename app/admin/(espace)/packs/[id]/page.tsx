import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import type { Pack } from "@/lib/types";
import { deletePack, savePack } from "../../../actions";
import Flash from "../../Flash";

const EMPTY: Pack = { id: "", slug: "", name: "", price: 0, period: "mois", level: "", tagline: "", networks: "", contents: "", items: [], audience: [], is_featured: false, is_active: true, position: 10 };

export default async function EditPack({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erreur?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  let p = EMPTY;
  if (id !== "nouveau") {
    const sb = await supabaseServer();
    const { data } = await sb.from("packs").select("*").eq("id", id).single();
    if (!data) notFound();
    p = data as Pack;
  }
  return (
    <>
      <div className="ad-head"><div><h1>{p.id ? `Modifier le pack ${p.name}` : "Nouveau pack"}</h1><p>Les changements apparaissent sur le site dès l’enregistrement.</p></div><a className="btn btn-ghost btn-sm" href="/admin/packs">← Tous les packs</a></div>
      <Flash sp={sp} />
      <form action={savePack} className="card form">
        <input type="hidden" name="id" value={p.id} />
        <div className="row3">
          <div className="f"><label htmlFor="name">Nom du pack</label><input id="name" name="name" defaultValue={p.name} required placeholder="Ex. Premium" /></div>
          <div className="f"><label htmlFor="price">Prix (FCFA)</label><input id="price" name="price" inputMode="numeric" defaultValue={p.price || ""} required placeholder="250000" /></div>
          <div className="f"><label htmlFor="period">Par</label><input id="period" name="period" defaultValue={p.period} placeholder="mois" /></div>
        </div>
        <div className="row3">
          <div className="f"><label htmlFor="level">Petit titre</label><input id="level" name="level" defaultValue={p.level} placeholder="Ex. Impact maximal" /></div>
          <div className="f"><label htmlFor="networks">Réseaux</label><input id="networks" name="networks" defaultValue={p.networks} placeholder="Ex. 3 réseaux sociaux" /></div>
          <div className="f"><label htmlFor="contents">Contenus</label><input id="contents" name="contents" defaultValue={p.contents} placeholder="Ex. 12 publications / mois" /></div>
        </div>
        <div className="f"><label htmlFor="tagline">Phrase d’accroche</label><input id="tagline" name="tagline" defaultValue={p.tagline} placeholder="Ex. Une communication complète et performante." /></div>
        <div className="row2">
          <div className="f"><label htmlFor="items">Ce qui est inclus</label><textarea id="items" name="items" rows={10} defaultValue={p.items.join("\n")} /><span className="hint">Une prestation par ligne.</span></div>
          <div className="f"><label htmlFor="audience">Pour qui ?</label><textarea id="audience" name="audience" rows={10} defaultValue={p.audience.join("\n")} /><span className="hint">Un profil par ligne. Affiché sur la page détaillée du pack.</span></div>
        </div>
        <div className="row3">
          <div className="f"><label htmlFor="position">Ordre d’affichage</label><input id="position" name="position" inputMode="numeric" defaultValue={p.position} /></div>
          <div className="f"><label htmlFor="slug">Adresse de la page</label><input id="slug" name="slug" defaultValue={p.slug} placeholder="se remplit tout seul" /><span className="hint">/packs/…</span></div>
          <div className="f" style={{ alignContent: "end", gap: 10 }}>
            <label className="check"><input type="checkbox" name="is_active" defaultChecked={p.is_active} /> Visible sur le site</label>
            <label className="check"><input type="checkbox" name="is_featured" defaultChecked={p.is_featured} /> Badge « Le plus choisi »</label>
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-primary">Enregistrer le pack</button>
          {p.id && <button formAction={deletePack} className="btn btn-danger">Supprimer ce pack</button>}
        </div>
      </form>
    </>
  );
}
