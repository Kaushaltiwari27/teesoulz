'use client';

import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export interface FilterOptions {
  category: string;
  gender: string;
  size: string;
  priceRange: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'bestselling';
}

interface ProductFiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onReset: () => void;
  totalCount: number;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Oversized T-Shirts', value: 'oversized-t-shirts' },
  { label: 'Graphic Tees', value: 'graphic-tees' },
  { label: 'Hoodies & Sweats', value: 'hoodies-sweatshirts' },
  { label: 'Bottomwear', value: 'bottomwear' },
  { label: 'Accessories', value: 'accessories' },
];

const GENDERS = [
  { label: 'All', value: 'all' },
  { label: 'Unisex', value: 'unisex' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹1,499', value: 'under-1499' },
  { label: '₹1,500 – ₹2,499', value: '1500-2499' },
  { label: '₹2,500 & Above', value: 'above-2500' },
];

export default function ProductFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
}: ProductFiltersProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { categories } = useStore();
  const activeCategoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...(categories && categories.length > 0
      ? categories.map((c: any) => ({ label: c.name, value: c.slug }))
      : CATEGORIES.slice(1)),
  ];

  // Lock scroll on mobile drawer
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileDrawerOpen]);

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.gender !== 'all' ||
    filters.size !== '' ||
    filters.priceRange !== 'all' ||
    filters.inStockOnly;

  return (
    <div className="mb-8">
      {/* Top Filter and Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        {/* Left: Filter Toggle for Mobile + Results Count */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#080808] text-xs font-bold uppercase tracking-wider bg-white hover:bg-[#F3F3F3]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          <span className="text-xs text-[#666666]">
            Showing <strong className="text-black">{totalCount}</strong> styles
          </span>
        </div>

        {/* Right: Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="sort-by" className="text-xs font-bold uppercase tracking-wider text-[#666666]">
            Sort By:
          </label>
          <select
            id="sort-by"
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({ ...filters, sortBy: e.target.value as FilterOptions['sortBy'] })
            }
            className="text-xs font-semibold bg-white border border-[#E5E5E5] px-3 py-2 text-[#111111] focus:border-black focus:outline-hidden cursor-pointer"
          >
            <option value="featured">Featured Drops</option>
            <option value="newest">New Arrivals</option>
            <option value="bestselling">Bestsellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#888888] mr-1">
            Active Filters:
          </span>

          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F3F3F3] border border-[#E5E5E5] text-xs font-medium text-[#111111]">
              Category: {filters.category.replace('-', ' ')}
              <button
                onClick={() => onFilterChange({ ...filters, category: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F3F3F3] border border-[#E5E5E5] text-xs font-medium text-[#111111]">
              Gender: {filters.gender}
              <button
                onClick={() => onFilterChange({ ...filters, gender: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.size && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F3F3F3] border border-[#E5E5E5] text-xs font-medium text-[#111111]">
              Size: {filters.size}
              <button
                onClick={() => onFilterChange({ ...filters, size: '' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F3F3F3] border border-[#E5E5E5] text-xs font-medium text-[#111111]">
              Price: {PRICE_RANGES.find((p) => p.value === filters.priceRange)?.label}
              <button
                onClick={() => onFilterChange({ ...filters, priceRange: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F3F3F3] border border-[#E5E5E5] text-xs font-medium text-[#111111]">
              In Stock Only
              <button
                onClick={() => onFilterChange({ ...filters, inStockOnly: false })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={onReset}
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        </div>
      )}

      {/* Desktop Horizontal Filter Bars or Category Quick Switch */}
      <div className="hidden lg:flex flex-wrap items-center gap-6 pt-4 text-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5">
          {activeCategoryOptions.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onFilterChange({ ...filters, category: cat.value })}
              className={`px-3 py-1.5 uppercase font-bold tracking-wider transition-colors border ${
                filters.category === cat.value
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#444444] border-[#E5E5E5] hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gender */}
        <div className="flex items-center gap-1 bg-[#F3F3F3] p-1 border border-[#E5E5E5]">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              onClick={() => onFilterChange({ ...filters, gender: g.value })}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-colors ${
                filters.gender === g.value ? 'bg-black text-white' : 'text-[#666666] hover:text-black'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* In Stock toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-4 h-4 accent-black"
          />
          <span className="font-semibold text-[#333333]">In Stock Only</span>
        </label>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                Filters
              </h3>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 text-[#666666] hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-6 flex-1">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#333333] mb-3">
                  Category
                </h4>
                <div className="space-y-2">
                  {activeCategoryOptions.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-cat"
                        checked={filters.category === cat.value}
                        onChange={() => onFilterChange({ ...filters, category: cat.value })}
                        className="accent-black"
                      />
                      <span className={filters.category === cat.value ? 'font-bold text-black' : 'text-[#555555]'}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#333333] mb-3">
                  Gender
                </h4>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => onFilterChange({ ...filters, gender: g.value })}
                      className={`px-3 py-1.5 text-xs font-bold uppercase border ${
                        filters.gender === g.value
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-[#555555] border-[#E5E5E5]'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#333333] mb-3">
                  Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onFilterChange({ ...filters, size: '' })}
                    className={`w-10 h-9 text-xs font-bold uppercase border ${
                      filters.size === '' ? 'bg-black text-white border-black' : 'border-[#E5E5E5]'
                    }`}
                  >
                    All
                  </button>
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => onFilterChange({ ...filters, size: filters.size === sz ? '' : sz })}
                      className={`w-10 h-9 text-xs font-bold uppercase border ${
                        filters.size === sz
                          ? 'bg-black text-white border-black'
                          : 'border-[#E5E5E5] text-[#555555]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#333333] mb-3">
                  Price
                </h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map((pr) => (
                    <label key={pr.value} className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-price"
                        checked={filters.priceRange === pr.value}
                        onChange={() => onFilterChange({ ...filters, priceRange: pr.value })}
                        className="accent-black"
                      />
                      <span className={filters.priceRange === pr.value ? 'font-bold text-black' : 'text-[#555555]'}>
                        {pr.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
                    className="w-4 h-4 accent-black"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full bg-[#080808] text-white py-3 text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters ({totalCount})
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    onReset();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full py-2 text-xs font-bold text-red-600 uppercase"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
