'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
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

const heroExit = {
  opacity: 0, scale: 0.95, y: -40,
  transition: { duration: 0.6, ease: EASE },
};

const eventsEnter = {
  opacity: 1, y: 0,
  transition: { duration: 0.7, ease: EASE, delay: 0.1 },
};

const eventsExit = {
  opacity: 0, y: 60,
  transition: { duration: 0.5, ease: EASE },
};

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

function FeaturedEvent({ event }: { event: EventData }) {
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className={styles.featuredImage}>
          <Image
            src={event.image || '/img/thirst-trap-logo.svg'}
            alt={event.title}
            width={864}
            height={413}
            className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 0 30px rgba(255, 0, 174, 0.15))' }}
          />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Star className="text-xs" />
            <span className="text-neon-pink/50 text-[10px] tracking-[0.2em] uppercase font-bold">
              Up Next
            </span>
          </div>
          <h3 className={`${styles.mega} text-4xl md:text-5xl lg:text-6xl text-foreground group-hover:text-neon-pink transition-colors mb-4`}>
            {event.title}
          </h3>
          <div className="flex items-center gap-4 mb-5">
            <span className="text-neon-pink/40 text-xs tracking-wider font-bold">{event.date}</span>
            <span className="text-foreground/10">|</span>
            <span className="text-foreground/30 text-xs">{event.time}</span>
            {event.location && (
              <>
                <span className="text-foreground/10">|</span>
                <span className="text-foreground/30 text-xs">{event.location}</span>
              </>
            )}
          </div>
          {event.description && (
            <p className="text-foreground/30 text-sm leading-relaxed max-w-md">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </Link>
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

// ── Scroll behavior hook ──────────────────────────────────────────

function useScrollTransition() {
  const [showEvents, setShowEvents] = useState(false);
  const [eventsEl, setEventsEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (showEvents) return;
    const handleScroll = () => {
      if (window.scrollY > 200) setShowEvents(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showEvents]);

  useEffect(() => {
    if (!showEvents) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY >= 0) return;
      if (eventsEl && eventsEl.scrollTop <= 0 && e.deltaY < -30) {
        setShowEvents(false);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [showEvents, eventsEl]);

  useEffect(() => {
    if (!showEvents) return;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0].clientY - touchStartY > 100 && eventsEl && eventsEl.scrollTop <= 0) {
        setShowEvents(false);
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [showEvents, eventsEl]);

  useEffect(() => {
    if (showEvents) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    return () => { document.body.style.overflow = ''; };
  }, [showEvents]);

  return { showEvents, setShowEvents, setEventsEl };
}

// ── Props ─────────────────────────────────────────────────────────

type HomePageClientProps = {
  featuredEvent: EventData | null;
  otherEvents: EventData[];
};

// ── Page ──────────────────────────────────────────────────────────

export default function HomePageClient({ featuredEvent, otherEvents }: HomePageClientProps) {
  const { showEvents, setShowEvents, setEventsEl } = useScrollTransition();

  const hasEvents = featuredEvent || otherEvents.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.wash} />

      {/* Nav */}
      <nav className={`${styles.nav} ${showEvents ? styles.navVisible : ''}`}>
        <div className="flex items-center justify-between px-8 md:px-16 py-4">
          <span
            className="text-foreground/30 text-[10px] tracking-[0.3em] uppercase cursor-pointer"
            onClick={() => setShowEvents(false)}
          >
            Thirst Trap
          </span>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setShowEvents(true)}
              className="text-foreground/25 hover:text-foreground/60 text-[10px] tracking-[0.2em] uppercase transition-colors"
            >
              Events
            </button>
            <Link href="/about" className="text-foreground/25 hover:text-foreground/60 text-[10px] tracking-[0.2em] uppercase transition-colors">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Scrolling text wall */}
      <motion.div
        className={`${styles.textWall} fixed inset-0`}
        aria-hidden="true"
        animate={{ opacity: showEvents ? 0 : 1 }}
        transition={{ duration: showEvents ? 0.4 : 0.8 }}
        style={{ zIndex: 0 }}
      >
        <TextWall words={TEXT_WALL_WORDS} rowCount={TEXT_WALL_ROW_COUNT} speeds={TEXT_WALL_SPEEDS} />
      </motion.div>

      <div className={styles.content}>
        {!showEvents && <div style={{ height: '200vh' }} />}

        <AnimatePresence mode="wait">
          {!showEvents ? (
            <motion.section
              key="hero"
              className="h-screen flex flex-col items-center justify-center px-6 md:px-12 fixed inset-0"
              style={{ zIndex: 1 }}
              initial={{ opacity: 1, scale: 1, y: 0 }}
              exit={heroExit}
            >
              <motion.div
                className="w-full max-w-6xl relative z-10"
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

              <motion.div
                className="mt-12 relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <ScrollIndicator />
              </motion.div>
            </motion.section>
          ) : (
            <motion.section
              key="events"
              ref={setEventsEl}
              className="fixed inset-0 px-6 md:px-12 lg:px-20 overflow-y-auto"
              style={{ zIndex: 2 }}
              initial={{ opacity: 0, y: 60 }}
              animate={eventsEnter}
              exit={eventsExit}
            >
              <div className="max-w-6xl mx-auto w-full pt-28 pb-20">
                {hasEvents ? (
                  <>
                    {/* Featured event */}
                    {featuredEvent && (
                      <motion.div
                        className="mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                      >
                        <FeaturedEvent event={featuredEvent} />
                      </motion.div>
                    )}

                    {otherEvents.length > 0 && (
                      <>
                        <motion.div
                          className={`${styles.rule} mb-6`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
                          style={{ transformOrigin: 'left' }}
                        />

                        {otherEvents.map((event, i) => (
                          <motion.div
                            key={event.slug}
                            className={`${styles.event}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: EASE }}
                          >
                            <EventRow event={event} />
                          </motion.div>
                        ))}

                        <motion.div
                          className={`${styles.rule} mt-8`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
                          style={{ transformOrigin: 'right' }}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <p className="text-foreground/20 text-sm tracking-[0.2em] uppercase">
                      No upcoming events — check back soon
                    </p>
                  </motion.div>
                )}

                {/* Ticker */}
                <motion.div
                  className="mt-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Ticker items={TICKER_ITEMS} />
                </motion.div>

                <motion.footer
                  className="py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
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
                </motion.footer>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
