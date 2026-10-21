'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Clock, Flame } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS, CATEGORIES_DATA } from '@/data/mockData';
import { Product } from '@/types';

const POPULAR_SEARCHES = [
  'Oversized T-Shirts',
  'Noir Monolith',
  'Heavyweight Hoodie',
  'Parachute Cargo',
  'Acid Wash',
  'Cyber Tokyo',
];

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('teesoulz_recent_searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Focus input and lock body scroll on open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  // Search filter
  useEffect(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      setResults([]);
      return;
    }

    const matched = PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(clean) ||
        p.description.toLowerCase().includes(clean) ||
        p.category.toLowerCase().includes(clean) ||
        p.tags.some((t) => t.toLowerCase().includes(clean)) ||
        p.collections.some((c) => c.toLowerCase().includes(clean))
      );
    });

    setResults(matched);
  }, [query]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('teesoulz_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query);
    closeSearch();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('teesoulz_recent_searches');
    } catch {}
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeSearch}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Search Container */}
      <div className="relative min-h-screen sm:min-h-0 sm:max-w-3xl sm:mx-auto sm:my-16 bg-white sm:shadow-2xl sm:rounded-none z-10 transition-all">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E5E5E5] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#888888] flex-shrink-0" />
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search heavyweight tees, hoodies, cargos..."
              className="w-full text-base sm:text-lg font-medium text-[#111111] placeholder:text-[#999999] focus:outline-hidden bg-transparent"
            />
          </form>
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#999999] hover:text-black p-1"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="p-1.5 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-black px-2 py-1 bg-[#F3F3F3] hover:bg-[#EAEAEA]"
          >
            ESC
          </button>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {query.trim() === '' ? (
            /* Default screen when no query typed */
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Recent Searches
                    </h4>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[11px] text-[#888888] hover:text-red-600 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          saveRecentSearch(term);
                        }}
                        className="text-xs px-3 py-1.5 bg-[#F3F3F3] hover:bg-[#080808] hover:text-white transition-colors border border-[#E5E5E5]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-3 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Trending Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setQuery(term);
                        saveRecentSearch(term);
                      }}
                      className="text-xs px-3 py-1.5 bg-[#FAFAFA] hover:bg-[#080808] hover:text-white transition-colors border border-[#E5E5E5]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#666666] mb-3">
                  Browse by Category
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES_DATA.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={closeSearch}
                      className="p-3 bg-[#F3F3F3] hover:bg-[#080808] hover:text-white transition-all text-xs font-semibold flex items-center justify-between group"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            /* Results list */
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-[#666666]">
                  Found <strong className="text-black">{results.length}</strong> matching products for &ldquo;{query}&rdquo;
                </p>
                <Link
                  href={`/shop?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    saveRecentSearch(query);
                    closeSearch();
                  }}
                  className="text-xs font-bold text-black hover:underline flex items-center gap-1"
                >
                  View All Results <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={() => {
                      saveRecentSearch(query);
                      closeSearch();
                    }}
                    className="flex gap-3 p-2 hover:bg-[#FAFAFA] border border-[#E5E5E5] group transition-colors"
                  >
                    <div className="relative w-16 h-20 bg-[#F3F3F3] flex-shrink-0 overflow-hidden">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-[#888888] tracking-wider block">
                        {product.category.replace('-', ' ')}
                      </span>
                      <h5 className="text-xs font-bold text-[#111111] group-hover:underline line-clamp-1 mt-0.5">
                        {product.name}
                      </h5>
                      <p className="text-[11px] text-[#666666] line-clamp-1 mt-0.5">
                        {product.subtitle || product.fitType}
                      </p>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-xs font-extrabold text-[#080808]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-[#888888] line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* No Results state */
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-[#F3F3F3] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-[#999999]" />
              </div>
              <h4 className="text-sm font-bold text-[#111111]">No matches found for &ldquo;{query}&rdquo;</h4>
              <p className="text-xs text-[#666666] max-w-sm mx-auto mt-1 mb-5">
                Check your spelling or try broader keywords such as &ldquo;Oversized&rdquo;, &ldquo;Hoodie&rdquo; or &ldquo;Tee&rdquo;.
              </p>
              <button
                onClick={() => setQuery('')}
                className="text-xs font-bold uppercase tracking-wider text-black underline underline-offset-4"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
