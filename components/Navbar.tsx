'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  // Homepage renders its own nav with scroll behavior
  if (pathname === '/') return null;

  return (
    <nav className={`${styles.nav} ${styles.navVisible}`}>
      <div className="flex items-center justify-between px-8 md:px-16 py-4">
        <Link
          href="/"
          className="text-foreground/30 text-[10px] tracking-[0.3em] uppercase hover:text-foreground/60 transition-colors"
        >
          Thirst Trap
        </Link>
        <div className="flex items-center gap-8">
          <Link href="/" className="text-foreground/25 hover:text-foreground/60 text-[10px] tracking-[0.2em] uppercase transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-foreground/25 hover:text-foreground/60 text-[10px] tracking-[0.2em] uppercase transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
