import type { Metadata, Viewport } from "next";
import "./globals.css";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://damas-digital.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Damas Digital · Vos idées, notre mission digitale", template: "%s · Damas Digital" },
  description: "Agence de communication et de marketing digital à Brazzaville. Gestion de vos réseaux sociaux, création de contenus, publicité et vidéo. Choisissez votre pack, on se charge de tout.",
  keywords: ["community management", "marketing digital", "Brazzaville", "Congo", "gestion réseaux sociaux", "agence de communication", "Damas Digital"],
  openGraph: { type: "website", locale: "fr_FR", siteName: "Damas Digital", images: ["/poster.jpg"] },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = { themeColor: "#070d24", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" />
      </head>
      <body>{children}</body>
    </html>
  );
}
