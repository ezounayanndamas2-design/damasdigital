import { supabaseServer } from "@/lib/supabase/server";
import ListEditor from "../ListEditor";
import Flash from "../Flash";

export default async function Faq({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const sp = await searchParams;
  const { data } = await (await supabaseServer()).from("faqs").select("*").order("position");
  return (
    <>
      <div className="ad-head"><div><h1>Questions fréquentes</h1><p>La FAQ affichée en bas de la page d’accueil.</p></div></div>
      <Flash sp={sp} />
      <ListEditor table="faqs" rows={data ?? []} addLabel="Ajouter une question"
        title={(r) => String(r.question)} sub={(r) => String(r.answer).slice(0, 90) + "…"}
        fields={[{ name: "question", label: "Question" }, { name: "answer", label: "Réponse", type: "textarea", rows: 5 }]} />
    </>
  );
}
