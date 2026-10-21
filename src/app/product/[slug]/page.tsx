import React from 'react';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '@/data/mockData';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found — TEESOULZ',
    };
  }

  const ogImage = product.images[0];

  return {
    title: `${product.name} — TEESOULZ Indian Streetwear`,
    description: `${product.subtitle || ''} ${product.description}`.trim(),
    keywords: [
      product.name,
      'TEESOULZ',
      product.category.replace('-', ' '),
      product.fitType,
      'Indian streetwear',
      'buy oversized t-shirts India',
      ...product.tags,
    ],
    alternates: {
      canonical: `https://teesoulz.in/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} — TEESOULZ`,
      description: product.description,
      url: `https://teesoulz.in/product/${product.slug}`,
      siteName: 'TEESOULZ',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 1600,
          alt: product.name,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — TEESOULZ`,
      description: product.description,
      images: [ogImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Find related products in the same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Google Rich Snippet Structured Data (JSON-LD)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku || `TS-${product.id}`,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'TEESOULZ',
      logo: 'https://teesoulz.in/icon.png',
    },
    offers: {
      '@type': 'Offer',
      url: `https://teesoulz.in/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.totalStock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'TEESOULZ',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 4,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://teesoulz.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://teesoulz.in/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category.replace('-', ' ').toUpperCase(),
        item: `https://teesoulz.in/category/${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `https://teesoulz.in/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
