'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCms } from '@/context/CmsContext';

export default function EditorialCultureSection() {
  const { cms } = useCms();
  const config = cms.editorialCulture;

  if (!config.enabled) return null;

  return (
    <section className="w-full bg-white py-6 sm:py-10">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[4px] sm:rounded-[8px] bg-black text-white">
          <div className="relative aspect-[4/3] sm:aspect-[16/8] lg:aspect-[21/8] min-h-[300px] sm:min-h-0 w-full overflow-hidden">
            <Image
              src={config.image || 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=2000&q=85'}
              alt="TEESOULZ Streetwear Editorial"
              fill
              sizes="100vw"
              className="object-cover object-center filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent flex items-center">
              <div className="p-5 sm:p-10 lg:p-16 max-w-xl">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-red-500 font-bold block mb-2">
                  {config.tag || 'EXCLUSIVE CAPSULE DROP'}
                </span>
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none mb-2 sm:mb-3">
                  {config.title || 'TIME TO GET WEIRD'}
                </h3>
                <p className="text-xs sm:text-base text-gray-300 font-normal leading-relaxed mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none">
                  {config.description || "If found possessed, blame the fashion. Heavyweight boxy silhouettes, brutalist typography, and drops you didn't see coming."}
                </p>
                {config.buttonText && config.buttonLink && (
                  <Link
                    href={config.buttonLink}
                    className="inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white border border-white rounded-[4px] hover:bg-white hover:text-black transition-all duration-300"
                  >
                    {config.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
