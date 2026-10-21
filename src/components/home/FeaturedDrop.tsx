'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import ParallaxImage from '@/components/motion/ParallaxImage';
import TextReveal from '@/components/motion/TextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';

export default function FeaturedDrop() {
  return (
    <section className="bg-[#080808] text-white py-16 sm:py-24 border-b border-[#222222] relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Editorial Visual with Aperture Reveal */}
          <div className="lg:col-span-7">
            <ParallaxImage
              src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1600&q=85"
              alt="NOIR MONOLITH Capsule Campaign"
              aspectRatio="aspect-[4/3] sm:aspect-[16/10]"
              className="border border-[#2B2B2B] shadow-2xl"
              sizes="(max-width: 1024px) 100vw, 60vw"
            >
              <div className="absolute top-4 left-4 bg-white text-black px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-md z-10">
                CAPSULE DROP 04
              </div>
            </ParallaxImage>
          </div>

          {/* Editorial Copy with Staggered Reveals */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B8B8B8]">
                <Flame className="w-4 h-4 text-white animate-pulse" />
                <span>ARCHIVAL STREETWEAR</span>
              </div>
            </ScrollReveal>

            {/* Headline with Staggered Masked Entrance */}
            <TextReveal
              as="h2"
              className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight font-sans"
              lines={[
                'NOIR MONOLITH:',
                <span key="h2" className="text-[#A3A3A3] font-light italic tracking-normal">
                  BRUTALIST ESSENTIALS
                </span>,
              ]}
              delay={0.15}
            />

            <ScrollReveal direction="up" delay={0.25}>
              <p className="text-sm text-[#B8B8B8] leading-relaxed">
                Constructed in homage to monumental architecture, heavy contrast, and unyielding form. Every garment in the Noir Monolith drop features 260–280 GSM compact yarn, double-needle topstitching, and an exaggerated drop-shoulder profile designed to hold its structural drape.
              </p>
            </ScrollReveal>

            {/* Editorial Numbered Micro-Specs (Homeeee Style) */}
            <ScrollReveal direction="up" delay={0.35}>
              <div className="pt-2 border-t border-white/15 space-y-3">
                <div className="flex items-baseline justify-between py-1 border-b border-white/10 text-xs font-mono">
                  <span className="text-[#777777] font-bold">01 / SILHOUETTE</span>
                  <span className="text-white uppercase font-semibold">Architectural Boxy Cut</span>
                </div>
                <div className="flex items-baseline justify-between py-1 border-b border-white/10 text-xs font-mono">
                  <span className="text-[#777777] font-bold">02 / TEXTILE</span>
                  <span className="text-white uppercase font-semibold">280 GSM Combed French Terry</span>
                </div>
                <div className="flex items-baseline justify-between py-1 text-xs font-mono">
                  <span className="text-[#777777] font-bold">03 / FINISH</span>
                  <span className="text-white uppercase font-semibold">Sulfur Wash & High-Density Ink</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.45}>
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/collections/noir-monolith"
                  className="bg-white text-black hover:bg-[#E5E5E5] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-center transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-white/20"
                >
                  <span>Shop The Capsule</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
                <Link
                  href="/category/oversized-t-shirts"
                  className="border border-[#444444] hover:border-white text-white px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-center transition-all"
                >
                  Explore Oversized
                </Link>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
