import { createClient } from '@supabase/supabase-js';
import { WebsiteCmsData } from '@/types/cms';
import { DEFAULT_CMS_DATA } from '@/data/defaultCmsData';
import { Database } from '@/types/database.types';

function getSupabaseCatalogClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcxvyfgeduyokdahkrow.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_V5k0p-NiVUOmWMvW5TptAw_WddPESHK';
  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function parseCmsRowsIntoData(rows: any[], baseData: WebsiteCmsData = DEFAULT_CMS_DATA): WebsiteCmsData {
  let updated: WebsiteCmsData = { ...baseData };

  for (const row of rows) {
    const val: any = row.value || {};

    if (row.key === 'homepage_cms') {
      // 1. Hero Campaign Slides
      if (Array.isArray(val.heroSlides) && val.heroSlides.length > 0) {
        updated.heroSlides = val.heroSlides;
      }

      // 2. 2-Column Category Gallery (Shop Mens / Shop Womens)
      if (Array.isArray(val.featuredCategories) && val.featuredCategories.length > 0) {
        updated.featuredCategories = val.featuredCategories;
      }

      // 3. Curated Product Sections (New In, Bestsellers, Shop Women, Shop Men)
      if (val.curatedSections) {
        updated.curatedSections = {
          ...updated.curatedSections,
          newIn: { ...updated.curatedSections.newIn, ...(val.curatedSections.newIn || {}) },
          bestSeller: { ...updated.curatedSections.bestSeller, ...(val.curatedSections.bestSeller || {}) },
          shopWomen: { ...updated.curatedSections.shopWomen, ...(val.curatedSections.shopWomen || {}) },
          shopMen: { ...updated.curatedSections.shopMen, ...(val.curatedSections.shopMen || {}) },
        };
      }

      // 4. Mid-page Campaign Banners
      if (val.campaignBanner) {
        updated.campaignBanners = {
          ...updated.campaignBanners,
          singleBanner: {
            ...updated.campaignBanners.singleBanner,
            ...val.campaignBanner,
            altText: val.campaignBanner.altText || val.campaignBanner.title || 'Campaign Banner',
          },
        };
      }
      if (val.campaignSlideshow) {
        updated.campaignBanners = {
          ...updated.campaignBanners,
          slideshow: {
            ...updated.campaignBanners.slideshow,
            ...val.campaignSlideshow,
          },
        };
      }
    } else if (row.key === 'website_content') {
      // 1. Announcement Bar & Tickers
      if (val.announcementBar) {
        updated.announcementBar = {
          ...updated.announcementBar,
          ...val.announcementBar,
          items: Array.isArray(val.announcementBar.items)
            ? val.announcementBar.items
            : updated.announcementBar.items,
        };
      } else if (Array.isArray(val.tickerItems) && val.tickerItems.length > 0) {
        updated.announcementBar = {
          ...updated.announcementBar,
          items: val.tickerItems.map((item: any) => ({
            id: item.id || `ticker-${Math.random()}`,
            text: item.text,
            badge: item.badge || '',
            link: item.link || '',
            active: item.active !== undefined ? item.active : true,
          })),
        };
      }

      // 2. Editorial Culture Manifesto
      if (val.editorialCulture) {
        updated.editorialCulture = {
          ...updated.editorialCulture,
          ...val.editorialCulture,
        };
      }

      // 3. Customer Reviews / Testimonials
      if (Array.isArray(val.reviews) && val.reviews.length > 0) {
        updated.customerReviews = {
          ...updated.customerReviews,
          reviews: val.reviews.map((r: any) => ({
            id: r.id || `rev-${Math.random()}`,
            name: r.name || r.customerName || 'Anonymous',
            city: r.city || '',
            rating: r.rating || 5,
            title: r.title || '',
            review: r.review || r.comment || '',
            product: r.product || 'TEESOULZ Streetwear',
            date: r.date || 'Recently',
            verified: r.verified !== undefined ? r.verified : true,
          })),
        };
      } else if (val.customerReviews) {
        updated.customerReviews = {
          ...updated.customerReviews,
          ...val.customerReviews,
        };
      }

      // 4. Trust Perks Guarantee Strip
      if (val.trustPerks) {
        if (Array.isArray(val.trustPerks)) {
          updated.trustPerks = {
            ...updated.trustPerks,
            perks: val.trustPerks,
          };
        } else if (typeof val.trustPerks === 'object') {
          updated.trustPerks = {
            ...updated.trustPerks,
            ...val.trustPerks,
          };
        }
      }

      // 5. Footer & Brand Links
      if (val.footer) {
        updated.footer = {
          ...(updated.footer || baseData.footer || {
            tagline: 'HEAVYWEIGHT STREETWEAR',
            instagramUrl: 'https://instagram.com',
            twitterUrl: 'https://twitter.com',
            youtubeUrl: 'https://youtube.com',
            spotifyUrl: 'https://spotify.com',
            copyrightText: '© 2026 TEESOULZ APPAREL PVT LTD. All Rights Reserved.',
          }),
          ...val.footer,
        };
      }
    }
  }

  return updated;
}

export async function getLiveCmsSettings(): Promise<WebsiteCmsData> {
  try {
    const supabase = getSupabaseCatalogClient();
    const { data: rows, error } = await supabase
      .from('cms_settings')
      .select('key, value');

    if (error || !rows || rows.length === 0) {
      return DEFAULT_CMS_DATA;
    }

    return parseCmsRowsIntoData(rows, DEFAULT_CMS_DATA);
  } catch (err) {
    console.warn('[CMS Sync] Could not fetch cms_settings, falling back to defaults:', err);
    return DEFAULT_CMS_DATA;
  }
}
