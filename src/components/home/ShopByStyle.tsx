'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const STYLES = [
  {
    title: 'OVERSIZED STREETWEAR',
    subtitle: '260 GSM Boxy Drop-Shoulder Drapes',
    link: '/category/oversized-t-shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'GRAPHIC SILKSCREEN TEES',
    subtitle: 'Cyberpunk Typography & Backprints',
    link: '/category/graphic-tees',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'HEAVYWEIGHT HOODIES',
    subtitle: '420 GSM Seamless Loopback Terry',
    link: '/category/hoodies-sweatshirts',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'TACTICAL BOTTOMWEAR',
    subtitle: 'Parachute Cargos & Relaxed Joggers',
    link: '/category/bottomwear',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
  },
];

export default function ShopByStyle() {
  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777] block mb-1">
              CURATED VIBES
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
              SHOP BY AESTHETIC
            </h2>
          </div>
          <p className="text-xs text-[#666666] max-w-xs">
            Whether you demand pure monochrome minimalism or bold statement typography, our drops are engineered for layering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STYLES.map((style) => (
            <Link
              key={style.title}
              href={style.link}
              className="group relative aspect-[3/4] overflow-hidden bg-[#E5E5E5] border border-[#E5E5E5] hover:border-black transition-all"
            >
              <Image
                src={style.image}
                alt={style.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity group-hover:opacity-95" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8B8B8]">
                  {style.subtitle}
                </span>
                <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white mt-1">
                  {style.title}
                </h3>
                <span className="text-xs text-[#E5E5E5] font-semibold flex items-center gap-1.5 mt-2 group-hover:underline">
                  <span>Explore Style</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
