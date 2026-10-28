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
      if (Array.isArray(val.heroSlides) && val.heroSlides.length > 0) {
        updated.heroSlides = val.heroSlides;
      }
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
    } else if (row.key === 'website_content') {
      if (Array.isArray(val.tickerItems) && val.tickerItems.length > 0) {
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
      if (val.editorialCulture) {
        updated.editorialCulture = {
          ...updated.editorialCulture,
          ...val.editorialCulture,
        };
      }
      if (Array.isArray(val.reviews) && val.reviews.length > 0) {
        updated.customerReviews = {
          ...updated.customerReviews,
          reviews: val.reviews.map((r: any) => ({
            id: r.id || `rev-${Math.random()}`,
            customerName: r.customerName || r.name || 'Anonymous',
            city: r.city || '',
            rating: r.rating || 5,
            review: r.review || r.comment || '',
            verified: r.verified !== undefined ? r.verified : true,
          })),
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
