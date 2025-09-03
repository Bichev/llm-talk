import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LLM-Talk - AI Communication Evolution',
  description: 'Watch multiple LLMs develop efficient communication protocols in real-time',
  keywords: ['AI', 'LLM', 'communication', 'evolution', 'research'],
  authors: [{ name: 'Vladimir Bichev' }],
  openGraph: {
    title: 'LLM-Talk - AI Communication Evolution',
    description: 'Watch multiple LLMs develop efficient communication protocols in real-time',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLM-Talk - AI Communication Evolution',
    description: 'Watch multiple LLMs develop efficient communication protocols in real-time',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gray-50 antialiased`}>
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
