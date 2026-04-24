import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import '@/app/globals.css';
import '@/styles/patterns.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AIAssistant from '@/components/layout/AIAssistant';

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Платформа · Единая цифровая платформа МСБ Узбекистана',
  description:
    'Единая цифровая платформа государственной поддержки малого и среднего бизнеса Республики Узбекистан. 14 модулей. 885 инструментов поддержки. Одна точка входа.',
  metadataBase: new URL('https://yarp.example.uz'),
  openGraph: {
    title: 'Платформа — Единая цифровая платформа МСБ',
    description:
      '14 модулей · 885 инструментов · 14 регионов + Ташкент + Каракалпакстан. Единая точка входа для предпринимателей.',
    type: 'website',
    locale: 'ru_RU',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#1B2A3D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-ink">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <AIAssistant />
      </body>
    </html>
  );
}
