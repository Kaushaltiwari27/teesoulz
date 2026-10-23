'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES_DATA, COLLECTIONS_DATA } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white border-b border-[#E5E5E5] shadow-xl z-50 transition-all duration-200 animate-in fade-in slide-in-from-top-1"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Categories Column */}
          <div className="col-span-3 border-r border-[#E5E5E5] pr-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="text-sm font-semibold text-[#111111] hover:text-[#080808] hover:translate-x-1 inline-block transition-all"
                >
                  Shop All Products
                </Link>
              </li>
              {CATEGORIES_DATA.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="text-sm text-[#333333] hover:text-black hover:translate-x-1 inline-block transition-all"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Curated Drops */}
          <div className="col-span-3 border-r border-[#E5E5E5] pr-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-4">
              Curated Drops
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/new-in"
                  onClick={onClose}
                  className="text-sm font-semibold text-[#111111] hover:text-[#080808] hover:translate-x-1 inline-block transition-all flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/bestsellers"
                  onClick={onClose}
                  className="text-sm text-[#333333] hover:text-black hover:translate-x-1 inline-block transition-all"
                >
                  Bestselling Essentials
                </Link>
              </li>
              <li>
                <Link
                  href="/sale"
                  onClick={onClose}
                  className="text-sm font-medium text-red-600 hover:text-red-700 hover:translate-x-1 inline-block transition-all"
                >
                  Limited Time Offers
                </Link>
              </li>
              {COLLECTIONS_DATA.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={`/collections/${col.slug}`}
                    onClick={onClose}
                    className="text-sm text-[#333333] hover:text-black hover:translate-x-1 inline-block transition-all"
                  >
                    {col.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Collection Highlight 1 */}
          <div className="col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-4">
              Featured Capsule
            </h4>
            <Link
              href="/collections/noir-monolith"
              onClick={onClose}
              className="group block relative aspect-[4/3] overflow-hidden bg-[#F3F3F3] border border-[#E5E5E5]"
            >
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85"
                alt="NOIR MONOLITH Capsule"
                fill
                sizes="300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8B8B8]">
                  DROP 04
                </span>
                <span className="text-sm font-bold tracking-tight">NOIR MONOLITH</span>
                <span className="text-xs text-white/80 flex items-center gap-1 mt-1 group-hover:underline">
                  Explore Capsule <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>

          {/* Featured Collection Highlight 2 */}
          <div className="col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-4">
              Streetwear Tech
            </h4>
            <Link
              href="/collections/cyber-tokyo"
              onClick={onClose}
              className="group block relative aspect-[4/3] overflow-hidden bg-[#F3F3F3] border border-[#E5E5E5]"
            >
              <Image
                src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85"
                alt="CYBER TOKYO Drop"
                fill
                sizes="300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#B8B8B8]">
                  GRAPHIC SERIES
                </span>
                <span className="text-sm font-bold tracking-tight">CYBER TOKYO</span>
                <span className="text-xs text-white/80 flex items-center gap-1 mt-1 group-hover:underline">
                  Shop Graphics <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
