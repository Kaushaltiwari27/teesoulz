'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { PRODUCTS } from '@/data/mockData';

export default function CustomerReviewsSection() {
  // Aggregate real reviews from products
  const verifiedReviews = PRODUCTS.flatMap((p) =>
    (p.reviews || []).map((r) => ({
      ...r,
      productName: p.name,
      productSlug: p.slug,
    }))
  ).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777777]">
            COMMUNITY FEEDBACK
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
            VOICES OF THE STREETS
          </h2>
          <p className="text-xs text-[#666666]">
            Genuine feedback from verified buyers across India experiencing our heavyweight fabrics and cuts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {verifiedReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E5E5E5] p-6 flex flex-col justify-between hover:border-black transition-colors relative"
            >
              <Quote className="w-8 h-8 text-[#E5E5E5] absolute top-4 right-4 pointer-events-none" />

              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-black text-black' : 'text-[#CCCCCC]'
                      }`}
                    />
                  ))}
                </div>

                <h3 className="text-sm font-bold text-[#111111]">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs text-[#555555] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F3F3F3]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-black">{rev.userName}</h4>
                    <span className="text-[10px] text-[#888888]">{rev.date}</span>
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                      <CheckCircle className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>

                {rev.sizePurchased && (
                  <div className="mt-2 text-[10px] text-[#777777] flex items-center gap-2">
                    <span>Purchased Size: <strong>{rev.sizePurchased}</strong></span>
                    {rev.fitFeedback && <span>• Drape: <strong>{rev.fitFeedback}</strong></span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
