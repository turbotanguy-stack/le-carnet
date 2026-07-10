"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function createList(name: string) {
  const current = await getCurrentFamily();
  if (!current?.member || !current.family) return;
  const supabase = await createClient();
  await supabase.from("lists").insert({
    family_id: current.family.id,
    name,
    created_by: current.member.id,
  });
  revalidatePath("/listes");
}

export async function addListItem(listId: string, label: string, assignedTo: string | null) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("list_items")
    .select("*", { count: "exact", head: true })
    .eq("list_id", listId);
  await supabase.from("list_items").insert({
    list_id: listId,
    label,
    assigned_to: assignedTo,
    position: count ?? 0,
  });
  revalidatePath("/listes");
}

export async function toggleListItem(id: string, done: boolean) {
  const supabase = await createClient();
  await supabase.from("list_items").update({ done: !done }).eq("id", id);
  revalidatePath("/listes");
  revalidatePath("/");
}

export async function deleteListItem(id: string) {
  const supabase = await createClient();
  await supabase.from("list_items").delete().eq("id", id);
  revalidatePath("/listes");
}
