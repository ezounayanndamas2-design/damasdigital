import { getSiteData } from "@/lib/data";
import { fcfa, num } from "@/lib/format";
import SiteShell from "@/components/SiteShell";
import CountUp from "@/components/CountUp";
import Steps from "@/components/Steps";
import { Arrow, ServiceIcon } from "@/components/icons";

export const revalidate = 60;

/** Lignes du tableau comparatif, construites à partir des packs. */
function compareRows(packs: { networks: string; contents: string; items: string[] }[]) {
  return [
    ["Réseaux gérés", packs.map((p) => p.networks || "—")],
    ["Contenus", packs.map((p) => p.contents || "—")],
    ["Prestations incluses", packs.map((p) => `${p.items.length} prestations`)],
  ] as [string, string[]][];
}

export default async function Home() {
  const data = await getSiteData();
  const { settings: s, packs, extras, services, faqs } = data;
  const min = packs.length ? Math.min(...packs.map((p) => p.price)) : 0;
  const keybar = [
    [`${packs.length} formules mensuelles`, packs.map((p) => p.name).join(", ").replace(/, ([^,]*)$/, " et $1"), "cm"],
    [`Dès ${num(min)} FCFA / mois`, extras.length ? "Prestations à la carte en complément" : "Formules claires, prix affichés", "md"],
    [`${services.length} domaines d’expertise`, services.map((x) => x.name.split(" ")[0]).join(", "), "bv"],
    ["On se charge de tout", "Vous choisissez votre pack, on s’occupe du reste", "cv"],
  ];

  return (
    <SiteShell data={data}>
      <section className="hero gut" id="accueil">
        <div className="in">
          <div className="rv">
            <span className="eyebrow">{s.slogan}</span>
            <h1>{s.hero_title} <em>{s.hero_accent}</em></h1>
            <p className="lead">{s.hero_text} <strong>{s.hero_punch}</strong></p>
            <div className="ctas">
              <a className="btn btn-primary" href="#accompagnements">Choisir mon pack <Arrow /></a>
              <a className="btn btn-ghost" href="#services">Découvrir nos services</a>
            </div>
            <div className="stats">
              {s.stat1_value > 0 && <div className="stat"><CountUp value={s.stat1_value} /><span>{s.stat1_label}</span></div>}
              {s.stat2_value > 0 && <div className="stat"><CountUp value={s.stat2_value} /><span>{s.stat2_label}</span></div>}
            </div>
          </div>
        </div>
      </section>

      <section className="keybar gut" aria-label="L’essentiel">
        <div className="in"><div className="kb">
          {keybar.map(([t, d, ic]) => (
            <div className="ki" key={t}><span className="kic"><ServiceIcon name={ic} /></span><div><b>{t}</b><span>{d}</span></div></div>
          ))}
        </div></div>
      </section>

      <section className="light band gut" id="services">
        <div className="in">
          <div className="head"><span className="eyebrow">Nos domaines d’accompagnement</span><h2>Nos expertises à votre service</h2><p>Selon votre pack, nous combinons ces expertises pour développer votre présence et votre impact en ligne. Vous n’avez rien à gérer.</p></div>
          <div className="domains">
            {services.map((d) => (
              <article className="dom" key={d.id}>
                <div className="ico"><ServiceIcon name={d.icon} /></div>
                <h3>{d.name}</h3><p>{d.description}</p>
                <ul>{d.points.map((m) => <li key={m}>{m}</li>)}</ul>
                <a className="more" href="#accompagnements">Voir les packs <Arrow /></a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band gut video-band">
        <div className="in vgrid">
          <div className="head" style={{ marginBottom: 0 }}><span className="eyebrow">En vidéo</span><h2>Nos plans de communication en 1 minute</h2><p>Les formules, les prestations supplémentaires et ce que chacune vous apporte.</p></div>
          <figure className="vid"><video src="/presentation.mp4" poster="/poster.jpg" controls playsInline preload="none" /></figure>
        </div>
      </section>

      <section className="band gut packs-band" id="accompagnements" style={{ paddingTop: 24 }}>
        <div className="in">
          <div className="head"><span className="eyebrow">Choisissez votre accompagnement</span><h2>Plan de communication marketing</h2><p>Une stratégie complète pour accroître votre visibilité, attirer plus de clients et développer vos ventes. Formules mensuelles.</p></div>
          <div className="packs">
            {packs.map((p) => (
              <article className={"pack" + (p.is_featured ? " top" : "")} key={p.id}>
                {p.is_featured && <span className="badge">Le plus choisi</span>}
                <span className="lvl">{p.level}</span>
                <h3>{p.name}</h3>
                <p className="for">{p.tagline}</p>
                <div className="price num">{num(p.price)} <span>FCFA / {p.period}</span></div>
                <div className="dur">Abonnement mensuel</div>
                <div className="facts">
                  <div className="fact"><small>Réseaux</small><b>{p.networks}</b></div>
                  <div className="fact"><small>Contenus</small><b>{p.contents}</b></div>
                </div>
                <ul>{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
                <div className="acts">
                  <button className="btn btn-primary" data-choose={p.slug}>Choisir cet accompagnement</button>
                  <a className="link" href={`/packs/${p.slug}`}>Voir le détail du pack</a>
                </div>
              </article>
            ))}
          </div>

          <h3 className="compare-title">Comparer les packs</h3>
          <div className="compare" role="region" aria-label="Tableau comparatif des packs" tabIndex={0}>
            <table>
              <thead><tr><th scope="col" />{packs.map((p) => <th scope="col" key={p.id} className={p.is_featured ? "top" : ""}>{p.name}</th>)}</tr></thead>
              <tbody>
                <tr><th scope="row">Prix</th>{packs.map((p) => <td className="num" key={p.id}>{fcfa(p.price)} / {p.period}</td>)}</tr>
                {compareRows(packs).map(([k, v]) => <tr key={k}><th scope="row">{k}</th>{v.map((x, i) => <td key={i} className={x === "—" ? "no" : ""}>{x}</td>)}</tr>)}
              </tbody>
            </table>
          </div>

          {extras.length > 0 && <>
            <div className="xhead"><h3 className="compare-title" style={{ margin: 0 }}>Prestations supplémentaires</h3><p>Avec ou sans pack. Ajoutez-les à votre demande au moment de choisir votre accompagnement.</p></div>
            <div className="xlist">{extras.map((e) => <div className="x" key={e.id}><span>{e.name}</span><b className="num">{e.price_label}</b></div>)}</div>
          </>}
        </div>
      </section>

      <section className="light band gut">
        <div className="in">
          <div className="head"><span className="eyebrow">Comment ça se passe</span><h2>Votre accompagnement en quatre étapes</h2></div>
          <Steps />
        </div>
      </section>

      <section className="light band gut" id="apropos" style={{ paddingTop: 0 }}>
        <div className="in about">
          <div>
            <div className="head" style={{ marginBottom: 0 }}><span className="eyebrow">À propos</span><h2>Bienvenue dans l’univers {s.brand_name}.</h2><p>{s.about_text}</p></div>
            <div className="values">
              <div className="value"><b>Présence en ligne</b><span>Des pages actives, soignées et cohérentes.</span></div>
              <div className="value"><b>Accompagnement</b><span>Un suivi adapté à votre pack.</span></div>
              <div className="value"><b>Impact</b><span>Des actions qui attirent des clients et font vendre.</span></div>
              <div className="value"><b>Tout pris en charge</b><span>Stratégie, contenus, publication et suivi.</span></div>
            </div>
          </div>
          <aside className="founder">
            <img className="fphoto" src="/yann-damas.jpg" alt={`${s.founder_name}, fondateur de ${s.brand_name}`} width={800} height={1000} loading="lazy" />
            <h3>{s.founder_name}</h3>
            <div className="role">{s.founder_role}</div>
            <p>{s.founder_bio}</p>
            <q>{s.slogan}</q>
          </aside>
        </div>
      </section>

      <section className="light band gut" id="faq" style={{ paddingTop: 0 }}>
        <div className="in">
          <div className="head"><span className="eyebrow">FAQ</span><h2>Questions fréquentes</h2></div>
          <div className="faq">{faqs.map((f, i) => <details key={f.id} open={i === 0}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="final gut">
        <div className="in"><div className="box">
          <div><h2>Prêt à booster votre présence en ligne ?</h2><p>{s.hero_punch}</p></div>
          <a className="btn" href="#accompagnements">Voir les packs <Arrow /></a>
        </div></div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "ProfessionalService", name: s.brand_name, slogan: s.slogan,
        areaServed: "CG", address: { "@type": "PostalAddress", addressLocality: "Brazzaville", addressCountry: "CG" },
        founder: { "@type": "Person", name: s.founder_name },
        makesOffer: packs.map((p) => ({ "@type": "Offer", name: `Pack ${p.name}`, price: p.price, priceCurrency: "XAF" })),
      }) }} />
    </SiteShell>
  );
}
