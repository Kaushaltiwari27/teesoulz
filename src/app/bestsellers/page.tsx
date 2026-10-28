import React from 'react';
import Link from 'next/link';
import { ChevronRight, Flame } from 'lucide-react';
import { getProducts } from '@/lib/supabase/products';
import { PRODUCTS } from '@/data/mockData';
import ProductGrid from '@/components/product/ProductGrid';

export const metadata = {
  title: 'Bestselling Streetwear — The Permanent Icons | TEESOULZ',
  description: 'Our most demanded heavyweight silhouettes, 260 GSM boxy tees, and structural hoodies.',
};

export const instant = false;

export default async function BestsellersPage() {
  const liveBestsellers = await getProducts({ isBestseller: true });
  const bestsellers = Array.isArray(liveBestsellers) && liveBestsellers.length > 0 
    ? liveBestsellers 
    : PRODUCTS.filter((p) => p.isBestseller);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#777777] mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">Bestsellers</span>
        </nav>

        <div className="mb-10 pb-6 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>COMMUNITY FAVORITES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#080808]">
              BESTSELLING SILHOUETTES
            </h1>
          </div>
          <span className="text-xs text-[#666666]">
            Showing <strong>{bestsellers.length}</strong> verified customer favourites
          </span>
        </div>

        <ProductGrid products={bestsellers} />
      </div>
    </div>
  );
}
