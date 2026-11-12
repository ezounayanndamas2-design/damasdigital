import { supabaseServer } from "@/lib/supabase/server";
import ListEditor from "../ListEditor";
import Flash from "../Flash";

export default async function Prestations({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const sp = await searchParams;
  const { data } = await (await supabaseServer()).from("extras").select("*").order("position");
  return (
    <>
      <div className="ad-head"><div><h1>Prestations supplémentaires</h1><p>Services à la carte affichés sous les packs et proposés dans la demande d’inscription.</p></div></div>
      <Flash sp={sp} />
      <ListEditor table="extras" rows={data ?? []} addLabel="Ajouter une prestation"
        title={(r) => String(r.name)} sub={(r) => String(r.price_label)}
        fields={[{ name: "name", label: "Nom de la prestation", placeholder: "Ex. Création d’un logo" }, { name: "price_label", label: "Prix affiché", placeholder: "Ex. 30 000 FCFA", hint: "Texte libre : « 10 000 à 20 000 FCFA », « 30 000 FCFA + budget publicitaire »…" }]} />
    </>
  );
}
