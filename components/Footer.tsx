import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="site-footer shell">
      <div>
        <Link href="/" className="footer-name">
          Thirst Trap
        </Link>
        <p>Queer nightlife. Lowell, MA.</p>
      </div>
      <div className="footer-links">
        <a
          href="https://instagram.com/thirst.trap.lowell"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram →
        </a>
        <a
          href="https://lowellisqueer.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lowell is Queer →
        </a>
        <span>© {new Date().getFullYear()} Thirst Trap</span>
      </div>
    </footer>
  );
}
