import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

// Uses the service_role key, which bypasses RLS and Auth restrictions
// (e.g. email confirmation) entirely. Only ever import this from
// "use server" action files — never from a Client Component — and
// never expose SUPABASE_SERVICE_ROLE_KEY via a NEXT_PUBLIC_ variable.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
