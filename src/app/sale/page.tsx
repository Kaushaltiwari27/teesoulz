import React from 'react';
import Link from 'next/link';
import { ChevronRight, Tag } from 'lucide-react';
import { PRODUCTS } from '@/data/mockData';
import ProductGrid from '@/components/product/ProductGrid';

export const metadata = {
  title: 'Sale & Special Promotions — Up to 40% Off | TEESOULZ',
  description: 'Limited-time special prices on premium heavyweight Indian streetwear.',
};

export default function SalePage() {
  const saleProducts = PRODUCTS.filter((p) => (p.discountPercent || 0) > 0);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#777777] mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">Sale</span>
        </nav>

        <div className="mb-10 pb-6 border-b border-[#E5E5E5] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-600 mb-1">
              <Tag className="w-3 h-3 text-red-600" />
              <span>LIMITED QUANTITIES</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#080808]">
              OFFICIAL SALE & OFFERS
            </h1>
          </div>
          <span className="text-xs text-[#666666]">
            Showing <strong>{saleProducts.length}</strong> marked-down drops
          </span>
        </div>

        <ProductGrid products={saleProducts} />
      </div>
    </div>
  );
}
