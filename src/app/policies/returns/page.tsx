import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Returns & Exchange Policy — 7-Day Doorstep Guarantee | TEESOULZ',
  description: 'Understand the hassle-free 7-day exchange and refund process at TEESOULZ.',
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            STORE POLICY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1">
            7-DAY RETURNS & EXCHANGES
          </h1>
          <p className="text-xs text-[#666666] mt-2">
            Last updated: October 2026 • Valid for all purchases made on teesoulz.in
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-xs text-[#444444] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              1. 7-Day Hassle-Free Doorstep Exchange
            </h2>
            <p>
              We want every TEESOULZ piece to drape perfectly on you. If the size or silhouette isn’t exactly what you anticipated, you have <strong>7 calendar days</strong> from the delivery timestamp to request an exchange.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              2. Eligibility Criteria
            </h2>
            <p>To qualify for a doorstep exchange or return, garments must:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be in their original unworn, unwashed, and unperfumed condition.</li>
              <li>Have all original TEESOULZ woven labels and paper tags intact.</li>
              <li>Include the original matte zip polybag packaging.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              3. Reverse Pickup & Delivery Process
            </h2>
            <p>
              Once your request is approved, our courier partner will arrive at your address within 24–48 hours to collect the item. For size exchanges, the replacement piece is dispatched immediately upon pickup confirmation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              4. Refunds & Store Credit
            </h2>
            <p>
              If an item is returned for a refund rather than an exchange, the approved refund will be credited directly to your original payment method (for prepaid UPI/cards) within 5–7 business days, or issued as a lifetime store credit coupon code for COD orders.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              5. How to Initiate
            </h2>
            <p>
              To initiate an exchange, please visit our <Link href="/contact" className="text-black font-bold underline">Contact Page</Link> or email us at <strong>support@teesoulz.in</strong> with your Order ID and preferred replacement size.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
