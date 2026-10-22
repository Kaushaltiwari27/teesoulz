import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { COLLECTIONS_DATA } from '@/data/mockData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curated Drops & Capsule Collections — TEESOULZ',
  description: 'Explore limited streetwear drops from TEESOULZ. Archival graphics, heavyweight loopback cotton, and minimal silhouettes.',
  alternates: {
    canonical: 'https://teesoulz.in/collections',
  },
};

export default function CollectionsPage() {
  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#777777] mb-8">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">Collections</span>
        </nav>

        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#777777] block mb-2">
            ARCHIVE & CAPSULES
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#080808]">
            COLLECTIONS
          </h1>
          <p className="text-sm text-[#666666] mt-3 leading-relaxed">
            Each TEESOULZ drop is engineered as a cohesive aesthetic study in silhouette, textile weight, and monochrome restraint.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COLLECTIONS_DATA.map((col, idx) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group block border border-[#E5E5E5] hover:border-black transition-all bg-[#F3F3F3] overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B8B8B8] mb-1">
                    0{idx + 1} // {col.tagline}
                  </span>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black uppercase tracking-tight">
                      {col.name}
                    </h2>
                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  <p className="text-xs text-[#CCCCCC] mt-2 line-clamp-2">
                    {col.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
