import React from 'react';

export const metadata = {
  title: 'Terms of Service — TEESOULZ Apparel',
  description: 'Terms and conditions governing the use of TEESOULZ storefront and purchase agreements.',
};

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            LEGAL NOTICE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs text-[#666666] mt-2">
            Effective Date: October 2026 • TEESOULZ APPAREL PVT LTD
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-xs text-[#444444] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or purchasing from this website (teesoulz.in), you acknowledge and agree to be bound by these Terms and Conditions. These terms apply to all users, visitors, and commercial shoppers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              2. Intellectual Property Rights
            </h2>
            <p>
              All trademarks, product designs, graphics, branding elements, typography, and logos displayed on this site—including the TEESOULZ infinity monogram—are the exclusive intellectual property of TEESOULZ Apparel Pvt Ltd. Any unauthorized reproduction, imitation, or redistribution is strictly prohibited under Indian Copyright and Trademark Acts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              3. Pricing and Product Information
            </h2>
            <p>
              Prices for all items are quoted in Indian Rupees (INR) and are inclusive of Goods & Services Tax (GST). While we make every attempt to ensure accurate stock representations, we reserve the right to correct typographical pricing errors or cancel orders in cases of stock discrepancies with prompt full refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              4. Governing Law and Jurisdiction
            </h2>
            <p>
              These terms and any contracts formed through this storefront shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
