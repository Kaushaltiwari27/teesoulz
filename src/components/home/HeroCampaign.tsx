'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function HeroCampaign() {
  return (
    <section className="relative w-full min-h-[75vh] sm:min-h-[85vh] lg:min-h-[88vh] flex items-center bg-[#080808] text-white overflow-hidden">
      {/* Background Campaign Imagery */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=85"
          alt="TEESOULZ Heavyweight Streetwear Campaign"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] filter brightness-90 contrast-105"
        />
        {/* Editorial Monochrome Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/55 lg:to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Tag / Collection indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs border border-white/20 text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-[#E5E5E5]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>AUTUMN / WINTER 2026 DROP</span>
          </div>

          {/* Concise Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] font-sans">
            HEAVYWEIGHT <br />
            <span className="text-[#B8B8B8] font-light italic">SILHOUETTES.</span>
          </h1>

          {/* Short Supporting Line */}
          <p className="text-sm sm:text-base text-[#D4D4D4] max-w-lg leading-relaxed font-normal">
            Engineered with 260–420 GSM custom-milled French Terry and architectural drop-shoulder tailoring. Designed in India for everyday rotation.
          </p>

          {/* Primary CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/new-in"
              className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-[#E5E5E5] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:translate-x-1"
            >
              <span>SHOP NEW ARRIVALS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white hover:bg-white/10 px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300"
            >
              <span>EXPLORE DROPS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Minimal Scroll Down Indicator */}
      <div className="hidden sm:flex absolute bottom-8 right-8 z-10 items-center gap-2 text-white/70 text-[10px] font-mono uppercase tracking-[0.2em]">
        <span>SCROLL DOWN</span>
        <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
      </div>
    </section>
  );
}
