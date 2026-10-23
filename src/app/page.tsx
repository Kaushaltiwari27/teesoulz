import React from 'react';
import CategoryBubbles from '@/components/home/CategoryBubbles';
import HeroCampaign from '@/components/home/HeroCampaign';
import OffersPromoStrip from '@/components/home/OffersPromoStrip';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import CuratedProductGrid from '@/components/home/CuratedProductGrid';
import CampaignBanner, { CampaignSlide } from '@/components/home/CampaignBanner';
import EditorialCultureSection from '@/components/home/EditorialCultureSection';
import CustomerReviewsSection from '@/components/home/CustomerReviewsSection';
import TrustPerksSection from '@/components/home/TrustPerksSection';
import { PRODUCTS } from '@/data/mockData';

const MID_PAGE_SLIDES: CampaignSlide[] = [
  {
    id: 'noir-monolith',
    title: 'NOIR MONOLITH CAPSULE',
    subtitle: '280 GSM architectural drape, dropped shoulders & brutalist monochrome graphics',
    buttonText: 'EXPLORE',
    buttonLink: '/shop?gender=men',
    desktopImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=2400&q=85',
    altText: 'TEESOULZ Men Heavyweight Capsule',
  },
  {
    id: 'cyber-tokyo',
    title: 'CYBER TOKYO STREETWEAR',
    subtitle: 'Japanese discharge print aesthetics, oversized boxy cuts & acid-treated textiles',
    buttonText: 'EXPLORE DROP',
    buttonLink: '/collections/cyber-tokyo',
    desktopImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2400&q=85',
    altText: 'TEESOULZ Cyber Tokyo Collection',
  },
  {
    id: 'double-fleece',
    title: '400 GSM DOUBLE FLEECE',
    subtitle: 'Heavyweight drop-shoulder structural hoodies with pre-shrunk Lycra ribbed cuffs',
    buttonText: 'SHOP HOODIES',
    buttonLink: '/category/hoodies',
    desktopImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=2400&q=85',
    altText: 'TEESOULZ Double Fleece Hoodies',
  },
  {
    id: 'parachute-cargos',
    title: 'PARACHUTE CARGO SYSTEMS',
    subtitle: 'Tactical 6-pocket bottoms with bungee cinching and architectural drape',
    buttonText: 'EXPLORE BOTTOMS',
    buttonLink: '/category/bottoms',
    desktopImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=85',
    altText: 'TEESOULZ Parachute Cargo Systems',
  },
  {
    id: 'acid-wash',
    title: 'RAW ACID WASH ARCHIVE',
    subtitle: 'Custom enzyme-washed monochrome silhouettes with vintage distressed hems',
    buttonText: 'EXPLORE ARCHIVE',
    buttonLink: '/bestsellers',
    desktopImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=2400&q=85',
    altText: 'TEESOULZ Raw Acid Wash Archive',
  },
];

export default function HomePage() {
  // 1. Curated New Arrivals (8 items)
  const newArrivals = PRODUCTS.filter(
    (p) => p.isNewArrival || p.tags?.includes('New Drop') || p.tags?.includes('New In')
  );
  const displayNewArrivals =
    newArrivals.length >= 4 ? newArrivals.slice(0, 8) : PRODUCTS.slice(0, 8);

  // 2. Curated Bestsellers (8 items)
  const bestsellers = PRODUCTS.filter((p) => p.isBestseller);
  const displayBestsellers =
    bestsellers.length >= 4 ? bestsellers.slice(0, 8) : PRODUCTS.slice(4, 12);

  // 3. Shop Women (8 items)
  const womens = PRODUCTS.filter((p) => p.gender === 'women' || p.gender === 'unisex');
  const displayWomens =
    womens.length >= 4 ? womens.slice(0, 8) : PRODUCTS.slice(0, 8);

  // 4. Shop Men (8 items)
  const mens = PRODUCTS.filter((p) => p.gender === 'men' || p.gender === 'unisex');
  const displayMens =
    mens.length >= 4 ? mens.slice(0, 8) : PRODUCTS.slice(0, 8);

  return (
    <div className="w-full bg-white">
      {/* 1. Quick Navigation Stories / Category Bubbles (Bonkers Corner Signature) */}
      <CategoryBubbles />

      {/* 2. Hero Section: Auto-rotating campaign slides (Bonkers Corner Style) */}
      <HeroCampaign />

      {/* 3. Promotional Offers & Discount Strip */}
      <OffersPromoStrip />

      {/* 4. 2-Column Gallery: SHOP MENS & SHOP WOMENS with Explore buttons */}
      <FeaturedCategories />

      {/* 3. Section #4: New In featured collection with "Shop New Arrivals" */}
      <CuratedProductGrid
        title="New In"
        subtitle="Upgrade your closet with everything trendy and new"
        viewAllLink="/new-in"
        viewAllText="Shop New Arrivals"
        products={displayNewArrivals}
      />

      {/* 4. Section #3 & #5: Mid-page Campaign Banner (Women's / Streetwear Drop) */}
      <CampaignBanner
        title="AUTUMN / WINTER '26 DROPS"
        subtitle="Heavyweight loopback Terry, boxy silhouette fits & acid wash textures"
        buttonText="Shop Now"
        buttonLink="/shop?gender=women"
        desktopImage="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=85"
        altText="TEESOULZ Women Streetwear Drop"
      />

      {/* 5. Section #6: Best Seller featured collection with "Shop Bestseller" */}
      <CuratedProductGrid
        title="Best Seller"
        subtitle="Handpicked and crafted for you"
        viewAllLink="/bestsellers"
        viewAllText="Shop Bestseller"
        products={displayBestsellers}
      />

      {/* 6. Section #8: Shop Women featured collection with "Shop Women" */}
      <CuratedProductGrid
        title="Shop Women"
        subtitle="From everyday essentials to statement pieces"
        viewAllLink="/shop?gender=women"
        viewAllText="Shop Women"
        products={displayWomens}
      />

      {/* 7. Mid-page Campaign Banner Slideshow (Max 5 slides, auto-changes every 5 seconds) */}
      <CampaignBanner slides={MID_PAGE_SLIDES} autoplayInterval={5000} />

      {/* 8. Section #9: Shop Men featured collection with "Shop Mens" */}
      <CuratedProductGrid
        title="Shop Men"
        subtitle="Uncover the latest in men's fashion"
        viewAllLink="/shop?gender=men"
        viewAllText="Shop Mens"
        products={displayMens}
      />

      {/* 9. Section #10: Editorial Streetwear Culture Statement (TIME TO GET WEIRD) */}
      <EditorialCultureSection />

      {/* 10. Section #12: Customer Reviews Carousel (Let Customers Speak For Us) */}
      <CustomerReviewsSection />

      {/* 11. Section #13: Text With Icons / Trust Perks (Free Shipping, Returns, Cotton, Security) */}
      <TrustPerksSection />
    </div>
  );
}
