'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', orderNumber: '', subject: 'Order Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
            CLIENT CONCIERGE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black">
            CONTACT TEESOULZ
          </h1>
          <p className="text-xs text-[#666666]">
            Have questions regarding sizing, custom drop orders, or returns? Our client support team responds within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Info Card (5 cols) */}
          <div className="lg:col-span-5 bg-[#080808] text-white p-8 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-[#222222] pb-3">
                Direct Channels
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#B8B8B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#888888] block text-[10px] uppercase font-bold">Email Support</span>
                    <a href="mailto:support@teesoulz.in" className="font-semibold text-white hover:underline">
                      support@teesoulz.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#B8B8B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#888888] block text-[10px] uppercase font-bold">Helpline & WhatsApp</span>
                    <p className="font-semibold text-white">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#B8B8B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#888888] block text-[10px] uppercase font-bold">Operating Hours</span>
                    <p className="text-[#CCCCCC]">Mon – Sat: 10:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#B8B8B8] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[#888888] block text-[10px] uppercase font-bold">Design Studio & HQ</span>
                    <p className="text-[#CCCCCC]">
                      TEESOULZ Apparel Pvt Ltd<br />
                      Bandra West, Mumbai, MH 400050, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#222222] text-[11px] text-[#888888]">
              For urgent doorstep exchange requests, please include your 6-digit Order ID (e.g. TS-123456).
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E5E5E5] p-6 sm:p-8">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold uppercase tracking-tight text-black">
                  Message Dispatched
                </h3>
                <p className="text-xs text-[#666666] max-w-sm mx-auto">
                  Thank you for reaching out. A client support specialist will review your inquiry and follow up via email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-black pb-3 border-b border-[#E5E5E5]">
                  Send a Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Yash Sharma"
                      className="w-full bg-white border border-[#CCCCCC] p-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="yash@example.com"
                      className="w-full bg-white border border-[#CCCCCC] p-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={form.orderNumber}
                      onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                      placeholder="e.g. TS-482910"
                      className="w-full bg-white border border-[#CCCCCC] p-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                      Subject *
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-white border border-[#CCCCCC] p-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                    >
                      <option value="Order Inquiry">Order & Shipment Tracking</option>
                      <option value="Return / Exchange">7-Day Size Exchange</option>
                      <option value="Size Consultation">Sizing & Fit Advice</option>
                      <option value="Collaborations">Collaborations & Press</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full bg-white border border-[#CCCCCC] p-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
