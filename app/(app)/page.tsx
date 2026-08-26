import { unstable_cache } from 'next/cache';
import { getPayloadClient } from '@/lib/payload';
import { extractPlainText } from '@/lib/richText';
import HomePageClient from './HomePageClient';

export type EventData = {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string | null;
  featured: boolean;
};

const getUpcomingEvents = unstable_cache(
  async (): Promise<EventData[]> => {
    const payload = await getPayloadClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { docs } = await payload.find({
      collection: 'events',
      where: {
        status: { equals: 'published' },
        date: { greater_than_equal: today.toISOString() },
      },
      sort: 'date',
      limit: 50,
    });

    return docs.map((event) => {
      const d = new Date(event.date);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dateStr = `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
      const hours = d.getHours();
      const mins = d.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      const timeStr = mins > 0 ? `${displayHour}:${String(mins).padStart(2, '0')}${period}` : `${displayHour}${period}`;

      const locationParts = [
        event.location?.city,
        event.location?.state,
      ].filter(Boolean);
      const locationStr = locationParts.join(', ');

      const imageUrl = typeof event.image === 'object' && event.image?.url
        ? event.image.url
        : null;

      return {
        slug: event.slug || '',
        title: event.title,
        date: dateStr,
        time: timeStr,
        location: locationStr,
        description: extractPlainText(event.description, 200),
        image: imageUrl,
        featured: event.featured || false,
      };
    });
  },
  ['upcoming-events'],
  { tags: ['homepage', 'events'], revalidate: 3600 },
);

export default async function HomePage() {
  const events = await getUpcomingEvents();

  const featuredIndex = events.findIndex((e) => e.featured);
  const heroEvent = featuredIndex >= 0 ? events[featuredIndex] : events[0] ?? null;
  const otherEvents = events.filter((_, i) => i !== (featuredIndex >= 0 ? featuredIndex : 0));

  return (
    <HomePageClient
      heroEvent={heroEvent}
      otherEvents={otherEvents}
    />
  );
}
