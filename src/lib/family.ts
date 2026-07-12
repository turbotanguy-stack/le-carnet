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
// round trips — every round trip this function avoids is one less hop
// per navigation, on top of the request-level dedupe.
//
// getClaims() verifies the JWT locally against Supabase's cached JWKS
// (this project uses asymmetric signing keys) instead of getUser()'s
// unconditional network call to the Auth server. Only the user id is
// needed here — no caller reads anything else off the returned `user`.
export const getCurrentFamily = cache(async () => {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData) return null;
  const user = { id: claimsData.claims.sub };

  const { data } = await supabase
    .from("family_members")
    .select("*, family:families(*)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return { user, member: null, family: null };

  const { family, ...member } = data as unknown as MemberWithFamily;
  return { user, member, family };
});
