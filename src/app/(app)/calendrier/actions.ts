"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function createEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const location = String(formData.get("location") ?? "");
  const color = String(formData.get("color") ?? "#D4704A");
  if (!title || !date) return { error: "Titre et date requis." };

  const current = await getCurrentFamily();
  if (!current?.member || !current.family) return { error: "Session invalide." };

  const supabase = await createClient();
  const { error } = await supabase.from("events").insert({
    family_id: current.family.id,
    title,
    location,
    start_at: new Date(date).toISOString(),
    all_day: true,
    color,
    created_by: current.member.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/calendrier");
  revalidatePath("/");
  return { error: null };
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/calendrier");
  revalidatePath("/");
}
