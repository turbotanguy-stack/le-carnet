"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";

export async function createContact(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const relation = String(formData.get("relation") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const category = String(formData.get("category") ?? "famille") as "famille" | "prestataire";
  const providerType = String(formData.get("providerType") ?? "").trim();
  if (!name) return { error: "Le nom est requis." };

  const current = await getCurrentFamily();
  if (!current?.member || !current.family) return { error: "Session invalide." };

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    family_id: current.family.id,
    name,
    relation,
    phone,
    category,
    provider_type: providerType,
    created_by: current.member.id,
  });
  if (error) return { error: error.message };

  revalidatePath("/contacts");
  revalidatePath("/");
  return { error: null };
}

export async function deleteContact(id: string) {
  const supabase = await createClient();
  await supabase.from("contacts").delete().eq("id", id);
  revalidatePath("/contacts");
  revalidatePath("/");
}
