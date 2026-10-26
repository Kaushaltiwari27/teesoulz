import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/supabase/products';
import { PRODUCTS } from '@/data/mockData';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export const instant = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) || PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found — TEESOULZ',
    };
  }

  const productUrl = `https://teesoulz.in/product/${product.slug}`;

  return {
    title: `${product.name} (${product.fitType}) — ₹${product.price}`,
    description: `${product.description} 100% combed cotton, 260-420 GSM heavyweight construction. Free express delivery in India with cash on delivery.`,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | TEESOULZ Indian Streetwear`,
      description: product.description,
      url: productUrl,
      type: 'website',
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 1600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — ₹${product.price}`,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) || PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Find related products in the same category
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  // Schema.org Product & Breadcrumb JSON-LD
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.variants[0]?.sku || product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'TEESOULZ',
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
      reviewCount: product.reviewCount || 1,
      bestRating: 5,
      worstRating: 1,
    },
  };

  const breadcrumbJsonLd = {
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
        name: product.category.replace('-', ' ').toUpperCase(),
        item: `https://teesoulz.in/category/${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://teesoulz.in/product/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
