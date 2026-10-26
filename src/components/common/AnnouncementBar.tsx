'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useCms } from '@/context/CmsContext';

export default function AnnouncementBar() {
  const { cms } = useCms();
  const config = cms.announcementBar;

  if (!config.enabled) return null;

  const items = config.items.filter((item) => item.active);
  if (items.length === 0) return null;

  return (
    <aside
      aria-label="Promotional announcement ticker"
      className="bg-[#080808] text-white border-b border-[#1c1c1c] text-[11px] font-medium tracking-[0.2em] uppercase py-2 overflow-hidden select-none"
    >
      <div className="animate-marquee flex items-center">
        {/* Track 1 */}
        <div className="flex items-center gap-10 pr-10 whitespace-nowrap">
          {items.map((item, idx) => (
            <div key={`t1-${item.id || idx}`} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-[#B8B8B8] flex-shrink-0" />
              <span className="text-[#E5E5E5] font-semibold">{item.text}</span>
              {item.badge && (
                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-extrabold tracking-wider">
                  {item.badge}
                </span>
              )}
              {item.link && (
                <Link
                  href={item.link}
                  className="text-[#999999] hover:text-white underline underline-offset-2 ml-1 transition-colors text-[10px]"
                >
                  SHOP NOW →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Duplicate Track 2 for seamless infinite loop */}
        <div className="flex items-center gap-10 pr-10 whitespace-nowrap" aria-hidden="true">
          {items.map((item, idx) => (
            <div key={`t2-${item.id || idx}`} className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-[#B8B8B8] flex-shrink-0" />
              <span className="text-[#E5E5E5] font-semibold">{item.text}</span>
              {item.badge && (
                <span className="text-[9px] bg-white text-black px-1.5 py-0.5 rounded font-extrabold tracking-wider">
                  {item.badge}
                </span>
              )}
              {item.link && (
                <Link
                  href={item.link}
                  className="text-[#999999] hover:text-white underline underline-offset-2 ml-1 transition-colors text-[10px]"
                >
                  SHOP NOW →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
