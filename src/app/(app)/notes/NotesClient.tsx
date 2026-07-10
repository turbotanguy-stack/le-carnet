"use client";

import { useState, useTransition } from "react";
import { createNote, deleteNote } from "./actions";
import { relativeTime } from "@/lib/format";
import type { Note, FamilyMember } from "@/lib/types";

const COLORS = [
  { bg: "#FFFBF0", border: "#EDD9A0" },
  { bg: "#FFF8F5", border: "#F0C4A8" },
  { bg: "#F0F5FC", border: "#B0C5E8" },
  { bg: "#FFF", border: "#E8DCB8" },
  { bg: "#F8F0FC", border: "#D4B8E8" },
];

export default function NotesClient({
  notes,
  members,
}: {
  notes: Note[];
  members: FamilyMember[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const memberMap = new Map(members.map((m) => [m.id, m]));

  async function handleCreate(formData: FormData) {
    setError(null);
    const res = await createNote(formData);
    if (res?.error) setError(res.error);
    else setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 px-5 md:px-8 pt-6 pb-4">
        <span className="font-display font-bold text-lg md:text-xl text-ink flex-1">
          Notes
        </span>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-gold text-white text-xs font-semibold px-3.5 py-2 rounded-full"
        >
          + Note
        </button>
      </div>

      {showForm && (
        <form
          action={handleCreate}
          className="mx-5 md:mx-8 mb-5 bg-white border border-line rounded-2xl p-4 flex flex-col gap-2.5"
        >
          <input
            name="title"
            required
            placeholder="Titre"
            className="border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none"
          />
          <textarea
            name="body"
            placeholder="Contenu…"
            rows={3}
            className="border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none resize-none"
          />
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <label key={c.bg} className="flex items-center">
                <input type="radio" name="color" value={c.bg} defaultChecked={c.bg === COLORS[0].bg} className="hidden peer" />
                <span
                  className="w-6 h-6 rounded-full inline-block border peer-checked:ring-2 ring-accent ring-offset-1"
                  style={{ background: c.bg, borderColor: c.border }}
                />
              </label>
            ))}
          </div>
          {error && <p className="text-xs text-accent-dark">{error}</p>}
          <button type="submit" className="bg-ink text-white text-xs font-semibold py-2 rounded-xl">
            Ajouter
          </button>
        </form>
      )}

      <div className="px-5 md:px-8 pb-10">
        {notes.length === 0 && (
          <div className="text-sm text-muted italic text-center py-8">Aucune note.</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {notes.map((note, i) => {
            const author = note.author ? memberMap.get(note.author) : undefined;
            const color = COLORS[i % COLORS.length];
            return (
              <div
                key={note.id}
                className="rounded-2xl p-3.5 relative group"
                style={{ background: note.color || color.bg, border: `1.5px solid ${color.border}` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: author?.color ?? "#8B6050" }}
                  >
                    <span className="text-[10px] font-semibold text-white">
                      {(author?.display_name ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold text-ink truncate">
                      {author?.display_name ?? "Membre"}
                    </div>
                    <div className="text-[10px] text-muted">{relativeTime(note.created_at)}</div>
                  </div>
                </div>
                <div className="text-[13px] font-semibold text-ink mb-1">{note.title}</div>
                {note.body && (
                  <div className="text-[11px] leading-relaxed text-[#7A6050] line-clamp-4">
                    {note.body}
                  </div>
                )}
                <button
                  onClick={() => startTransition(() => deleteNote(note.id))}
                  className="absolute top-2 right-2 text-[10px] text-muted opacity-0 group-hover:opacity-100 hover:text-accent-dark"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
