import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TEESOULZ Admin Portal',
  description: 'Independent management system for TEESOULZ Streetwear',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://teesoulz-admin.vercel.app'
  ),
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
