export default function Flash({ sp }: { sp: { ok?: string; erreur?: string } }) {
  if (sp.erreur) return <div className="flash ko">Erreur : {sp.erreur}</div>;
  if (sp.ok) return <div className="flash ok">Modifications enregistrées. Le site est à jour.</div>;
  return null;
}
