import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AirServices - Automatización Inteligente',
  description: 'Plataforma SaaS para crear automatizaciones sin código usando n8n',
  keywords: ['automatización', 'n8n', 'workflows', 'whatsapp', 'ai', 'bots'],
  authors: [{ name: 'AirServices Team' }],
  creator: 'AirServices',
  publisher: 'AirServices',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:8000'),
  openGraph: {
    title: 'AirServices - Automatización Inteligente',
    description: 'Plataforma SaaS para crear automatizaciones sin código usando n8n',
    url: '/',
    siteName: 'AirServices',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AirServices - Automatización Inteligente',
    description: 'Plataforma SaaS para crear automatizaciones sin código usando n8n',
  },
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
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1d4ed8' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
