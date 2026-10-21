'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Music, Shield } from 'lucide-react';
import { InstagramIcon, TwitterIcon, YoutubeIcon } from '@/components/common/BrandIcons';
import { CATEGORIES_DATA } from '@/data/mockData';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = 2026;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#080808] text-white border-t border-[#222222] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Brand Statement Banner */}
        <div className="pb-14 border-b border-[#222222] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8B8B8]">
              JOIN THE UNDERGROUND
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              GET PRIORITY ACCESS TO FUTURE DROPS
            </h3>
            <p className="text-xs sm:text-sm text-[#A0A0A0] max-w-xl">
              Be the first to know about private capsule releases, secret discounts, and restocks of limited 260-420 GSM silhouettes.
            </p>
          </div>

          <div className="lg:col-span-5">
            {isSubscribed ? (
              <div className="bg-[#181818] border border-[#333333] p-4 flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">You are on the VIP List</h4>
                  <p className="text-[11px] text-[#A0A0A0]">Check your inbox for your 10% welcome voucher.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-[#181818] border border-[#333333] px-4 py-3 text-xs text-white placeholder:text-[#777777] focus:outline-hidden focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-[#E5E5E5] px-6 py-3 text-xs font-extrabold uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-[#777777] mt-2">
              By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-9 flex-shrink-0">
                <Image
                  src="/teesoulz-logo.png"
                  alt="TEESOULZ"
                  fill
                  sizes="44px"
                  className="object-contain invert brightness-200"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tighter text-xl text-white leading-none uppercase">
                  TEESOULZ
                </span>
                <span className="text-[8px] tracking-[0.25em] text-[#888888] uppercase font-semibold mt-0.5">
                  STREETWEAR
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#999999] leading-relaxed max-w-sm">
              TEESOULZ is a contemporary Indian streetwear label established to challenge conventional silhouettes through heavyweight custom-milled textiles, drop-shoulder geometry, and unapologetic brutalist design.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[#999999]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#181818] flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="TEESOULZ Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#181818] flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="TEESOULZ Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#181818] flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="TEESOULZ YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#181818] flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                aria-label="TEESOULZ Studio Playlist"
              >
                <Music className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-[#999999]">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/new-in" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              {CATEGORIES_DATA.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/bestsellers" className="hover:text-white transition-colors">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-red-400 hover:text-red-300 font-semibold transition-colors">
                  Sale & Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-[#999999]">
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition-colors">
                  7-Day Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Streetwear Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FFFFFF]">
              Brand & Legal
            </h4>
            <ul className="space-y-2 text-xs text-[#999999]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About TEESOULZ
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payment Marks & Copyright */}
        <div className="pt-8 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#888888]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#B8B8B8]" />
            <span>© {currentYear} TEESOULZ APPAREL PVT LTD. All Rights Reserved.</span>
          </div>

          {/* Real Supported Payment Methods Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
            <span className="px-2 py-1 bg-[#181818] border border-[#2B2B2B] rounded text-white">
              UPI / GPay / PhonePe
            </span>
            <span className="px-2 py-1 bg-[#181818] border border-[#2B2B2B] rounded text-white">
              RuPay
            </span>
            <span className="px-2 py-1 bg-[#181818] border border-[#2B2B2B] rounded text-white">
              Visa & Mastercard
            </span>
            <span className="px-2 py-1 bg-[#181818] border border-[#2B2B2B] rounded text-white">
              NetBanking
            </span>
            <span className="px-2 py-1 bg-[#181818] border border-[#2B2B2B] rounded text-white">
              Cash on Delivery (COD)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
