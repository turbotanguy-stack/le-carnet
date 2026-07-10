import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import CalendrierClient from "./CalendrierClient";

export default async function CalendrierPage() {
  const current = await getCurrentFamily();
  const family = current!.family!;
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("family_id", family.id)
    .order("start_at", { ascending: true });

  return <CalendrierClient events={events ?? []} />;
}
