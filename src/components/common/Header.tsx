'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, ChevronDown, MapPin, X } from 'lucide-react';
import AnnouncementBar from './AnnouncementBar';
import MobileNavDrawer from './MobileNavDrawer';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/mockData';

interface MegaMenuColumn {
  heading: string;
  links: { name: string; href: string }[];
}

const MEGA_MENUS: Record<string, { columns: MegaMenuColumn[] }> = {
  WOMEN: {
    columns: [
      {
        heading: 'TOPWEAR',
        links: [
          { name: 'New Arrivals', href: '/new-in' },
          { name: 'Oversized T-Shirts', href: '/category/oversized-t-shirts' },
          { name: 'Graphic Tees', href: '/category/graphic-tees' },
          { name: 'Hoodies & Sweatshirts', href: '/category/hoodies' },
          { name: 'Crop Tops & Tanks', href: '/category/tops' },
        ],
      },
      {
        heading: 'BOTTOMWEAR',
        links: [
          { name: 'Parachute Cargos', href: '/category/bottoms' },
          { name: 'Wide-Leg Sweatpants', href: '/category/bottoms' },
          { name: 'Everyday Joggers', href: '/category/bottoms' },
          { name: 'Co-ord Sets', href: '/category/co-ord-sets' },
        ],
      },
      {
        heading: 'CURATED CAPSULES',
        links: [
          { name: 'Noir Monolith Capsule', href: '/collections/noir-monolith' },
          { name: 'Cyber Tokyo Drift', href: '/collections/cyber-tokyo' },
          { name: 'Special Prices (Sale)', href: '/sale' },
          { name: 'All Women Collection', href: '/shop?gender=women' },
        ],
      },
    ],
  },
  MEN: {
    columns: [
      {
        heading: 'TOPWEAR',
        links: [
          { name: 'New In Drops', href: '/new-in' },
          { name: '280 GSM Oversized Tees', href: '/category/oversized-t-shirts' },
          { name: 'Heavy Graphic Tees', href: '/category/graphic-tees' },
          { name: '400 GSM Heavyweight Hoodies', href: '/category/hoodies' },
          { name: 'Bombers & Shackets', href: '/category/jackets' },
        ],
      },
      {
        heading: 'BOTTOMWEAR',
        links: [
          { name: 'Tactical Parachute Cargos', href: '/category/bottoms' },
          { name: 'Loose Fit Sweatpants', href: '/category/bottoms' },
          { name: 'Studio Mist Joggers', href: '/category/bottoms' },
          { name: 'Heavy Terry Shorts', href: '/category/shorts' },
        ],
      },
      {
        heading: 'SIGNATURE DROPS',
        links: [
          { name: 'Brutalist Monolith Drop', href: '/collections/noir-monolith' },
          { name: 'Tokyo Underground Drift', href: '/collections/cyber-tokyo' },
          { name: 'All Bestsellers', href: '/bestsellers' },
          { name: 'All Men Collection', href: '/shop?gender=men' },
        ],
      },
    ],
  },
  ACCESSORIES: {
    columns: [
      {
        heading: 'HEADWEAR',
        links: [
          { name: 'Distressed Dad Caps', href: '/shop?category=accessories' },
          { name: 'Embroidered Snapbacks', href: '/shop?category=accessories' },
          { name: 'Chunky Knit Beanies', href: '/shop?category=accessories' },
        ],
      },
      {
        heading: 'BAGS & GEAR',
        links: [
          { name: 'Heavyweight Canvas Totes', href: '/shop?category=accessories' },
          { name: 'Tactical Crossbody Slings', href: '/shop?category=accessories' },
          { name: 'Keychain Tags & Clips', href: '/shop?category=accessories' },
        ],
      },
      {
        heading: 'SPECIALS',
        links: [
          { name: 'Anime Graphic Socks', href: '/shop?category=accessories' },
          { name: 'Metal Carabiners', href: '/shop?category=accessories' },
          { name: 'Archival Sticker Pack', href: '/shop?category=accessories' },
        ],
      },
    ],
  },
};

