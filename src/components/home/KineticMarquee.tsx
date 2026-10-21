'use client';

import React from 'react';

export default function KineticMarquee() {
  const phrases = [
    'TEESOULZ STREETWEAR',
    '260 GSM COMBED COTTON',
    'AUTUMN/WINTER DROP 04',
    '420 GSM FRENCH TERRY',
    'ARCHITECTURAL BOXY DRAPES',
    'MUMBAI TO THE WORLD',
    'NOIR MONOLITH',
  ];

  return (
    <div className="bg-[#080808] border-y border-[#222222] py-4 overflow-hidden select-none">
      <div className="animate-marquee flex items-center">
        {/* Copy 1 */}
        <div className="flex items-center gap-8 pr-8">
          {phrases.map((phrase, idx) => (
            <div key={`p1-${idx}`} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white/90">
                {phrase}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#B8B8B8] flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Copy 2 for infinite loop */}
        <div className="flex items-center gap-8 pr-8" aria-hidden="true">
          {phrases.map((phrase, idx) => (
            <div key={`p2-${idx}`} className="flex items-center gap-8 whitespace-nowrap">
              <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white/90">
                {phrase}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#B8B8B8] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
