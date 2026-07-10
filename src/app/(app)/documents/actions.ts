"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function uploadDocument(formData: FormData) {
  const file = formData.get("file") as File | null;
  const category = String(formData.get("category") ?? "general");
  if (!file || file.size === 0) return { error: "Aucun fichier sélectionné." };

  const current = await getCurrentFamily();
  if (!current?.member || !current.family) return { error: "Session invalide." };

  const supabase = await createClient();
  const path = `${current.family.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: file.type || undefined });
  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("documents").insert({
    family_id: current.family.id,
    name: file.name,
    storage_path: path,
    category: category as "administratif" | "recettes" | "photos" | "general",
    size_bytes: file.size,
    mime_type: file.type,
    uploaded_by: current.member.id,
  });
  if (insertError) return { error: insertError.message };

  revalidatePath("/documents");
  revalidatePath("/");
  return { error: null };
}

export async function deleteDocument(id: string, storagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("documents").remove([storagePath]);
  await supabase.from("documents").delete().eq("id", id);
  revalidatePath("/documents");
  revalidatePath("/");
}

export async function getDocumentUrl(storagePath: string) {
  const supabase = await createClient();
  const { data } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60 * 10);
  return data?.signedUrl ?? null;
}