export default function Header() {
  const router = useRouter();
  const { cartCount, wishlistCount, openSearch, setIsCartOpen } = useStore();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Predictive search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    // Non-sticky header: Natural relative scroll with the page, does not stay stuck on screen
    <header className="relative z-40 bg-white text-black border-b border-gray-200 transition-colors duration-300">
      {/* 1. Marquee Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Desktop Single-Bar Header (Light Bonkers Corner Style) */}
      <div className="hidden lg:block">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-8">
          <div className="h-17 flex items-center justify-between gap-6">

            {/* Zone 1 (Left): WOMEN ▾ | MEN ▾ | ACCESSORIES ▾ */}
            <nav aria-label="Main Navigation" className="flex items-center space-x-7">
              {['WOMEN', 'MEN', 'ACCESSORIES'].map((key) => (
                <div
                  key={key}
                  className="relative group py-5"
                  onMouseEnter={() => setActiveMenu(key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    href={
                      key === 'ACCESSORIES'
                        ? '/shop?category=accessories'
                        : `/shop?gender=${key.toLowerCase()}`
                    }
                    className="text-xs xl:text-sm font-extrabold tracking-[0.08em] uppercase text-black hover:text-gray-600 flex items-center gap-1 transition-colors"
                  >
                    <span>{key}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                        activeMenu === key ? 'rotate-180 text-black' : ''
                      }`}
                    />
                  </Link>

                  {/* Mega Menu Dropdown Panel (Clean Light Surface) */}
                  {activeMenu === key && (
                    <div
                      className="absolute top-full left-0 w-[720px] bg-white border border-gray-200 shadow-2xl p-7 z-50 rounded-b-md animate-in fade-in slide-in-from-top-1 duration-150"
                      onMouseEnter={() => setActiveMenu(key)}
                      onMouseLeave={() => setActiveMenu(null)}
                    >
                      <div className="grid grid-cols-3 gap-8">
                        {MEGA_MENUS[key].columns.map((col, idx) => (
                          <div key={idx} className="space-y-3">
                            <h4 className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500 font-bold border-b border-gray-100 pb-1.5">
                              {col.heading}
                            </h4>
                            <ul className="space-y-2">
                              {col.links.map((link, lIdx) => (
                                <li key={lIdx}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setActiveMenu(null)}
                                    className="text-xs font-medium text-gray-700 hover:text-black hover:underline transition-colors block"
                                  >
                                    {link.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Zone 2 (Center): TEESOULZ CREATION Clean Typography */}
            <Link
              href="/"
              className="flex flex-col items-center justify-center text-center py-1 group select-none focus:outline-hidden"
              aria-label="TEESOULZ CREATION Home"
            >
              <span className="text-xl xl:text-2xl font-black tracking-[0.25em] uppercase text-black leading-none group-hover:text-gray-700 transition-colors">
                TEESOULZ
              </span>
              <span className="text-[9px] xl:text-[10px] font-bold tracking-[0.45em] uppercase text-gray-500 leading-none mt-1 group-hover:text-black transition-colors">
                CREATION
              </span>
            </Link>

            {/* Zone 3 (Right): Outlined Search Box + Vertical Divider + Utility Icons */}
            <div className="flex items-center space-x-4">
              {/* Outlined Rectangular Search Bar with Predictive Dropdown */}
              <div ref={searchContainerRef} className="relative">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center border border-gray-300 hover:border-black focus-within:border-black rounded-md bg-gray-50 transition-colors px-3 py-1.5 w-44 xl:w-56"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search..."
                    className="w-full bg-transparent text-xs text-black placeholder-gray-400 focus:outline-hidden pr-6"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 text-gray-400 hover:text-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="absolute right-2.5 text-gray-400 hover:text-black"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Predictive Search Dropdown Panel (Clean Light Background) */}
                {isSearchFocused && searchQuery.trim().length > 0 && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-2xl rounded-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-[11px] font-mono text-gray-500 uppercase">
                      <span>SUGGESTED PRODUCTS</span>
                      <span>{searchResults.length} Results</span>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={`/product/${item.slug}`}
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSearchQuery('');
                            }}
                            className="flex items-center gap-3 p-2.5 hover:bg-gray-50 transition-colors group"
                          >
                            <div className="relative w-12 h-15 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={item.images[0]}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-black uppercase truncate group-hover:text-gray-600 transition-colors">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-gray-500 uppercase">
                                {item.category}
                              </p>
                              <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="text-xs font-black text-black">
                                  ₹{item.price.toLocaleString('en-IN')}
                                </span>
                                {item.mrp > item.price && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    ₹{item.mrp.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500">
                        No matching streetwear styles found for &ldquo;{searchQuery}&rdquo;.
                      </div>
                    )}

                    <div className="p-2 border-t border-gray-100 bg-gray-50">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-1.5 bg-black hover:bg-gray-800 text-white text-[11px] font-bold uppercase tracking-wider rounded transition-colors"
                      >
                        View All Search Results →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subtle Vertical Divider */}
              <div className="h-5 w-px bg-gray-300 mx-1" />

              {/* Utility Icons: User Account | Wishlist | Store/Track | Shopping Bag */}
              <div className="flex items-center space-x-3 text-black">
                {/* Account */}
                <Link
                  href="/account"
                  aria-label="My Account"
                  className="p-1 text-black hover:text-gray-600 transition-colors"
                  title="My Account"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="relative p-1 text-black hover:text-gray-600 transition-colors"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Track Order / Store Pin */}
                <Link
                  href="/track-order"
                  aria-label="Track Order"
                  className="p-1 text-black hover:text-gray-600 transition-colors"
                  title="Track Order"
                >
                  <MapPin className="w-5 h-5" />
                </Link>

                {/* Shopping Bag */}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={`Shopping bag with ${cartCount} items`}
                  className="relative p-1 text-black hover:text-gray-600 transition-colors focus:outline-hidden"
                  title="Shopping Bag"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Header (Clean Light Styling) */}
      <div className="lg:hidden px-4 py-3.5 border-t border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left: Mobile Menu & Search Button */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="p-1.5 text-black hover:text-gray-600 focus:outline-hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="p-1.5 text-black hover:text-gray-600 focus:outline-hidden"
              aria-label="Search products"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Center: TEESOULZ CREATION Typography */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-center py-0.5"
            aria-label="TEESOULZ CREATION Home"
          >
            <span className="text-lg font-black tracking-[0.2em] uppercase text-black leading-none">
              TEESOULZ
            </span>
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-gray-500 leading-none mt-0.5">
              CREATION
            </span>
          </Link>

          {/* Right: Wishlist & Bag */}
          <div className="flex items-center space-x-2">
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-1.5 text-black hover:text-gray-600 focus:outline-hidden"
            >
              <Heart className="w-4.5 h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping bag"
              className="relative p-1.5 text-black hover:text-gray-600 focus:outline-hidden"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-black text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </header>
  );
}
