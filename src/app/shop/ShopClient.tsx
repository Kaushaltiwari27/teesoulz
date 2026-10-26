'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters, { FilterOptions } from '@/components/product/ProductFilters';
import { getProducts } from '@/lib/supabase/products';
import { PRODUCTS } from '@/data/mockData';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export default function ShopClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial query params
  const initialCategory = searchParams.get('category') || 'all';
  const initialGender = searchParams.get('gender') || 'all';
  const initialSize = searchParams.get('size') || '';
  const initialPrice = searchParams.get('price') || 'all';
  const initialSort = (searchParams.get('sort') as FilterOptions['sortBy']) || 'featured';
  const searchQuery = searchParams.get('q') || '';

  const [filters, setFilters] = useState<FilterOptions>({
    category: initialCategory,
    gender: initialGender,
    size: initialSize,
    priceRange: initialPrice,
    inStockOnly: false,
    sortBy: initialSort,
  });

  const { products: storeProducts } = useStore();
  const [products, setProducts] = useState<Product[]>(storeProducts || PRODUCTS);

  useEffect(() => {
    if (storeProducts && storeProducts.length > 0) {
      setProducts(storeProducts);
    }
  }, [storeProducts]);

  // Fetch live products from Supabase
  useEffect(() => {
    let active = true;
    getProducts().then((live) => {
      if (active && live && live.length > 0) {
        setProducts(live);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Keep state in sync if URL params change externally
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || 'all',
      gender: searchParams.get('gender') || 'all',
      size: searchParams.get('size') || '',
      priceRange: searchParams.get('price') || 'all',
      sortBy: (searchParams.get('sort') as FilterOptions['sortBy']) || 'featured',
    }));
  }, [searchParams]);

  // Update URL params when filters change
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    const params = new URLSearchParams();

    if (newFilters.category !== 'all') params.set('category', newFilters.category);
    if (newFilters.gender !== 'all') params.set('gender', newFilters.gender);
    if (newFilters.size) params.set('size', newFilters.size);
    if (newFilters.priceRange !== 'all') params.set('price', newFilters.priceRange);
    if (newFilters.sortBy !== 'featured') params.set('sort', newFilters.sortBy);
    if (searchQuery) params.set('q', searchQuery);

    const queryStr = params.toString();
    router.replace(`/shop${queryStr ? `?${queryStr}` : ''}`, { scroll: false });
  };

  const handleResetFilters = () => {
    const resetValues: FilterOptions = {
      category: 'all',
      gender: 'all',
      size: '',
      priceRange: 'all',
      inStockOnly: false,
      sortBy: 'featured',
    };
    setFilters(resetValues);
    router.replace(searchQuery ? `/shop?q=${encodeURIComponent(searchQuery)}` : '/shop', { scroll: false });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags || []).some((t: string) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Gender
    if (filters.gender !== 'all') {
      result = result.filter((p) => p.gender === filters.gender || p.gender === 'unisex');
    }

    // Size
    if (filters.size) {
      result = result.filter((p) =>
        (p.variants || []).some((v: any) => v.size === filters.size && v.stock > 0)
      );
    }

    // Price range
    if (filters.priceRange === 'under-1499') {
      result = result.filter((p) => p.price < 1500);
    } else if (filters.priceRange === '1500-2499') {
      result = result.filter((p) => p.price >= 1500 && p.price <= 2499);
    } else if (filters.priceRange === 'above-2500') {
      result = result.filter((p) => p.price >= 2500);
    }

    // In stock
    if (filters.inStockOnly) {
      result = result.filter((p) => p.totalStock > 0);
    }

    // Sorting
    if (filters.sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'bestselling') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return result;
  }, [filters, searchQuery, products]);

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-[#777777] mb-6">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#111111] font-semibold">Shop All</span>
          {searchQuery && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-black font-bold">Search: &ldquo;{searchQuery}&rdquo;</span>
            </>
          )}
        </nav>

        {/* Page Title & Banner */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#080808]">
            {searchQuery ? `SEARCH: "${searchQuery}"` : 'SHOP ALL STREETWEAR'}
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] max-w-2xl mt-2 leading-relaxed">
            Engineered silhouettes, 260-420 GSM custom-knit fabrics, and signature Indian monochrome streetwear. Filter by fit, category, and size to find your next daily piece.
          </p>
        </div>

        {/* Filter Bar */}
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalCount={filteredProducts.length}
        />

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          showReset={true}
          onReset={handleResetFilters}
        />
      </div>
    </div>
  );
}
