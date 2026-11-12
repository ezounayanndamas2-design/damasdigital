"use client";
import { useEffect, useState } from "react";

const LINKS = [["accueil", "Accueil"], ["accompagnements", "Nos accompagnements"], ["services", "Nos services"], ["apropos", "À propos"], ["faq", "FAQ"]];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState("accueil");
  useEffect(() => {
    const ids = LINKS.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!ids.length) { setOn(""); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    ids.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <header className="nav gut">
      <div className="in">
        <a href="/#accueil" aria-label="Damas Digital, accueil"><img src="/logo-damas-blanc.png" alt="Damas Digital" width={77} height={36} /></a>
        <nav className={"menu" + (open ? " open" : "")} id="menu">
          {LINKS.map(([id, label]) => (
            <a key={id} href={`/#${id}`} className={on === id ? "on" : ""} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <button className="burger" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}><span /><span /><span /></button>
      </div>
    </header>
  );
}
