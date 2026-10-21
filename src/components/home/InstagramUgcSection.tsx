'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from '@/components/common/BrandIcons';

const UGC_LOOKS = [
  {
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    tag: '@teesoulz / Drop 04',
  },
  {
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    tag: '@teesoulz / Heavyweight Noir',
  },
  {
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
    tag: '@teesoulz / Cyber Archival',
  },
  {
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
    tag: '@teesoulz / 420 GSM Hoodie',
  },
  {
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    tag: '@teesoulz / Tactical Parachute',
  },
  {
    image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=600&q=80',
    tag: '@teesoulz / Drop Shoulder',
  },
];

export default function InstagramUgcSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777] block mb-1">
              AS SEEN ON THE STREETS
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
              TAG #TEESOULZ TO BE FEATURED
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-[#080808] hover:underline flex items-center gap-1.5"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @teesoulz</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {UGC_LOOKS.map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden bg-[#F3F3F3] border border-[#E5E5E5]"
            >
              <Image
                src={item.image}
                alt={item.tag}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center text-white">
                <InstagramIcon className="w-6 h-6 mb-1 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                  {item.tag}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
