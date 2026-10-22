'use client';

import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Aman V.',
    city: 'Mumbai',
    rating: 5,
    title: 'Fabric weight is insane',
    review: 'Hands down the best oversized t-shirt I have owned in India. 260 GSM actually feels premium and heavy, collar doesn’t loosen after washing.',
    product: 'Noir Heavyweight Oversized Tee',
    date: '3 days ago',
  },
  {
    name: 'Rhea S.',
    city: 'Bengaluru',
    rating: 5,
    title: 'Perfect boxy street drape',
    review: 'The fit is super flattering. Dropped shoulders are exact streetwear proportion. Arrived in 2 days in sustainable packaging.',
    product: 'Tokyo Drift Cyber Graphic Tee',
    date: '1 week ago',
  },
  {
    name: 'Kabir M.',
    city: 'Delhi NCR',
    rating: 5,
    title: 'Top-tier graphics and wash',
    review: 'Graphic print detail is super sharp, doesn’t crack after iron or wash. Easily matches international streetwear brands at 1/3rd the price.',
    product: 'Acid Wash Vintage Boxy Tee',
    date: '2 weeks ago',
  },
];

export default function CustomerReviewsSection() {
  return (
    <section className="w-full bg-[#FAFAFA] py-12 sm:py-16 border-t border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs font-bold text-gray-700 ml-1.5">
              4.9 / 5.0 (1,280+ Reviews)
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
            Let Customers Speak For Us
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real feedback from verified streetwear enthusiasts across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="bg-white p-6 sm:p-7 rounded-[4px] border border-gray-200/70 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-black mb-1.5">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {rev.review}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-black">{rev.name}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                    <span className="text-[10px] text-emerald-700 font-medium">Verified Buyer</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{rev.city} • Verified Fit</span>
                </div>
                <span className="text-[10px] font-medium text-gray-500 max-w-[120px] text-right truncate">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
