import { unstable_cache } from "next/cache";
import { DEMO } from "./demo";
import { hasSupabase } from "./supabase/config";
import { supabasePublic } from "./supabase/public";
import type { SiteData } from "./types";

async function load(): Promise<SiteData> {
  if (!hasSupabase) return DEMO;
  try {
    const sb = supabasePublic();
    const [s, p, x, sv, f] = await Promise.all([
      sb.from("settings").select("*").eq("id", 1).single(),
      sb.from("packs").select("*").eq("is_active", true).order("position"),
      sb.from("extras").select("*").eq("is_active", true).order("position"),
      sb.from("services").select("*").eq("is_active", true).order("position"),
      sb.from("faqs").select("*").eq("is_active", true).order("position"),
    ]);
    if (s.error || p.error) throw s.error ?? p.error;
    return {
      settings: s.data ?? DEMO.settings,
      packs: p.data ?? [],
      extras: x.data ?? [],
      services: sv.data ?? [],
      faqs: f.data ?? [],
    };
  } catch (e) {
    console.error("Lecture Supabase impossible, contenu de secours utilisé :", e);
    return DEMO;
  }
}

/** Contenu du site, mis en cache 60 s et rafraîchi immédiatement après chaque modification dans l'admin. */
export const getSiteData = unstable_cache(load, ["site-data"], { revalidate: 60, tags: ["site"] });
