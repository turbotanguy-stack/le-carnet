import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database, FamilyMember } from "@/lib/types";

type MemberWithFamily = FamilyMember & {
  family: Database["public"]["Tables"]["families"]["Row"];
};

// Every (app) page independently calls this, and the (app) layout calls it
// too for the nav shell — without request-level memoization each navigation
// paid for this *twice* per request. React's cache() dedupes that.
//
// The family_members -> families lookup is a real FK relationship, so it's
// fetched as one embedded PostgREST query instead of two sequential
// round trips — with Vercel and Supabase in different regions, every
// round trip this function avoids is one less cross-region hop per
// navigation, on top of the request-level dedupe.
export const getCurrentFamily = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("family_members")
    .select("*, family:families(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return { user, member: null, family: null };

  const { family, ...member } = data as unknown as MemberWithFamily;
  return { user, member, family };
});
