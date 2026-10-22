'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, User, Menu } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import MobileNavDrawer from './MobileNavDrawer';
import { useStore } from '@/context/StoreContext';

const NAV_LINKS = [
  { name: 'MEN', href: '/shop?gender=men' },
  { name: 'WOMEN', href: '/shop?gender=women' },
];

export default function Header() {
  const { cartCount, wishlistCount, openSearch, setIsCartOpen } = useStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    // Non-sticky header: scrolls naturally with the page, does not stay pinned
    <header className="relative z-40 bg-white border-b border-[#E5E5E5]">
      {/* 1. Scrolling Marquee Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Desktop Header Layout */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Top Brand Tier: Centered Prominent Logo & Brand Name */}
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <Link
              href="/"
              className="group inline-flex flex-col items-center focus:outline-hidden"
              aria-label="TEESOULZ Home"
            >
              {/* Perfectly sized prominent logo inside elegant capsule */}
              <div className="px-7 py-2.5 rounded-full bg-[#F3F3F3] border border-[#E5E5E5] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center mb-2.5 shadow-2xs">
                <div className="relative w-20 h-10 flex-shrink-0">
                  <Image
                    src="/teesoulz-logo.png"
                    alt="TEESOULZ Official Logo"
                    fill
                    sizes="80px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* Brand Name */}
              <span className="text-2xl font-black tracking-[0.25em] text-[#080808] uppercase leading-none">
                TEESOULZ
              </span>

              {/* Tagline */}
              <span className="text-xs font-normal text-[#666666] tracking-[0.2em] lowercase mt-1.5">
                style your soulz
              </span>
            </Link>
          </div>

          {/* Thin Hairline Divider */}
          <div className="border-t border-[#E5E5E5]" />

          {/* Center Navigation Row: Only MEN & WOMEN */}
          <nav
            aria-label="Main Navigation"
            className="py-3.5 flex items-center justify-center space-x-16 text-xs font-bold tracking-[0.25em] text-[#111111]"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="py-1 relative hover:text-black transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-black hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Thin Hairline Divider */}
          <div className="border-t border-[#E5E5E5]" />

          {/* Utility Row: Search (Left) + Account, Wishlist, Cart (Right) */}
          <div className="py-2.5 flex items-center justify-between">
            {/* Left: Visible Search field trigger */}
            <button
              type="button"
              onClick={openSearch}
              className="flex items-center gap-2.5 text-[#666666] hover:text-[#111111] transition-colors py-1 px-1 focus:outline-hidden group cursor-text"
              aria-label="Search products"
            >
              <Search className="w-4 h-4 text-[#111111] transition-transform group-hover:scale-110" />
              <span className="text-xs text-[#777777] font-normal group-hover:text-black">
                Search products...
              </span>
            </button>

            {/* Right: User account, Wishlist, Cart */}
            <div className="flex items-center space-x-5 text-[#111111]">
              {/* Account */}
              <Link
                href="/account"
                aria-label="My Account"
                className="p-1 hover:text-black transition-transform hover:scale-110 focus:outline-hidden"
              >
                <User className="w-4.5 h-4.5" />
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative p-1 hover:text-black transition-transform hover:scale-110 focus:outline-hidden"
              >
                <Heart className="w-4.5 h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
                className="relative p-1 hover:text-black transition-transform hover:scale-110 focus:outline-hidden cursor-pointer"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-[#080808] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Header Layout (Non-sticky, clean, proper logo size) */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 -ml-2 text-[#111111] hover:text-black focus:outline-hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="p-2 text-[#111111] hover:text-black focus:outline-hidden"
              aria-label="Search products"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Center: Prominent Logo & Brand Name */}
          <Link
            href="/"
            className="flex flex-col items-center text-center py-0.5"
            aria-label="TEESOULZ Home"
          >
            <div className="px-4 py-1.5 rounded-full bg-[#F3F3F3] border border-[#E5E5E5] flex items-center justify-center mb-1">
              <div className="relative w-14 h-7 flex-shrink-0">
                <Image
                  src="/teesoulz-logo.png"
                  alt="TEESOULZ Official Logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="text-sm font-black tracking-[0.2em] text-[#080808] uppercase leading-none">
              TEESOULZ
            </span>
            <span className="text-[9px] text-[#666666] tracking-wider lowercase">
              style your soulz
            </span>
          </Link>

          {/* Right: Wishlist & Cart */}
          <div className="flex items-center space-x-1">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 text-[#111111] hover:text-black focus:outline-hidden"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className="relative p-2 text-[#111111] hover:text-black focus:outline-hidden"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row: MEN & WOMEN */}
        <div className="border-t border-[#E5E5E5] mt-2 pt-2 flex items-center justify-center space-x-10 text-[11px] font-bold tracking-[0.2em]">
          <Link href="/shop?gender=men" className="hover:text-black text-[#111111]">
            MEN
          </Link>
          <span className="text-[#CCCCCC]">•</span>
          <Link href="/shop?gender=women" className="hover:text-black text-[#111111]">
            WOMEN
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </header>
  );
}
