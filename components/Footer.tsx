import type { Settings } from "@/lib/types";
export default function Footer({ s }: { s: Settings }) {
  const socials = [["Facebook", s.facebook], ["Instagram", s.instagram], ["TikTok", s.tiktok]].filter(([, u]) => u);
  return (
    <footer className="gut">
      <div className="in">
        <img src="/logo-damas-blanc.png" alt="Damas Digital" width={69} height={32} />
        <nav>
          <a href="/#accompagnements">Accompagnements</a><a href="/#services">Services</a><a href="/#apropos">À propos</a><a href="/#faq">FAQ</a>
          {socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener">{n}</a>)}
          {s.email && <a href={`mailto:${s.email}`}>{s.email}</a>}
        </nav>
        <span>© {new Date().getFullYear() < 2027 ? 2027 : new Date().getFullYear()} {s.brand_name} · {s.slogan}</span>
      </div>
    </footer>
  );
}
