import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/*',
          '/checkout',
          '/order-confirmation/*',
          '/api/*',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    sitemap: 'https://teesoulz.in/sitemap.xml',
    host: 'https://teesoulz.in',
  };
}
