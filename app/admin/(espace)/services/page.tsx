import { supabaseServer } from "@/lib/supabase/server";
import ListEditor from "../ListEditor";
import Flash from "../Flash";

export default async function Services({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const sp = await searchParams;
  const { data } = await (await supabaseServer()).from("services").select("*").order("position");
  return (
    <>
      <div className="ad-head"><div><h1>Services</h1><p>Les cartes « Nos domaines d’accompagnement » de la page d’accueil.</p></div></div>
      <Flash sp={sp} />
      <ListEditor table="services" rows={data ?? []} addLabel="Ajouter un service"
        title={(r) => String(r.name)} sub={(r) => `${(r.points as string[]).length} points`}
        fields={[
          { name: "name", label: "Nom du service", placeholder: "Ex. Community Management" },
          { name: "icon", label: "Icône", type: "select", options: [["cm", "Communauté"], ["md", "Mégaphone (marketing)"], ["bv", "Courbe (visibilité)"], ["cv", "Caméra (vidéo)"], ["ec", "Panier (e-commerce)"]] },
          { name: "description", label: "Description courte", type: "textarea", rows: 2 },
          { name: "points", label: "Points affichés", type: "textarea", rows: 6, hint: "Un point par ligne." },
        ]} />
    </>
  );
}
