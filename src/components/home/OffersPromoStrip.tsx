'use client';

import React from 'react';
import { Tag, Zap, Truck, ShieldCheck } from 'lucide-react';

const OFFERS = [
  {
    icon: Tag,
    title: 'FLAT 10% OFF',
    desc: 'Use Code TEESOULZ10 on 1st Order',
    highlight: 'TEESOULZ10',
  },
  {
    icon: Zap,
    title: 'EXTRA 5% OFF',
    desc: 'Instant Discount on all UPI & Prepaid Orders',
    highlight: 'NO CODE REQUIRED',
  },
  {
    icon: Truck,
    title: 'FREE EXPRESS SHIPPING',
    desc: 'On all orders above ₹999 pan-India',
    highlight: 'FAST DISPATCH',
  },
  {
    icon: ShieldCheck,
    title: '100% SECURE & COD',
    desc: 'Cash on delivery + 7-day doorstep exchange',
    highlight: 'ASSURED',
  },
];

export default function OffersPromoStrip() {
  return (
    <section className="w-full bg-[#111111] text-white py-3 border-y border-[#262626]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#262626]">
          {OFFERS.map((offer, idx) => {
            const Icon = offer.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 sm:gap-3 ${
                  idx > 0 ? 'pt-2 sm:pt-0 sm:pl-4 lg:pl-6' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#1e1e1e] border border-[#333333] flex items-center justify-center flex-shrink-0 text-white">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white">
                      {offer.title}
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-1 py-0.2 bg-white text-black rounded tracking-tighter">
                      {offer.highlight}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-[#A0A0A0] truncate font-normal">
                    {offer.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}