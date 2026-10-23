'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  {
    title: 'SHOP MENS',
    href: '/shop?gender=men',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=85',
    alt: 'Shop Mens Streetwear',
  },
  {
    title: 'SHOP WOMENS',
    href: '/shop?gender=women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85',
    alt: 'Shop Womens Streetwear',
  },
];

export default function FeaturedCategories() {
  return (
    <section className="w-full bg-white py-2 sm:py-6">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        {/* Always 2 columns (horizontal side-by-side) across all devices matching Bonkers Corner */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative block w-full overflow-hidden rounded-[4px] sm:rounded-[8px] bg-[#111111]"
            >
              {/* Image Container with portrait fashion aspect ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  sizes="50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-105"
                  priority
                />

                {/* Subtle vignette gradient for readable typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

                {/* Bottom-left content matching Bonkers Corner layout */}
                <div className="absolute bottom-3 left-3 sm:bottom-8 sm:left-8 z-10 flex flex-col items-start pr-2">
                  <h3 className="text-sm xs:text-base sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-2 sm:mb-4 drop-shadow-md leading-tight font-sans">
                    {cat.title}
                  </h3>
                  <span className="inline-flex items-center justify-center px-3.5 py-1.5 sm:px-7 sm:py-2.5 text-[10px] sm:text-sm font-bold tracking-wider uppercase text-white border border-white rounded-[3px] sm:rounded-[6px] bg-black/20 backdrop-blur-xs transition-all duration-300 group-hover:bg-white group-hover:text-black touch-manipulation">
                    Explore
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
