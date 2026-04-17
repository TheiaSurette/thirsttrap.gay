import { InstagramIcon } from '@/components/icons';
import styles from './page.module.css';

export const metadata = {
  title: 'About — Thirst Trap',
  description: 'Queer nightlife in Lowell, MA. By queers, for queers.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.wash} />

      <div className={styles.content}>
        <h1 className={`${styles.mega} text-5xl md:text-7xl lg:text-8xl text-foreground mb-12 pt-24`}>
          About
        </h1>

        <div className={`${styles.rule} mb-10`} />

        <div className={`${styles.body} max-w-2xl`}>
          <p>
            Thirst Trap is a queer nightlife event series in Lowell, MA.
            Trans led, community driven, and judgement free.
          </p>
          <p>
            We exist to create space — for dancing, for connection, for joy.
            A night out the way it should be.
          </p>
          <p>
            21+ with valid ID. All are welcome.
          </p>
        </div>

        <div className={`${styles.rule} mt-16 mb-6`} />

        <footer className="pb-12">
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
    </div>
  );
}
