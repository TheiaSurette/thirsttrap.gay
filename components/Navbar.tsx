import Image from 'next/image';
import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/img/thirst-trap-logo.svg"
            alt="Thirst Trap — home"
            width={150}
            height={72}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
