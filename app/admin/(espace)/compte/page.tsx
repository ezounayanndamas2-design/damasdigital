import { supabaseServer } from "@/lib/supabase/server";
import PasswordForm from "./PasswordForm";

export default async function Compte() {
  const { data: { user } } = await (await supabaseServer()).auth.getUser();
  return (
    <>
      <div className="ad-head"><div><h1>Mon compte</h1><p>Connecté en tant que {user?.email}.</p></div></div>
      <PasswordForm />
    </>
  );
}
