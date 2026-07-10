import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import NotesClient from "./NotesClient";

export default async function NotesPage() {
  const current = await getCurrentFamily();
  const family = current!.family!;
  const supabase = await createClient();

  const [{ data: notes }, { data: members }] = await Promise.all([
    supabase
      .from("notes")
      .select("*")
      .eq("family_id", family.id)
      .order("created_at", { ascending: false }),
    supabase.from("family_members").select("*").eq("family_id", family.id),
  ]);

  return <NotesClient notes={notes ?? []} members={members ?? []} />;
}
