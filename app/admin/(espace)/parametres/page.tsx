import { supabaseServer } from "@/lib/supabase/server";
import { DEMO } from "@/lib/demo";
import type { Settings } from "@/lib/types";
import { saveSettings } from "../../actions";
import Flash from "../Flash";

export default async function Parametres({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const sp = await searchParams;
  const { data } = await (await supabaseServer()).from("settings").select("*").eq("id", 1).single();
  const s = (data ?? DEMO.settings) as Settings;
  const F = ({ k, label, area, hint, rows }: { k: keyof Settings; label: string; area?: boolean; hint?: string; rows?: number }) => (
    <div className="f"><label htmlFor={k}>{label}</label>
      {area ? <textarea id={k} name={k} rows={rows ?? 3} defaultValue={String(s[k])} /> : <input id={k} name={k} defaultValue={String(s[k])} />}
      {hint && <span className="hint">{hint}</span>}</div>
  );
  return (
    <>
      <div className="ad-head"><div><h1>Paramètres</h1><p>Numéro WhatsApp, textes principaux, chiffres et réseaux sociaux.</p></div></div>
      <Flash sp={sp} />
      <form action={saveSettings} className="form">
        <div className="card form">
          <h2 style={{ fontSize: "1.05rem" }}>WhatsApp et marque</h2>
          <div className="row2">
            <F k="whatsapp" label="Numéro WhatsApp qui reçoit les demandes" hint="Avec l’indicatif, sans + ni espaces. Ex. 242068522857" />
            <F k="brand_name" label="Nom de la marque" />
          </div>
          <F k="slogan" label="Slogan" />
        </div>
        <div className="card form">
          <h2 style={{ fontSize: "1.05rem" }}>Haut de la page d’accueil</h2>
          <div className="row2"><F k="hero_title" label="Titre (blanc)" /><F k="hero_accent" label="Suite du titre (bleu)" /></div>
          <F k="hero_text" label="Texte de présentation" area />
          <F k="hero_punch" label="Phrase d’appel" />
          <div className="row2">
            <div className="form" style={{ gap: 10 }}><F k="stat1_value" label="Chiffre 1" hint="Nombre sans espaces. Mettez 0 pour le masquer." /><F k="stat1_label" label="Texte du chiffre 1" /></div>
            <div className="form" style={{ gap: 10 }}><F k="stat2_value" label="Chiffre 2" hint="Nombre sans espaces. Mettez 0 pour le masquer." /><F k="stat2_label" label="Texte du chiffre 2" /></div>
          </div>
        </div>
        <div className="card form">
          <h2 style={{ fontSize: "1.05rem" }}>À propos</h2>
          <F k="about_text" label="Présentation de Damas Digital" area rows={4} />
          <div className="row2"><F k="founder_name" label="Nom du fondateur" /><F k="founder_role" label="Rôle" /></div>
          <F k="founder_bio" label="Présentation du fondateur" area />
        </div>
        <div className="card form">
          <h2 style={{ fontSize: "1.05rem" }}>Réseaux sociaux et contact</h2>
          <p style={{ color: "var(--mute-d)", fontSize: ".86rem" }}>Liens complets (https://…). Les champs vides ne s’affichent pas sur le site.</p>
          <div className="row2"><F k="facebook" label="Facebook" /><F k="instagram" label="Instagram" /></div>
          <div className="row2"><F k="tiktok" label="TikTok" /><F k="email" label="E-mail" /></div>
        </div>
        <div className="actions"><button className="btn btn-primary">Enregistrer les paramètres</button></div>
      </form>
    </>
  );
}
