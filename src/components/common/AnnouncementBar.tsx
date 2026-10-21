'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Flame, ShieldCheck, Tag } from 'lucide-react';

const MARQUEE_ITEMS = [
  {
    icon: Sparkles,
    text: 'FREE PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹1,499',
    badge: 'FREE DELIVERY',
  },
  {
    icon: Tag,
    text: 'USE CODE SOUL10 FOR EXTRA 10% OFF YOUR CART',
    badge: 'CODE: SOUL10',
  },
  {
    icon: Flame,
    text: 'NEW DROP 04: NOIR MONOLITH CAPSULE IS LIVE',
    badge: 'NEW DROP',
  },
  {
    icon: ShieldCheck,
    text: '260–420 GSM FRENCH TERRY • 7-DAY DOORSTEP EXCHANGE',
    badge: 'AUTHENTIC',
  },
];

export default function AnnouncementBar() {
  return (
    <div className="bg-[#080808] text-white text-[11px] font-bold tracking-widest uppercase border-b border-[#222222] relative z-40 overflow-hidden select-none py-2">
      <div className="animate-marquee flex items-center">
        {/* First copy */}
        <div className="flex items-center gap-8 pr-8">
          {MARQUEE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m1-${idx}`} className="flex items-center gap-3 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <Icon className="w-3.5 h-3.5 text-[#B8B8B8] flex-shrink-0" />
                <span className="text-[#E5E5E5]">{item.text}</span>
                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-extrabold tracking-wider">
                  {item.badge}
                </span>
                <Link
                  href="/sale"
                  className="text-[#999999] hover:text-white underline underline-offset-2 ml-1 transition-colors"
                >
                  SHOP NOW →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Duplicate copy for seamless infinite loop */}
        <div className="flex items-center gap-8 pr-8" aria-hidden="true">
          {MARQUEE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`m2-${idx}`} className="flex items-center gap-3 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <Icon className="w-3.5 h-3.5 text-[#B8B8B8] flex-shrink-0" />
                <span className="text-[#E5E5E5]">{item.text}</span>
                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-extrabold tracking-wider">
                  {item.badge}
                </span>
                <Link
                  href="/sale"
                  className="text-[#999999] hover:text-white underline underline-offset-2 ml-1 transition-colors"
                >
                  SHOP NOW →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
