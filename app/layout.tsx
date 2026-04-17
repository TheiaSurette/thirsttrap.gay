import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Geist } from 'next/font/google';
import './globals.css';

const megaMonster = localFont({
  src: [
    {
      path: '../public/fonts/MegaMonster.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/MegaMonsterItalic.ttf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-mega-monster',
  display: 'swap',
});

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'THIRST TRAP',
    template: '%s | THIRST TRAP',
  },
  description: 'Nightlife events that quench your thirst.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${megaMonster.variable} ${geist.variable} font-[family-name:var(--font-geist)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
