'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function BrandStorySection() {
  return (
    <section className="py-20 sm:py-28 bg-[#080808] text-white border-b border-[#222222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Editorial Visual Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden border border-[#2B2B2B] bg-[#141414] mt-8">
              <Image
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
                alt="TEESOULZ Studio Drape"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden border border-[#2B2B2B] bg-[#141414]">
              <Image
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                alt="TEESOULZ Heavyweight Fabric"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Story Content */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8B8B8] block">
              THE TEESOULZ MANIFESTO
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              BORN IN INDIA.
              <br />
              SHAPED BY THE STREETS.
            </h2>

            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              We grew tired of flimsy fast-fashion tees marketed as &ldquo;streetwear.&rdquo; TEESOULZ was founded in Mumbai with one relentless objective: engineer garments with genuine structural integrity, true heavyweight density, and pure monochrome restraint.
            </p>

            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              Every drop is cut from scratch. We custom-knit our 260-420 GSM textiles from long-staple combed cotton, engineer tight-weave anti-curl rib collars, and test each piece across dozens of wash cycles so the shape never collapses.
            </p>

            <div className="pt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-black hover:bg-[#E5E5E5] px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest transition-colors"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
