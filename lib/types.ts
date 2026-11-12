export type Settings = {
  brand_name: string; slogan: string; whatsapp: string;
  hero_title: string; hero_accent: string; hero_text: string; hero_punch: string;
  stat1_value: number; stat1_label: string; stat2_value: number; stat2_label: string;
  founder_name: string; founder_role: string; founder_bio: string; about_text: string;
  facebook: string; instagram: string; tiktok: string; email: string;
};
export type Pack = {
  id: string; slug: string; name: string; price: number; period: string; level: string;
  tagline: string; networks: string; contents: string; items: string[]; audience: string[];
  is_featured: boolean; is_active: boolean; position: number;
};
export type Extra = { id: string; name: string; price_label: string; is_active: boolean; position: number };
export type Service = { id: string; icon: "cm" | "md" | "bv" | "cv" | "ec"; name: string; description: string; points: string[]; is_active: boolean; position: number };
export type Faq = { id: string; question: string; answer: string; is_active: boolean; position: number };
export type DemandeStatus = "nouvelle" | "contactee" | "payee" | "active" | "annulee";
export type Demande = {
  id: string; created_at: string; pack_id: string | null; pack_name: string; pack_price: number;
  extras: string[]; name: string; country: string; phone: string; status: DemandeStatus; notes: string;
};
export type SiteData = { settings: Settings; packs: Pack[]; extras: Extra[]; services: Service[]; faqs: Faq[] };

export const STATUS_LABEL: Record<DemandeStatus, string> = {
  nouvelle: "Nouvelle", contactee: "Contactée", payee: "Payée", active: "Accompagnement en cours", annulee: "Annulée",
};
