import { MetadataRoute } from 'next';
import { PRODUCTS, CATEGORIES_DATA, COLLECTIONS_DATA } from '@/data/mockData';

const BASE_URL = 'https://teesoulz.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/new-in`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/bestsellers`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sale`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/track-order`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/size-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/policies/shipping`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/policies/returns`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/policies/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/policies/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. Dynamic Product Routes (All 28 Products)
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Dynamic Category Routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES_DATA.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 4. Dynamic Collection Routes
  const collectionRoutes: MetadataRoute.Sitemap = COLLECTIONS_DATA.map((col) => ({
    url: `${BASE_URL}/collections/${col.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...collectionRoutes];
}
