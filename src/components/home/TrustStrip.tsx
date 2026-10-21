'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';
import ScrollReveal from '@/components/motion/ScrollReveal';

const TRUST_ITEMS = [
  {
    num: '01',
    icon: Truck,
    title: 'EXPRESS PAN-INDIA SHIPPING',
    description: 'Dispatch in 24 hours. Delivery across 27,000+ pin codes in 2–4 business days.',
  },
  {
    num: '02',
    icon: RotateCcw,
    title: '7-DAY HASSLE-FREE RETURNS',
    description: 'Easy doorstep exchange or refund if the fit or drape is anything less than perfect.',
  },
  {
    num: '03',
    icon: ShieldCheck,
    title: '100% SECURE CHECKOUT',
    description: 'Encrypted payment gateways supporting all Indian UPI apps, Cards, NetBanking, and COD.',
  },
  {
    num: '04',
    icon: Headphones,
    title: 'DEDICATED SUPPORT TEAM',
    description: 'Direct WhatsApp and email customer support for size queries, tracking, and styling.',
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-white border-b border-[#E5E5E5] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {TRUST_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.title} delay={idx * 0.1} direction="up" distance={20}>
                <div className="flex items-start gap-3 sm:gap-4 p-2 group">
                  <div className="w-10 h-10 rounded-full bg-[#080808] text-white flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#888888]">
                      <span>{item.num}</span>
                      <span>/</span>
                      <span>GUARANTEE</span>
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#080808]">
                      {item.title}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#666666] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
