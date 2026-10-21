import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'About TEESOULZ — Reimagining Indian Streetwear',
  description: 'Learn about the philosophy, textile engineering, and design ethos behind TEESOULZ.',
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            ESTABLISHED IN INDIA • 2026
          </span>
          <h1 className="text-3xl sm:text-6xl font-extrabold uppercase tracking-tight text-[#080808] leading-none">
            ENGINEERED DRAPES.
            <br />
            BRUTALIST PURSUIT.
          </h1>
          <p className="text-sm sm:text-base text-[#555555] leading-relaxed pt-2">
            TEESOULZ emerged from a simple realization: Indian youth culture deserves streetwear that rivals the structural density, aesthetic clarity, and material excellence of luxury archival labels.
          </p>
        </div>

        {/* Visual Banner */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-[#111111] overflow-hidden border border-[#222222]">
          <Image
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
            alt="TEESOULZ Studio & Lookbook"
            fill
            sizes="100vw"
            priority
            className="object-cover brightness-75"
          />
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#E5E5E5]">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-black">01 / TEXTILE MASTERY</span>
            <h3 className="text-lg font-bold text-black uppercase">260–420 GSM CUSTOM KNITS</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              We reject standard stock market jerseys. We custom-mill our high-density compact yarns with long-staple combed cotton and loopback French Terry to achieve unmatched weight and longevity.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-black">02 / ARCHITECTURAL SILHOUETTES</span>
            <h3 className="text-lg font-bold text-black uppercase">BOXY & DROP-SHOULDER CUTS</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Our patterns are engineered with dropped shoulder seams, wider chest dimensions, and reinforced ribbed collars that will never warp or bacon even after 50 washes.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-black">03 / MONOCHROME ETHOS</span>
            <h3 className="text-lg font-bold text-black uppercase">UNCOMPROMISING CONTRAST</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Black, white, and silver-grey form our visual foundation. No random gimmicky fluorescent accents or seasonal throwaways. Just enduring pieces built for daily uniform rotation.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-8 sm:p-12 text-center space-y-4">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-black">
            EXPERIENCE THE TEESOULZ UNIFORM
          </h2>
          <p className="text-xs text-[#666666] max-w-md mx-auto">
            Discover our limited drops and foundational oversized tees designed for the streets.
          </p>
          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#080808] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              <span>Explore The Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
