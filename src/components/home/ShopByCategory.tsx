'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES_DATA } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';
import ScrollReveal from '@/components/motion/ScrollReveal';

export default function ShopByCategory() {
  const { categories } = useStore();
  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES_DATA;
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777777] block mb-1">
                CURATED CATEGORIES
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
                SHOP BY CATEGORY
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#080808] hover:underline flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>View All Categories</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Category Grid with Staggered ScrollReveal */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {displayCategories.map((cat: any, index: number) => (
            <ScrollReveal key={cat.slug} delay={index * 0.08} direction="up">
              <Link
                href={`/category/${cat.slug}`}
                className={`group relative flex flex-col overflow-hidden bg-[#F3F3F3] border border-[#E5E5E5] hover:border-black transition-all ${
                  index === 4 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                {/* Image Container with 4:5 ratio and Homeeee-style scale */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#B8B8B8]">
                      {cat.itemCount}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-white mt-0.5 flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
