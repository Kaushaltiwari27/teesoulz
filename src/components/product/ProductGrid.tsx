'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyMessage?: string;
  showReset?: boolean;
  onReset?: () => void;
}

export default function ProductGrid({
  products,
  emptyTitle = 'No products found',
  emptyMessage = 'Try clearing or modifying your active filters to explore available drops.',
  showReset = false,
  onReset,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center border border-[#E5E5E5] bg-[#FAFAFA] p-8">
        <h4 className="text-base font-bold text-[#111111]">{emptyTitle}</h4>
        <p className="text-xs text-[#666666] max-w-sm mx-auto mt-2 mb-6">
          {emptyMessage}
        </p>
        {showReset && onReset ? (
          <button
            onClick={onReset}
            className="inline-block bg-[#080808] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-black transition-colors"
          >
            Clear All Filters
          </button>
        ) : (
          <Link
            href="/shop"
            className="inline-block bg-[#080808] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-black transition-colors"
          >
            Browse All Drops
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={idx < 4}
        />
      ))}
    </div>
  );
}
