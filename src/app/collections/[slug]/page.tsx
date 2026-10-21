import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, Sparkles } from 'lucide-react';
import { PRODUCTS, COLLECTIONS_DATA } from '@/data/mockData';
import ProductGrid from '@/components/product/ProductGrid';
import { Metadata } from 'next';

export async function generateStaticParams() {
  return COLLECTIONS_DATA.map((c) => ({ slug: c.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const col = COLLECTIONS_DATA.find((c) => c.slug === slug);
  return {
    title: col ? `${col.name} Capsule Drop — TEESOULZ` : 'Streetwear Collections — TEESOULZ',
    description: col?.description || 'Limited capsule releases from TEESOULZ.',
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;

  const collection = COLLECTIONS_DATA.find((c) => c.slug === slug);
  const products = PRODUCTS.filter((p) => p.collections.includes(slug));

  const displayName = collection ? collection.name : slug.replace('-', ' ').toUpperCase();

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
            Collections
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111] font-semibold">{displayName}</span>
        </nav>

        {/* Collection Hero Header */}
        <div className="relative mb-10 overflow-hidden bg-[#080808] text-white border border-[#222222] p-8 sm:p-14">
          {collection && (
            <div className="absolute inset-0 opacity-25 pointer-events-none">
              <Image
                src={collection.image}
                alt={displayName}
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
          )}
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-[#B8B8B8] text-[10px] font-bold uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-white" />
              <span>{collection?.tagline || 'LIMITED CAPSULE RELEASE'}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed max-w-xl">
              {collection?.description || 'Architectural streetwear silhouettes tailored from custom-milled heavyweight textiles.'}
            </p>
          </div>
        </div>

        {/* Products */}
        <ProductGrid
          products={products}
          emptyTitle={`No products currently found in ${displayName}`}
        />
      </div>
    </div>
  );
}
