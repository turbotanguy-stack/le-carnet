"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import {
  HomeIcon,
  DocsIcon,
  CalendarIcon,
  ListsIcon,
  ContactsIcon,
  NotesIcon,
  PhotosIcon,
} from "@/components/icons";
import type { FamilyMember } from "@/lib/types";

const NAV = [
  { href: "/", label: "Accueil", Icon: HomeIcon, mobile: true },
  { href: "/documents", label: "Docs", Icon: DocsIcon, mobile: true },
  { href: "/calendrier", label: "Agenda", Icon: CalendarIcon, mobile: true },
  { href: "/listes", label: "Listes", Icon: ListsIcon, mobile: true },
  { href: "/contacts", label: "Contacts", Icon: ContactsIcon, mobile: true },
  { href: "/notes", label: "Notes", Icon: NotesIcon, mobile: false },
  { href: "/photos", label: "Photos", Icon: PhotosIcon, mobile: false },
];

export default function AppShell({
  familyName,
  member,
  children,
}: {
  familyName: string;
  member: FamilyMember;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:flex md:w-60 md:flex-col md:shrink-0 border-r border-line bg-cream px-4 py-6">
        <div className="mb-8 px-2">
          <div className="font-display font-bold text-lg text-ink">Le Carnet</div>
          <div className="text-xs text-muted mt-0.5">{familyName}</div>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-dark"
                    : "text-muted hover:bg-white"
                }`}
              >
                <Icon className="shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 flex items-center gap-3 px-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
            style={{ background: member.color }}
          >
            {member.display_name.slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{member.display_name}</div>
            <div className="text-xs text-muted truncate">{member.relation}</div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-muted hover:text-accent-dark"
              title="Se déconnecter"
            >
              Sortir
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-cream/97 backdrop-blur border-t border-line flex justify-around items-center py-2">
          {NAV.filter((n) => n.mobile).map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
                  active ? "text-accent" : "text-muted"
                }`}
              >
                <Icon />
                <span className={`text-[9.5px] ${active ? "font-semibold" : ""}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
