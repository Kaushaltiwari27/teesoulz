'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EditorialCultureSection() {
  return (
    <section className="w-full bg-white py-6 sm:py-10">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[4px] sm:rounded-[8px] bg-black text-white">
          <div className="relative aspect-[16/8] sm:aspect-[21/8] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=2000&q=85"
              alt="TEESOULZ Streetwear Editorial"
              fill
              sizes="100vw"
              className="object-cover object-center filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-center">
              <div className="p-6 sm:p-12 lg:p-16 max-w-xl">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-red-500 font-bold block mb-2">
                  EXCLUSIVE CAPSULE DROP
                </span>
                <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none mb-3">
                  TIME TO GET WEIRD
                </h3>
                <p className="text-xs sm:text-base text-gray-300 font-normal leading-relaxed mb-6">
                  If found possessed, blame the fashion. Heavyweight boxy silhouettes, brutalist typography, and drops you didn&apos;t see coming.
                </p>
                <Link
                  href="/collections/noir-monolith"
                  className="inline-flex items-center justify-center px-7 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white border border-white rounded-[4px] hover:bg-white hover:text-black transition-all duration-300"
                >
                  Explore Capsule
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
