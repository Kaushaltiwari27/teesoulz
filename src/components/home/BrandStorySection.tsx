'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BrandStorySection() {
  return (
    <section className="py-20 sm:py-28 bg-[#080808] text-white border-b border-[#222222] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] bg-[#1a1a1a] border border-[#2b2b2b] overflow-hidden mt-6">
              <Image
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
                alt="TEESOULZ Studio Heavyweight Drape"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover filter contrast-105"
              />
            </div>
            <div className="relative aspect-[3/4] bg-[#1a1a1a] border border-[#2b2b2b] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                alt="TEESOULZ French Terry Construction"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover filter contrast-105"
              />
            </div>
          </div>

          {/* Minimal Brand Statement Content */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B8B8B8] block">
              THE TEESOULZ MANIFESTO
            </span>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight font-sans">
              BORN IN INDIA. <br />
              <span className="text-[#A3A3A3] font-light italic tracking-normal">
                ENGINEERED FOR THE UNDERGROUND.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#D4D4D4] leading-relaxed max-w-xl">
              TEESOULZ was founded with one clear conviction: genuine streetwear requires structural integrity, unapologetic heavyweight fabric, and monochrome discipline.
            </p>

            <p className="text-xs sm:text-sm text-[#999999] leading-relaxed max-w-xl">
              Every drop is developed from custom-milled 260–420 GSM French Terry combed cotton. Designed with reinforced zero-sag collars and deliberate drop-shoulder drape to withstand everyday rotation.
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-[#E5E5E5] px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all group"
              >
                <span>EXPLORE OUR PHILOSOPHY</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
