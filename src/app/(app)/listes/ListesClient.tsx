"use client";

import { useState, useTransition } from "react";
import {
  createList,
  addListItem,
  toggleListItem,
  deleteListItem,
} from "./actions";
import type { ListRow, ListItem, FamilyMember } from "@/lib/types";

export default function ListesClient({
  lists,
  itemsByList,
  members,
}: {
  lists: ListRow[];
  itemsByList: Map<string, ListItem[]>;
  members: FamilyMember[];
}) {
  const [activeId, setActiveId] = useState(lists[0]?.id ?? null);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemAssignee, setNewItemAssignee] = useState("");
  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(lists.length === 0);
  const [, startTransition] = useTransition();

  const memberName = new Map(members.map((m) => [m.id, m.display_name]));
  const activeList = lists.find((l) => l.id === activeId) ?? null;
  const items = activeList ? itemsByList.get(activeList.id) ?? [] : [];
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  function handleAddItem() {
    if (!activeList || !newItemLabel.trim()) return;
    startTransition(() =>
      addListItem(activeList.id, newItemLabel.trim(), newItemAssignee || null)
    );
    setNewItemLabel("");
    setNewItemAssignee("");
  }

  function handleCreateList() {
    if (!newListName.trim()) return;
    startTransition(() => createList(newListName.trim()));
    setNewListName("");
    setShowNewList(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 px-5 md:px-8 pt-6 pb-4">
        <span className="font-display font-bold text-lg md:text-xl text-ink flex-1">
          Listes
        </span>
        <button
          onClick={() => setShowNewList((s) => !s)}
          className="bg-blue text-white text-xs font-semibold px-3.5 py-2 rounded-full"
        >
          + Nouvelle
        </button>
      </div>

      {showNewList && (
        <div className="mx-5 md:mx-8 mb-4 flex gap-2">
          <input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Nom de la liste"
            className="flex-1 bg-white border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
          />
          <button
            onClick={handleCreateList}
            className="bg-ink text-white text-xs font-semibold px-3.5 rounded-xl"
          >
            Créer
          </button>
        </div>
      )}

      {lists.length > 0 && (
        <div className="px-5 md:px-8 mb-3 flex gap-0 overflow-x-auto">
          {lists.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setActiveId(l.id)}
              className={`flex-1 min-w-[110px] whitespace-nowrap px-2 py-2 text-[11.5px] font-semibold border transition-colors ${
                i === 0 ? "rounded-l-xl" : ""
              } ${i === lists.length - 1 ? "rounded-r-xl" : "border-r-0"} ${
                activeId === l.id
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-[#9E8878] border-[#E0CDB8]"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}

      {activeList && (
        <>
          <div className="px-5 md:px-8 mb-2">
            <div className="bg-[#FFF8F0] rounded-xl px-3.5 py-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-[#9A7820]">
                {done} / {items.length} articles cochés
              </span>
              <div className="w-20 h-[5px] bg-[#EDD9A0] rounded-full">
                <div
                  className="h-full bg-gold rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-t-[18px] md:mx-8 md:rounded-2xl mb-4">
            {items.length === 0 && (
              <div className="text-sm text-muted italic px-5 py-8 text-center">
                Aucun article. Ajoutez-en un ci-dessous.
              </div>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-line last:border-b-0"
              >
                <button
                  onClick={() => startTransition(() => toggleListItem(item.id, item.done))}
                  className="w-5 h-5 min-w-5 rounded-md border-[1.5px] flex items-center justify-center shrink-0"
                  style={{
                    borderColor: item.done ? "#D4704A" : "#C0B0A0",
                    background: item.done ? "#D4704A" : "transparent",
                  }}
                >
                  {item.done && <span className="text-white text-[11px] font-bold">✓</span>}
                </button>
                <span
                  className="flex-1 text-sm"
                  style={{
                    color: item.done ? "#B8A898" : "#4A3728",
                    textDecoration: item.done ? "line-through" : "none",
                  }}
                >
                  {item.label}
                </span>
                {item.assigned_to && (
                  <span className="text-[10.5px] text-muted-2">
                    {memberName.get(item.assigned_to) ?? ""}
                  </span>
                )}
                <button
                  onClick={() => startTransition(() => deleteListItem(item.id))}
                  className="text-[11px] text-muted hover:text-accent-dark shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="px-5 md:px-8 pb-8 flex gap-2">
            <input
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Ajouter un article…"
              className="flex-1 bg-white border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
            />
            <select
              value={newItemAssignee}
              onChange={(e) => setNewItemAssignee(e.target.value)}
              className="bg-white border border-[#E0CDB8] rounded-xl px-2 text-xs outline-none max-w-[110px]"
            >
              <option value="">Qui ?</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.display_name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddItem}
              className="bg-ink text-white text-xs font-semibold px-3.5 rounded-xl"
            >
              Ajouter
            </button>
          </div>
        </>
      )}
    </div>
  );
}
