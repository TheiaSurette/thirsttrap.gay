import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={`${styles.nav} ${styles.navVisible}`}>
      <div className="flex items-center justify-between px-8 md:px-16 py-4">
        <Link href="/" className="opacity-30 hover:opacity-60 transition-opacity">
          <Image
            src="/img/thirst-trap-logo.svg"
            alt="Thirst Trap"
            width={100}
            height={48}
            className="h-8 w-auto"
          />
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
