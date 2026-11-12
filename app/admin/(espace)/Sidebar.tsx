"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "../actions";

const LINKS = [["/admin", "Tableau de bord"], ["/admin/demandes", "Demandes"], ["/admin/packs", "Packs"], ["/admin/prestations", "Prestations"], ["/admin/services", "Services"], ["/admin/faq", "FAQ"], ["/admin/parametres", "Paramètres"]];

export default function Sidebar({ fresh }: { fresh: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const on = (h: string) => (h === "/admin" ? path === h : path.startsWith(h));
  return (
    <>
      <div className="mtop"><img src="/logo-damas-blanc.png" alt="Damas Digital" width={64} height={30} /><button className="burger" style={{ display: "block" }} aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /><span /></button></div>
      <aside className={"ad-side" + (open ? " open" : "")} onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        <img src="/logo-damas-blanc.png" alt="Damas Digital" width={73} height={34} />
        {LINKS.map(([h, l]) => <a key={h} href={h} className={on(h) ? "on" : ""}>{l}{h === "/admin/demandes" && fresh > 0 && <span className="pill">{fresh}</span>}</a>)}
        <div className="grow" />
        <a href="/" target="_blank" rel="noopener">Voir le site ↗</a>
        <form action={signOut}><button className="btn btn-ghost btn-sm">Se déconnecter</button></form>
      </aside>
    </>
  );
}
