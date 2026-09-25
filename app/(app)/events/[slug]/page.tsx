import { connection } from 'next/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { loadEvent } from '@/lib/events/repository';
import { serializeRichText } from '@/lib/richText';
import styles from './page.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const event = await loadEvent((await params).slug);
  return { title: event?.title || 'Event not found' };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const event = await loadEvent((await params).slug);
  if (!event) notFound();
  const media = typeof event.image === 'object' ? event.image : null;
  return (
    <main id="main" className="shell prose-page">
      <Link href="/#events" className="text-link">
        ← Upcoming events
      </Link>
      {event.ended ? (
        <div className={styles.ended} role="status">
          This event has ended.{' '}
          <Link href="/#events">Find an upcoming event →</Link>
        </div>
      ) : null}
      <h1 className="page-title">{event.title}</h1>
      <div className={styles.meta}>
        <p>
          {event.longDate} · {event.displayTime}
        </p>
        <p>
          {[
            event.location?.venueName,
            event.location?.address,
            [event.location?.city, event.location?.state]
              .filter(Boolean)
              .join(', '),
          ]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
      {!event.ended && event.eventLinks?.length ? (
        <div className={styles.actions}>
          {event.eventLinks
            .filter((link) => /^https?:\/\//.test(link.url))
            .map((link, i) => (
              <a
                key={i}
                href={link.url}
                className={`action ${link.icon === 'ticket' ? 'primary' : 'secondary'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.text} →
              </a>
            ))}
        </div>
      ) : null}
      {media?.url ? (
        <Image
          className={styles.flyer}
          src={media.url}
          alt={media.alt || `${event.title} flyer`}
          width={media.width || 864}
          height={media.height || 1000}
          sizes="(max-width: 840px) 100vw, 800px"
          priority
        />
      ) : null}
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: serializeRichText(event.description),
        }}
      />
    </main>
  );
}
