"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function createNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const color = String(formData.get("color") ?? "#FFFBF0");
  if (!title) return { error: "Le titre est requis." };

  const current = await getCurrentFamily();
  if (!current?.member || !current.family) return { error: "Session invalide." };

  const supabase = await createClient();
  const { error } = await supabase.from("notes").insert({
    family_id: current.family.id,
    title,
    body,
    color,
    author: current.member.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/notes");
  revalidatePath("/");
  return { error: null };
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  await supabase.from("notes").delete().eq("id", id);
  revalidatePath("/notes");
  revalidatePath("/");
}
