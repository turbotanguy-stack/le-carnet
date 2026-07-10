type IconProps = { className?: string };

export function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path d="M2.5 10L10.5 2.5l8 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="5" y="9.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8.5" y="13.5" width="4" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}

export function DocsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="21" viewBox="0 0 21 21" fill="none">
      <rect x="4" y="2" width="13" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="7.5" x2="14" y2="7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="14.5" x2="10.5" y2="14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="21" viewBox="0 0 21 21" fill="none">
      <rect x="2" y="4" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="2" y1="9" x2="19" y2="9" stroke="currentColor" strokeWidth="1.4" />
      <line x1="6.5" y1="2" x2="6.5" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.5" y1="2" x2="14.5" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ListsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="21" viewBox="0 0 21 21" fill="none">
      <rect x="2" y="2.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 6l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="12.5" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="12.5" y1="15.5" x2="19" y2="15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ContactsIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="21" viewBox="0 0 21 21" fill="none">
      <circle cx="10.5" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 19.5c0-4.1 3.4-7.5 7.5-7.5s7.5 3.4 7.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function NotesIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="21" viewBox="0 0 22 22" fill="none">
      <rect x="4" y="1.5" width="13" height="19" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <line x1="2" y1="7" x2="4" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="2" y1="11" x2="4" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="7" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="7" y1="15" x2="11" y2="15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function PhotosIcon({ className }: IconProps) {
  return (
    <svg className={className} width="21" height="21" viewBox="0 0 22 22" fill="none">
      <rect x="1.5" y="3.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7" cy="8.5" r="2" fill="currentColor" />
      <path d="M2 16l5-5 3.5 3.5L15 9l5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M5.5 3.5L10 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BackIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10.5 3.5L5.5 8l5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
