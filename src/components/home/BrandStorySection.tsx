'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ParallaxImage from '@/components/motion/ParallaxImage';
import TextReveal from '@/components/motion/TextReveal';
import ScrollReveal from '@/components/motion/ScrollReveal';

export default function BrandStorySection() {
  return (
    <section className="py-20 sm:py-28 bg-[#080808] text-white border-b border-[#222222] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Visual Collage with Aperture Reveals */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="mt-8">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
                alt="TEESOULZ Studio Drape"
                aspectRatio="aspect-[3/4]"
                className="border border-[#2B2B2B] shadow-2xl"
              />
            </div>
            <div>
              <ParallaxImage
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                alt="TEESOULZ Heavyweight Fabric"
                aspectRatio="aspect-[3/4]"
                className="border border-[#2B2B2B] shadow-2xl"
              />
            </div>
          </div>

          {/* Story Content with Staggered Motion */}
          <div className="lg:col-span-6 space-y-6">
            <ScrollReveal direction="up" delay={0.1}>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B8B8B8] block">
                THE TEESOULZ MANIFESTO
              </span>
            </ScrollReveal>

            {/* Headline with Masked Text Reveal */}
            <TextReveal
              as="h2"
              className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight font-sans"
              lines={[
                'BORN IN INDIA.',
                <span key="h2" className="text-[#A3A3A3] font-light italic tracking-normal">
                  SHAPED BY THE STREETS.
                </span>,
              ]}
              delay={0.15}
            />

            <ScrollReveal direction="up" delay={0.25}>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                We grew tired of flimsy fast-fashion tees marketed as &ldquo;streetwear.&rdquo; TEESOULZ was founded in Mumbai with one relentless objective: engineer garments with genuine structural integrity, true heavyweight density, and pure monochrome restraint.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.35}>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Every drop is cut from scratch. We custom-knit our 260-420 GSM textiles from long-staple combed cotton, engineer tight-weave anti-curl rib collars, and test each piece across dozens of wash cycles so the architectural shape never collapses.
              </p>
            </ScrollReveal>

            {/* Homeeee-style Editorial Architectural Metrics */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/15 pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">280</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">GSM French Terry</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">100%</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">Combed Cotton</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">50+</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">Wash Tested</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">27K+</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777]">PIN Codes Served</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.5}>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-white text-black hover:bg-[#E5E5E5] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all group shadow-lg hover:shadow-white/20"
                >
                  <span>Read Full Brand Story</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
