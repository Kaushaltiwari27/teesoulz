'use client';

import React from 'react';
import HeroCampaign from '@/components/home/HeroCampaign';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import CuratedProductGrid from '@/components/home/CuratedProductGrid';
import CampaignBanner from '@/components/home/CampaignBanner';
import EditorialCultureSection from '@/components/home/EditorialCultureSection';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';
import TrustPerksSection from '@/components/home/TrustPerksSection';
import RecentlyViewedSection from '@/components/home/RecentlyViewedSection';
import { useCms } from '@/context/CmsContext';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export default function HomeSectionsClient({ initialProducts }: { initialProducts: Product[] }) {
  const { cms } = useCms();
  const { products: storeProducts } = useStore();

  const products = storeProducts && storeProducts.length > 0 ? storeProducts : initialProducts;

  // 1. Curated New Arrivals (8 items)
  const newArrivals = products.filter(
    (p) => p.isNewArrival || p.tags?.includes('New Drop') || p.tags?.includes('New In')
  );
  const displayNewArrivals =
    newArrivals.length >= 4 ? newArrivals.slice(0, cms.curatedSections.newIn.displayLimit || 8) : products.slice(0, 8);

  // 2. Curated Bestsellers (8 items)
  const bestsellers = products.filter((p) => p.isBestseller);
  const displayBestsellers =
    bestsellers.length >= 4 ? bestsellers.slice(0, cms.curatedSections.bestSeller.displayLimit || 8) : products.slice(4, 12);

  // 3. Shop Women (8 items)
  const womens = products.filter((p) => p.gender === 'women' || p.gender === 'unisex');
  const displayWomens =
    womens.length >= 4 ? womens.slice(0, cms.curatedSections.shopWomen.displayLimit || 8) : products.slice(0, 8);

  // 4. Shop Men (8 items)
  const mens = products.filter((p) => p.gender === 'men' || p.gender === 'unisex');
  const displayMens =
    mens.length >= 4 ? mens.slice(0, cms.curatedSections.shopMen.displayLimit || 8) : products.slice(0, 8);

  const activeSlideshowSlides = (cms.campaignBanners.slideshow.slides || []).filter((s) => s.active);

  return (
    <div className="w-full bg-white">
      {/* 1. Hero Section: Auto-rotating campaign slides (Bonkers Corner Style) */}
      <HeroCampaign />

      {/* 2. 2-Column Gallery: SHOP MENS & SHOP WOMENS with Explore buttons */}
      <FeaturedCategories />

      {/* 3. Section #4: New In featured collection with "Shop New Arrivals" */}
      {cms.curatedSections.newIn.enabled && (
        <CuratedProductGrid
          title={cms.curatedSections.newIn.title}
          subtitle={cms.curatedSections.newIn.subtitle}
          viewAllLink={cms.curatedSections.newIn.viewAllLink}
          viewAllText={cms.curatedSections.newIn.viewAllText}
          products={displayNewArrivals}
        />
      )}

      {/* 4. Mid-page Campaign Banner (Women's / Streetwear Drop) */}
      {cms.campaignBanners.singleBanner.enabled && (
        <CampaignBanner
          title={cms.campaignBanners.singleBanner.title}
          subtitle={cms.campaignBanners.singleBanner.subtitle}
          buttonText={cms.campaignBanners.singleBanner.buttonText}
          buttonLink={cms.campaignBanners.singleBanner.buttonLink}
          desktopImage={cms.campaignBanners.singleBanner.desktopImage}
          altText={cms.campaignBanners.singleBanner.altText}
        />
      )}

      {/* 5. Section #6: Best Seller featured collection with "Shop Bestseller" */}
      {cms.curatedSections.bestSeller.enabled && (
        <CuratedProductGrid
          title={cms.curatedSections.bestSeller.title}
          subtitle={cms.curatedSections.bestSeller.subtitle}
          viewAllLink={cms.curatedSections.bestSeller.viewAllLink}
          viewAllText={cms.curatedSections.bestSeller.viewAllText}
          products={displayBestsellers}
        />
      )}

      {/* 6. Section #8: Shop Women featured collection with "Shop Women" */}
      {cms.curatedSections.shopWomen.enabled && (
        <CuratedProductGrid
          title={cms.curatedSections.shopWomen.title}
          subtitle={cms.curatedSections.shopWomen.subtitle}
          viewAllLink={cms.curatedSections.shopWomen.viewAllLink}
          viewAllText={cms.curatedSections.shopWomen.viewAllText}
          products={displayWomens}
        />
      )}

      {/* 7. Mid-page Campaign Banner Slideshow */}
      {cms.campaignBanners.slideshow.enabled && activeSlideshowSlides.length > 0 && (
        <CampaignBanner
          slides={activeSlideshowSlides}
          autoplayInterval={cms.campaignBanners.slideshow.autoplayInterval || 5000}
        />
      )}

      {/* 8. Section #9: Shop Men featured collection with "Shop Mens" */}
      {cms.curatedSections.shopMen.enabled && (
        <CuratedProductGrid
          title={cms.curatedSections.shopMen.title}
          subtitle={cms.curatedSections.shopMen.subtitle}
          viewAllLink={cms.curatedSections.shopMen.viewAllLink}
          viewAllText={cms.curatedSections.shopMen.viewAllText}
          products={displayMens}
        />
      )}

      {/* 9. Recently Viewed Archive (Appears automatically for returning users) */}
      <RecentlyViewedSection />

      {/* 10. Section #10: Editorial Streetwear Culture Statement (TIME TO GET WEIRD) */}
      <EditorialCultureSection />

      {/* 11. Section #12: Customer Reviews Carousel (Let Customers Speak For Us) */}
      <CustomerReviewsSection />

      {/* 12. Section #13: Text With Icons / Trust Perks (Free Shipping, Returns, Cotton, Security) */}
      <TrustPerksSection />
    </div>
  );
}
