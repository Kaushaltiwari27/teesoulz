import { Coupon } from './index';

export interface AnnouncementTickerItem {
  id: string;
  text: string;
  badge: string;
  link: string;
  active: boolean;
}

export interface AnnouncementBarConfig {
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast';
  items: AnnouncementTickerItem[];
}

export interface HeroSlideConfig {
  id: string;
  title: string;
  subtitle: string;
  link: string;
  desktopImage: string;
  mobileImage: string;
  desktopPosition?: string;
  badge?: string;
  buttonText?: string;
  active: boolean;
}

export interface FeaturedCategoryCard {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  image: string;
  alt: string;
  buttonText: string;
}

export interface CuratedSectionConfig {
  id: string;
  title: string;
  subtitle: string;
  viewAllLink: string;
  viewAllText: string;
  displayLimit: number;
  enabled: boolean;
}

export interface CampaignBannerSlide {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  desktopImage: string;
  altText: string;
  active: boolean;
}

export interface CampaignBannerConfig {
  singleBanner: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    desktopImage: string;
    altText: string;
    enabled: boolean;
  };
  slideshow: {
    enabled: boolean;
    autoplayInterval: number;
    slides: CampaignBannerSlide[];
  };
}

export interface EditorialCultureConfig {
  tag: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  enabled: boolean;
}

export interface CustomerReviewItem {
  id: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  review: string;
  product: string;
  date: string;
  verified: boolean;
}

export interface CustomerReviewsConfig {
  enabled: boolean;
  badgeText: string;
  heading: string;
  subtitle: string;
  reviews: CustomerReviewItem[];
}

export interface TrustPerkItem {
  id: string;
  iconName: 'Truck' | 'RotateCcw' | 'Sparkles' | 'ShieldCheck';
  title: string;
  description: string;
}

export interface TrustPerksConfig {
  enabled: boolean;
  perks: TrustPerkItem[];
}

export interface FooterConfig {
  tagline: string;
  instagramUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
  copyrightText: string;
}

export interface WebsiteCmsData {
  announcementBar: AnnouncementBarConfig;
  heroSlides: HeroSlideConfig[];
  featuredCategories: FeaturedCategoryCard[];
  curatedSections: {
    newIn: CuratedSectionConfig;
    bestSeller: CuratedSectionConfig;
    shopWomen: CuratedSectionConfig;
    shopMen: CuratedSectionConfig;
  };
  campaignBanners: CampaignBannerConfig;
  editorialCulture: EditorialCultureConfig;
  customerReviews: CustomerReviewsConfig;
  trustPerks: TrustPerksConfig;
  footer?: FooterConfig;
  coupons: Coupon[];
  updatedAt: string;
}
