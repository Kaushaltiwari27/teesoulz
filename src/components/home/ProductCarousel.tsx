'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  viewAllLink: string;
  viewAllText?: string;
  products: Product[];
  bgColor?: string;
}

export default function ProductCarousel({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'View All Drops',
  products,
  bgColor = 'bg-white',
}: ProductCarouselProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = scrollContainerRef.current.clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`py-16 sm:py-24 ${bgColor} border-b border-[#E5E5E5]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            {subtitle && (
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777] block mb-1">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            {/* Nav Arrows for horizontal scroller on desktop */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="w-9 h-9 border border-[#E5E5E5] flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="w-9 h-9 border border-[#E5E5E5] flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors"
                aria-label="Next products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href={viewAllLink}
              className="text-xs font-bold uppercase tracking-wider text-[#080808] hover:underline flex items-center gap-1"
            >
              <span>{viewAllText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Rich Responsive Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom View All Link for Mobile & Desktop */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href={viewAllLink}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white hover:bg-[#222222] text-xs font-black uppercase tracking-[0.2em] transition-all border border-black shadow-md hover:shadow-lg"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
