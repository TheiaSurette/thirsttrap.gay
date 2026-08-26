'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { InstagramIcon } from '@/components/icons';
import styles from './page.module.css';
import type { EventData } from './page';

// ── Data ──────────────────────────────────────────────────────────

const TEXT_WALL_WORDS = [
  'LOWELL', 'QUEER', 'PARTY', 'DRINKS', 'TRANS', 'NIGHTLIFE',
  'DANCING', 'GAY', 'PRIDE', 'COMMUNITY', 'LOVE', 'MUSIC',
  'THIRST', 'VIBES', 'QUEENS', 'BASS', 'FREEDOM', 'DANCE',
  'SLAY', 'NIGHT', 'JOY',
];

const TEXT_WALL_ROW_COUNT = 17;

const TEXT_WALL_SPEEDS = [
  80, 95, 70, 110, 85, 100, 75, 105, 90, 115, 78, 108, 82, 98, 73, 112, 88,
];

const TICKER_ITEMS = [
  '21+ W/ VALID ID', 'LOCAL ARTISTS', 'SUPPORT TRANS HEALTHCARE',
  'EVERY MONTH', 'BY QUEERS FOR QUEERS', 'JUDGEMENT FREE',
  'TRANS LED', 'LOWELL MA',
];

// ── Utilities ─────────────────────────────────────────────────────

