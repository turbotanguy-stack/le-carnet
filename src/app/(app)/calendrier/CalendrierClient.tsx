"use client";

import { useMemo, useState, useTransition } from "react";
import { createEvent, deleteEvent } from "./actions";
import {
  MONTH_NAMES_FR,
  WEEKDAY_LETTERS_FR,
  getMonthGrid,
  sameDay,
} from "@/lib/calendar";
import type { EventRow } from "@/lib/types";

const COLORS = [
  { value: "#D4704A", label: "Terracotta" },
  { value: "#5CA844", label: "Vert" },
  { value: "#4475B0", label: "Bleu" },
  { value: "#8B5CB0", label: "Violet" },
];

export default function CalendrierClient({ events }: { events: EventRow[] }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, EventRow[]>();
    for (const ev of events) {
      const d = new Date(ev.start_at);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) ?? [];
      arr.push(ev);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  const upcoming = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return [...events]
      .filter((e) => new Date(e.start_at) >= now)
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
      .slice(0, 8);
  }, [events]);

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); } else setMonth((m) => m + 1);
  }

  async function handleCreate(formData: FormData) {
    setError(null);
    const res = await createEvent(formData);
    if (res?.error) setError(res.error);
    else setShowForm(false);
  }

  return (
    <div>
      <div className="flex items-center gap-2.5 px-5 md:px-8 pt-6 pb-4">
        <span className="font-display font-bold text-lg md:text-xl text-ink flex-1">
          Calendrier
        </span>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-green text-white text-xs font-semibold px-3.5 py-2 rounded-full"
        >
          + Événement
        </button>
      </div>

      {showForm && (
        <form
          action={handleCreate}
          className="mx-5 md:mx-8 mb-4 bg-white border border-line rounded-2xl p-4 flex flex-col gap-2.5"
        >
          <input
            name="title"
            required
            placeholder="Titre de l'événement"
            className="border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none"
          />
          <div className="flex gap-2">
            <input
              name="date"
              type="date"
              required
              className="flex-1 border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none"
            />
            <input
              name="location"
              placeholder="Lieu"
              className="flex-1 border border-[#E0CDB8] rounded-xl px-3.5 py-2 text-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <label key={c.value} className="flex items-center gap-1 text-xs">
                <input type="radio" name="color" value={c.value} defaultChecked={c.value === COLORS[0].value} />
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block"
                  style={{ background: c.value }}
                />
              </label>
            ))}
          </div>
          {error && <p className="text-xs text-accent-dark">{error}</p>}
          <button
            type="submit"
            className="bg-ink text-white text-xs font-semibold py-2 rounded-xl"
          >
            Ajouter
          </button>
        </form>
      )}

      <div className="px-5 md:px-8 mb-2 flex items-center justify-between">
        <button onClick={prevMonth} className="text-muted px-2 py-1">‹</button>
        <span className="font-semibold text-sm text-ink">
          {MONTH_NAMES_FR[month]} {year}
        </span>
        <button onClick={nextMonth} className="text-muted px-2 py-1">›</button>
      </div>

      <div className="px-5 md:px-8 mb-4">
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {WEEKDAY_LETTERS_FR.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-semibold text-muted py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {grid.map((date, i) => {
            if (!date) return <div key={i} className="py-1" />;
            const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            const dayEvents = eventsByDay.get(key) ?? [];
            const isToday = sameDay(date, today);
            return (
              <div key={i} className="text-center py-1">
                <div className="flex flex-col items-center">
                  <span
                    className={`inline-flex items-center justify-center rounded-full text-xs ${
                      isToday ? "bg-accent text-white font-bold" : "text-[#7A6050]"
                    }`}
                    style={{ width: 26, height: 26 }}
                  >
                    {date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 -mt-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className="w-1 h-1 rounded-full"
                          style={{ background: e.color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-t-[18px] md:mx-8 md:rounded-2xl pb-6">
        <div className="px-5 pt-3 pb-1.5">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            À venir
          </span>
        </div>
        {upcoming.length === 0 && (
          <div className="text-sm text-muted italic px-5 py-8 text-center">
            Aucun événement à venir.
          </div>
        )}
        {upcoming.map((e) => {
          const d = new Date(e.start_at);
          return (
            <div key={e.id} className="flex gap-3 px-5 py-2.5 border-b border-line last:border-b-0">
              <div className="flex flex-col items-center w-9 shrink-0">
                <div className="font-bold text-base leading-none" style={{ color: e.color }}>
                  {d.getDate()}
                </div>
                <div className="text-[10px] font-medium text-muted">
                  {MONTH_NAMES_FR[d.getMonth()].slice(0, 4).toLowerCase()}
                </div>
              </div>
              <div className="flex-1 pl-3" style={{ borderLeft: `3px solid ${e.color}` }}>
                <div className="text-sm font-semibold text-ink">{e.title}</div>
                {e.location && (
                  <div className="text-[11px] text-muted mt-0.5">{e.location}</div>
                )}
              </div>
              <button
                onClick={() => startTransition(() => deleteEvent(e.id))}
                className="text-[11px] text-muted hover:text-accent-dark shrink-0 self-start"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
