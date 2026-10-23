'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BubbleCategory {
  title: string;
  href: string;
  image: string;
  badge?: string;
  isHot?: boolean;
}

const CATEGORY_BUBBLES: BubbleCategory[] = [
  {
    title: 'Oversized',
    href: '/category/oversized-t-shirts',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=300&q=80',
    isHot: true,
  },
  {
    title: 'Graphic Tees',
    href: '/category/graphic-tees',
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Hoodies',
    href: '/category/hoodies-sweatshirts',
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=300&q=80',
    badge: '400 GSM',
  },
  {
    title: 'Cargos',
    href: '/category/bottomwear',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Women',
    href: '/shop?gender=women',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'New Drops',
    href: '/new-in',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=80',
    isHot: true,
  },
  {
    title: 'Accessories',
    href: '/category/accessories',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80',
  },
  {
    title: 'Sale',
    href: '/sale',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=300&q=80',
    badge: 'OFFERS',
  },
];

export default function CategoryBubbles() {
  return (
    <section className="w-full bg-white border-b border-[#EFEFEF] py-3 sm:py-4">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-6 lg:px-8">
        {/* Horizontal scroll container with hidden scrollbar */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-none py-1 px-2 justify-start sm:justify-center">
          {CATEGORY_BUBBLES.map((bubble) => (
            <Link
              key={bubble.title}
              href={bubble.href}
              className="group flex flex-col items-center flex-shrink-0 transition-transform duration-200 active:scale-95"
            >
              {/* Outer circle with gradient/ring border like Bonkers Corner stories */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-black via-neutral-700 to-neutral-400 group-hover:from-red-600 group-hover:to-black transition-all duration-300">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-100 border-2 border-white">
                  <Image
                    src={bubble.image}
                    alt={bubble.title}
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Hot / Badge indicator */}
                {bubble.isHot && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white"></span>
                  </span>
                )}
                {bubble.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full tracking-tighter shadow-sm border border-white">
                    {bubble.badge}
                  </span>
                )}
              </div>

              {/* Title underneath */}
              <span className="mt-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-tight text-[#111111] group-hover:text-black text-center font-sans">
                {bubble.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}