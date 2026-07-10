"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { uploadPhoto, deletePhoto } from "./actions";
import { MONTH_NAMES_FR } from "@/lib/calendar";
import type { Photo } from "@/lib/types";

type PhotoWithUrl = Photo & { url: string | null };

export default function PhotosClient({ photos }: { photos: PhotoWithUrl[] }) {
  const albums = useMemo(
    () => [...new Set(photos.map((p) => p.album))],
    [photos]
  );
  const [album, setAlbum] = useState<string>("tous");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = album === "tous" ? photos : photos.filter((p) => p.album === album);

  const groups = useMemo(() => {
    const map = new Map<string, PhotoWithUrl[]>();
    for (const p of filtered) {
      const d = new Date(p.taken_at);
      const key = `${MONTH_NAMES_FR[d.getMonth()]} ${d.getFullYear()}`;
      const arr = map.get(key) ?? [];
      arr.push(p);
      map.set(key, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    formData.set("album", album === "tous" ? "Général" : album);
    setError(null);
    startTransition(async () => {
      const res = await uploadPhoto(formData);
      if (res?.error) setError(res.error);
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 px-5 md:px-8 pt-6 pb-4">
        <span className="font-display font-bold text-lg md:text-xl text-ink flex-1">
          Photos &amp; vidéos
        </span>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="bg-pink text-white text-xs font-semibold px-3.5 py-2 rounded-full disabled:opacity-60"
        >
          {pending ? "Envoi…" : "+ Ajouter"}
        </button>
      </div>

      {error && (
        <div className="mx-5 md:mx-8 mb-3 text-sm text-accent-dark bg-accent-soft border border-[#F0C4A8] rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="px-5 md:px-8 mb-3 flex gap-1.5 overflow-x-auto">
        <button
          onClick={() => setAlbum("tous")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11.5px] font-semibold border ${
            album === "tous" ? "bg-pink text-white border-pink" : "bg-white text-[#7A6050] border-[#E0CDB8]"
          }`}
        >
          Tous les albums
        </button>
        {albums.map((a) => (
          <button
            key={a}
            onClick={() => setAlbum(a)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11.5px] font-semibold border ${
              album === a ? "bg-pink text-white border-pink" : "bg-white text-[#7A6050] border-[#E0CDB8]"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-t-[18px] md:mx-8 md:rounded-2xl p-3.5 pb-8">
        {groups.length === 0 && (
          <div className="text-sm text-muted italic text-center py-8">Aucun souvenir pour le moment.</div>
        )}
        {groups.map(([label, items]) => (
          <div key={label} className="mb-4 last:mb-0">
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
              {label}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {items.map((p) => (
                <a
                  key={p.id}
                  href={p.url ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-square rounded-xl overflow-hidden relative bg-[#C05028] group"
                >
                  {p.url && !p.is_video && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                  )}
                  {p.url && p.is_video && (
                    <video src={p.url} className="w-full h-full object-cover" muted />
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      startTransition(() => deletePhoto(p.id, p.storage_path));
                    }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
