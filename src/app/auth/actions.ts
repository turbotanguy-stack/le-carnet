"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ActionState = { error?: string } | null;

function randomJoinCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  redirect("/");
}

export async function signUp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "");

  if (password.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." };
  }

  // Created via the Admin API with email_confirm: true so family members
  // can sign up and use the app immediately — this is a small private
  // family app, not a public product where unverified emails are a risk.
  const admin = createAdminClient();
  const { error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  if (createError) return { error: createError.message };

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) return { error: signInError.message };

  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createFamily(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const familyName = String(formData.get("familyName") ?? "");
  const displayName = String(formData.get("displayName") ?? "");
  const relation = String(formData.get("relation") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Session expirée, reconnectez-vous." };

  const { data: family, error: familyError } = await supabase
    .from("families")
    .insert({ name: familyName, join_code: randomJoinCode() })
    .select()
    .single();
  if (familyError) return { error: familyError.message };

  const { error: memberError } = await supabase.from("family_members").insert({
    family_id: family.id,
    user_id: user.id,
    display_name: displayName,
    relation,
  });
  if (memberError) return { error: memberError.message };

  redirect("/");
}

export async function joinFamily(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const joinCode = String(formData.get("joinCode") ?? "").trim().toUpperCase();
  const displayName = String(formData.get("displayName") ?? "");
  const relation = String(formData.get("relation") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Session expirée, reconnectez-vous." };

  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("id")
    .eq("join_code", joinCode)
    .maybeSingle();
  if (familyError) return { error: familyError.message };
  if (!family) return { error: "Aucune famille ne correspond à ce code." };

  const { error: memberError } = await supabase.from("family_members").insert({
    family_id: family.id,
    user_id: user.id,
    display_name: displayName,
    relation,
  });
  if (memberError) return { error: memberError.message };

  redirect("/");
}
