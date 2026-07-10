import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentFamily } from "@/lib/family";
import { dateFR, relativeTime } from "@/lib/format";
import {
  DocsIcon,
  CalendarIcon,
  NotesIcon,
  ContactsIcon,
  PhotosIcon,
  ListsIcon,
  ChevronRight,
} from "@/components/icons";

const TILES = [
  { href: "/documents", label: "Documents", Icon: DocsIcon, bg: "#FFF4EE", border: "#F0C4A8", iconBg: "#E8956D", text: "#C4622A" },
  { href: "/calendrier", label: "Calendrier", Icon: CalendarIcon, bg: "#F2FAF0", border: "#B4D8A8", iconBg: "#5CA844", text: "#3E7E2E" },
  { href: "/notes", label: "Notes", Icon: NotesIcon, bg: "#FFFBF0", border: "#EEDAD8", iconBg: "#C49038", text: "#9A7820" },
  { href: "/contacts", label: "Contacts", Icon: ContactsIcon, bg: "#F8F0FC", border: "#D4B8E8", iconBg: "#8B5CB0", text: "#6838A0" },
];

export default async function HomePage() {
  const current = await getCurrentFamily();
  const family = current!.family!;
  const member = current!.member!;
  const supabase = await createClient();

  const [{ count: docsCount }, { count: notesCount }, { count: contactsCount }, { count: photosCount }, { data: lists }, activity] =
    await Promise.all([
      supabase.from("documents").select("*", { count: "exact", head: true }).eq("family_id", family.id),
      supabase.from("notes").select("*", { count: "exact", head: true }).eq("family_id", family.id),
      supabase.from("contacts").select("*", { count: "exact", head: true }).eq("family_id", family.id),
      supabase.from("photos").select("*", { count: "exact", head: true }).eq("family_id", family.id),
      supabase.from("lists").select("id").eq("family_id", family.id),
      supabase
        .from("activity_feed")
        .select("*")
        .eq("family_id", family.id)
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  const listIds = (lists ?? []).map((l) => l.id);
  const { count: itemsCount } =
    listIds.length > 0
      ? await supabase
          .from("list_items")
          .select("*", { count: "exact", head: true })
          .in("list_id", listIds)
      : { count: 0 };

  const { count: upcomingEvents } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("family_id", family.id)
    .gte("start_at", new Date().toISOString());

  const activityRows = activity.data ?? [];
  const actorIds = [...new Set(activityRows.map((a) => a.actor).filter(Boolean))] as string[];
  const { data: actors } = actorIds.length
    ? await supabase.from("family_members").select("id, display_name").in("id", actorIds)
    : { data: [] };
  const actorNames = new Map((actors ?? []).map((a) => [a.id, a.display_name]));

  const last24h = activityRows.filter(
    (a) => Date.now() - new Date(a.created_at).getTime() < 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-8 py-6 md:py-10">
      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="font-display font-bold text-xl md:text-2xl text-ink">
            {family.name}
          </div>
          <div className="text-xs text-muted mt-0.5 capitalize">{dateFR()}</div>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
          style={{ background: member.color }}
        >
          {member.display_name.slice(0, 1).toUpperCase()}
        </div>
      </div>

      <div className="rounded-3xl p-5 md:p-6 mb-6 relative overflow-hidden bg-gradient-to-br from-[#E8956D] to-[#C05028]">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute right-4 -bottom-8 w-28 h-28 rounded-full bg-white/[0.07]" />
        <div className="relative">
          <div className="text-xs font-medium text-white/80 mb-1">Bonjour {member.display_name} !</div>
          <div className="font-display font-bold text-lg md:text-xl text-white mb-1">
            {last24h > 0
              ? `${last24h} nouveau${last24h > 1 ? "x" : ""} partage${last24h > 1 ? "s" : ""}`
              : "Tout est calme"}
          </div>
          <div className="text-xs text-white/75">
            {activityRows.length > 0
              ? "Retrouvez l'activité récente ci-dessous"
              : "Ajoutez un document, une note ou un événement pour commencer"}
          </div>
        </div>
      </div>

      <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        Vos espaces
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        {TILES.map(({ href, label, Icon, bg, border, iconBg, text }) => (
          <Link
            key={href}
            href={href}
            className="rounded-[20px] p-4 block"
            style={{ background: bg, border: `1.5px solid ${border}` }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 text-white"
              style={{ background: iconBg }}
            >
              <Icon />
            </div>
            <div className="text-sm font-semibold text-ink">{label}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: text }}>
              {label === "Documents" && `${docsCount ?? 0} fichiers`}
              {label === "Calendrier" && `${upcomingEvents ?? 0} événements`}
              {label === "Notes" && `${notesCount ?? 0} notes`}
              {label === "Contacts" && `${contactsCount ?? 0} contacts`}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/photos"
        className="rounded-[20px] px-4 py-3.5 flex items-center gap-3 mt-2.5"
        style={{ background: "#FDF0F6", border: "1.5px solid #EFB8D0" }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: "#C85A88" }}>
          <PhotosIcon />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">Photos &amp; vidéos</div>
          <div className="text-xs font-medium mt-0.5" style={{ color: "#A8386A" }}>
            {photosCount ?? 0} souvenirs
          </div>
        </div>
        <ChevronRight className="text-muted" />
      </Link>

      <Link
        href="/listes"
        className="rounded-[20px] px-4 py-3.5 flex items-center gap-3 mt-2.5"
        style={{ background: "#F0F5FC", border: "1.5px solid #AECAE8" }}
      >
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: "#4475B0" }}>
          <ListsIcon />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">Listes</div>
          <div className="text-xs font-medium mt-0.5" style={{ color: "#2E60A0" }}>
            {listIds.length} liste{listIds.length !== 1 ? "s" : ""} · {itemsCount ?? 0} tâches
          </div>
        </div>
        <ChevronRight className="text-muted" />
      </Link>

      <div className="text-xs font-semibold text-muted uppercase tracking-wider mt-7 mb-3">
        Activité récente
      </div>
      <div className="flex flex-col gap-2">
        {activityRows.length === 0 && (
          <div className="text-sm text-muted italic">Aucune activité pour le moment.</div>
        )}
        {activityRows.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-3 flex gap-2.5 items-center shadow-[0_1px_6px_rgba(74,55,40,0.08)]"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-ink truncate">{item.title}</div>
              <div className="text-[10.5px] text-muted mt-0.5">
                {item.actor ? actorNames.get(item.actor) ?? "Un membre" : "Un membre"} ·{" "}
                {relativeTime(item.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
