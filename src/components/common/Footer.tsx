'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Plus, Minus, ChevronUp, Shield, Music } from 'lucide-react';
import { InstagramIcon, TwitterIcon, YoutubeIcon } from '@/components/common/BrandIcons';

interface FooterSection {
  id: string;
  title: string;
  links: { label: string; href: string; badge?: string }[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    id: 'shop',
    title: 'SHOP',
    links: [
      { label: 'Shop All Products', href: '/shop' },
      { label: 'Men Streetwear', href: '/shop?gender=men' },
      { label: 'Women Streetwear', href: '/shop?gender=women' },
      { label: 'Oversized T-Shirts', href: '/category/oversized-t-shirts' },
      { label: 'Graphic Tees', href: '/category/graphic-tees' },
      { label: 'Hoodies & Sweatshirts', href: '/category/hoodies-sweatshirts' },
      { label: 'Bottomwear & Cargos', href: '/category/bottomwear' },
      { label: 'Accessories', href: '/category/accessories' },
    ],
  },
  {
    id: 'trending',
    title: 'TRENDING',
    links: [
      { label: 'New In / Latest Drop', href: '/new-in', badge: 'HOT' },
      { label: 'Bestselling Essentials', href: '/bestsellers' },
      { label: 'NOIR MONOLITH Capsule', href: '/collections/noir-monolith' },
      { label: 'CYBER TOKYO Drop', href: '/collections/cyber-tokyo' },
      { label: 'Heavyweight Essentials', href: '/collections/heavyweight-essentials' },
      { label: 'Shadow Core Archive', href: '/collections/shadow-core' },
      { label: 'Limited Time Offers', href: '/sale', badge: 'SALE' },
    ],
  },
  {
    id: 'info',
    title: 'INFO',
    links: [
      { label: 'Track Your Order', href: '/track-order' },
      { label: '7-Day Returns & Exchanges', href: '/policies/returns' },
      { label: 'Shipping & Delivery Info', href: '/policies/shipping' },
      { label: 'Streetwear Size Guide', href: '/size-guide' },
      { label: 'Frequently Asked Questions', href: '/faq' },
      { label: 'Contact Client Support', href: '/contact' },
    ],
  },
  {
    id: 'explore',
    title: 'Explore',
    links: [
      { label: 'About TEESOULZ', href: '/about' },
      { label: 'Textile Engineering (260-420 GSM)', href: '/about#textiles' },
      { label: 'Terms & Conditions', href: '/policies/terms' },
      { label: 'Privacy Policy', href: '/policies/privacy' },
      { label: 'My Account', href: '/account' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = 2026;

  // Toggle mobile accordion
  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Track scroll position for floating back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <>
      <footer className="bg-[#080808] text-white border-t border-[#222222] pt-12 sm:pt-16 pb-12 transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Brand Banner */}
          <div className="pb-8 sm:pb-12 border-b border-[#222222] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-9 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/teesoulz-logo.png"
                  alt="TEESOULZ"
                  fill
                  sizes="44px"
                  className="object-contain invert brightness-200"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tighter text-xl sm:text-2xl text-white leading-none uppercase font-sans">
                  TEESOULZ
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.25em] text-[#888888] uppercase font-semibold mt-0.5">
                  HEAVYWEIGHT STREETWEAR
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3 text-[#A3A3A3]">
              <span className="text-xs uppercase tracking-wider font-bold text-[#777777] hidden sm:inline-block mr-2">
                Follow Us:
              </span>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
                aria-label="TEESOULZ Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
                aria-label="TEESOULZ Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
                aria-label="TEESOULZ YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://spotify.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#161616] border border-[#262626] flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all"
                aria-label="TEESOULZ Spotify Playlist"
              >
                <Music className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ========================================================
              MOBILE VIEW: Accordion Style Matching Bonkers Corner
             ======================================================== */}
          <div className="block lg:hidden divide-y divide-[#222222]">
            {FOOTER_SECTIONS.map((sec) => {
              const isOpen = !!openSections[sec.id];
              return (
                <div key={sec.id} className="py-1">
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between py-4 text-left group focus:outline-hidden"
                  >
                    <span className="text-base sm:text-lg font-black tracking-wide text-white uppercase font-sans group-hover:text-neutral-300 transition-colors">
                      {sec.title}
                    </span>
                    <span className="text-white p-1 text-lg leading-none transition-transform duration-200">
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-neutral-300" />
                      ) : (
                        <Plus className="w-5 h-5 text-neutral-300" />
                      )}
                    </span>
                  </button>

                  {/* Expandable list */}
                  {isOpen && (
                    <div className="pb-4 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      <ul className="space-y-3 pl-1">
                        {sec.links.map((link) => (
                          <li key={link.href + link.label}>
                            <Link
                              href={link.href}
                              className="text-sm text-[#A3A3A3] hover:text-white transition-colors inline-flex items-center gap-2"
                            >
                              <span>{link.label}</span>
                              {link.badge && (
                                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                  link.badge === 'HOT'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-white text-black'
                                }`}>
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Mobile Newsletter: "WE'VE GOT YOU COVERED:" */}
            <div className="pt-8 pb-4">
              <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-white font-sans">
                WE&apos;VE GOT YOU COVERED:
              </h4>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed font-normal">
                Beyond the Outfit: Be the first to know about new arrivals, sales &amp; exclusive drops.
              </p>

              {isSubscribed ? (
                <div className="mt-4 bg-[#141414] border border-[#333333] p-4 flex items-center gap-3 text-white">
                  <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold uppercase tracking-wider text-white">You are on the list</p>
                    <p className="text-[11px] text-[#A0A0A0]">Welcome voucher sent to your inbox.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full bg-[#111111] border border-[#333333] px-4 py-3.5 pr-12 text-sm text-white placeholder:text-[#666666] focus:outline-hidden focus:border-white transition-colors rounded-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-white hover:text-neutral-300 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ========================================================
              DESKTOP VIEW: Multi-column Grid
             ======================================================== */}
          <div className="hidden lg:grid grid-cols-12 gap-8 py-14">
            {/* Links Columns */}
            {FOOTER_SECTIONS.map((sec) => (
              <div key={sec.id} className="col-span-2 space-y-4">
                <h4 className="text-sm font-black uppercase tracking-wider text-white font-sans">
                  {sec.title}
                </h4>
                <ul className="space-y-2.5 text-xs text-[#999999]">
                  {sec.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className={`text-[8px] font-black uppercase px-1 py-0.2 rounded ${
                            link.badge === 'HOT'
                              ? 'bg-red-600 text-white'
                              : 'bg-white text-black'
                          }`}>
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Desktop Newsletter: "WE'VE GOT YOU COVERED:" */}
            <div className="col-span-4 pl-4 space-y-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-white font-sans">
                WE&apos;VE GOT YOU COVERED:
              </h4>
              <p className="text-xs text-[#999999] leading-relaxed">
                Beyond the Outfit: Be the first to know about new arrivals, sales &amp; exclusive drops.
              </p>

              {isSubscribed ? (
                <div className="bg-[#141414] border border-[#333333] p-4 flex items-center gap-3 text-white">
                  <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold uppercase tracking-wider text-white">You are on the list</p>
                    <p className="text-[11px] text-[#A0A0A0]">Check inbox for 10% welcome coupon.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative mt-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full bg-[#111111] border border-[#333333] px-4 py-3.5 pr-12 text-xs text-white placeholder:text-[#666666] focus:outline-hidden focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-white hover:text-neutral-300 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
              <p className="text-[10px] text-[#666666]">
                By signing up, you agree to TEESOULZ Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* ========================================================
              BOTTOM BAR: Copyright & Supported Payment Methods
             ======================================================== */}
          <div className="pt-8 border-t border-[#222222] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#777777] text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Shield className="w-4 h-4 text-[#999999] flex-shrink-0" />
              <span>© {currentYear} TEESOULZ APPAREL PVT LTD. All Rights Reserved.</span>
            </div>

            {/* Payment Method Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span className="px-2.5 py-1 bg-[#141414] border border-[#262626] rounded text-[#E5E5E5]">
                UPI / GPay / PhonePe
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-[#262626] rounded text-[#E5E5E5]">
                RuPay
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-[#262626] rounded text-[#E5E5E5]">
                Visa &amp; Mastercard
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-[#262626] rounded text-[#E5E5E5]">
                NetBanking
              </span>
              <span className="px-2.5 py-1 bg-[#141414] border border-[#262626] rounded text-[#E5E5E5]">
                Cash on Delivery (COD)
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================
          FLOATING BACK-TO-TOP BUTTON (Matching Bonkers Corner)
         ======================================================== */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="fixed bottom-6 right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-hidden hover:bg-neutral-200 cursor-pointer animate-in fade-in zoom-in-75"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>
      )}
    </>
  );
}