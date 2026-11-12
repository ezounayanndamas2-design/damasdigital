"use client";
import { useActionState } from "react";
import { signIn } from "../actions";
import "../admin.css";

export default function Connexion() {
  const [state, action, pending] = useActionState(signIn, null as null | { error?: string });
  return (
    <main className="login">
      <form className="card form" action={action}>
        <img src="/logo-damas-blanc.png" alt="Damas Digital" width={86} height={40} />
        <div><h1 style={{ fontSize: "1.5rem" }}>Espace administrateur</h1><p style={{ color: "var(--mute-d)", marginTop: 6 }}>Connectez-vous pour gérer votre site.</p></div>
        {state?.error && <div className="flash ko">{state.error}</div>}
        <div className="f"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete="email" required /></div>
        <div className="f"><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" autoComplete="current-password" required /></div>
        <button className="btn btn-primary" disabled={pending}>{pending ? "Connexion…" : "Se connecter"}</button>
        <a href="/" style={{ textAlign: "center", color: "var(--mute-d)", fontSize: ".88rem" }}>← Retour au site</a>
      </form>
    </main>
  );
}
