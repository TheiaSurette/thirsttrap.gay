import Image from 'next/image';
import Link from 'next/link';
import WordWall from '@/components/WordWall';
import { extractPlainText } from '@/lib/richText';
import type { EventView } from '@/lib/events/discovery';
import styles from './page.module.css';

function Artwork({ event }: { event: EventView }) {
  const media = typeof event.image === 'object' ? event.image : null;
  return (
    <div className={styles.artwork}>
      {media?.url ? (
        <Image
          src={media.url}
          alt={media.alt || `${event.title} flyer`}
          width={media.width || 864}
          height={media.height || 1000}
          sizes="(max-width: 700px) 100vw, 600px"
          priority
        />
      ) : (
        <div className={styles.brandFlyer}>
          <Image
            src="/img/thirst-trap-logo.svg"
            alt="Thirst Trap"
            width={864}
            height={413}
            priority
          />
        </div>
      )}
    </div>
  );
}

export default function HomePage({
  featured,
  featuredLabel,
  others,
}: {
  featured: EventView | null;
  featuredLabel: string;
  others: EventView[];
}) {
  const ticket = featured?.eventLinks?.find(
    (link) => link.icon === 'ticket' && /^https?:\/\//.test(link.url),
  );
  return (
    <main id="main">
      <section className={styles.hero} id="events" aria-label="Featured event">
        <WordWall />
        <div className={`shell ${styles.heroContent}`}>
          {featured ? (
            <>
              <div className={styles.feature}>
                <Artwork event={featured} />
                <div className={styles.details}>
                  <p className="eyebrow">
                    <span aria-hidden="true">✦</span> {featuredLabel}
                  </p>
                  <h1 className={styles.title}>{featured.title}</h1>
                  <div className={styles.meta}>
                    <p>
                      {featured.displayDate} <span> / </span>{' '}
                      {featured.displayTime}
                    </p>
                    <p>
                      {[
                        featured.location?.venueName,
                        [featured.location?.city, featured.location?.state]
                          .filter(Boolean)
                          .join(', '),
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  </div>
                  <div className={styles.actions}>
                    {ticket ? (
                      <a
                        className="action primary"
                        href={ticket.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get tickets <span aria-hidden="true">→</span>
                      </a>
                    ) : null}
                    <Link
                      className={`action ${ticket ? 'secondary' : 'primary'}`}
                      href={`/events/${featured.slug}`}
                    >
                      Event details <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                  <p className={styles.description}>
                    {extractPlainText(featured.description, 240)}
                  </p>
                </div>
              </div>
              <div className={styles.dateStrip}>
                <span>{featured.displayDate}</span>
                <span>
                  {featured.location?.venueName || 'Thirst Trap'}{' '}
                  <span aria-hidden="true">✦</span> {featured.displayTime}
                </span>
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <Image
                src="/img/thirst-trap-logo.svg"
                alt="Thirst Trap"
                width={500}
                height={240}
                priority
              />
              <h1>The next party is in the works.</h1>
              <p>Follow us on Instagram for new event announcements.</p>
              <div className={styles.actions}>
                <a
                  className="action secondary"
                  href="https://instagram.com/thirst.trap.lowell"
                >
                  Follow on Instagram →
                </a>
                <Link className="action primary" href="/get-involved">
                  Get involved →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <div className="shell">
        {others.length > 0 ? (
          <section className={styles.upcoming} aria-labelledby="upcoming-title">
            <div className={styles.sectionHeading}>
              <h2 id="upcoming-title">More upcoming events</h2>
            </div>
            {others.map((event) => (
              <Link
                className={styles.eventRow}
                key={event.id}
                href={`/events/${event.slug}`}
              >
                <span className={styles.smallArtwork}>
                  {typeof event.image === 'object' && event.image?.url ? (
                    <Image
                      src={event.image.url}
                      alt=""
                      width={90}
                      height={110}
                    />
                  ) : (
                    <span aria-hidden="true">✦</span>
                  )}
                </span>
                <span className={styles.rowContent}>
                  <span className={styles.rowDate}>
                    {event.displayDate} · {event.displayTime}
                  </span>
                  <h3>{event.title}</h3>
                  <span>
                    {[event.location?.venueName, event.location?.city]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
                <span className={styles.rowAction}>
                  Event details <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </section>
        ) : null}
        <section className={styles.involved} aria-labelledby="involved-title">
          <div>
            <h2 id="involved-title">Get involved.</h2>
            <p>DJ, perform, vend, or volunteer at a future event.</p>
          </div>
          <Link className="action primary" href="/get-involved">
            Apply to get involved <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
