const STEPS = [["Audit", "On analyse vos pages, votre image et vos concurrents."], ["Stratégie", "On fixe les objectifs, les réseaux, le ton et le calendrier."], ["Création et gestion", "Visuels, textes, vidéos, publications et animation."], ["Suivi", "Statistiques, rapports et ajustements pour vendre plus."]];
export default function Steps({ dark }: { dark?: boolean }) {
  return <ol className={"steps" + (dark ? " dark" : "")}>{STEPS.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ol>;
}
