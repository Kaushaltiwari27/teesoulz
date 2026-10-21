import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CartDrawer from '@/components/common/CartDrawer';
import SearchModal from '@/components/common/SearchModal';
import QuickViewModal from '@/components/common/QuickViewModal';
import SizeGuideModal from '@/components/common/SizeGuideModal';
import ToastContainer from '@/components/common/ToastContainer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://teesoulz.in'),
  title: {
    default: 'TEESOULZ — Premium Contemporary Indian Streetwear & Heavyweight Apparel',
    template: '%s | TEESOULZ Streetwear',
  },
  description:
    'Official TEESOULZ® online store. Shop 240-420 GSM oversized t-shirts, brutalist graphic tees, architectural hoodies & tactical bottomwear engineered in India with express nationwide dispatch.',
  applicationName: 'TEESOULZ',
  keywords: [
    'TEESOULZ',
    'Indian streetwear brand',
    'oversized t-shirts India',
    'heavyweight tees 280 GSM',
    '400 GSM loopback hoodie',
    'brutalist streetwear Mumbai',
    'cyberpunk graphic tees',
    'tactical parachute cargo pants',
    'drop shoulder silhouettes',
    'unisex luxury streetwear',
    'Bonkers Corner alternative',
    'Warriorworld alternative',
    'cotton streetwear blanks',
  ],
  authors: [{ name: 'TEESOULZ Apparel Studios', url: 'https://teesoulz.in' }],
  creator: 'TEESOULZ',
  publisher: 'TEESOULZ',
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  alternates: {
    canonical: 'https://teesoulz.in',
    languages: {
      'en-IN': 'https://teesoulz.in',
      'x-default': 'https://teesoulz.in',
    },
  },
  openGraph: {
    title: 'TEESOULZ — Premium Indian Streetwear & Heavyweight Apparel',
    description:
      'Engineered 260-420 GSM custom-milled combed cotton with drop-shoulder boxy drapes. Designed in India for the global streetwear movement.',
    url: 'https://teesoulz.in',
    siteName: 'TEESOULZ',
    images: [
      {
        url: '/icon.png',
        width: 800,
        height: 800,
        alt: 'TEESOULZ Official Monogram Logo',
      },
      {
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'TEESOULZ Autumn/Winter Drop 04 Campaign',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEESOULZ — Premium Indian Streetwear',
    description:
      'Heavyweight 260-420 GSM silhouettes, monochrome contrast, and minimal boxy drapes engineered in India.',
    images: ['/icon.png'],
    creator: '@teesoulz',
    site: '@teesoulz',
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
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    // Geo Targeting Meta Tags for India & International Search Engines
    'geo.region': 'IN-MH',
    'geo.placename': 'Mumbai, Maharashtra, India',
    'geo.position': '19.0760;72.8777',
    'ICBM': '19.0760, 72.8777',
    'distribution': 'global',
    'rating': 'general',
    'target': 'all',
    'country': 'India',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global Structured Data / Schema.org JSON-LD
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'TEESOULZ',
    alternateName: 'TEESOULZ Streetwear',
    url: 'https://teesoulz.in',
    logo: 'https://teesoulz.in/icon.png',
    image: 'https://teesoulz.in/icon.png',
    description:
      'Contemporary Indian streetwear brand specializing in 260-420 GSM heavyweight combed cotton oversized t-shirts, hoodies, and tactical bottomwear.',
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash on Delivery, UPI, Credit Card, Debit Card, Net Banking',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400050',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.0760',
      longitude: '72.8777',
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'India',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Worldwide',
      },
    ],
    sameAs: [
      'https://instagram.com/teesoulz',
      'https://twitter.com/teesoulz',
      'https://youtube.com/@teesoulz',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TEESOULZ',
    url: 'https://teesoulz.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://teesoulz.in/shop?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Favicon fallback links */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-white text-[#111111] antialiased">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Interactive Global Drawers & Modals */}
          <CartDrawer />
          <SearchModal />
          <QuickViewModal />
          <SizeGuideModal />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
