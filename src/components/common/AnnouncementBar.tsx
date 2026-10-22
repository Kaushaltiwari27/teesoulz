'use client';

import React from 'react';
import Link from 'next/link';

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Promotional announcement"
      className="bg-[#080808] text-white border-b border-[#1c1c1c] text-[11px] font-medium tracking-[0.2em] uppercase py-2 px-4 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <Link
          href="/new-in"
          className="hover:text-[#B8B8B8] transition-colors flex items-center gap-2"
        >
          <span>NEW DROP AVAILABLE NOW</span>
          <span className="hidden sm:inline text-[#666666]">•</span>
          <span className="hidden sm:inline text-[#B8B8B8] font-normal text-[10px]">
            FREE PAN-INDIA EXPRESS SHIPPING OVER ₹1,499
          </span>
        </Link>
      </div>
    </aside>
  );
}
