import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'VerdantIQ — Environmental Sustainability Decision-Support Platform',
  description: 'Precision spatial intelligence, predictive HVAC optimization, and auditor-certified ESG compliance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="dark bg-stone-950 text-stone-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
