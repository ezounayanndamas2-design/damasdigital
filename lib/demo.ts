import type { SiteData } from "./types";

/** Contenu de secours, utilisé seulement si la base de données n'est pas encore connectée. */
export const DEMO: SiteData = {
  settings: {
    brand_name: "Damas Digital", slogan: "Vos idées, notre mission digitale.", whatsapp: "242068522857",
    hero_title: "Une présence forte en ligne.", hero_accent: "Un vrai impact sur votre activité.",
    hero_text: "Damas Digital gère vos réseaux sociaux, crée vos contenus et pilote votre communication pour que votre activité gagne en visibilité, attire plus de clients et vende davantage.",
    hero_punch: "Choisissez votre pack, on se charge de tout.",
    stat1_value: 20000, stat1_label: "personnes sont passées chez Damas Digital",
    stat2_value: 50000, stat2_label: "personnes ont utilisé nos services",
    founder_name: "Yann Damas", founder_role: "Fondateur de Damas Digital · Brazzaville",
    founder_bio: "Entrepreneur du digital et du e-commerce, Yann a créé Damas Digital pour aider les entrepreneurs et les marques à se développer en ligne.",
    about_text: "Damas Digital est une agence de communication et de marketing digital. Nous aidons les entrepreneurs, les commerces et les marques à avoir une présence forte et un vrai impact en ligne. Vous choisissez votre pack, nous nous chargeons de tout.",
    facebook: "", instagram: "", tiktok: "", email: "",
  },
  packs: [
    { id: "starter", slug: "starter", name: "Starter", price: 75000, period: "mois", level: "Pour démarrer", tagline: "Une présence efficace pour bien démarrer.", networks: "2 réseaux sociaux", contents: "8 publications / mois",
      items: ["Audit rapide", "Stratégie de communication", "Gestion de 2 réseaux sociaux", "8 publications / mois", "Visuels simples", "Rédaction des textes"],
      audience: ["Entrepreneurs qui lancent leur activité", "Petits commerces qui veulent être présents en ligne", "Marques qui publient sans régularité"], is_featured: false, is_active: true, position: 1 },
    { id: "pro", slug: "pro", name: "Pro", price: 150000, period: "mois", level: "Pour grandir", tagline: "Une communication complète et performante.", networks: "3 réseaux sociaux", contents: "12 publications / mois",
      items: ["Stratégie marketing", "Gestion de 3 réseaux sociaux", "12 publications / mois", "8 stories", "Création de visuels", "Rédaction + calendrier éditorial", "Animation de communauté", "Suivi des statistiques"],
      audience: ["Entreprises qui veulent une communication régulière", "Marques qui veulent animer leur communauté", "Commerces qui veulent suivre leurs résultats"], is_featured: false, is_active: true, position: 2 },
    { id: "premium", slug: "premium", name: "Premium", price: 250000, period: "mois", level: "Impact maximal", tagline: "Une stratégie avancée pour un impact maximal.", networks: "Toutes les pages", contents: "16 publications / mois",
      items: ["Stratégie complète", "Gestion de toutes les pages", "16 publications / mois", "Stories régulières", "Création de contenus vidéo", "Rédaction + calendrier éditorial", "Animation de communauté", "Optimisation des pages", "Analyse mensuelle", "Recommandations pour développer les ventes"],
      audience: ["Marques présentes sur plusieurs réseaux", "Entreprises qui veulent de la vidéo", "Activités qui veulent développer leurs ventes"], is_featured: false, is_active: true, position: 3 },
    { id: "full-boost", slug: "full-boost", name: "Full Boost", price: 350000, period: "mois", level: "Sur-mesure", tagline: "Un accompagnement sur-mesure pour aller encore plus loin.", networks: "Gestion quotidienne", contents: "Contenu professionnel",
      items: ["Prise en charge complète de la communication", "Stratégie marketing avancée", "Création de contenu professionnel", "Gestion quotidienne des réseaux", "Vidéos / Reels / TikTok", "Campagnes publicitaires", "Suivi des prospects", "Reporting détaillé", "Optimisation continue"],
      audience: ["Entreprises qui délèguent toute leur communication", "Marques qui investissent dans la publicité", "Dirigeants qui veulent des résultats sans y passer du temps"], is_featured: true, is_active: true, position: 4 },
  ],
  extras: [
    ["Création d’une identité visuelle", "75 000 FCFA"], ["Création d’un logo", "30 000 FCFA"], ["Création d’une affiche / publicité", "10 000 à 20 000 FCFA"],
    ["Montage d’une vidéo courte", "15 000 à 30 000 FCFA"], ["Gestion d’une campagne sponsorisée", "30 000 FCFA + budget publicitaire"],
    ["Audit complet d’une entreprise", "50 000 FCFA"], ["Élaboration d’une stratégie marketing complète", "75 000 FCFA"],
  ].map(([name, price_label], i) => ({ id: "x" + i, name, price_label, is_active: true, position: i + 1 })),
  services: [
    { id: "s1", icon: "cm", name: "Community Management", description: "Vos réseaux sociaux gérés efficacement, du profil jusqu’à la relation client.", points: ["Création et optimisation de pages", "Stratégie de communication", "Création de contenus", "Calendrier éditorial", "Gestion des communautés", "Relation client", "Analyse des performances"], is_active: true, position: 1 },
    { id: "s2", icon: "md", name: "Marketing digital", description: "Des actions pour vendre en ligne et attirer de nouveaux clients.", points: ["Stratégie de vente en ligne", "Publicité Facebook et Instagram", "Publicité TikTok", "Acquisition de clients", "Tunnel de vente", "WhatsApp Business"], is_active: true, position: 2 },
    { id: "s3", icon: "bv", name: "Booster ses comptes et sa visibilité", description: "Une présence en ligne qui grandit, de façon organique et avec la publicité.", points: ["Optimisation des profils", "Croissance organique", "Techniques d’engagement", "Analyse des statistiques", "Publicité de visibilité"], is_active: true, position: 3 },
    { id: "s4", icon: "cv", name: "Création de contenu vidéo", description: "Des vidéos qui retiennent l’attention et donnent envie d’acheter.", points: ["Tournage", "Montage CapCut", "Vidéos publicitaires", "Storytelling", "Reels et TikTok"], is_active: true, position: 4 },
  ],
  faqs: [
    ["Comment choisir mon accompagnement ?", "Starter convient pour démarrer avec 2 réseaux, Pro pour une communication régulière sur 3 réseaux, Premium pour un impact maximal avec de la vidéo, et Full Boost si vous voulez nous confier toute votre communication, publicité comprise. En cas de doute, choisissez un pack : nous ajustons avec vous lors de l’échange."],
    ["Comment effectuer mon inscription ?", "Cliquez sur « Choisir cet accompagnement », indiquez votre nom, votre pays et votre numéro, ajoutez si besoin des prestations supplémentaires, puis envoyez le message préparé sur WhatsApp. Nous vous répondons pour finaliser."],
    ["Comment payer ma formule ?", "Aucun paiement ne se fait sur le site. Les modalités de paiement vous sont communiquées directement lors de l’échange sur WhatsApp, puis votre accompagnement est confirmé."],
    ["Quand démarre mon accompagnement ?", "Dès la confirmation, nous lançons votre accompagnement : audit, puis stratégie, puis création et publication de vos contenus."],
    ["Puis-je tout suivre depuis mon téléphone ?", "Oui. Tout se fait depuis votre téléphone : échanges, validation des contenus et rapports."],
    ["Est-ce que je reçois les contenus créés pour moi ?", "Oui. Les visuels, vidéos et textes réalisés pour votre activité vous sont transmis et restent à votre disposition."],
    ["Peut-on bénéficier d’un accompagnement personnalisé ?", "Oui. Le pack Full Boost est entièrement sur-mesure, et chaque pack est adapté à votre activité dès l’audit."],
  ].map(([question, answer], i) => ({ id: "f" + i, question, answer, is_active: true, position: i + 1 })),
};
