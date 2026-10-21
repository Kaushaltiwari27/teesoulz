import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#080808] text-white min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-8xl sm:text-9xl font-black tracking-tighter text-[#222222] select-none block">
          404
        </span>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            LOST IN THE VOID
          </h1>
          <p className="text-xs text-[#A0A0A0] leading-relaxed">
            The drop, silhouette, or page you were seeking has been archived, moved, or never existed in this dimension.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-white text-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors"
          >
            Return to Storefront
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto border border-[#333333] hover:border-white text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Explore Active Drops
          </Link>
        </div>
      </div>
    </div>
  );
}
