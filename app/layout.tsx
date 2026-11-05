import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'WonderTales — The Clockwork Garden',
  description:
    'An adventure where understanding changes the world. A story-driven fraction quest for ages 7–10.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-parchment font-ui text-ink antialiased">{children}</body>
    </html>
  );
}
