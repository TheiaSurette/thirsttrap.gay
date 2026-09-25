import type { LexicalRoot } from '../richText';

export type EventRecord = {
  id: number | string;
  slug?: string | null;
  title: string;
  status: string;
  date: string;
  endDate?: string | null;
  featured?: boolean | null;
  image?:
    | number
    | {
        url?: string | null;
        width?: number | null;
        height?: number | null;
        alt?: string | null;
      }
    | null;
  location?: {
    venueName?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
  description?: LexicalRoot | null;
  eventLinks?: { url: string; text: string; icon?: string | null }[] | null;
};

const timeZone = 'America/New_York';
const localParts = new Intl.DateTimeFormat('en-US', {
  timeZone,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  hourCycle: 'h23',
});

function parts(date: Date) {
  return Object.fromEntries(
    localParts.formatToParts(date).map((p) => [p.type, Number(p.value)]),
  );
}

function effectiveEnd(event: EventRecord): number {
  if (event.endDate) return Date.parse(event.endDate);
  const start = new Date(event.date);
  if (!Number.isFinite(start.getTime())) return NaN;
  const local = parts(start);
  const target = Date.UTC(
    local.year,
    local.month - 1,
    local.day + (local.hour >= 6 ? 1 : 0),
    6,
  );
  let candidate = target;
  // Resolve the local 6 AM against its own offset, not the start day's offset.
  for (let i = 0; i < 3; i++) {
    const at = parts(new Date(candidate));
    candidate += target - Date.UTC(at.year, at.month - 1, at.day, at.hour);
  }
  return candidate;
}

export function describeEvent(event: EventRecord, now = new Date()) {
  const date = new Date(event.date);
  return {
    ...event,
    ended: effectiveEnd(event) <= now.getTime(),
    displayDate: new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date),
    longDate: new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date),
    displayTime: new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(date),
  };
}

export type EventView = ReturnType<typeof describeEvent>;

export function discoverEvents(records: EventRecord[], now = new Date()) {
  const eligible = records
    .filter((e) => e.status === 'published' && effectiveEnd(e) > now.getTime())
    .map((e) => describeEvent(e, now))
    .sort(
      (a, b) =>
        Date.parse(a.date) - Date.parse(b.date) ||
        String(a.id).localeCompare(String(b.id)),
    );
  const featured = eligible.find((e) => e.featured) ?? eligible[0] ?? null;
  return {
    featured,
    featuredLabel:
      featured && featured.id === eligible[0]?.id
        ? 'Up next'
        : 'Featured event',
    others: eligible.filter((e) => e.id !== featured?.id),
  };
}
