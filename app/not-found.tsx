export default function NotFound() {
  return (
    <main className="gut" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div><h1 style={{ fontSize: "2.4rem" }}>Page introuvable</h1><p style={{ color: "var(--mute-d)", margin: "12px 0 24px" }}>Cette page n’existe pas ou a été déplacée.</p><a className="btn btn-primary" href="/">Retour à l’accueil</a></div>
    </main>
  );
}
