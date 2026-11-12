"use client";
import { useActionState } from "react";
import { changePassword } from "../../actions";

export default function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null as null | { error?: string; ok?: boolean });
  return (
    <form action={action} className="card form" style={{ maxWidth: 520 }}>
      <h2 style={{ fontSize: "1.05rem" }}>Changer mon mot de passe</h2>
      {state?.error && <div className="flash ko">{state.error}</div>}
      {state?.ok && <div className="flash ok">Mot de passe changé. Utilisez-le à votre prochaine connexion.</div>}
      <div className="f"><label htmlFor="password">Nouveau mot de passe</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /></div>
      <div className="f"><label htmlFor="confirm">Confirmer le mot de passe</label><input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required /></div>
      <div className="actions"><button className="btn btn-primary" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer le nouveau mot de passe"}</button></div>
    </form>
  );
}
