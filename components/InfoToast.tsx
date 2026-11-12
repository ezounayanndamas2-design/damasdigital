"use client";
import { useEffect, useState } from "react";
import { ServiceIcon } from "./icons";

export type Tip = [string, string, string];

/** Petite fenêtre d'informations qui défile en bas de l'écran (informations vraies uniquement). */
export default function InfoToast({ tips }: { tips: Tip[] }) {
  const [i, setI] = useState(-1);
  const [show, setShow] = useState(false);
  const [off, setOff] = useState(false);
  useEffect(() => {
    if (off || !tips.length) return;
    let t: ReturnType<typeof setTimeout>;
    const cycle = (n: number) => {
      t = setTimeout(() => {
        if (document.body.classList.contains("lock")) { cycle(n); return; }
        setI(n % tips.length); setShow(true);
        t = setTimeout(() => { setShow(false); cycle(n + 1); }, 5500);
      }, n === 0 ? 4000 : 6000);
    };
    cycle(0);
    const hide = () => setShow(false);
    window.addEventListener("dd:modal-open", hide);
    return () => { clearTimeout(t); window.removeEventListener("dd:modal-open", hide); };
  }, [off, tips]);
  if (off || i < 0) return null;
  const [k, txt, ic] = tips[i];
  return (
    <a className={"toast" + (show ? " show" : "")} href="/#accompagnements" aria-live="polite">
      <span className="ti"><ServiceIcon name={ic} /></span>
      <span><small>{k}</small><b>{txt}</b></span>
      <button type="button" aria-label="Masquer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOff(true); }}>×</button>
    </a>
  );
}
