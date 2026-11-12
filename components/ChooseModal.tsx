"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Extra, Pack } from "@/lib/types";
import { fcfa, num } from "@/lib/format";

const COUNTRIES: [string, string][] = [
  ["Congo-Brazzaville", "+242"], ["RD Congo", "+243"], ["Gabon", "+241"], ["Cameroun", "+237"], ["Côte d’Ivoire", "+225"], ["Sénégal", "+221"],
  ["Bénin", "+229"], ["Togo", "+228"], ["Mali", "+223"], ["Burkina Faso", "+226"], ["Guinée", "+224"], ["Niger", "+227"], ["Tchad", "+235"],
  ["Centrafrique", "+236"], ["Madagascar", "+261"], ["Maroc", "+212"], ["France", "+33"], ["Belgique", "+32"], ["Suisse", "+41"], ["Canada", "+1"], ["Autre pays", ""],
];
const STORE = "dd_contact";

/**
 * Fenêtre « Votre demande d’inscription ».
 * S'ouvre depuis n'importe quel bouton portant l'attribut data-choose="<slug du pack>".
 * Enregistre la demande dans l'admin puis ouvre WhatsApp avec le message déjà écrit.
 */
export default function ChooseModal({ packs, extras, whatsapp }: { packs: Pack[]; extras: Extra[]; whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<null | { msg: string; url: string }>(null);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState(0);
  const [phone, setPhone] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { const c = JSON.parse(localStorage.getItem(STORE) || "null"); if (c) { setName(c.n || ""); setCountry(+c.c || 0); setPhone(c.p || ""); } } catch { /* stockage indisponible */ }
    const onClick = (e: MouseEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-choose]");
      if (!b) return;
      e.preventDefault();
      setSlug(b.dataset.choose || ""); setErr(""); setDone(null); setSending(false); setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    document.body.classList.toggle("lock", open);
    if (!open) return;
    window.dispatchEvent(new Event("dd:modal-open"));
    if (matchMedia("(hover:hover) and (pointer:fine)").matches) setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 60);
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open, close]);

  const [cName, cDial] = COUNTRIES[country];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = packs.find((x) => x.slug === slug);
    if (!p) return setErr("Choisissez un pack.");
    if (name.trim().length < 2) return setErr("Indiquez votre nom et prénom.");
    if (phone.replace(/\D/g, "").length < 6) return setErr("Indiquez un numéro de téléphone valide.");
    setSending(true);
    const ex = extras.filter((x) => picked.includes(x.id));
    const tel = `${cDial ? cDial + " " : ""}${phone.trim()}`;
    const msg =
      `Bonjour Damas Digital,\n\nJe souhaite m’inscrire à l’accompagnement suivant :\n• Pack : ${p.name}\n• Prix : ${fcfa(p.price)} / ${p.period}\n• Durée : abonnement mensuel` +
      (ex.length ? `\n\nPrestations supplémentaires :\n${ex.map((x) => `• ${x.name} : ${x.price_label}`).join("\n")}` : "") +
      `\n\nNom : ${name.trim()}\nPays : ${cName}\nTéléphone : ${tel}\n\nMerci de me donner la suite pour finaliser mon inscription.`;
    const url = `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;

    // 1) enregistre la demande pour l'admin, sans faire attendre le client
    try {
      fetch("/api/demandes", {
        method: "POST", keepalive: true, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack_id: p.id, pack_name: p.name, pack_price: p.price, extras: ex.map((x) => `${x.name} (${x.price_label})`), name: name.trim(), country: cName, phone: tel }),
      }).catch(() => {});
    } catch { /* l'envoi WhatsApp reste prioritaire */ }
    try { localStorage.setItem(STORE, JSON.stringify({ n: name, c: country, p: phone })); } catch { /* ignoré */ }

    // 2) ouvre WhatsApp immédiatement (dans le geste du clic)
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setDone({ msg, url });
  }

  if (!open) return null;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="mTitle" onClick={(e) => e.target === e.currentTarget && close()}>
      {!done ? (
        <form className="sheet" onSubmit={submit} noValidate>
          <div className="grab" aria-hidden="true" />
          <h3 id="mTitle">Votre demande d’inscription</h3>
          <p className="msub">Sélectionnez votre pack, puis indiquez vos coordonnées.</p>
          <div className="lbl">Votre pack</div>
          <div className="popts" role="radiogroup" aria-label="Votre pack">
            {packs.map((p) => (
              <label key={p.id} className="po">
                {p.is_featured && <span className="star">Le plus choisi</span>}
                <input type="radio" name="mpack" value={p.slug} checked={slug === p.slug} onChange={() => setSlug(p.slug)} />
                <span className="pn"><span>{p.name}</span><span className="pp num">{num(p.price)} F/{p.period}</span></span>
                <small>{[p.networks, p.contents].filter(Boolean).join(" · ")}</small>
              </label>
            ))}
          </div>
          <label htmlFor="mName">Nom et prénom</label>
          <input id="mName" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" autoCapitalize="words" enterKeyHint="next" placeholder="Ex. Grâce Mabiala" />
          <label htmlFor="mCountry">Pays</label>
          <select id="mCountry" value={country} onChange={(e) => setCountry(+e.target.value)} autoComplete="country-name">
            {COUNTRIES.map(([n, d], i) => <option key={n} value={i}>{n}{d ? ` (${d})` : ""}</option>)}
          </select>
          <label htmlFor="mPhone">Numéro de téléphone</label>
          <div className="tel"><span>{cDial || "+…"}</span><input id="mPhone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel-national" enterKeyHint="send" placeholder={cDial ? "06 123 45 67" : "Indicatif et numéro"} /></div>
          {extras.length > 0 && (
            <details className="more-x">
              <summary>Ajouter une prestation supplémentaire (facultatif)</summary>
              <div className="xopts">
                {extras.map((x) => (
                  <label key={x.id} className="xo">
                    <input type="checkbox" checked={picked.includes(x.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, x.id] : picked.filter((i) => i !== x.id))} />
                    <span>{x.name}</span><b>{x.price_label}</b>
                  </label>
                ))}
              </div>
            </details>
          )}
          <div className="err" role="alert">{err}</div>
          <div className="row-btns">
            <button type="button" className="btn btn-ghost" onClick={close}>Annuler</button>
            <button type="submit" className="btn btn-primary" disabled={sending}>Continuer sur WhatsApp</button>
          </div>
          <p className="fine">WhatsApp s’ouvre avec votre demande déjà écrite, il ne reste qu’à l’envoyer. Le paiement et la confirmation se font ensuite directement avec nous.</p>
        </form>
      ) : (
        <div className="sheet">
          <div className="grab" aria-hidden="true" />
          <div className="ok">✓</div>
          <h3>Votre demande est prête</h3>
          <p className="msub">WhatsApp s’ouvre avec votre message déjà écrit : il vous suffit d’appuyer sur <b>Envoyer</b>. Si WhatsApp ne s’est pas ouvert, utilisez le bouton ci-dessous.</p>
          <label htmlFor="mMsg">Votre demande</label>
          <textarea id="mMsg" rows={8} readOnly value={done.msg} />
          <div className="row-btns">
            <button type="button" className="btn btn-ghost" onClick={close}>Fermer</button>
            <a className="btn btn-primary" href={done.url} target="_blank" rel="noopener">Ouvrir WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
