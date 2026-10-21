import React from 'react';
import HeroCampaign from '@/components/home/HeroCampaign';
import KineticMarquee from '@/components/home/KineticMarquee';
import ShopByCategory from '@/components/home/ShopByCategory';
import ProductCarousel from '@/components/home/ProductCarousel';
import FeaturedDrop from '@/components/home/FeaturedDrop';
import ShopByStyle from '@/components/home/ShopByStyle';
import BundlePromoSection from '@/components/home/BundlePromoSection';
import BrandStorySection from '@/components/home/BrandStorySection';
import TrustStrip from '@/components/home/TrustStrip';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';
import InstagramUgcSection from '@/components/home/InstagramUgcSection';
import { PRODUCTS } from '@/data/mockData';

export default function HomePage() {
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival || p.tags.includes('New Drop') || p.tags.includes('New In'));
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller);
  const trending = PRODUCTS.filter((p) => p.isTrending);

  const displayNewArrivals = newArrivals.length >= 8 ? newArrivals.slice(0, 8) : PRODUCTS.slice(0, 8);
  const displayBestsellers = bestsellers.length >= 8 ? bestsellers.slice(0, 8) : PRODUCTS.slice(4, 12);
  const displayTrending = trending.length >= 8 ? trending.slice(0, 8) : PRODUCTS.slice(8, 16);

  return (
    <div className="w-full">
      {/* C. Hero Campaign with GSAP Animations */}
      <HeroCampaign />

      {/* Kinetic Typography Marquee Ribbon */}
      <KineticMarquee />

      {/* D. Shop by Category */}
      <ShopByCategory />

      {/* E. New Arrivals */}
      <ProductCarousel
        title="NEW ARRIVALS"
        subtitle="AUTUMN/WINTER DROP 04"
        viewAllLink="/new-in"
        products={displayNewArrivals}
      />

      {/* F. Bestsellers */}
      <ProductCarousel
        title="BESTSELLERS"
        subtitle="THE SIGNATURE UNIFORM"
        viewAllLink="/bestsellers"
        products={displayBestsellers}
        bgColor="bg-[#FAFAFA]"
      />

      {/* G. Featured Collection or Latest Drop */}
      <FeaturedDrop />

      {/* H. Trending Products */}
      <ProductCarousel
        title="TRENDING ON THE STREETS"
        subtitle="HIGH ENGAGEMENT STYLES"
        viewAllLink="/shop"
        products={displayTrending}
      />

      {/* I. Shop By Style / Curated Aesthetics */}
      <ShopByStyle />

      {/* J. Bundle & Promotional Section */}
      <BundlePromoSection />

      {/* K. Brand Story & Manifesto */}
      <BrandStorySection />

      {/* L. Trust & Service Strip */}
      <TrustStrip />

      {/* M. Customer Reviews */}
      <CustomerReviewsSection />

      {/* O. Instagram UGC Grid */}
      <InstagramUgcSection />
    </div>
  );
}
