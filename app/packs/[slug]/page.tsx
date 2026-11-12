import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/data";
import { fcfa, num } from "@/lib/format";
import SiteShell from "@/components/SiteShell";
import Steps from "@/components/Steps";

export const revalidate = 60;

export async function generateStaticParams() {
  const { packs } = await getSiteData();
  return packs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getSiteData()).packs.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `Pack ${p.name}`, description: `${p.tagline} ${fcfa(p.price)} / ${p.period}. ${p.items.slice(0, 4).join(", ")}…`, alternates: { canonical: `/packs/${p.slug}` } };
}

export default async function PackPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getSiteData();
  const p = data.packs.find((x) => x.slug === slug);
  if (!p) notFound();
  const others = data.packs.filter((x) => x.id !== p.id);
  return (
    <SiteShell data={data}>
      <section className="detail gut"><div className="in">
        <div className="crumbs"><a href="/#accueil">Accueil</a><span>/</span><a href="/#accompagnements">Accompagnements</a><span>/</span><span>Pack {p.name}</span></div>
        <div className="dhead">
          <div className="rv">
            <span className="eyebrow">{p.level}{p.is_featured ? " · Le plus choisi" : ""}</span>
            <h1>Pack {p.name}</h1>
            <p className="intro">{p.tagline} Nous construisons une stratégie adaptée à votre activité et nous nous chargeons de tout : {p.items.slice(0, 3).map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join(", ")}, et plus encore.</p>
          </div>
          <aside className="sticky-card rv">
            <div className="price num">{num(p.price)} <span>FCFA / {p.period}</span></div>
            <div className="rows">
              <div className="row"><span>Durée</span><span>Abonnement mensuel</span></div>
              <div className="row"><span>Réseaux</span><span>{p.networks}</span></div>
              <div className="row"><span>Contenus</span><span>{p.contents}</span></div>
            </div>
            <button className="btn btn-primary" data-choose={p.slug}>Je choisis cette formule</button>
          </aside>
        </div>
        <div className="blocks">
          <div className="block"><h2>Ce qui est inclus</h2><ul>{p.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
          {p.audience.length > 0 && <div className="block"><h2>Pour qui ?</h2><ul>{p.audience.map((x) => <li key={x}>{x}</li>)}</ul></div>}
          <div className="block"><h2>Comment ça se passe</h2><Steps dark /></div>
          {data.extras.length > 0 && <div className="block"><h2>Prestations supplémentaires</h2><div className="xlist one">{data.extras.map((e) => <div className="x" key={e.id}><span>{e.name}</span><b className="num">{e.price_label}</b></div>)}</div></div>}
          {others.length > 0 && <div className="block"><h2>Comparer avec les autres packs</h2><div className="mini-packs">{others.map((o) => <div className="mini" key={o.id}><b>{o.name}</b><span className="num">{fcfa(o.price)} / {o.period}</span><a className="btn btn-ghost" href={`/packs/${o.slug}`}>Voir ce pack</a></div>)}</div></div>}
        </div>
      </div></section>
    </SiteShell>
  );
}
