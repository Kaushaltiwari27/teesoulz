import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/supabase/products';
import { PRODUCTS } from '@/data/mockData';
import ProductGrid from '@/components/product/ProductGrid';

export const metadata = {
  title: 'New In — Latest Drops & Arrivals | TEESOULZ',
  description: 'Explore the newest heavyweight drop-shoulder oversized tees, hoodies, and streetwear essentials.',
};

export const instant = false;

export default async function NewInPage() {
  const liveNew = await getProducts({ isNewArrival: true });
  const newProducts = liveNew && liveNew.length > 0 
    ? liveNew 
    : PRODUCTS.filter((p) => p.isNewArrival || p.tags.includes('New In'));

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#777777] mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">New Arrivals</span>
        </nav>

        <div className="mb-10 pb-6 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#777777] mb-1">
              <Sparkles className="w-3 h-3 text-black" />
              <span>DROP 04 IS LIVE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#080808]">
              NEW ARRIVALS
            </h1>
          </div>
          <span className="text-xs text-[#666666]">
            Showing <strong>{newProducts.length}</strong> latest released styles
          </span>
        </div>

        <ProductGrid products={newProducts} />
      </div>
    </div>
  );
}
