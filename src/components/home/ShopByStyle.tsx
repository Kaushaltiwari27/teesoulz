'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/motion/ScrollReveal';

const STYLES = [
  {
    num: '01',
    title: 'OVERSIZED STREETWEAR',
    subtitle: '260 GSM Boxy Drop-Shoulder Drapes',
    link: '/category/oversized-t-shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
  },
  {
    num: '02',
    title: 'GRAPHIC SILKSCREEN TEES',
    subtitle: 'Cyberpunk Typography & Backprints',
    link: '/category/graphic-tees',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
  },
  {
    num: '03',
    title: 'HEAVYWEIGHT HOODIES',
    subtitle: '420 GSM Seamless Loopback Terry',
    link: '/category/hoodies-sweatshirts',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    num: '04',
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
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777777] block mb-1">
                CURATED AESTHETICS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
                SHOP BY STYLE
              </h2>
            </div>
            <p className="text-xs text-[#666666] max-w-xs font-mono leading-relaxed">
              From pure monochrome minimalism to bold graphic statements — engineered for architectural layering.
            </p>
          </div>
        </ScrollReveal>

        {/* Styles Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STYLES.map((style, index) => (
            <ScrollReveal key={style.title} delay={index * 0.1} direction="up">
              <Link
                href={style.link}
                className="group relative aspect-[3/4] block overflow-hidden bg-[#E5E5E5] border border-[#E5E5E5] hover:border-black transition-all"
              >
                <Image
                  src={style.image}
                  alt={style.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-108"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Card Top Index Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[10px] font-mono tracking-widest text-white/60 bg-black/40 backdrop-blur-md px-2 py-0.5 border border-white/15">
                    {style.num}
                  </span>
                </div>

                {/* Card Bottom Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end text-white z-10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#B8B8B8]">
                    {style.subtitle}
                  </span>
                  <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mt-1">
                    {style.title}
                  </h3>
                  <span className="text-xs text-[#E5E5E5] font-semibold flex items-center gap-1.5 mt-2 group-hover:underline">
                    <span>Explore Style</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
