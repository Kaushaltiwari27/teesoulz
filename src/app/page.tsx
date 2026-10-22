import React from 'react';
import HeroCampaign from '@/components/home/HeroCampaign';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import CuratedProductGrid from '@/components/home/CuratedProductGrid';
import FeaturedDrop from '@/components/home/FeaturedDrop';
import BrandStorySection from '@/components/home/BrandStorySection';
import { PRODUCTS } from '@/data/mockData';

export default function HomePage() {
  // Curated New Arrivals (8 items)
  const newArrivals = PRODUCTS.filter(
    (p) => p.isNewArrival || p.tags.includes('New Drop') || p.tags.includes('New In')
  );
  const displayNewArrivals =
    newArrivals.length >= 8 ? newArrivals.slice(0, 8) : PRODUCTS.slice(0, 8);

  // Curated Bestsellers (4 items for tight, high-impact focus)
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller);
  const displayBestsellers =
    bestsellers.length >= 4 ? bestsellers.slice(0, 4) : PRODUCTS.slice(4, 8);

  return (
    <div className="w-full bg-white">
      {/* 3. Hero Section: One strong campaign image, concise headline, short line, primary CTA */}
      <HeroCampaign />

      {/* 4. Featured Categories: Simple image-led cards for Men, Women, Unisex */}
      <FeaturedCategories />

      {/* 5. New Arrivals: Clean product grid featuring a limited, curated selection */}
      <CuratedProductGrid
        title="NEW ARRIVALS"
        subtitle="AUTUMN / WINTER DROP 04"
        viewAllLink="/new-in"
        products={displayNewArrivals}
      />

      {/* 6. Featured Collection & Bestsellers: Supported by actual products */}
      <FeaturedDrop />

      <CuratedProductGrid
        title="BESTSELLERS"
        subtitle="THE PERMANENT SIGNATURE UNIFORM"
        viewAllLink="/bestsellers"
        products={displayBestsellers}
        bgColor="bg-[#FAFAFA]"
      />

      {/* 7. Brand Statement: Short, stylish TEESOULZ brand message */}
      <BrandStorySection />
    </div>
  );
}