function seededShuffle(arr: string[], seed: number): string[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function buildTextRow(words: string[], seed: number): string {
  const shuffled = seededShuffle(words, seed);
  return shuffled.join(' ');
}

// ── Animation config ──────────────────────────────────────────────

const EASE = [0.4, 0, 0.2, 1] as const;

// ── Small components ──────────────────────────────────────────────

function Star({ delay = '0s', className = '' }: { delay?: string; className?: string }) {
  return (
    <span
      className={`${styles.star} text-neon-pink ${className}`}
      style={{ animationDelay: delay }}
    >
      ✦
    </span>
  );
}

function ScrollIndicator() {
  return (
    <div className={styles.scrollIndicator}>
      <div className={styles.scrollDot} />
    </div>
  );
}

function Ticker({ items, separator = '✦' }: { items: string[]; separator?: string }) {
  const withSeparators = items.flatMap((item) => [item, separator]).slice(0, -1);
  return (
    <div className={`${styles.ticker} py-3 border-y border-foreground/5`}>
      <div className={styles.tickerInner}>
        {Array.from({ length: 2 }).map((_, i) => (
          <span key={i} className="flex items-center gap-8 mr-8">
            {withSeparators.map((t, j) => (
              <span
                key={j}
                className={`${t === separator ? 'text-neon-pink/30' : 'text-foreground/15'} text-xs tracking-[0.2em] uppercase whitespace-nowrap`}
              >
                {t}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

function TextWall({ words, rowCount, speeds }: { words: string[]; rowCount: number; speeds: number[] }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => {
        const text = buildTextRow(words, (i + 1) * 7919);
        const duration = speeds[i % speeds.length];
        const reverse = i % 2 === 1;
        return (
          <div
            key={i}
            className={styles.textRow}
            style={{
              '--duration': `${duration}s`,
              '--direction': reverse ? 'reverse' : 'normal',
            } as React.CSSProperties}
          >
            <span>{text} </span>
            <span>{text} </span>
          </div>
        );
      })}
    </>
  );
}

function EventRow({ event }: { event: EventData }) {
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4 md:gap-8">
          <span className="text-neon-pink/40 text-xs tracking-wider font-bold min-w-[95px]">{event.date}</span>
          <h3 className={`${styles.mega} text-2xl md:text-4xl lg:text-5xl text-foreground group-hover:text-neon-pink transition-colors`}>
            {event.title}
          </h3>
        </div>
        <span className="text-foreground/20 text-sm font-bold hidden sm:block">{event.time}</span>
      </div>
    </Link>
  );
}

// ── Props ─────────────────────────────────────────────────────────

type HomePageClientProps = {
  heroEvent: EventData | null;
  otherEvents: EventData[];
};

// ── Page ──────────────────────────────────────────────────────────

export default function HomePageClient({ heroEvent, otherEvents }: HomePageClientProps) {
  return (
    <div className={styles.page}>
      <div className={styles.wash} />

      {/* Scrolling text wall background */}
      <div className={`${styles.textWall} fixed inset-0`} aria-hidden="true" style={{ zIndex: 0 }}>
        <TextWall words={TEXT_WALL_WORDS} rowCount={TEXT_WALL_ROW_COUNT} speeds={TEXT_WALL_SPEEDS} />
      </div>

      {/* Hero */}
      <section className={styles.hero}>
        {heroEvent ? (
          <Link href={`/events/${heroEvent.slug}`} className="block relative z-10" style={{ height: '100%' }}>
            {/* Event image background */}
            {heroEvent.image && (
              <div className={styles.heroImageBg}>
                <Image
                  src={heroEvent.image}
                  alt={heroEvent.title}
                  fill
                  className="object-cover object-top"
                  priority
                />
                <div className={styles.heroImageOverlay} />
              </div>
            )}

            {/* Event info */}
            <div className={styles.heroContent}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Star className="text-xs" />
                  <span className="text-neon-pink/60 text-[10px] tracking-[0.2em] uppercase font-bold">
                    Up Next
                  </span>
                </div>
                <h1 className={`${styles.mega} text-6xl md:text-8xl lg:text-9xl text-foreground mb-6`}>
                  {heroEvent.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="text-neon-pink/50 text-sm tracking-wider font-bold">{heroEvent.date}</span>
                  <span className="text-foreground/10">|</span>
                  <span className="text-foreground/40 text-sm">{heroEvent.time}</span>
                  {heroEvent.location && (
                    <>
                      <span className="text-foreground/10">|</span>
                      <span className="text-foreground/40 text-sm">{heroEvent.location}</span>
                    </>
                  )}
                </div>
                {heroEvent.description && (
                  <p className="text-foreground/30 text-base leading-relaxed max-w-lg">
                    {heroEvent.description}
                  </p>
                )}
              </motion.div>

              <motion.div
                className="pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <ScrollIndicator />
              </motion.div>
            </div>
          </Link>
        ) : (
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <motion.div
              className="w-full max-w-5xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src="/img/thirst-trap-logo.svg"
                alt="Thirst Trap"
                width={864}
                height={413}
                className="w-full"
                style={{ filter: 'drop-shadow(0 0 50px rgba(255, 0, 174, 0.2)) drop-shadow(0 0 100px rgba(139, 92, 246, 0.1))' }}
                priority
              />
            </motion.div>
            <motion.p
              className="mt-8 text-foreground/20 text-sm tracking-[0.2em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              No upcoming events — check back soon
            </motion.p>
          </div>
        )}
      </section>

      {/* Events section */}
      {otherEvents.length > 0 && (
        <section className={styles.eventsSection}>
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              className={`${styles.rule} mb-6`}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ transformOrigin: 'left' }}
            />

            {otherEvents.map((event, i) => (
              <motion.div
                key={event.slug}
                className={styles.event}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              >
                <EventRow event={event} />
              </motion.div>
            ))}

            <motion.div
              className={`${styles.rule} mt-8`}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ transformOrigin: 'right' }}
            />
          </div>
        </section>
      )}

      {/* Footer area */}
      <section className={styles.footerSection}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-8">
            <Link
              href="/past-events"
              className="text-foreground/20 hover:text-foreground/50 text-[10px] tracking-[0.2em] uppercase transition-colors"
            >
              Past Events →
            </Link>
          </div>

          <Ticker items={TICKER_ITEMS} />

          <footer className="py-6">
            <div className="flex justify-between items-center">
              <span className="text-foreground/30 text-[10px] tracking-[0.15em] uppercase">
                &copy; {new Date().getFullYear()} Thirst Trap
              </span>
              <a
                href="https://instagram.com/thirst.trap.lowell"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground/50 hover:text-neon-pink text-[10px] tracking-[0.15em] uppercase transition-colors"
              >
                <InstagramIcon className="w-3 h-3" />
                @thirst.trap.lowell
              </a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
