import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sprout & Flourish — 3D Habit Tracker Garden',
  description: 'Every habit you complete helps your virtual 3D garden grow. Build streaks, unlock rare plants, and cultivate daily goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 antialiased overflow-hidden select-none`}>
        {children}
      </body>
    </html>
  );
}
