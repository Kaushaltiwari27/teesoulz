'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Flame } from 'lucide-react';
import gsap from 'gsap';

export default function FeaturedDrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intersection observer or subtle entrance
      gsap.from(visualRef.current, {
        opacity: 0.2,
        scale: 0.95,
        duration: 1.2,
        ease: 'power2.out',
      });
      gsap.from(contentRef.current, {
        opacity: 0,
        x: 30,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="bg-[#080808] text-white py-16 sm:py-24 border-b border-[#222222] relative overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Editorial Visual */}
          <div
            ref={visualRef}
            className="lg:col-span-7 relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden border border-[#2B2B2B] bg-[#141414] group"
          >
            <Image
              src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1400&q=85"
              alt="NOIR MONOLITH Capsule"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest shadow-md">
              LIMITED CAPSULE
            </div>
          </div>

          {/* Editorial Copy */}
          <div ref={contentRef} className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B8B8B8]">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              <span>COLLECTION 04 DROP</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              NOIR MONOLITH:
              <br />
              BRUTALIST ESSENTIALS
            </h2>

            <p className="text-sm text-[#A0A0A0] leading-relaxed">
              Constructed in homage to monumental architecture, heavy contrast, and unyielding form. Every garment in the Noir Monolith drop features 260 GSM compact yarn, double-needle topstitching, and an exaggerated drop-shoulder profile designed to hold its structural drape.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/collections/noir-monolith"
                className="bg-white text-black hover:bg-[#E5E5E5] px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-lg hover:scale-102"
              >
                <span>Shop The Capsule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/category/oversized-t-shirts"
                className="border border-[#444444] hover:border-white text-white px-8 py-3.5 text-xs font-extrabold uppercase tracking-widest text-center transition-all"
              >
                Explore Oversized
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
