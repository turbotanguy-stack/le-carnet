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

  const { data: signed } = photos?.length
    ? await supabase.storage
        .from("photos")
        .createSignedUrls(
          photos.map((p) => p.storage_path),
          60 * 30
        )
    : { data: [] };
  const urlByPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  const withUrls = (photos ?? []).map((p) => ({
    ...p,
    url: urlByPath.get(p.storage_path) ?? null,
  }));

  return <PhotosClient photos={withUrls} />;
}
