import { unstable_cache } from 'next/cache';
import { getPayloadClient } from '@/lib/payload';
import Link from 'next/link';
import { Suspense } from 'react';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'Past Events — Thirst Trap',
  description: 'Past queer nightlife events from Thirst Trap in Lowell, MA.',
};

type PastEventData = {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
};

const getPastEvents = unstable_cache(
  async (): Promise<PastEventData[]> => {
    const payload = await getPayloadClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { docs } = await payload.find({
      collection: 'events',
      where: {
        status: { equals: 'published' },
        date: { less_than: today.toISOString() },
      },
      sort: '-date',
      limit: 100,
    });

    return docs.map((event) => {
      const d = new Date(event.date);
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = [
        'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
        'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
      ];
      const dateStr = `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      const hours = d.getHours();
      const mins = d.getMinutes();
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours % 12 || 12;
      const timeStr = mins > 0
        ? `${displayHour}:${String(mins).padStart(2, '0')}${period}`
        : `${displayHour}${period}`;

      const locationParts = [event.location?.city, event.location?.state].filter(Boolean);

      return {
        slug: event.slug || '',
        title: event.title,
        date: dateStr,
        time: timeStr,
        location: locationParts.join(', '),
      };
    });
  },
  ['past-events'],
  { tags: ['events'], revalidate: 3600 },
);

export default async function PastEventsPage() {
  const events = await getPastEvents();

  return (
    <div className={styles.page}>
      <div className={styles.wash} />

      <div className={styles.content}>
        <h1 className={`${styles.mega} text-5xl md:text-7xl lg:text-8xl text-foreground mb-12 pt-24`}>
          Past Events
        </h1>

        <div className={`${styles.rule} mb-2`} />

        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.slug} className={styles.event}>
              <Link href={`/events/${event.slug}`} className="block group">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="text-foreground/20 text-xs tracking-wider font-bold min-w-[150px] shrink-0">
                      {event.date}
                    </span>
                    <h3 className={`${styles.mega} text-2xl md:text-4xl lg:text-5xl text-foreground/40 group-hover:text-neon-pink transition-colors`}>
                      {event.title}
                    </h3>
                  </div>
                  <span className="text-foreground/15 text-sm font-bold hidden sm:block">{event.time}</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-foreground/20 text-sm tracking-[0.2em] uppercase">
              No past events yet
            </p>
          </div>
        )}

        <div className={`${styles.rule} mt-8 mb-6`} />

        <Suspense>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
