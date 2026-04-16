import type { Metadata, Viewport } from 'next';
import './globals.css';
import { RootLayout } from './components/RootLayout';

export const metadata: Metadata = {
  title: {
    default: 'Şikayetimvar - Tüketici Şikayetleri Platformu',
    template: '%s | Şikayetimvar',
  },
  description: 'Türkiye\'nin en güvenilir tüketici şikayetleri platformu. Şikayetlerinizi paylaşın, çözüm bulun, haklarınızı savunun.',
  keywords: [
    'şikayet', 'tüketici hakları', 'şikayetvar', 'tüketici şikayetleri',
    'müşteri şikayetleri', 'şikayet platformu', 'hak arama', 'tüketici',
    'şikayetimvar', 'online şikayet', 'şikayet yaz', 'şikayet çözüm',
  ],
  authors: [{ name: 'Şikayetimvar' }],
  creator: 'Şikayetimvar',
  publisher: 'Şikayetimvar',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Şikayetimvar',
    title: 'Şikayetimvar - Tüketici Şikayetleri Platformu',
    description: 'Türkiye\'nin en güvenilir tüketici şikayetleri platformu. Şikayetlerinizi paylaşın, çözüm bulun.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Şikayetimvar - Tüketici Şikayetleri Platformu',
    description: 'Türkiye\'nin en güvenilir tüketici şikayetleri platformu.',
  },
  alternates: {
    canonical: 'https://sikayetimvar.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1E6E4F',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
