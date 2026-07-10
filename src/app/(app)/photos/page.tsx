import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import PhotosClient from "./PhotosClient";

export default async function PhotosPage() {
  const current = await getCurrentFamily();
  const family = current!.family!;
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("family_id", family.id)
    .order("taken_at", { ascending: false });

  const withUrls = await Promise.all(
    (photos ?? []).map(async (p) => {
      const { data } = await supabase.storage
        .from("photos")
        .createSignedUrl(p.storage_path, 60 * 30);
      return { ...p, url: data?.signedUrl ?? null };
    })
  );

  return <PhotosClient photos={withUrls} />;
}
