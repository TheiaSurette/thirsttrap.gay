'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          <Image
            src="/img/thirst-trap-logo.svg"
            alt="Thirst Trap — home"
            width={150}
            height={72}
            priority
          />
        </Link>
        <button
          className={styles.menu}
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <div
          id="site-navigation"
          className={`${styles.links} ${open ? styles.open : ''}`}
        >
          <Link href="/#events" onClick={() => setOpen(false)}>
            Events
          </Link>
          <Link
            href="/get-involved"
            className="action primary"
            onClick={() => setOpen(false)}
          >
            Get involved <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
