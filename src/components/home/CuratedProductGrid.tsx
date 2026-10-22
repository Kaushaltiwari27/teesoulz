'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface Props {
  title: string;
  subtitle: string;
  viewAllLink: string;
  viewAllText?: string;
  products: Product[];
  bgColor?: string;
}

export default function CuratedProductGrid({
  title,
  subtitle,
  viewAllLink,
  viewAllText,
  products,
  bgColor = 'bg-white',
}: Props) {
  const buttonLabel = viewAllText || `Shop ${title}`;

  return (
    <section className={`w-full py-8 sm:py-14 border-b border-gray-100 ${bgColor}`}>
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header matching Bonkers Corner layout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-normal">
              {subtitle}
            </p>
          </div>
          <Link
            href={viewAllLink}
            className="text-xs sm:text-sm font-semibold text-black underline underline-offset-4 hover:opacity-70 transition-opacity self-start sm:self-auto"
          >
            {buttonLabel}
          </Link>
        </div>

        {/* 4-Column Responsive Grid matching Bonkers Corner */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
