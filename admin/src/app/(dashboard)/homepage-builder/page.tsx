'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Sliders,
  Save,
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  ShoppingBag,
  Layers,
  FileText,
  Megaphone,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Eye,
  Check,
  ArrowRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type TabType =
  | 'hero'
  | 'categories'
  | 'grids'
  | 'banners'
  | 'editorial'
  | 'reviews'
  | 'trust'
  | 'ticker';

export default function HomepageBuilderPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('hero');
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  const storefrontUrl =
    process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://teesoulz.vercel.app';

  // 1. Hero Slides
  const [heroSlides, setHeroSlides] = useState<any[]>([
    {
      id: 'slide-1',
      title: 'STREET SOUL. RAW LUXURY.',
      subtitle: 'Winter 2026 drop featuring 240 GSM oversized boxy essentials.',
      link: '/shop',
      desktopImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      badge: 'DROP #04 LIVE',
      buttonText: 'SHOP THE DROP',
      active: true,
    },
    {
      id: 'slide-2',
      title: 'HEAVYWEIGHT BOX-FIT ESSENTIALS',
      subtitle: 'Combed cotton tees built for enduring street silhouette.',
      link: '/category/oversized-t-shirts',
      desktopImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&auto=format&fit=crop&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
      badge: 'BESTSELLER RESTOCK',
      buttonText: 'EXPLORE TEES',
      active: true,
    },
  ]);

  // 2. Featured 2-Column Categories
  const [featuredCategoriesEnabled, setFeaturedCategoriesEnabled] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState<any[]>([
    {
      id: 'cat-mens',
      title: 'SHOP MENS',
      subtitle: 'Tactical cargos, heavy hoodies & boxy tees',
      href: '/shop?gender=men',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=85',
      alt: 'Shop Mens Streetwear',
      buttonText: 'Explore',
    },
    {
      id: 'cat-womens',
      title: 'SHOP WOMENS',
      subtitle: 'Boyfriend tees, cropped silhouettes & cargos',
      href: '/shop?gender=women',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85',
      alt: 'Shop Womens Streetwear',
      buttonText: 'Explore',
    },
  ]);

  // 3. Curated Product Grids Configuration
  const [curatedSections, setCuratedSections] = useState({
    newIn: {
      id: 'new-in',
      title: 'NEW IN DROPS',
      subtitle: 'Engineered 260-420 GSM silhouettes hot from the loom',
      viewAllLink: '/new-in',
      viewAllText: 'SHOP NEW ARRIVALS',
      displayLimit: 8,
      enabled: true,
    },
    bestSeller: {
      id: 'best-sellers',
      title: 'ALL-TIME BESTSELLERS',
      subtitle: 'Most coveted street staples with verified customer love',
      viewAllLink: '/bestsellers',
      viewAllText: 'SHOP BESTSELLERS',
      displayLimit: 8,
      enabled: true,
    },
    shopWomen: {
      id: 'shop-women',
      title: 'WOMEN STREET CAPSULE',
      subtitle: 'Cropped boxes, drop-shoulder silhouettes & drapes',
      viewAllLink: '/shop?gender=women',
      viewAllText: 'SHOP WOMEN',
      displayLimit: 8,
      enabled: true,
    },
    shopMen: {
      id: 'shop-men',
      title: 'MEN HEAVYWEIGHT DROP',
      subtitle: '280 GSM compact yarn drapes and tactical builds',
      viewAllLink: '/shop?gender=men',
      viewAllText: 'SHOP MENS',
      displayLimit: 8,
      enabled: true,
    },
  });

  // 4. Mid-page Campaign Banners
  const [campaignBanner, setCampaignBanner] = useState({
    title: 'THE OVERSIZED REVOLUTION',
    subtitle: 'Limited release streetwear capsules engineered with high-density drop stitching.',
    buttonText: 'VIEW THE CAPSULE',
    buttonLink: '/collections',
    desktopImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1400&auto=format&fit=crop&q=80',
    enabled: true,
    altText: 'Streetwear Capsule Banner',
  });

  const [campaignSlideshow, setCampaignSlideshow] = useState({
    enabled: false,
    autoplayInterval: 5000,
    slides: [
      {
        id: 'promo-1',
        title: 'MONOLITH ACID WASH',
        subtitle: 'Special pigment dyed streetwear series',
        buttonText: 'SHOP CAPSULE',
        buttonLink: '/collections/noir-monolith',
        desktopImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&auto=format&fit=crop&q=80',
        altText: 'Acid Wash Drop',
        active: true,
      },
    ],
  });

  // 5. Editorial Culture Section ("TIME TO GET WEIRD")
  const [editorialCulture, setEditorialCulture] = useState({
    tag: 'EXCLUSIVE CAPSULE DROP',
    title: 'TIME TO GET WEIRD',
    description: "If found possessed, blame the fashion. Heavyweight boxy silhouettes, brutalist typography, and drops you didn't see coming.",
    buttonText: 'Explore Capsule',
    buttonLink: '/collections/noir-monolith',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=2000&q=85',
    enabled: true,
  });

  // 6. Customer Reviews Carousel ("Let Customers Speak For Us")
  const [customerReviews, setCustomerReviews] = useState({
    enabled: true,
    badgeText: '4.9 / 5.0 (1,280+ Reviews)',
    heading: 'Let Customers Speak For Us',
    subtitle: 'Real feedback from verified streetwear enthusiasts across India',
    reviews: [
      {
        id: 'rev-1',
        name: 'Aman V.',
        city: 'Mumbai',
        rating: 5,
        title: 'Fabric weight is insane',
        review: 'Hands down the best oversized t-shirt I have owned in India. 260 GSM actually feels premium and heavy, collar doesn’t loosen after washing.',
        verified: true,
        date: '14 Oct 2026',
      },
      {
        id: 'rev-2',
        name: 'Rhea S.',
        city: 'Bengaluru',
        rating: 5,
        title: 'Perfect boxy street drape',
        review: 'The fit is super flattering. Dropped shoulders are exact streetwear proportion. Arrived in 2 days in sustainable packaging.',
        verified: true,
        date: '18 Oct 2026',
      },
      {
        id: 'rev-3',
        name: 'Kabir D.',
        city: 'Delhi NCR',
        rating: 5,
        title: 'High-density print quality',
        review: 'Print quality survived multiple machine washes with zero cracks. Absolute luxury at high-street price point.',
        verified: true,
        date: '22 Oct 2026',
      },
    ],
  });

  // 7. Trust Perks Strip
  const [trustPerks, setTrustPerks] = useState({
    enabled: true,
    perks: [
      {
        id: 'perk-1',
        iconName: 'Truck',
        title: 'FREE EXPRESS SHIPPING',
        description: 'On all prepaid orders pan-India with live real-time SMS tracking',
      },
      {
        id: 'perk-2',
        iconName: 'RotateCcw',
        title: '7-DAY HASSLE-FREE RETURNS',
        description: 'Easy door-to-door reverse pickup & instant exchange support',
      },
      {
        id: 'perk-3',
        iconName: 'Sparkles',
        title: 'PREMIUM HEAVYWEIGHT COTTON',
        description: '260–420 GSM custom combed cotton engineered for structural drape',
      },
      {
        id: 'perk-4',
        iconName: 'ShieldCheck',
        title: '100% SECURE CHECKOUT',
        description: 'Encrypted UPI, Cards, NetBanking & Cash On Delivery options',
      },
    ],
  });

  // 8. Announcement Bar Marquee
  const [announcementBar, setAnnouncementBar] = useState({
    enabled: true,
    speed: 'normal' as 'slow' | 'normal' | 'fast',
    items: [
      { id: 't1', text: 'FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,499', badge: 'SHIPPING', link: '/shop', active: true },
      { id: 't2', text: 'USE CODE STREET20 FOR 20% OFF AT CHECKOUT', badge: 'PROMO', link: '/shop', active: true },
      { id: 't3', text: 'NEW ACID WASH DROP NOW LIVE IN CATALOG', badge: 'DROP #04', link: '/new-in', active: true },
    ],
  });

  // Footer config preserve
  const [footerConfig, setFooterConfig] = useState({
    tagline: 'HEAVYWEIGHT STREETWEAR',
    instagramUrl: 'https://instagram.com',
    twitterUrl: 'https://twitter.com',
    youtubeUrl: 'https://youtube.com',
    spotifyUrl: 'https://spotify.com',
    copyrightText: '© 2026 TEESOULZ APPAREL PVT LTD. All Rights Reserved.',
  });

  // Load all CMS data from Supabase
  const loadAllCmsData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: rows, error: fetchErr } = await supabase
        .from('cms_settings')
        .select('*');

      if (rows && rows.length > 0) {
        for (const row of rows) {
          const val: any = row.value || {};
          if (row.key === 'homepage_cms') {
            if (Array.isArray(val.heroSlides) && val.heroSlides.length > 0) {
              setHeroSlides(val.heroSlides);
            }
            if (val.featuredCategoriesEnabled !== undefined) {
              setFeaturedCategoriesEnabled(val.featuredCategoriesEnabled);
            }
            if (Array.isArray(val.featuredCategories) && val.featuredCategories.length > 0) {
              setFeaturedCategories(val.featuredCategories);
            }
            if (val.curatedSections) {
              setCuratedSections((prev) => ({
                newIn: { ...prev.newIn, ...(val.curatedSections.newIn || {}) },
                bestSeller: { ...prev.bestSeller, ...(val.curatedSections.bestSeller || {}) },
                shopWomen: { ...prev.shopWomen, ...(val.curatedSections.shopWomen || {}) },
                shopMen: { ...prev.shopMen, ...(val.curatedSections.shopMen || {}) },
              }));
            }
            if (val.campaignBanner) setCampaignBanner((prev) => ({ ...prev, ...val.campaignBanner }));
            if (val.campaignSlideshow) setCampaignSlideshow((prev) => ({ ...prev, ...val.campaignSlideshow }));
          } else if (row.key === 'website_content') {
            if (val.announcementBar) setAnnouncementBar((prev) => ({ ...prev, ...val.announcementBar }));
            else if (Array.isArray(val.tickerItems)) setAnnouncementBar((prev) => ({ ...prev, items: val.tickerItems }));

            if (val.editorialCulture) setEditorialCulture((prev) => ({ ...prev, ...val.editorialCulture }));

            if (val.customerReviews) {
              setCustomerReviews((prev) => ({ ...prev, ...val.customerReviews }));
            } else if (Array.isArray(val.reviews)) {
              setCustomerReviews((prev) => ({ ...prev, reviews: val.reviews }));
            }

            if (val.trustPerks) {
              if (Array.isArray(val.trustPerks)) {
                setTrustPerks((prev) => ({ ...prev, perks: val.trustPerks }));
              } else {
                setTrustPerks((prev) => ({ ...prev, ...val.trustPerks }));
              }
            }

            if (val.footer) setFooterConfig((prev) => ({ ...prev, ...val.footer }));
          }
        }
      }
    } catch (err: any) {
      console.warn('Could not load CMS settings from DB, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllCmsData();
  }, []);

  // Persistent image upload
  const handleUploadImage = async (
    targetFolder: string,
    file: File,
    onSuccess: (url: string) => void
  ) => {
    const sectionKey = `${targetFolder}-${Date.now()}`;
    setUploadingSection(sectionKey);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${targetFolder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      onSuccess(publicUrl);
      success('Image Uploaded', 'Saved to persistent Supabase Storage bucket.');
    } catch (err: any) {
      error('Upload Failed', err.message || 'Storage upload error');
    } finally {
      setUploadingSection(null);
    }
  };

  // Save all 8 sections simultaneously to Supabase
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const timestamp = new Date().toISOString();

      // 1. Payload for homepage_cms
      const homepagePayload = {
        key: 'homepage_cms',
        value: {
          heroSlides,
          featuredCategories,
          featuredCategoriesEnabled,
          curatedSections,
          campaignBanner,
          campaignSlideshow,
          updatedAt: timestamp,
        },
        updated_at: timestamp,
      };

      // 2. Payload for website_content
      const contentPayload = {
        key: 'website_content',
        value: {
          announcementBar,
          tickerItems: announcementBar.items,
          editorialCulture,
          customerReviews,
          reviews: customerReviews.reviews,
          trustPerks,
          footer: footerConfig,
          updatedAt: timestamp,
        },
        updated_at: timestamp,
      };

      const [res1, res2] = await Promise.all([
        supabase.from('cms_settings').upsert(homepagePayload),
        supabase.from('cms_settings').upsert(contentPayload),
      ]);

      if (res1.error) throw res1.error;
      if (res2.error) throw res2.error;

      await logActivity('ALL_HOMEPAGE_SECTIONS_SAVED', 'cms', 'homepage_cms', {
        heroSlidesCount: heroSlides.length,
        curatedSectionsCount: 4,
        reviewsCount: customerReviews.reviews.length,
      });

      success(
        'Storefront Synchronized!',
        'All 8 homepage sections saved in database & published live to your storefront.'
      );
    } catch (err: any) {
      error('Save failed', err.message || 'Database error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  // Slide helpers
  const handleAddSlide = () => {
    setHeroSlides([
      ...heroSlides,
      {
        id: `slide-${Date.now()}`,
        title: 'NEW CAPSULE DROP',
        subtitle: 'Exclusive limited streetwear silhouettes released today.',
        link: '/shop',
        desktopImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80',
        mobileImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        badge: 'NEW IN',
        buttonText: 'SHOP NOW',
        active: true,
      },
    ]);
  };

  const handleRemoveSlide = (index: number) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== index));
  };

  // Review helpers
  const handleAddReview = () => {
    setCustomerReviews({
      ...customerReviews,
      reviews: [
        ...customerReviews.reviews,
        {
          id: `rev-${Date.now()}`,
          name: 'New Customer',
          city: 'Mumbai',
          rating: 5,
          title: 'Unbelievable fit & quality',
          review: 'Superb quality fabric and the oversized drape is spot on. Loved the rapid delivery!',
          verified: true,
          date: 'Just now',
        },
      ],
    });
  };

  const handleRemoveReview = (index: number) => {
    setCustomerReviews({
      ...customerReviews,
      reviews: customerReviews.reviews.filter((_, i) => i !== index),
    });
  };

  // Ticker helpers
  const handleAddTicker = () => {
    setAnnouncementBar({
      ...announcementBar,
      items: [
        ...announcementBar.items,
        {
          id: `ticker-${Date.now()}`,
          text: 'NEW ANNOUNCEMENT TITLE',
          badge: 'SPECIAL',
          link: '/shop',
          active: true,
        },
      ],
    });
  };

  const handleRemoveTicker = (index: number) => {
    setAnnouncementBar({
      ...announcementBar,
      items: announcementBar.items.filter((_, i) => i !== index),
    });
  };

  const TABS_CONFIG: { id: TabType; label: string; icon: any; count?: number; enabled?: boolean }[] = [
    { id: 'hero', label: '1. Hero Carousel', icon: Sliders, count: heroSlides.length },
    { id: 'categories', label: '2. Category Cards', icon: LayoutGrid, enabled: featuredCategoriesEnabled },
    { id: 'grids', label: '3. Product Grids', icon: ShoppingBag, count: 4 },
    { id: 'banners', label: '4. Promo Banners', icon: Layers, enabled: campaignBanner.enabled },
    { id: 'editorial', label: '5. Editorial Culture', icon: Sparkles, enabled: editorialCulture.enabled },
    { id: 'reviews', label: '6. Customer Reviews', icon: Star, count: customerReviews.reviews.length, enabled: customerReviews.enabled },
    { id: 'trust', label: '7. Trust Perks', icon: ShieldCheck, count: trustPerks.perks.length, enabled: trustPerks.enabled },
    { id: 'ticker', label: '8. Top Announcement', icon: Megaphone, count: announcementBar.items.length, enabled: announcementBar.enabled },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black tracking-tight text-zinc-950 font-sans">
              Homepage Visual Builder
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              8 Live Sections
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Edit, toggle, customize, and reorder all visual content appearing on your storefront homepage.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Live Store</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Syncing Storefront...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TABS_CONFIG.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-black text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
                {t.enabled !== undefined && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      t.enabled ? 'bg-emerald-500' : 'bg-zinc-300'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading homepage configuration from Supabase..." />
      ) : (
        <div className="space-y-6">
          {/* ========================================================
              TAB 1: HERO SLIDES
             ======================================================== */}
          {activeTab === 'hero' && (
            <Card
              title="1. Hero Billboard Carousel"
              subtitle="The high-impact full-bleed banner carousel rotating at the top of your homepage"
              action={
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Slide</span>
                </button>
              }
            >
              <div className="space-y-6">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-4 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-zinc-900 bg-zinc-200 px-2.5 py-0.5 rounded-md">
                          SLIDE #{idx + 1}
                        </span>
                        {slide.badge && <Badge variant="neutral">{slide.badge}</Badge>}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={slide.active}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].active = e.target.checked;
                              setHeroSlides(updated);
                            }}
                            className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <span>Active on Storefront</span>
                        </label>
                        {heroSlides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(idx)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-600 cursor-pointer transition-colors"
                            title="Delete Slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Live Mini Preview */}
                    <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-black text-white p-4 flex flex-col justify-end border border-zinc-300 shadow-inner">
                      {slide.desktopImage && (
                        <Image
                          src={slide.desktopImage}
                          alt={slide.title || 'Hero Slide'}
                          fill
                          className="object-cover opacity-60"
                          unoptimized
                        />
                      )}
                      <div className="relative z-10 max-w-lg">
                        {slide.badge && (
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest font-mono">
                            {slide.badge}
                          </span>
                        )}
                        <h4 className="text-base sm:text-xl font-black uppercase tracking-tight text-white line-clamp-1">
                          {slide.title || 'SLIDE TITLE'}
                        </h4>
                        <p className="text-[11px] text-zinc-300 line-clamp-1">
                          {slide.subtitle || 'Slide subtitle description goes here'}
                        </p>
                        <span className="inline-block mt-2 px-3 py-1 rounded bg-white text-black text-[10px] font-black uppercase">
                          {slide.buttonText || 'SHOP NOW'} →
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Main Heading (Title)
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].title = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-950 focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Badge Tag Text (e.g. DROP #04)
                        </label>
                        <input
                          type="text"
                          value={slide.badge || ''}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].badge = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Subtitle Description
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].subtitle = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={slide.buttonText || ''}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].buttonText = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Button Target Link (e.g. /shop, /new-in)
                        </label>
                        <input
                          type="text"
                          value={slide.link}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].link = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Desktop Image URL (1600x800 recommended)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={slide.desktopImage}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].desktopImage = e.target.value;
                              setHeroSlides(updated);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono focus:border-black focus:outline-hidden"
                          />
                          <label className="px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleUploadImage('homepage/hero', file, (url) => {
                                  const updated = [...heroSlides];
                                  updated[idx].desktopImage = url;
                                  setHeroSlides(updated);
                                });
                                e.target.value = '';
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Mobile Image URL (Optional, 1080x1920)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={slide.mobileImage || ''}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].mobileImage = e.target.value;
                              setHeroSlides(updated);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono focus:border-black focus:outline-hidden"
                          />
                          <label className="px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleUploadImage('homepage/hero-mobile', file, (url) => {
                                  const updated = [...heroSlides];
                                  updated[idx].mobileImage = url;
                                  setHeroSlides(updated);
                                });
                                e.target.value = '';
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 2: FEATURED CATEGORIES (2-COL GALLERY)
             ======================================================== */}
          {activeTab === 'categories' && (
            <Card
              title="2. Category Cards (2-Column Gallery)"
              subtitle="The high-impact 2-box section displaying SHOP MENS and SHOP WOMENS right under the hero"
              action={
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredCategoriesEnabled}
                    onChange={(e) => setFeaturedCategoriesEnabled(e.target.checked)}
                    className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Show on Homepage</span>
                </label>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredCategories.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-4 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-zinc-900 bg-zinc-200 px-2.5 py-0.5 rounded-md">
                        CARD #{idx + 1}: {cat.title}
                      </span>
                    </div>

                    {/* Live Preview */}
                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black text-white p-4 flex flex-col justify-end border border-zinc-300 shadow-inner">
                      {cat.image && (
                        <Image
                          src={cat.image}
                          alt={cat.title || 'Category'}
                          fill
                          className="object-cover opacity-75"
                          unoptimized
                        />
                      )}
                      <div className="relative z-10">
                        <h4 className="text-xl font-black uppercase tracking-tight text-white">
                          {cat.title}
                        </h4>
                        <span className="inline-block mt-2 px-3 py-1 rounded border border-white text-white text-[10px] font-bold uppercase backdrop-blur-xs">
                          {cat.buttonText || 'Explore'} →
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Card Title (Heading)
                        </label>
                        <input
                          type="text"
                          value={cat.title}
                          onChange={(e) => {
                            const updated = [...featuredCategories];
                            updated[idx].title = e.target.value;
                            setFeaturedCategories(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-950 focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Button Text (e.g. Explore)
                        </label>
                        <input
                          type="text"
                          value={cat.buttonText || ''}
                          onChange={(e) => {
                            const updated = [...featuredCategories];
                            updated[idx].buttonText = e.target.value;
                            setFeaturedCategories(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Target Link (href)
                        </label>
                        <input
                          type="text"
                          value={cat.href}
                          onChange={(e) => {
                            const updated = [...featuredCategories];
                            updated[idx].href = e.target.value;
                            setFeaturedCategories(updated);
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Card Photography Image URL
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={cat.image}
                            onChange={(e) => {
                              const updated = [...featuredCategories];
                              updated[idx].image = e.target.value;
                              setFeaturedCategories(updated);
                            }}
                            className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono focus:border-black focus:outline-hidden"
                          />
                          <label className="px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleUploadImage('homepage/categories', file, (url) => {
                                  const updated = [...featuredCategories];
                                  updated[idx].image = url;
                                  setFeaturedCategories(updated);
                                });
                                e.target.value = '';
                              }}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 3: CURATED PRODUCT GRIDS (4 SECTIONS)
             ======================================================== */}
          {activeTab === 'grids' && (
            <Card
              title="3. Curated Homepage Product Sections"
              subtitle="Configure titles, subtitles, display limits, and toggle visibility of the 4 storefront product grids"
            >
              <div className="space-y-6">
                {[
                  { key: 'newIn', name: '1. New In Drops Collection Grid' },
                  { key: 'bestSeller', name: '2. All-Time Bestsellers Collection Grid' },
                  { key: 'shopWomen', name: '3. Women Streetwear Capsule Grid' },
                  { key: 'shopMen', name: '4. Men Heavyweight Collection Grid' },
                ].map(({ key, name }) => {
                  const section = (curatedSections as any)[key];
                  return (
                    <div
                      key={key}
                      className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-4 hover:border-zinc-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900">{name}</span>
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={section.enabled}
                            onChange={(e) => {
                              setCuratedSections({
                                ...curatedSections,
                                [key]: { ...section, enabled: e.target.checked },
                              });
                            }}
                            className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                          />
                          <span>Visible on Homepage</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                              setCuratedSections({
                                ...curatedSections,
                                [key]: { ...section, title: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-950 focus:border-black focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Subtitle Description
                          </label>
                          <input
                            type="text"
                            value={section.subtitle}
                            onChange={(e) =>
                              setCuratedSections({
                                ...curatedSections,
                                [key]: { ...section, subtitle: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            View All Button Text
                          </label>
                          <input
                            type="text"
                            value={section.viewAllText}
                            onChange={(e) =>
                              setCuratedSections({
                                ...curatedSections,
                                [key]: { ...section, viewAllText: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            View All Link
                          </label>
                          <input
                            type="text"
                            value={section.viewAllLink}
                            onChange={(e) =>
                              setCuratedSections({
                                ...curatedSections,
                                [key]: { ...section, viewAllLink: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Max Products Display Limit
                          </label>
                          <input
                            type="number"
                            min={4}
                            max={24}
                            value={section.displayLimit || 8}
                            onChange={(e) =>
                              setCuratedSections({
                                ...curatedSections,
                                [key]: { ...section, displayLimit: parseInt(e.target.value) || 8 },
                              })
                            }
                            className="w-32 px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 4: PROMO & SLIDESHOW BANNERS
             ======================================================== */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              {/* Single Promo Banner */}
              <Card
                title="4A. Mid-Page Single Promo Banner"
                subtitle="Full-bleed visual banner situated between product grids"
                action={
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaignBanner.enabled}
                      onChange={(e) =>
                        setCampaignBanner({ ...campaignBanner, enabled: e.target.checked })
                      }
                      className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Enabled</span>
                  </label>
                }
              >
                {/* Live Preview */}
                <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-black text-white p-6 flex flex-col justify-end border border-zinc-300 shadow-inner mb-4">
                  {campaignBanner.desktopImage && (
                    <Image
                      src={campaignBanner.desktopImage}
                      alt={campaignBanner.title || 'Promo Banner'}
                      fill
                      className="object-cover opacity-70"
                      unoptimized
                    />
                  )}
                  <div className="relative z-10 max-w-md">
                    <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                      {campaignBanner.title}
                    </h4>
                    <p className="text-xs text-zinc-200 mt-1 line-clamp-2">
                      {campaignBanner.subtitle}
                    </p>
                    <span className="inline-block mt-3 px-4 py-1.5 rounded bg-white text-black text-xs font-bold uppercase">
                      {campaignBanner.buttonText || 'VIEW CAPSULE'} →
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Banner Heading
                      </label>
                      <input
                        type="text"
                        value={campaignBanner.title}
                        onChange={(e) =>
                          setCampaignBanner({ ...campaignBanner, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 font-bold focus:border-black focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Action Button Text
                      </label>
                      <input
                        type="text"
                        value={campaignBanner.buttonText}
                        onChange={(e) =>
                          setCampaignBanner({ ...campaignBanner, buttonText: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Subtitle Description
                      </label>
                      <textarea
                        rows={2}
                        value={campaignBanner.subtitle}
                        onChange={(e) =>
                          setCampaignBanner({ ...campaignBanner, subtitle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Target Link (href)
                      </label>
                      <input
                        type="text"
                        value={campaignBanner.buttonLink}
                        onChange={(e) =>
                          setCampaignBanner({ ...campaignBanner, buttonLink: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Photography Image URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={campaignBanner.desktopImage}
                          onChange={(e) =>
                            setCampaignBanner({
                              ...campaignBanner,
                              desktopImage: e.target.value,
                            })
                          }
                          className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 font-mono focus:border-black focus:outline-hidden"
                        />
                        <label className="px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              handleUploadImage('homepage/banner', file, (url) => {
                                setCampaignBanner({ ...campaignBanner, desktopImage: url });
                              });
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Multi-banner Slideshow */}
              <Card
                title="4B. Secondary Multi-Banner Slideshow"
                subtitle="Optional auto-rotating banner carousel situated further down the homepage"
                action={
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaignSlideshow.enabled}
                      onChange={(e) =>
                        setCampaignSlideshow({ ...campaignSlideshow, enabled: e.target.checked })
                      }
                      className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Enabled</span>
                  </label>
                }
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                    <label className="text-xs font-semibold text-zinc-700">
                      Autoplay Interval (milliseconds)
                    </label>
                    <input
                      type="number"
                      min={2000}
                      max={15000}
                      step={500}
                      value={campaignSlideshow.autoplayInterval || 5000}
                      onChange={(e) =>
                        setCampaignSlideshow({
                          ...campaignSlideshow,
                          autoplayInterval: parseInt(e.target.value) || 5000,
                        })
                      }
                      className="w-28 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono"
                    />
                  </div>

                  {campaignSlideshow.slides.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-zinc-800">
                          PROMO SLIDE #{idx + 1}
                        </span>
                        <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={s.active}
                            onChange={(e) => {
                              const updated = [...campaignSlideshow.slides];
                              updated[idx].active = e.target.checked;
                              setCampaignSlideshow({ ...campaignSlideshow, slides: updated });
                            }}
                            className="rounded text-black focus:ring-0"
                          />
                          <span>Active</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Heading"
                          value={s.title}
                          onChange={(e) => {
                            const updated = [...campaignSlideshow.slides];
                            updated[idx].title = e.target.value;
                            setCampaignSlideshow({ ...campaignSlideshow, slides: updated });
                          }}
                          className="px-3 py-1.5 rounded border border-zinc-200 text-xs font-bold"
                        />
                        <input
                          type="text"
                          placeholder="Button text"
                          value={s.buttonText}
                          onChange={(e) => {
                            const updated = [...campaignSlideshow.slides];
                            updated[idx].buttonText = e.target.value;
                            setCampaignSlideshow({ ...campaignSlideshow, slides: updated });
                          }}
                          className="px-3 py-1.5 rounded border border-zinc-200 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Subtitle description"
                          value={s.subtitle}
                          onChange={(e) => {
                            const updated = [...campaignSlideshow.slides];
                            updated[idx].subtitle = e.target.value;
                            setCampaignSlideshow({ ...campaignSlideshow, slides: updated });
                          }}
                          className="md:col-span-2 px-3 py-1.5 rounded border border-zinc-200 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Target link"
                          value={s.buttonLink}
                          onChange={(e) => {
                            const updated = [...campaignSlideshow.slides];
                            updated[idx].buttonLink = e.target.value;
                            setCampaignSlideshow({ ...campaignSlideshow, slides: updated });
                          }}
                          className="px-3 py-1.5 rounded border border-zinc-200 text-xs font-mono"
                        />
                        <input
                          type="url"
                          placeholder="Desktop Image URL"
                          value={s.desktopImage}
                          onChange={(e) => {
                            const updated = [...campaignSlideshow.slides];
                            updated[idx].desktopImage = e.target.value;
                            setCampaignSlideshow({ ...campaignSlideshow, slides: updated });
                          }}
                          className="px-3 py-1.5 rounded border border-zinc-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ========================================================
              TAB 5: EDITORIAL CULTURE STATEMENT ("TIME TO GET WEIRD")
             ======================================================== */}
          {activeTab === 'editorial' && (
            <Card
              title="5. Editorial Culture Manifesto ('TIME TO GET WEIRD')"
              subtitle="The high-fashion editorial statement block located above the reviews on your storefront"
              action={
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editorialCulture.enabled}
                    onChange={(e) =>
                      setEditorialCulture({ ...editorialCulture, enabled: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Show on Homepage</span>
                </label>
              }
            >
              {/* Live Preview */}
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-black text-white p-6 sm:p-10 flex flex-col justify-center border border-zinc-300 shadow-inner mb-6">
                {editorialCulture.image && (
                  <Image
                    src={editorialCulture.image}
                    alt={editorialCulture.title || 'Editorial'}
                    fill
                    className="object-cover opacity-50 filter contrast-125"
                    unoptimized
                  />
                )}
                <div className="relative z-10 max-w-xl">
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-red-500 font-bold block mb-2">
                    {editorialCulture.tag || 'EXCLUSIVE CAPSULE DROP'}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none">
                    {editorialCulture.title || 'TIME TO GET WEIRD'}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4 line-clamp-2">
                    {editorialCulture.description}
                  </p>
                  {editorialCulture.buttonText && (
                    <span className="inline-block px-5 py-2 text-xs font-bold uppercase tracking-wider text-white border border-white rounded-md backdrop-blur-xs">
                      {editorialCulture.buttonText} →
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Header Tag Text (e.g. EXCLUSIVE CAPSULE DROP)
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.tag}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, tag: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Manifesto Title (Heading)
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.title}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-black text-zinc-950 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Editorial Story Description
                    </label>
                    <textarea
                      rows={3}
                      value={editorialCulture.description}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, description: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.buttonText}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, buttonText: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Button Target Link
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.buttonLink}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, buttonLink: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      High-Resolution Editorial Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={editorialCulture.image}
                        onChange={(e) =>
                          setEditorialCulture({ ...editorialCulture, image: e.target.value })
                        }
                        className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:border-black focus:outline-hidden"
                      />
                      <label className="px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            handleUploadImage('homepage/editorial', file, (url) => {
                              setEditorialCulture({ ...editorialCulture, image: url });
                            });
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 6: CUSTOMER REVIEWS CAROUSEL
             ======================================================== */}
          {activeTab === 'reviews' && (
            <Card
              title="6. Customer Reviews Carousel ('Let Customers Speak For Us')"
              subtitle="Social proof & customer testimonial cards displayed directly on the homepage"
              action={
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerReviews.enabled}
                      onChange={(e) =>
                        setCustomerReviews({ ...customerReviews, enabled: e.target.checked })
                      }
                      className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Show on Homepage</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddReview}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Review Card</span>
                  </button>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-zinc-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={customerReviews.heading}
                      onChange={(e) =>
                        setCustomerReviews({ ...customerReviews, heading: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={customerReviews.subtitle}
                      onChange={(e) =>
                        setCustomerReviews({ ...customerReviews, subtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Rating Badge Text
                    </label>
                    <input
                      type="text"
                      value={customerReviews.badgeText}
                      onChange={(e) =>
                        setCustomerReviews({ ...customerReviews, badgeText: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Reviews List */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {customerReviews.reviews.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3 relative hover:border-zinc-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (rev.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-zinc-300'
                              }`}
                            />
                          ))}
                        </div>
                        {customerReviews.reviews.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveReview(idx)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-600 cursor-pointer"
                            title="Remove Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Review Title"
                        value={rev.title}
                        onChange={(e) => {
                          const updated = [...customerReviews.reviews];
                          updated[idx].title = e.target.value;
                          setCustomerReviews({ ...customerReviews, reviews: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs font-bold"
                      />

                      <textarea
                        rows={3}
                        placeholder="Customer review statement"
                        value={rev.review}
                        onChange={(e) => {
                          const updated = [...customerReviews.reviews];
                          updated[idx].review = e.target.value;
                          setCustomerReviews({ ...customerReviews, reviews: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs"
                      />

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-200">
                        <input
                          type="text"
                          placeholder="Customer Name"
                          value={rev.name}
                          onChange={(e) => {
                            const updated = [...customerReviews.reviews];
                            updated[idx].name = e.target.value;
                            setCustomerReviews({ ...customerReviews, reviews: updated });
                          }}
                          className="px-2 py-1 rounded border border-zinc-200 text-xs font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="City (e.g. Mumbai)"
                          value={rev.city}
                          onChange={(e) => {
                            const updated = [...customerReviews.reviews];
                            updated[idx].city = e.target.value;
                            setCustomerReviews({ ...customerReviews, reviews: updated });
                          }}
                          className="px-2 py-1 rounded border border-zinc-200 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 7: TRUST PERKS & GUARANTEES
             ======================================================== */}
          {activeTab === 'trust' && (
            <Card
              title="7. Trust Perks & Guarantee Badges"
              subtitle="The 4 security, shipping, and quality assurance perks situated above the footer"
              action={
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trustPerks.enabled}
                    onChange={(e) =>
                      setTrustPerks({ ...trustPerks, enabled: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Show on Homepage</span>
                </label>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {trustPerks.perks.map((perk, idx) => (
                  <div
                    key={perk.id || idx}
                    className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                        #{idx + 1}
                      </span>
                      <select
                        value={perk.iconName}
                        onChange={(e) => {
                          const updated = [...trustPerks.perks];
                          updated[idx].iconName = e.target.value;
                          setTrustPerks({ ...trustPerks, perks: updated });
                        }}
                        className="px-2 py-1 rounded border border-zinc-200 text-xs bg-white"
                      >
                        <option value="Truck">Truck (Shipping)</option>
                        <option value="RotateCcw">RotateCcw (Returns)</option>
                        <option value="Sparkles">Sparkles (Cotton/Quality)</option>
                        <option value="ShieldCheck">ShieldCheck (Security)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={perk.title}
                        onChange={(e) => {
                          const updated = [...trustPerks.perks];
                          updated[idx].title = e.target.value;
                          setTrustPerks({ ...trustPerks, perks: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-500 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={perk.description}
                        onChange={(e) => {
                          const updated = [...trustPerks.perks];
                          updated[idx].description = e.target.value;
                          setTrustPerks({ ...trustPerks, perks: updated });
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 8: TOP ANNOUNCEMENT MARQUEE TICKER
             ======================================================== */}
          {activeTab === 'ticker' && (
            <Card
              title="8. Storefront Top Announcement Bar"
              subtitle="The scrolling marquee ticker positioned at the very top of your entire storefront"
              action={
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementBar.enabled}
                      onChange={(e) =>
                        setAnnouncementBar({ ...announcementBar, enabled: e.target.checked })
                      }
                      className="rounded text-black focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <span>Enabled</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTicker}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Message</span>
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-200">
                  <label className="text-xs font-semibold text-zinc-700">
                    Marquee Animation Speed:
                  </label>
                  <select
                    value={announcementBar.speed}
                    onChange={(e) =>
                      setAnnouncementBar({
                        ...announcementBar,
                        speed: e.target.value as 'slow' | 'normal' | 'fast',
                      })
                    }
                    className="px-3 py-1 rounded-lg border border-zinc-200 text-xs bg-white"
                  >
                    <option value="slow">Slow Pace</option>
                    <option value="normal">Normal Speed</option>
                    <option value="fast">Fast Scroll</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {announcementBar.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/60 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      <input
                        type="text"
                        placeholder="Badge (e.g. SHIPPING)"
                        value={item.badge}
                        onChange={(e) => {
                          const updated = [...announcementBar.items];
                          updated[idx].badge = e.target.value;
                          setAnnouncementBar({ ...announcementBar, items: updated });
                        }}
                        className="w-28 px-2.5 py-1.5 rounded border border-zinc-200 text-xs font-mono uppercase bg-white font-bold"
                      />

                      <input
                        type="text"
                        placeholder="Announcement message text..."
                        value={item.text}
                        onChange={(e) => {
                          const updated = [...announcementBar.items];
                          updated[idx].text = e.target.value;
                          setAnnouncementBar({ ...announcementBar, items: updated });
                        }}
                        className="flex-1 px-2.5 py-1.5 rounded border border-zinc-200 text-xs bg-white font-medium"
                      />

                      <input
                        type="text"
                        placeholder="Link (e.g. /shop)"
                        value={item.link}
                        onChange={(e) => {
                          const updated = [...announcementBar.items];
                          updated[idx].link = e.target.value;
                          setAnnouncementBar({ ...announcementBar, items: updated });
                        }}
                        className="w-32 px-2.5 py-1.5 rounded border border-zinc-200 text-xs font-mono bg-white"
                      />

                      <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={(e) => {
                            const updated = [...announcementBar.items];
                            updated[idx].active = e.target.checked;
                            setAnnouncementBar({ ...announcementBar, items: updated });
                          }}
                          className="rounded text-black focus:ring-0"
                        />
                        <span>Active</span>
                      </label>

                      {announcementBar.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTicker(idx)}
                          className="p-1 rounded text-zinc-400 hover:text-rose-600 cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Floating Save Bar at Bottom */}
      <div className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-30 bg-zinc-950/95 backdrop-blur-md text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl sm:rounded-full shadow-2xl flex items-center justify-between sm:justify-start gap-3 sm:gap-4 border border-zinc-800">
        <span className="text-xs text-zinc-300 hidden sm:inline">
          Ready to apply changes to your live storefront?
        </span>
        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveAll}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50 w-full sm:w-auto shrink-0 shadow-xs"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Syncing...' : 'Save & Publish Live'}</span>
        </button>
      </div>
    </div>
  );
}
