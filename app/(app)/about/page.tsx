import { Suspense } from 'react';
import Footer from '@/components/Footer';
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

        <Suspense>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}
