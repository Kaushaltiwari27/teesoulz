'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { CATEGORIES_DATA, COLLECTIONS_DATA } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const { wishlistCount, cartCount, openSearch } = useStore();

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] animate-in slide-in-from-left">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <Link href="/" onClick={onClose} className="flex flex-col text-left py-0.5" aria-label="TEESOULZ CREATION">
            <span className="text-base font-black tracking-[0.2em] uppercase text-black leading-none">
              TEESOULZ
            </span>
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-[#666666] leading-none mt-0.5">
              CREATION
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-[#111111] hover:text-black hover:bg-[#F3F3F3] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search shortcut */}
        <div className="p-4 border-b border-[#E5E5E5]">
          <button
            onClick={() => {
              onClose();
              openSearch();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F3F3F3] text-[#666666] text-xs font-medium rounded hover:bg-[#EAEAEA] transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#111111]" />
              Search streetwear, tees, hoodies...
            </span>
            <span className="text-[10px] uppercase font-bold text-[#111111]">Search</span>
          </button>
        </div>

        {/* Navigation Links Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Primary Navigation Row */}
          <div className="border-b border-[#E5E5E5] pb-4">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] mb-2.5">
              EXPLORE
            </h5>
            <ul className="space-y-1">
              {[
                { name: 'WOMEN', href: '/shop?gender=women' },
                { name: 'MEN', href: '/shop?gender=men' },
                { name: 'ACCESSORIES', href: '/shop?category=accessories' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-2 text-sm font-bold tracking-wider text-[#080808] hover:text-black transition-colors"
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#CCCCCC]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#666666]">
                Shop Categories
              </h5>
              <span className="text-[9px] font-mono text-[#999999] tracking-widest">EDITION 2026</span>
            </div>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-sm font-semibold text-[#111111] hover:text-black transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-[#999999]">00</span>
                    Shop All Products
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#B8B8B8]" />
                </Link>
              </li>
              {CATEGORIES_DATA.map((cat, idx) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-2 text-sm text-[#333333] hover:text-black transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-[#999999]">0{idx + 1}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-xs text-[#888888]">{cat.itemCount}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-3">
              Curated Drops & Collections
            </h5>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/new-in"
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-sm font-medium text-[#111111]"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black"></span>
                    New In
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
                    HOT
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/bestsellers"
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-sm font-medium text-[#111111]"
                >
                  <span>Bestsellers</span>
                  <ChevronRight className="w-4 h-4 text-[#B8B8B8]" />
                </Link>
              </li>
              <li>
                <Link
                  href="/sale"
                  onClick={onClose}
                  className="flex items-center justify-between py-2 text-sm font-bold text-red-600"
                >
                  <span>Sale & Offers</span>
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                    UP TO 40% OFF
                  </span>
                </Link>
              </li>
              {COLLECTIONS_DATA.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={`/collections/${col.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-2 text-sm text-[#444444] hover:text-black"
                  >
                    <span>{col.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#B8B8B8]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Policies Quick Access */}
          <div className="pt-4 border-t border-[#E5E5E5]">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#666666] mb-3">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs text-[#555555]">
              <li>
                <Link href="/track-order" onClick={onClose} className="hover:text-black">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" onClick={onClose} className="hover:text-black">
                  7-Day Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" onClick={onClose} className="hover:text-black">
                  Size & Fit Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={onClose} className="hover:text-black">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#E5E5E5] bg-[#FAFAFA] grid grid-cols-3 gap-2 text-center">
          <Link
            href="/account"
            onClick={onClose}
            className="flex flex-col items-center justify-center p-2 rounded hover:bg-white text-xs font-medium text-[#111111]"
          >
            <User className="w-5 h-5 mb-1 text-[#333333]" />
            <span>Account</span>
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="relative flex flex-col items-center justify-center p-2 rounded hover:bg-white text-xs font-medium text-[#111111]"
          >
            <Heart className="w-5 h-5 mb-1 text-[#333333]" />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="relative flex flex-col items-center justify-center p-2 rounded hover:bg-white text-xs font-medium text-[#111111]"
          >
            <ShoppingBag className="w-5 h-5 mb-1 text-[#333333]" />
            <span>Bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1 right-3 w-4 h-4 bg-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
