'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  title: string;
  subtitle: string;
  viewAllLink: string;
  products: Product[];
  bgColor?: string;
}

export default function CuratedProductGrid({
  title,
  subtitle,
  viewAllLink,
  products,
  bgColor = 'bg-white',
}: Props) {
  return (
    <section className={`py-16 sm:py-24 border-b border-[#E5E5E5] ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777777] block mb-1.5">
              {subtitle}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllLink}
            className="text-xs font-bold uppercase tracking-wider text-[#080808] hover:underline flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
