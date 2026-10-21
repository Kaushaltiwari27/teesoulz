import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account',
          '/account/*',
          '/checkout',
          '/order-confirmation/*',
        ],
      },
    ],
    sitemap: 'https://teesoulz.in/sitemap.xml',
    host: 'https://teesoulz.in',
  };
}
