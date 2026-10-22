'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Tag, ShieldCheck } from 'lucide-react';

const TICKER_ITEMS = [
  {
    icon: Sparkles,
    text: 'NEW DROP AVAILABLE NOW',
    badge: 'DROP 04',
  },
  {
    icon: ShieldCheck,
    text: 'FREE PAN-INDIA EXPRESS SHIPPING ON ORDERS OVER ₹1,499',
    badge: 'FREE DELIVERY',
  },
  {
    icon: Tag,
    text: 'USE CODE SOUL10 FOR EXTRA 10% OFF YOUR ORDER',
    badge: 'SOUL10',
  },
  {
    icon: Sparkles,
    text: 'ENGINEERED 260–420 GSM FRENCH TERRY HEAVYWEIGHT SILHOUETTES',
    badge: '100% COTTON',
  },
  {
    icon: ShieldCheck,
    text: '7-DAY DOORSTEP EXCHANGE & EASY RETURNS',
    badge: 'ASSURED',
  },
];

export default function AnnouncementBar() {
  return (
    <aside
      aria-label="Promotional announcement ticker"
      className="bg-[#080808] text-white border-b border-[#1c1c1c] text-[11px] font-medium tracking-[0.2em] uppercase py-2 overflow-hidden select-none"
    >
      <div className="animate-marquee flex items-center">
        {/* Track 1 */}
        <div className="flex items-center gap-10 pr-10 whitespace-nowrap">
          {TICKER_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`t1-${idx}`} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <Icon className="w-3.5 h-3.5 text-[#B8B8B8] flex-shrink-0" />
                <span className="text-[#E5E5E5] font-semibold">{item.text}</span>
                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-extrabold tracking-wider">
                  {item.badge}
                </span>
                <Link
                  href="/shop"
                  className="text-[#999999] hover:text-white underline underline-offset-2 ml-1 transition-colors text-[10px]"
                >
                  SHOP NOW →
                </Link>
              </div>
            );
          })}
        </div>

        {/* Duplicate Track 2 for seamless infinite loop */}
        <div className="flex items-center gap-10 pr-10 whitespace-nowrap" aria-hidden="true">
          {TICKER_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={`t2-${idx}`} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <Icon className="w-3.5 h-3.5 text-[#B8B8B8] flex-shrink-0" />
                <span className="text-[#E5E5E5] font-semibold">{item.text}</span>
                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-extrabold tracking-wider">
                  {item.badge}
                </span>
                <Link
                  href="/shop"
                  className="text-[#999999] hover:text-white underline underline-offset-2 ml-1 transition-colors text-[10px]"
                >
                  SHOP NOW →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
