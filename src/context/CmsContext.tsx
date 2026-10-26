'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WebsiteCmsData,
  AnnouncementBarConfig,
  HeroSlideConfig,
  FeaturedCategoryCard,
  CampaignBannerConfig,
  EditorialCultureConfig,
  CustomerReviewsConfig,
  CustomerReviewItem,
  TrustPerkItem,
} from '@/types/cms';
import { Coupon } from '@/types';
import { DEFAULT_CMS_DATA } from '@/data/defaultCmsData';

interface CmsContextType {
  cms: WebsiteCmsData;
  isHydrated: boolean;
  updateCms: (updater: (prev: WebsiteCmsData) => WebsiteCmsData) => void;
  updateAnnouncementBar: (bar: Partial<AnnouncementBarConfig>) => void;
  updateHeroSlides: (slides: HeroSlideConfig[]) => void;
  addHeroSlide: (slide: Omit<HeroSlideConfig, 'id'>) => void;
  deleteHeroSlide: (id: string) => void;
  updateFeaturedCategories: (cats: FeaturedCategoryCard[]) => void;
  updateCuratedSections: (sections: Partial<WebsiteCmsData['curatedSections']>) => void;
  updateCampaignBanners: (banners: Partial<CampaignBannerConfig>) => void;
  updateEditorialCulture: (config: Partial<EditorialCultureConfig>) => void;
  updateCustomerReviews: (config: Partial<CustomerReviewsConfig>) => void;
  addCustomerReview: (review: Omit<CustomerReviewItem, 'id'>) => void;
  deleteCustomerReview: (id: string) => void;
  updateTrustPerks: (perks: TrustPerkItem[]) => void;
  updateCoupons: (coupons: Coupon[]) => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;
  resetToDefaults: () => void;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

const CMS_STORAGE_KEY = 'teesoulz_cms_data';

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<WebsiteCmsData>(DEFAULT_CMS_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults in case of missing keys
        setCms((prev) => ({
          ...DEFAULT_CMS_DATA,
          ...parsed,
          announcementBar: { ...DEFAULT_CMS_DATA.announcementBar, ...(parsed.announcementBar || {}) },
          curatedSections: { ...DEFAULT_CMS_DATA.curatedSections, ...(parsed.curatedSections || {}) },
          campaignBanners: { ...DEFAULT_CMS_DATA.campaignBanners, ...(parsed.campaignBanners || {}) },
          editorialCulture: { ...DEFAULT_CMS_DATA.editorialCulture, ...(parsed.editorialCulture || {}) },
          customerReviews: { ...DEFAULT_CMS_DATA.customerReviews, ...(parsed.customerReviews || {}) },
          trustPerks: { ...DEFAULT_CMS_DATA.trustPerks, ...(parsed.trustPerks || {}) },
        }));
      }
    } catch (e) {
      console.warn('Failed to parse CMS data from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage and broadcast whenever cms changes
  const saveCmsData = useCallback((newData: WebsiteCmsData) => {
    setCms(newData);
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(newData));
      window.dispatchEvent(new CustomEvent('teesoulz_cms_updated', { detail: newData }));
    } catch (e) {
      console.warn('Failed to persist CMS data to localStorage:', e);
    }
  }, []);

  // Listen to cross-tab / cross-component CMS update events
  useEffect(() => {
    const handleCmsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<WebsiteCmsData>;
      if (customEvent.detail) {
        setCms(customEvent.detail);
      }
    };

    window.addEventListener('teesoulz_cms_updated', handleCmsUpdate);
    return () => window.removeEventListener('teesoulz_cms_updated', handleCmsUpdate);
  }, []);

  const updateCms = useCallback(
    (updater: (prev: WebsiteCmsData) => WebsiteCmsData) => {
      setCms((prev) => {
        const next = updater(prev);
        const withTimestamp = { ...next, updatedAt: new Date().toISOString() };
        try {
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(withTimestamp));
          window.dispatchEvent(new CustomEvent('teesoulz_cms_updated', { detail: withTimestamp }));
        } catch {}
        return withTimestamp;
      });
    },
    []
  );

  const updateAnnouncementBar = useCallback(
    (bar: Partial<AnnouncementBarConfig>) => {
      updateCms((prev) => ({
        ...prev,
        announcementBar: {
          ...prev.announcementBar,
          ...bar,
        },
      }));
    },
    [updateCms]
  );

  const updateHeroSlides = useCallback(
    (slides: HeroSlideConfig[]) => {
      updateCms((prev) => ({
        ...prev,
        heroSlides: slides,
      }));
    },
    [updateCms]
  );

  const addHeroSlide = useCallback(
    (slide: Omit<HeroSlideConfig, 'id'>) => {
      const newSlide: HeroSlideConfig = {
        ...slide,
        id: `slide-${Date.now()}`,
      };
      updateCms((prev) => ({
        ...prev,
        heroSlides: [...prev.heroSlides, newSlide],
      }));
    },
    [updateCms]
  );

  const deleteHeroSlide = useCallback(
    (id: string) => {
      updateCms((prev) => ({
        ...prev,
        heroSlides: prev.heroSlides.filter((s) => s.id !== id),
      }));
    },
    [updateCms]
  );

  const updateFeaturedCategories = useCallback(
    (cats: FeaturedCategoryCard[]) => {
      updateCms((prev) => ({
        ...prev,
        featuredCategories: cats,
      }));
    },
    [updateCms]
  );

  const updateCuratedSections = useCallback(
    (sections: Partial<WebsiteCmsData['curatedSections']>) => {
      updateCms((prev) => ({
        ...prev,
        curatedSections: {
          ...prev.curatedSections,
          ...sections,
        },
      }));
    },
    [updateCms]
  );

  const updateCampaignBanners = useCallback(
    (banners: Partial<CampaignBannerConfig>) => {
      updateCms((prev) => ({
        ...prev,
        campaignBanners: {
          ...prev.campaignBanners,
          ...banners,
        },
      }));
    },
    [updateCms]
  );

  const updateEditorialCulture = useCallback(
    (config: Partial<EditorialCultureConfig>) => {
      updateCms((prev) => ({
        ...prev,
        editorialCulture: {
          ...prev.editorialCulture,
          ...config,
        },
      }));
    },
    [updateCms]
  );

  const updateCustomerReviews = useCallback(
    (config: Partial<CustomerReviewsConfig>) => {
      updateCms((prev) => ({
        ...prev,
        customerReviews: {
          ...prev.customerReviews,
          ...config,
        },
      }));
    },
    [updateCms]
  );

  const addCustomerReview = useCallback(
    (review: Omit<CustomerReviewItem, 'id'>) => {
      const newReview: CustomerReviewItem = {
        ...review,
        id: `rev-${Date.now()}`,
      };
      updateCms((prev) => ({
        ...prev,
        customerReviews: {
          ...prev.customerReviews,
          reviews: [newReview, ...prev.customerReviews.reviews],
        },
      }));
    },
    [updateCms]
  );

  const deleteCustomerReview = useCallback(
    (id: string) => {
      updateCms((prev) => ({
        ...prev,
        customerReviews: {
          ...prev.customerReviews,
          reviews: prev.customerReviews.reviews.filter((r) => r.id !== id),
        },
      }));
    },
    [updateCms]
  );

  const updateTrustPerks = useCallback(
    (perks: TrustPerkItem[]) => {
      updateCms((prev) => ({
        ...prev,
        trustPerks: {
          ...prev.trustPerks,
          perks,
        },
      }));
    },
    [updateCms]
  );

  const updateCoupons = useCallback(
    (coupons: Coupon[]) => {
      updateCms((prev) => ({
        ...prev,
        coupons,
      }));
    },
    [updateCms]
  );

  const addCoupon = useCallback(
    (coupon: Coupon) => {
      updateCms((prev) => ({
        ...prev,
        coupons: [coupon, ...prev.coupons.filter((c) => c.code !== coupon.code)],
      }));
    },
    [updateCms]
  );

  const deleteCoupon = useCallback(
    (code: string) => {
      updateCms((prev) => ({
        ...prev,
        coupons: prev.coupons.filter((c) => c.code !== code),
      }));
    },
    [updateCms]
  );

  const resetToDefaults = useCallback(() => {
    saveCmsData(DEFAULT_CMS_DATA);
  }, [saveCmsData]);

  return (
    <CmsContext.Provider
      value={{
        cms,
        isHydrated,
        updateCms,
        updateAnnouncementBar,
        updateHeroSlides,
        addHeroSlide,
        deleteHeroSlide,
        updateFeaturedCategories,
        updateCuratedSections,
        updateCampaignBanners,
        updateEditorialCulture,
        updateCustomerReviews,
        addCustomerReview,
        deleteCustomerReview,
        updateTrustPerks,
        updateCoupons,
        addCoupon,
        deleteCoupon,
        resetToDefaults,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
}
