import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { getProducts } from '@/lib/supabase/products';
import { PRODUCTS, CATEGORIES_DATA } from '@/data/mockData';
import ProductGrid from '@/components/product/ProductGrid';
import { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = [
    ...CATEGORIES_DATA.map((c) => ({ slug: c.slug })),
    { slug: 'men' },
    { slug: 'women' },
    { slug: 'unisex' },
  ];
  return slugs;
}

export const instant = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES_DATA.find((c) => c.slug === slug);
  const title = category ? `${category.name} — TEESOULZ Indian Streetwear` : `${slug.replace('-', ' ').toUpperCase()} Streetwear — TEESOULZ`;
  const description = category?.description || `Explore ${slug} streetwear drops by TEESOULZ. Crafted with 260-420 GSM heavyweight combed cotton in India.`;
  const url = `https://teesoulz.in/category/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [category?.image || '/teesoulz-logo.png'],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const categoryMeta = CATEGORIES_DATA.find((c) => c.slug === slug);
  const liveProducts = await getProducts();
  const allProducts = liveProducts && liveProducts.length > 0 ? liveProducts : PRODUCTS;

  // Match products by category or gender
  const products = allProducts.filter((p) => {
    if (slug === 'men' || slug === 'women' || slug === 'unisex') {
      return p.gender === slug || p.gender === 'unisex';
    }
    return p.category === slug;
  });

  const displayName = categoryMeta ? categoryMeta.name : slug.replace('-', ' ').toUpperCase();
  const description = categoryMeta
    ? categoryMeta.description
    : `Discover our signature ${displayName} streetwear silhouettes, crafted with custom-milled textiles and architectural boxy fits.`;

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#777777] mb-6">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111] font-semibold">{displayName}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="relative mb-10 overflow-hidden bg-[#080808] text-white border border-[#222222] p-8 sm:p-12">
          {categoryMeta && (
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <Image
                src={categoryMeta.image}
                alt={displayName}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8B8B8]">
              OFFICIAL COLLECTION
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed pt-1">
              {description}
            </p>
            <div className="pt-2 text-xs font-semibold text-[#B8B8B8]">
              Showing <strong className="text-white">{products.length}</strong> styles in this category
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={products}
          emptyTitle={`No products currently available in ${displayName}`}
          emptyMessage="Check back soon for upcoming capsule drops or explore our other streetwear collections."
        />
      </div>
    </div>
  );
}
