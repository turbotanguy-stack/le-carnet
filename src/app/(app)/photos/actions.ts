"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function uploadPhoto(formData: FormData) {
  const file = formData.get("file") as File | null;
  const album = String(formData.get("album") ?? "Général").trim() || "Général";
  if (!file || file.size === 0) return { error: "Aucun fichier sélectionné." };

  const current = await getCurrentFamily();
  if (!current?.member || !current.family) return { error: "Session invalide." };

  const supabase = await createClient();
  const path = `${current.family.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type || undefined });
  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("photos").insert({
    family_id: current.family.id,
    album,
    storage_path: path,
    is_video: file.type.startsWith("video/"),
    uploaded_by: current.member.id,
  });
  if (insertError) return { error: insertError.message };

  revalidatePath("/photos");
  revalidatePath("/");
  return { error: null };
}

export async function deletePhoto(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("photos").remove([storagePath]);
  await supabase.from("photos").delete().eq("id", id);
  revalidatePath("/photos");
  revalidatePath("/");
}
