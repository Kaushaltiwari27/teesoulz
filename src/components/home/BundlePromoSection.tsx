'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/motion/ScrollReveal';

export default function BundlePromoSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="border-2 border-[#080808] p-6 sm:p-12 relative overflow-hidden bg-[#FAFAFA]">
            {/* Subtle Watermark Monogram */}
            <div className="absolute right-[-40px] top-[-40px] text-[180px] font-black text-black/5 pointer-events-none select-none font-mono">
              TS
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Promo Info */}
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest">
                  <Tag className="w-3 h-3" />
                  <span>OFFICIAL STORE BUNDLE OFFER</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
                  THE STREET DUO PACK:
                  <br />
                  ANY 2 OVERSIZED TEES AT ₹1,799
                </h2>

                <p className="text-xs sm:text-sm text-[#555555] max-w-xl leading-relaxed">
                  Upgrade your daily rotation. Combine any two 240-280 GSM Heavyweight or Graphic Oversized T-Shirts in your bag and save up to ₹799 automatically. No coupon required at checkout.
                </p>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#333333]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
                    <span>Applicable on all 240+ GSM Oversized styles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
                    <span>Free express Pan-India shipping included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
                    <span>Mix and match colors, graphics, and sizes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-black flex-shrink-0" />
                    <span>7-Day hassle-free doorstep size exchange</span>
                  </div>
                </div>
              </div>

              {/* Promo CTA Box */}
              <div className="lg:col-span-4 bg-white border border-[#E5E5E5] p-6 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#777777] tracking-wider block">
                    BUNDLE VALUE
                  </span>
                  <div className="flex items-baseline justify-center gap-2 mt-1">
                    <span className="text-3xl sm:text-4xl font-black text-black font-mono">₹1,799</span>
                    <span className="text-sm text-[#888888] line-through font-mono">₹2,598</span>
                  </div>
                  <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 mt-1 inline-block">
                    INSTANT SAVING: ₹799
                  </span>
                </div>

                <Link
                  href="/category/oversized-t-shirts"
                  className="w-full bg-[#080808] text-white hover:bg-black py-4 px-6 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-md"
                >
                  <span>Build Your 2-Pack</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
