'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { useCms } from '@/context/CmsContext';

export default function CustomerReviewsSection() {
  const { cms } = useCms();
  const config = cms.customerReviews;

  if (!config.enabled) return null;

  const reviews = config.reviews && config.reviews.length > 0 ? config.reviews : [];

  return (
    <section className="w-full bg-[#FAFAFA] py-12 sm:py-16 border-t border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-gray-700 ml-1.5">
              {config.badgeText || '4.9 / 5.0 (1,280+ Reviews)'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
            {config.heading || 'Let Customers Speak For Us'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {config.subtitle || 'Real feedback from verified streetwear enthusiasts across India'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((rev, i) => (
            <div
              key={rev.id || i}
              className="bg-white border border-gray-200 rounded-[6px] p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">{rev.date}</span>
                </div>
                <h4 className="text-sm font-bold text-black mb-1.5 leading-snug">{rev.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">&ldquo;{rev.review}&rdquo;</p>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-black">{rev.name}</span>
                    {rev.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] text-gray-400 block">{rev.city}</span>
                </div>
                {rev.product && (
                  <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono truncate max-w-[140px]">
                    {rev.product}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
