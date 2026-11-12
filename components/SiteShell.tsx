import type { SiteData } from "@/lib/types";
import { num } from "@/lib/format";
import Nav from "./Nav";
import Footer from "./Footer";
import ChooseModal from "./ChooseModal";
import InfoToast, { type Tip } from "./InfoToast";

export default function SiteShell({ data, children }: { data: SiteData; children: React.ReactNode }) {
  const { settings: s, packs, extras } = data;
  const top = packs.find((p) => p.is_featured);
  const min = packs.length ? Math.min(...packs.map((p) => p.price)) : 0;
  const tips: Tip[] = [
    ...(top ? [["Le plus choisi", `Pack ${top.name} : ${top.tagline.charAt(0).toLowerCase()}${top.tagline.slice(1).replace(/\.$/, "")}`, "bv"] as Tip] : []),
    ...(packs.length ? [["Formules", `${packs.length} packs mensuels dès ${num(min)} FCFA`, "cm"] as Tip] : []),
    ...(s.stat2_value ? [["Ils nous font confiance", `+${num(s.stat2_value)} ${s.stat2_label}`, "md"] as Tip] : []),
    ...(extras.length ? [["À la carte", extras.slice(0, 3).map((x) => x.name.replace(/^Création d’(un|une) /, "").replace(/^Montage d’une /, "")).join(", ") + "…", "cv"] as Tip] : []),
    ["Simple", s.hero_punch, "bv"],
  ];
  return (
    <>
      <Nav />
      <main>{children}</main>
      <Footer s={s} />
      <InfoToast tips={tips} />
      <ChooseModal packs={packs} extras={extras} whatsapp={s.whatsapp} />
    </>
  );
}
