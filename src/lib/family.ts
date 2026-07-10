import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Every (app) page independently calls this, and the (app) layout calls it
// too for the nav shell — without request-level memoization each navigation
// paid for auth.getUser() + two more round trips *twice* per request.
export const getCurrentFamily = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: member } = await supabase
    .from("family_members")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member) return { user, member: null, family: null };

  const { data: family } = await supabase
    .from("families")
    .select("*")
    .eq("id", member.family_id)
    .single();

  return { user, member, family };
});
