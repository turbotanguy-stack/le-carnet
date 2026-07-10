import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import ListesClient from "./ListesClient";
import type { ListItem } from "@/lib/types";

export default async function ListesPage() {
  const current = await getCurrentFamily();
  const family = current!.family!;
  const supabase = await createClient();

  const [{ data: lists }, { data: members }] = await Promise.all([
    supabase
      .from("lists")
      .select("*")
      .eq("family_id", family.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("family_members")
      .select("*")
      .eq("family_id", family.id),
  ]);

  const listIds = (lists ?? []).map((l) => l.id);
  const { data: items } = listIds.length
    ? await supabase
        .from("list_items")
        .select("*")
        .in("list_id", listIds)
        .order("position", { ascending: true })
    : { data: [] };

  const itemsByList = new Map<string, ListItem[]>();
  for (const item of items ?? []) {
    const arr = itemsByList.get(item.list_id) ?? [];
    arr.push(item);
    itemsByList.set(item.list_id, arr);
  }

  return (
    <ListesClient
      lists={lists ?? []}
      itemsByList={itemsByList}
      members={members ?? []}
    />
  );
}
