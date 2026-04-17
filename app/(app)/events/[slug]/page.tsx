import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import Image from 'next/image';
import { Ticket, ExternalLink, MapPin } from 'lucide-react';
import { InstagramIcon } from '@/components/icons';
import { getPayloadClient } from '@/lib/payload';
import { serializeRichText } from '@/lib/richText';
import Footer from '@/components/Footer';
import styles from './page.module.css';

type EventLink = {
  url: string;
  text: string;
  icon?: string | null;
};

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  ticket: Ticket,
  'external-link': ExternalLink,
  instagram: InstagramIcon,
  'map-pin': MapPin,
};

async function getEvent(slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'events',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    limit: 1,
  });
  return docs[0] || null;
}

const getCachedEvent = (slug: string) =>
  unstable_cache(
    () => getEvent(slug),
    [`event-${slug}`],
    { tags: ['events', `event-${slug}`] },
  )();

export async function generateStaticParams() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'events',
    where: { status: { equals: 'published' } },
    limit: 100,
  });
  return docs.map((event) => ({ slug: event.slug as string }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getCachedEvent(slug);
  if (!event) return { title: 'Event Not Found' };
  return {
    title: `${event.title} — Thirst Trap`,
    description: `${event.title} — a Thirst Trap event`,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getCachedEvent(slug);

  if (!event) notFound();

  const d = new Date(event.date);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateStr = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const hours = d.getHours();
  const mins = d.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  const timeStr = mins > 0 ? `${displayHour}:${String(mins).padStart(2, '0')} ${period}` : `${displayHour} ${period}`;

  const locationParts = [
    event.location?.venueName,
    event.location?.address,
    [event.location?.city, event.location?.state].filter(Boolean).join(', '),
  ].filter(Boolean);

  const imageUrl = typeof event.image === 'object' && event.image?.url
    ? event.image.url
    : null;

  const descriptionHtml = serializeRichText(event.description);
  const links: EventLink[] = event.eventLinks || [];

  return (
    <div className={styles.page}>
      <div className={styles.wash} />

      <div className={styles.content}>
        <div className="pt-24" />

        {/* Event image */}
        {imageUrl && (
          <div className={`${styles.heroImage} mb-10`}>
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              className="object-contain"
              priority
              style={{ filter: 'drop-shadow(0 0 30px rgba(255, 0, 174, 0.1))' }}
            />
          </div>
        )}

        {/* Title */}
        <h1 className={`${styles.mega} text-5xl md:text-7xl lg:text-8xl text-foreground mb-8`}>
          {event.title}
        </h1>

        {/* Meta */}
        <div className={`${styles.meta} mb-8`}>
          <span className={styles.metaLabel}>{dateStr}</span>
          <span className={styles.metaDivider}>|</span>
          <span className={styles.metaValue}>{timeStr}</span>
          {locationParts.length > 0 && (
            <>
              <span className={styles.metaDivider}>|</span>
              <span className={styles.metaValue}>{locationParts.join(' — ')}</span>
            </>
          )}
        </div>

        <div className={`${styles.rule} mb-10`} />

        {/* Description */}
        {descriptionHtml && (
          <div
            className={`${styles.description} max-w-3xl mb-10`}
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        )}

        {/* Event links */}
        {links.length > 0 && (
          <div className={`${styles.eventLinks} mb-16`}>
            {links.map((link, i) => {
              const IconComponent = link.icon ? iconMap[link.icon] : ExternalLink;
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.eventLink}
                >
                  {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                  {link.text}
                </a>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className={`${styles.rule} mb-6`} />
        <Suspense>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
