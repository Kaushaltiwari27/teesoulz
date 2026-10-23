'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import { History, Trash2 } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
  excludeProductId?: string;
  limit?: number;
}

export default function RecentlyViewedSection({
  title = 'Recently Viewed',
  subtitle = 'Pick up right where you left off in your session',
  excludeProductId,
  limit = 8,
}: Props) {
  const { recentlyViewed, clearRecentlyViewed } = useStore();

  // Filter out excluded product if passed (e.g. On PDP page)
  const displayProducts = React.useMemo(() => {
    let list = recentlyViewed;
    if (excludeProductId) {
      list = list.filter((p) => p.id !== excludeProductId);
    }
    return list.slice(0, limit);
  }, [recentlyViewed, excludeProductId, limit]);

  // Don't render anything if the user has not viewed any products yet
  if (!displayProducts || displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 sm:py-16 bg-white border-b border-[#E5E5E5] animate-in fade-in duration-300">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#777777] mb-1">
              <History className="w-3.5 h-3.5 text-black" />
              <span>YOUR BROWSING ARCHIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-black font-sans">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1 font-normal">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={clearRecentlyViewed}
            className="inline-flex items-center gap-1.5 text-xs text-[#888888] hover:text-black hover:underline transition-colors self-start sm:self-auto cursor-pointer"
            title="Clear recently viewed history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>

        {/* Responsive Grid matching Bonkers Corner */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}