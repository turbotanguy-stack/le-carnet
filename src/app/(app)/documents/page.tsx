import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import DocumentsClient from "./DocumentsClient";

export default async function DocumentsPage() {
  const current = await getCurrentFamily();
  const family = current!.family!;
  const supabase = await createClient();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("family_id", family.id)
    .order("created_at", { ascending: false });

  const uploaderIds = [
    ...new Set((documents ?? []).map((d) => d.uploaded_by).filter(Boolean)),
  ] as string[];
  const { data: uploaders } = uploaderIds.length
    ? await supabase.from("family_members").select("id, display_name").in("id", uploaderIds)
    : { data: [] };
  const uploaderNames = new Map((uploaders ?? []).map((u) => [u.id, u.display_name]));

  return <DocumentsClient documents={documents ?? []} uploaderNames={uploaderNames} />;
}
