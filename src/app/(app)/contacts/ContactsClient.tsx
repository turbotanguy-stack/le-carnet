"use client";

import { useMemo, useState, useTransition } from "react";
import { createContact, deleteContact } from "./actions";
import type { Contact } from "@/lib/types";

const AVATAR_COLORS = ["#8B6050", "#B070A0", "#D4704A", "#4A8070", "#607080"];

export default function ContactsClient({ contacts }: { contacts: Contact[] }) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      contacts.filter(
        (c) =>
          !query ||
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.relation.toLowerCase().includes(query.toLowerCase())
      ),
    [contacts, query]
  );

  const famille = filtered.filter((c) => c.category === "famille");
  const prestataires = filtered.filter((c) => c.category === "prestataire");

  async function handleCreate(formData: FormData) {
    setError(null);
    const res = await createContact(formData);
    if (res?.error) setError(res.error);
    else setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 px-5 md:px-8 pt-6 pb-4">
        <span className="font-display font-bold text-lg md:text-xl text-ink flex-1">
          Contacts
        </span>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-purple text-white text-xs font-semibold px-3.5 py-2 rounded-full"
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <form
          action={handleCreate}
          className="mx-5 md:mx-8 mb-4 bg-white border border-line rounded-2xl p-4 flex flex-col gap-2.5"
        >
          <input name="name" required placeholder="Nom" className="border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none" />
          <div className="flex gap-2">
            <input name="relation" placeholder="Rôle (Papa, Médecin…)" className="flex-1 border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none" />
            <input name="phone" placeholder="Téléphone" className="flex-1 border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none" />
          </div>
          <div className="flex gap-2 items-center">
            <select name="category" className="border border-[#E0CDB8] rounded-xl px-2 py-2 text-xs outline-none">
              <option value="famille">Famille</option>
              <option value="prestataire">Prestataire</option>
            </select>
            <input name="providerType" placeholder="Type (Médecin, Artisan…)" className="flex-1 border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none" />
          </div>
          {error && <p className="text-xs text-accent-dark">{error}</p>}
          <button type="submit" className="bg-ink text-white text-xs font-semibold py-2 rounded-xl">
            Ajouter
          </button>
        </form>
      )}

      <div className="px-5 md:px-8 mb-3">
        <div className="bg-white border border-[#EDD9C0] rounded-xl px-3.5 py-2.5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un contact…"
            className="w-full text-sm outline-none placeholder:text-muted-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-t-[18px] md:mx-8 md:rounded-2xl pb-6">
        {famille.length > 0 && (
          <>
            <SectionLabel text="Famille" />
            {famille.map((c, i) => (
              <ContactRow key={c.id} c={c} color={AVATAR_COLORS[i % AVATAR_COLORS.length]} onDelete={() => startTransition(() => deleteContact(c.id))} />
            ))}
          </>
        )}
        {prestataires.length > 0 && (
          <>
            <SectionLabel text="Prestataires" />
            {prestataires.map((c, i) => (
              <ContactRow key={c.id} c={c} color="#607080" onDelete={() => startTransition(() => deleteContact(c.id))} />
            ))}
          </>
        )}
        {filtered.length === 0 && (
          <div className="text-sm text-muted italic px-5 py-8 text-center">Aucun contact.</div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="px-5 pt-3 pb-1">
      <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">{text}</span>
    </div>
  );
}

function ContactRow({ c, color, onDelete }: { c: Contact; color: string; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-3 px-5 py-2.5 border-b border-line last:border-b-0 group">
      <div className="w-9.5 h-9.5 rounded-full flex items-center justify-center shrink-0" style={{ background: color, width: 38, height: 38 }}>
        <span className="text-sm font-semibold text-white">{c.name.slice(0, 1).toUpperCase()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-ink truncate">{c.name}</div>
        <div className="text-[11px] text-muted mt-0.5">
          {[c.relation, c.phone].filter(Boolean).join(" · ")}
        </div>
      </div>
      {c.category === "prestataire" && c.provider_type && (
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#EDF8E8] text-[#3E7E2E] shrink-0">
          {c.provider_type}
        </span>
      )}
      <button onClick={onDelete} className="text-[11px] text-muted opacity-0 group-hover:opacity-100 hover:text-accent-dark shrink-0">
        ✕
      </button>
    </div>
  );
}
