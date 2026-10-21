import React from 'react';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Shipping Policy — TEESOULZ Pan-India Logistics',
  description: 'Learn about our shipping partners, delivery timelines, tracking, and thresholds.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            STORE POLICY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black mt-1">
            SHIPPING & DELIVERY POLICY
          </h1>
          <p className="text-xs text-[#666666] mt-2">
            Last updated: October 2026 • Effective across all deliveries in India.
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-xs text-[#444444] space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              1. Fulfillment & Dispatch Timelines
            </h2>
            <p>
              At TEESOULZ, every garment is carefully inspected, folded, and packaged at our Mumbai fulfillment center. Orders placed before 2:00 PM IST on business days are dispatched within 24 hours. Orders placed over weekends or national holidays are dispatched on the immediate following business day.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              2. Shipping Charges & Free Delivery Threshold
            </h2>
            <p>
              We provide <strong>FREE Pan-India Express Delivery</strong> on all orders with a cart value of <strong>₹1,499 and above</strong>. For orders below ₹1,499, a nominal flat express shipping charge of ₹99 is added at checkout.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              3. Courier Partners & Estimated Transit Times
            </h2>
            <p>
              We partner exclusively with tier-1 Indian courier networks including Blue Dart Express, Delhivery, and DTDC.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Metro Cities (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata):</strong> 2 to 3 business days from dispatch.</li>
              <li><strong>Tier-2 & Tier-3 Cities:</strong> 3 to 5 business days from dispatch.</li>
              <li><strong>Northeast & Remote Pin Codes:</strong> 5 to 7 business days from dispatch.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              4. Real-time Airway Bill (AWB) Tracking
            </h2>
            <p>
              Upon shipment handover, an SMS and email notification containing your unique AWB tracking number is automatically delivered. You can monitor milestone movements live through our <Link href="/track-order" className="text-black font-bold underline">Track Order</Link> tool.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black">
              5. Cash on Delivery (COD) Terms
            </h2>
            <p>
              Cash on Delivery is available across 27,000+ pin codes. A courier verification handling charge of ₹50 is applicable on COD orders. Please ensure someone is present with the exact amount or ready to scan the delivery executive’s UPI QR code upon arrival.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
