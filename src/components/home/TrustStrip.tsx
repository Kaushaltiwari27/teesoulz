'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Truck,
    title: 'EXPRESS PAN-INDIA SHIPPING',
    description: 'Dispatch in 24 hours. Delivery across all major pin codes in 2–4 business days.',
  },
  {
    icon: RotateCcw,
    title: '7-DAY HASSLE-FREE RETURNS',
    description: 'Easy doorstep exchange or refund if the fit or drape is anything less than perfect.',
  },
  {
    icon: ShieldCheck,
    title: '100% SECURE CHECKOUT',
    description: 'Encrypted payment gateways supporting all Indian UPI apps, Cards, NetBanking, and COD.',
  },
  {
    icon: Headphones,
    title: 'DEDICATED SUPPORT TEAM',
    description: 'Direct WhatsApp and email customer support for size queries, tracking, and styling.',
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-white border-b border-[#E5E5E5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-start gap-4 p-2">
                <div className="w-10 h-10 rounded-full bg-[#080808] text-white flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#080808]">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
