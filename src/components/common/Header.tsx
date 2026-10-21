'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import MegaMenu from './MegaMenu';
import MobileNavDrawer from './MobileNavDrawer';
import { useStore } from '@/context/StoreContext';

export default function Header() {
  const { cartCount, wishlistCount, openSearch, setIsCartOpen } = useStore();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md transition-shadow duration-200">
      <AnnouncementBar />

      <div
        className={`border-b transition-colors duration-200 ${
          isScrolled ? 'border-[#E5E5E5] shadow-xs' : 'border-[#E5E5E5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20">
            {/* Left: Mobile hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 -ml-2 text-[#111111] hover:text-black focus:outline-hidden"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={openSearch}
                className="p-2 text-[#111111] hover:text-black focus:outline-hidden"
                aria-label="Search storefront"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Brand Logo: Official Provided Asset (Logo Only) */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group py-1" aria-label="TEESOULZ Home">
                <div className="relative w-16 h-12 sm:w-20 sm:h-14 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/teesoulz-logo.png"
                    alt="TEESOULZ Official Logo"
                    fill
                    sizes="(max-width: 640px) 64px, 80px"
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold uppercase tracking-wider text-[#222222]">
              <Link
                href="/new-in"
                className="py-6 hover:text-black transition-colors relative flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                New In
              </Link>

              {/* Collections & Categories MegaMenu trigger */}
              <div
                className="relative py-6"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
              >
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 hover:text-black transition-colors focus:outline-hidden cursor-pointer"
                >
                  <span>Catalogue</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <Link
                href="/category/oversized-t-shirts"
                className="py-6 hover:text-black transition-colors"
              >
                Oversized Tees
              </Link>

              <Link
                href="/category/graphic-tees"
                className="py-6 hover:text-black transition-colors"
              >
                Graphic Tees
              </Link>

              <Link
                href="/category/hoodies-sweatshirts"
                className="py-6 hover:text-black transition-colors"
              >
                Hoodies & Sweats
              </Link>

              <Link
                href="/category/bottomwear"
                className="py-6 hover:text-black transition-colors"
              >
                Bottomwear
              </Link>

              <Link
                href="/bestsellers"
                className="py-6 hover:text-black transition-colors"
              >
                Bestsellers
              </Link>

              <Link
                href="/sale"
                className="py-6 text-red-600 hover:text-red-700 transition-colors font-bold"
              >
                Sale
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-3 text-[#111111]">
              {/* Search button on desktop */}
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search"
                className="hidden lg:flex items-center gap-2 p-2 hover:bg-[#F3F3F3] rounded-full transition-colors text-xs font-medium text-[#444444]"
              >
                <Search className="w-5 h-5 text-[#111111]" />
                <span className="hidden xl:inline text-[#777777] font-normal">Search...</span>
              </button>

              {/* User Account */}
              <Link
                href="/account"
                aria-label="My Account"
                className="p-2 hover:bg-[#F3F3F3] rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist with live count */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative p-2 hover:bg-[#F3F3F3] rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag with live count and Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
                className="relative p-2 hover:bg-[#F3F3F3] rounded-full transition-colors focus:outline-hidden"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-[#080808] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </header>
  );
}
