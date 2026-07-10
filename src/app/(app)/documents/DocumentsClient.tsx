"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { uploadDocument, deleteDocument, getDocumentUrl } from "./actions";
import { formatBytes, relativeTime } from "@/lib/format";
import type { DocumentRow } from "@/lib/types";

const CATEGORIES = [
  { id: "tous", label: "Tous" },
  { id: "administratif", label: "Administratif" },
  { id: "recettes", label: "Recettes" },
  { id: "photos", label: "Photos" },
  { id: "general", label: "Général" },
] as const;

function badge(name: string) {
  const ext = name.split(".").pop()?.toUpperCase() ?? "";
  if (ext === "PDF") return { label: "PDF", bg: "#FFE8E0", border: "#F0C4A8", text: "#C84C20" };
  if (["DOC", "DOCX"].includes(ext)) return { label: "DOC", bg: "#E4F0FF", border: "#B8D0F0", text: "#1E50A0" };
  if (["JPG", "JPEG", "PNG", "HEIC"].includes(ext)) return { label: "IMG", bg: "#F8F0FC", border: "#D4B8E8", text: "#6838A0" };
  return { label: ext.slice(0, 4) || "FILE", bg: "#F0F5FC", border: "#B0C5E8", text: "#2E60A0" };
}

export default function DocumentsClient({
  documents,
  uploaderNames,
}: {
  documents: DocumentRow[];
  uploaderNames: Map<string, string>;
}) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("tous");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (category !== "tous" && d.category !== category) return false;
      if (query && !d.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [documents, category, query]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.set("file", file);
    formData.set("category", category === "tous" ? "general" : category);
    setError(null);
    startTransition(async () => {
      const res = await uploadDocument(formData);
      if (res?.error) setError(res.error);
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  async function handleOpen(d: DocumentRow) {
    const url = await getDocumentUrl(d.storage_path);
    if (url) window.open(url, "_blank");
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 px-5 md:px-8 pt-6 pb-4">
        <span className="font-display font-bold text-lg md:text-xl text-ink flex-1">
          Documents
        </span>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFile}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="bg-[#E8956D] text-white text-xs font-semibold px-3.5 py-2 rounded-full disabled:opacity-60"
        >
          {pending ? "Envoi…" : "+ Ajouter"}
        </button>
      </div>

      {error && (
        <div className="mx-5 md:mx-8 mb-3 text-sm text-accent-dark bg-accent-soft border border-[#F0C4A8] rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="px-5 md:px-8 mb-3">
        <div className="bg-white border border-[#EDD9C0] rounded-xl px-3.5 py-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="w-full text-sm outline-none placeholder:text-muted-2"
          />
        </div>
      </div>

      <div className="px-5 md:px-8 mb-3 flex gap-1.5 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[11.5px] font-semibold border transition-colors ${
              category === c.id
                ? "bg-accent text-white border-accent"
                : "bg-white text-[#7A6050] border-[#E0CDB8]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-t-[18px] md:mx-8 md:rounded-2xl">
        {filtered.length === 0 && (
          <div className="text-sm text-muted italic px-5 py-8 text-center">
            Aucun document.
          </div>
        )}
        {filtered.map((d) => {
          const b = badge(d.name);
          return (
            <div
              key={d.id}
              className="flex items-center gap-3 px-5 py-3.5 border-b border-line last:border-b-0"
            >
              <button
                onClick={() => handleOpen(d)}
                className="w-10 h-11 rounded-lg flex items-center justify-center shrink-0 border"
                style={{ background: b.bg, borderColor: b.border }}
              >
                <span className="text-[9px] font-bold" style={{ color: b.text }}>
                  {b.label}
                </span>
              </button>
              <button
                onClick={() => handleOpen(d)}
                className="flex-1 min-w-0 text-left"
              >
                <div className="text-sm font-medium text-ink truncate">{d.name}</div>
                <div className="text-[11px] text-muted mt-0.5">
                  {d.uploaded_by ? uploaderNames.get(d.uploaded_by) ?? "Un membre" : "Un membre"} ·{" "}
                  {relativeTime(d.created_at)} · {formatBytes(d.size_bytes)}
                </div>
              </button>
              <button
                onClick={() =>
                  startTransition(() => deleteDocument(d.id, d.storage_path))
                }
                className="text-[11px] text-muted hover:text-accent-dark shrink-0"
              >
                Supprimer
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
