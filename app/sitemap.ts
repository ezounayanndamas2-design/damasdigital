import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://damas-digital.vercel.app";
  const { packs } = await getSiteData();
  return [{ url: base, priority: 1 }, ...packs.map((p) => ({ url: `${base}/packs/${p.slug}`, priority: 0.8 }))];
}
