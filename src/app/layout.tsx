import type { Metadata, Viewport } from 'next';
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

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://teesoulz.in'),
  title: {
    default: 'TEESOULZ — Premium Indian Streetwear & Heavyweight Fashion Label',
    template: '%s | TEESOULZ Indian Streetwear',
  },
  description:
    'TEESOULZ is an authentic Indian streetwear brand specializing in 260–420 GSM oversized t-shirts, drop-shoulder silhouettes, loopback hoodies, and tactical cargo trousers. Crafted in India with express shipping across 27,000+ pin codes.',
  keywords: [
    'TEESOULZ',
    'Indian streetwear brand',
    'oversized t-shirts India',
    'heavyweight t-shirts 280 GSM',
    'graphic tees India',
    'streetwear Mumbai',
    'drop shoulder t-shirts',
    'hoodies and sweatshirts India',
    'parachute cargo pants India',
    'luxury streetwear India',
    'combed cotton oversized tees',
    'unisex streetwear India',
  ],
  authors: [{ name: 'TEESOULZ Apparel Private Limited', url: 'https://teesoulz.in' }],
  creator: 'TEESOULZ',
  publisher: 'TEESOULZ Apparel',
  applicationName: 'TEESOULZ',
  generator: 'Next.js',
  formatDetection: {
    telephone: false,
    address: true,
    email: true,
  },
  alternates: {
    canonical: 'https://teesoulz.in',
    languages: {
      'en-IN': 'https://teesoulz.in',
      'x-default': 'https://teesoulz.in',
    },
  },
  openGraph: {
    title: 'TEESOULZ — Premium Indian Streetwear & Heavyweight Fashion',
    description:
      'Engineered 260-420 GSM heavyweight silhouettes, drop-shoulder boxy drapes, and brutalist monochrome contrast. Made in India.',
    url: 'https://teesoulz.in',
    siteName: 'TEESOULZ',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/teesoulz-logo.png',
        width: 1200,
        height: 630,
        alt: 'TEESOULZ Streetwear Official Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEESOULZ — Premium Indian Streetwear Label',
    description:
      'Heavyweight 260–420 GSM oversized t-shirts, brutalist graphic series, and drop-shoulder streetwear. Curated in India.',
    creator: '@teesoulz',
    site: '@teesoulz',
    images: ['/teesoulz-logo.png'],
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
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    // Geo-targeting meta tags for Indian Streetwear Search
    'geo.region': 'IN-MH',
    'geo.placename': 'Mumbai, Maharashtra, India',
    'geo.position': '19.0760;72.8777',
    'ICBM': '19.0760, 72.8777',
    'country': 'India',
    'currency': 'INR',
  },
};

// JSON-LD Structured Data (Organization & Sitelinks Searchbox)
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ClothingStore',
      '@id': 'https://teesoulz.in/#organization',
      name: 'TEESOULZ',
      alternateName: 'TEESOULZ Streetwear',
      url: 'https://teesoulz.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://teesoulz.in/teesoulz-logo.png',
        width: 512,
        height: 512,
      },
      image: 'https://teesoulz.in/teesoulz-logo.png',
      description:
        'Premium contemporary Indian streetwear brand producing 260-420 GSM heavyweight apparel, oversized t-shirts, drop-shoulder silhouettes, and tactical cargo trousers.',
      currenciesAccepted: 'INR',
      paymentAccepted: 'UPI, Credit Card, Debit Card, Net Banking, Cash on Delivery',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN',
        postalCode: '400050',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 19.076,
        longitude: 72.8777,
      },
      areaServed: {
        '@type': 'Country',
        name: 'India',
      },
      sameAs: [
        'https://instagram.com/teesoulz',
        'https://twitter.com/teesoulz',
        'https://youtube.com/@teesoulz',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://teesoulz.in/#website',
      url: 'https://teesoulz.in',
      name: 'TEESOULZ',
      publisher: {
        '@id': 'https://teesoulz.in/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://teesoulz.in/shop?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
