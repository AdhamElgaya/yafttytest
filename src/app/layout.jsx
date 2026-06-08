import Providers from './providers';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Yaftty – Outdoor Advertising Platform',
    template: '%s | Yaftty',
  },
  description:
    'Book and manage outdoor advertising banners across Egypt. Discover billboard locations on the map.',
  keywords: ['outdoor advertising', 'billboards', 'Egypt', 'Yaftty'],
  openGraph: {
    type: 'website',
    siteName: 'Yaftty',
    title: 'Yaftty – Outdoor Advertising Platform',
    description: 'Book outdoor advertising banners across Egypt.',
  },
  icons: {
    icon: [{ url: '/favicon.png?v=3', type: 'image/png' }],
    shortcut: [{ url: '/favicon.png?v=3', type: 'image/png' }],
    apple: [{ url: '/favicon.png?v=3', type: 'image/png' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@700&display=swap"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@700&display=swap"
        />
        <link rel="icon" href="/favicon.png?v=3" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?v=3" type="image/png" />
      </head>
      <body suppressHydrationWarning data-font="latin">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
