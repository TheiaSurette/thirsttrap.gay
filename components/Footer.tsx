'use client';

import { InstagramIcon } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="pb-12">
      <div className="flex justify-between items-center">
        <span className="text-foreground/30 text-[10px] tracking-[0.15em] uppercase">
          &copy; {new Date().getFullYear()} Thirst Trap
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://lowellisqueer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/50 hover:text-neon-pink text-[10px] tracking-[0.15em] uppercase transition-colors"
          >
            Lowell is Queer
          </a>
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
      </div>
    </footer>
  );
}
