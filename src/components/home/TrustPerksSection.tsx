'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

const PERKS = [
  {
    icon: Truck,
    title: 'FREE EXPRESS SHIPPING',
    description: 'On all prepaid orders pan-India with live real-time SMS tracking',
  },
  {
    icon: RotateCcw,
    title: '7-DAY HASSLE-FREE RETURNS',
    description: 'Easy door-to-door reverse pickup & instant exchange support',
  },
  {
    icon: Sparkles,
    title: 'PREMIUM HEAVYWEIGHT COTTON',
    description: '260–420 GSM custom combed cotton engineered for structural drape',
  },
  {
    icon: ShieldCheck,
    title: '100% SECURE CHECKOUT',
    description: 'Encrypted UPI, Cards, NetBanking & Cash On Delivery options',
  },
];

export default function TrustPerksSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-14 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PERKS.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-black mb-3">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black mb-1">
                  {perk.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 max-w-[220px] leading-relaxed">
                  {perk.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
