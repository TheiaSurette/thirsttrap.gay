'use client';

import { InstagramIcon } from '@/components/icons';

export default function Footer() {
  return (
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
  );
}
