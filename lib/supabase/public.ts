import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Client anonyme sans cookies : lecture du contenu public, compatible avec la mise en cache. */
export const supabasePublic = () => createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
