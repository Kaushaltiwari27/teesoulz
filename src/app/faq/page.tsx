'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    category: 'Orders & Shipping',
    q: 'How long does Pan-India delivery take?',
    a: 'All orders are dispatched from our Mumbai fulfillment center within 24 hours of placement. Metro cities (Mumbai, Delhi-NCR, Bangalore, Hyderabad, Chennai, Kolkata) generally receive deliveries in 2–3 business days. Non-metro pin codes are delivered in 3–5 business days via Blue Dart Express or Delhivery.',
  },
  {
    category: 'Orders & Shipping',
    q: 'Are shipping charges free?',
    a: 'Yes, we provide 100% Free Pan-India Express Delivery on all orders over ₹1,499. For orders below ₹1,499, a nominal flat express shipping fee of ₹99 is applicable.',
  },
  {
    category: 'Orders & Shipping',
    q: 'Can I track my package live?',
    a: 'Yes. As soon as your order is packaged, an Airway Bill (AWB) tracking link is generated and sent via SMS and email. You can also paste your Order ID into our Track Order page at any time.',
  },
  {
    category: 'Sizing & Drape',
    q: 'What does "Oversized Boxy Cut" mean?',
    a: 'Our garments are patterned with dropped shoulder seams and wider chest and body dimensions to produce an authentic streetwear drape. We recommend ordering your true standard size. If you want a tighter or conventional slim fit, we suggest sizing down by one size.',
  },
  {
    category: 'Sizing & Drape',
    q: 'Will the fabric shrink or the collar lose shape after washing?',
    a: 'No. All TEESOULZ fabrics undergo pre-shrinking and bio-washing during manufacturing. Furthermore, our collars feature heavy 1x1 Lycra-reinforced ribbing designed specifically to prevent the dreaded "bacon neck" warping.',
  },
  {
    category: 'Returns & Exchanges',
    q: 'What is your return & exchange policy?',
    a: 'We offer a 7-day hassle-free doorstep exchange policy from the date of delivery. If the size or fit isn’t ideal, our courier partner will pick up the garment directly from your doorstep and deliver the replacement size free of charge.',
  },
  {
    category: 'Returns & Exchanges',
    q: 'How do I initiate a return or exchange?',
    a: 'You can initiate an exchange by visiting our Contact page or emailing support@teesoulz.in with your 6-digit Order ID. Our support team will schedule the reverse pickup within 24 hours.',
  },
  {
    category: 'Payments',
    q: 'Which payment methods are accepted?',
    a: 'We support all Indian payment options including UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, NetBanking, and Cash on Delivery (COD).',
  },
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            HELP & KNOWLEDGE BASE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-xs text-[#666666] max-w-md mx-auto">
            Find immediate answers regarding orders, sizing specifications, doorstep exchanges, and delivery timelines.
          </p>

          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search queries (e.g. shipping, returns, sizing)..."
                className="w-full bg-white border border-[#CCCCCC] pl-10 pr-4 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white border border-[#E5E5E5] divide-y divide-[#E5E5E5]">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="text-xs sm:text-sm font-bold text-black uppercase tracking-tight">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#888888] transition-transform flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-black' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-3 text-xs text-[#555555] leading-relaxed animate-in fade-in pt-2">
                    <p>{faq.a}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider text-[#888888] bg-[#F3F3F3] px-2 py-0.5 rounded">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Strip */}
        <div className="mt-8 p-6 bg-white border border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold uppercase text-black">Still have questions?</h3>
            <p className="text-xs text-[#666666]">Our concierge team is available Mon–Sat on WhatsApp and email.</p>
          </div>
          <Link
            href="/contact"
            className="bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#222222] transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
