'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'MEN',
    subtitle: 'HEAVYWEIGHT BOX DROPS',
    description: 'Oversized tees, structural loopback hoodies & utility bottomwear.',
    href: '/shop?gender=men',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    itemCount: '18 STYLES',
  },
  {
    title: 'WOMEN',
    subtitle: 'RELAXED STREET DRAPES',
    description: 'Dropped shoulders, boxy cropped fits & graphic acid-wash cuts.',
    href: '/shop?gender=women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    itemCount: '14 STYLES',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777777] block mb-1.5">
              CURATED SILHOUETTES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
              SHOP BY GENDER
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#080808] hover:underline flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View Full Catalogue</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 2 Simple Image-Led Cards: Men & Women */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative flex flex-col bg-[#F3F3F3] border border-[#E5E5E5] hover:border-black transition-all duration-300 overflow-hidden"
            >
              {/* Card Image with 16:10 or 4:3 aspect ratio */}
              <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-[#ECECEC]">
                <Image
                  src={cat.image}
                  alt={`Shop ${cat.title} Streetwear`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Bottom Overlay Label */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-white">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B8B8B8]">
                      0{idx + 1} // {cat.itemCount}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D4D4D4] mt-1 font-medium">
                    {cat.subtitle} — {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
