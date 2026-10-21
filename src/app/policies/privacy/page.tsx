import React from 'react';

export const metadata = {
  title: 'Privacy Policy — TEESOULZ Apparel',
  description: 'How we collect, protect, and handle your data at TEESOULZ.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            PRIVACY & DATA PROTECTION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1">
            PRIVACY POLICY
          </h1>
          <p className="text-xs text-[#666666] mt-2">
            Last Updated: October 2026 • Compliant with Indian Information Technology Act, 2000
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-xs text-[#444444] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              1. Information We Collect
            </h2>
            <p>
              When you purchase an item or create an account with TEESOULZ, we collect information necessary to fulfill your order, including your name, delivery address, contact email, and phone number. We do not store sensitive payment card details or net banking credentials on our servers; all transactions are routed through certified, encrypted payment gateway partners.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              2. How Your Information is Used
            </h2>
            <p>
              Your personal data is used solely to dispatch orders, notify you of shipment movements via SMS/email, verify fraud, and send VIP collection drop announcements if you have opted in. We never sell, lease, or rent customer personal information to third-party marketing brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              3. Data Security Measures
            </h2>
            <p>
              We maintain industry-standard physical, electronic, and administrative safeguards to protect personal data against unauthorized disclosure, alteration, or misuse.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              4. Contact the Grievance Officer
            </h2>
            <p>
              In accordance with Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, queries or concerns may be addressed to our designated Grievance Officer at <strong>grievance@teesoulz.in</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
