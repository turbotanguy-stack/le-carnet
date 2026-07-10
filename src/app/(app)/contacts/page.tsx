import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import ContactsClient from "./ContactsClient";

export default async function ContactsPage() {
  const current = await getCurrentFamily();
  const family = current!.family!;
  const supabase = await createClient();

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("family_id", family.id)
    .order("created_at", { ascending: true });

  return <ContactsClient contacts={contacts ?? []} />;
}
