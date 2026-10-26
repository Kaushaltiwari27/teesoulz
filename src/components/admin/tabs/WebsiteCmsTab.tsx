'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sliders,
  Sparkles,
  Plus,
  Trash2,
  Save,
  Check,
  Eye,
  RefreshCw,
  Tag,
  Star,
  Layers,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { WebsiteCmsData, HeroSlideConfig, CustomerReviewItem } from '@/types/cms';
import { Coupon } from '@/types';

interface WebsiteCmsTabProps {
  cms: WebsiteCmsData;
  onUpdateCms: (updater: (prev: WebsiteCmsData) => WebsiteCmsData) => void;
  onResetDefaults: () => void;
}

type CmsSubSection =
  | 'announcement'
  | 'hero'
  | 'categories'
  | 'curated'
  | 'campaign'
  | 'editorial'
  | 'reviews'
  | 'perks'
  | 'coupons';

export default function WebsiteCmsTab({
  cms,
  onUpdateCms,
  onResetDefaults,
}: WebsiteCmsTabProps) {
  const [activeSection, setActiveSection] = useState<CmsSubSection>('announcement');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const triggerSuccess = (msg = 'Changes saved to live storefront!') => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // 1. Announcement Bar Handlers
  const handleToggleAnnouncement = () => {
    onUpdateCms((prev) => ({
      ...prev,
      announcementBar: {
        ...prev.announcementBar,
        enabled: !prev.announcementBar.enabled,
      },
    }));
    triggerSuccess();
  };

  const handleAddTickerItem = () => {
    onUpdateCms((prev) => ({
      ...prev,
      announcementBar: {
        ...prev.announcementBar,
        items: [
          ...prev.announcementBar.items,
          {
            id: `ticker-${Date.now()}`,
            text: 'NEW STREETWEAR DROP LIVE',
            badge: 'HOT',
            link: '/shop',
            active: true,
          },
        ],
      },
    }));
    triggerSuccess('Added new marquee ticker item.');
  };

  const handleUpdateTickerItem = (idx: number, field: string, value: any) => {
    onUpdateCms((prev) => {
      const items = [...prev.announcementBar.items];
      items[idx] = { ...items[idx], [field]: value };
      return {
        ...prev,
        announcementBar: {
          ...prev.announcementBar,
          items,
        },
      };
    });
  };

  const handleDeleteTickerItem = (idx: number) => {
    onUpdateCms((prev) => ({
      ...prev,
      announcementBar: {
        ...prev.announcementBar,
        items: prev.announcementBar.items.filter((_, i) => i !== idx),
      },
    }));
    triggerSuccess('Ticker item removed.');
  };

  // 2. Hero Slide Handlers
  const handleAddHeroSlide = () => {
    onUpdateCms((prev) => ({
      ...prev,
      heroSlides: [
        ...prev.heroSlides,
        {
          id: `slide-${Date.now()}`,
          title: 'NEW CAPSULE DROP // 2026',
          subtitle: 'HEAVYWEIGHT OVERSIZED ESSENTIALS',
          link: '/shop',
          desktopImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2800&h=1400&q=90',
          mobileImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1080&h=1920&q=90',
          badge: 'NEW DROP',
          buttonText: 'EXPLORE DROP',
          active: true,
        },
      ],
    }));
    triggerSuccess('Added new hero slide.');
  };

  const handleUpdateHeroSlide = (idx: number, field: string, value: any) => {
    onUpdateCms((prev) => {
      const slides = [...prev.heroSlides];
      slides[idx] = { ...slides[idx], [field]: value };
      return { ...prev, heroSlides: slides };
    });
  };

  const handleDeleteHeroSlide = (idx: number) => {
    onUpdateCms((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== idx),
    }));
    triggerSuccess('Hero slide removed.');
  };

  // 3. Featured Categories Handlers
  const handleUpdateCategoryCard = (idx: number, field: string, value: string) => {
    onUpdateCms((prev) => {
      const cats = [...prev.featuredCategories];
      cats[idx] = { ...cats[idx], [field]: value };
      return { ...prev, featuredCategories: cats };
    });
  };

  // 4. Curated Sections Handlers
  const handleUpdateCuratedSection = (
    key: 'newIn' | 'bestSeller' | 'shopWomen' | 'shopMen',
    field: string,
    value: any
  ) => {
    onUpdateCms((prev) => ({
      ...prev,
      curatedSections: {
        ...prev.curatedSections,
        [key]: {
          ...prev.curatedSections[key],
          [field]: value,
        },
      },
    }));
  };

  // 5. Campaign Banner Handlers
  const handleUpdateSingleBanner = (field: string, value: any) => {
    onUpdateCms((prev) => ({
      ...prev,
      campaignBanners: {
        ...prev.campaignBanners,
        singleBanner: {
          ...prev.campaignBanners.singleBanner,
          [field]: value,
        },
      },
    }));
  };

  // 6. Editorial Culture Handlers
  const handleUpdateEditorial = (field: string, value: any) => {
    onUpdateCms((prev) => ({
      ...prev,
      editorialCulture: {
        ...prev.editorialCulture,
        [field]: value,
      },
    }));
  };

  // 7. Customer Reviews Handlers
  const handleAddReview = () => {
    onUpdateCms((prev) => ({
      ...prev,
      customerReviews: {
        ...prev.customerReviews,
        reviews: [
          {
            id: `rev-${Date.now()}`,
            name: 'New Verified Buyer',
            city: 'Mumbai',
            rating: 5,
            title: 'Top Tier Streetwear Quality',
            review: 'Unbelievable drape and thick GSM fabric. Worth every rupee.',
            product: 'Noir Heavyweight Oversized Tee',
            date: 'Just now',
            verified: true,
          },
          ...prev.customerReviews.reviews,
        ],
      },
    }));
    triggerSuccess('New customer review added.');
  };

  const handleUpdateReview = (idx: number, field: string, value: any) => {
    onUpdateCms((prev) => {
      const reviews = [...prev.customerReviews.reviews];
      reviews[idx] = { ...reviews[idx], [field]: value };
      return {
        ...prev,
        customerReviews: {
          ...prev.customerReviews,
          reviews,
        },
      };
    });
  };

  const handleDeleteReview = (idx: number) => {
    onUpdateCms((prev) => ({
      ...prev,
      customerReviews: {
        ...prev.customerReviews,
        reviews: prev.customerReviews.reviews.filter((_, i) => i !== idx),
      },
    }));
    triggerSuccess('Customer review deleted.');
  };

  // 8. Trust Perks Handlers
  const handleUpdatePerk = (idx: number, field: string, value: any) => {
    onUpdateCms((prev) => {
      const perks = [...prev.trustPerks.perks];
      perks[idx] = { ...perks[idx], [field]: value };
      return {
        ...prev,
        trustPerks: {
          ...prev.trustPerks,
          perks,
        },
      };
    });
  };

  // 9. Coupon Handlers
  const handleAddCoupon = () => {
    onUpdateCms((prev) => ({
      ...prev,
      coupons: [
        {
          code: `DROP${Math.floor(10 + Math.random() * 90)}`,
          discountType: 'percentage',
          discountValue: 15,
          minOrderValue: 999,
          description: 'Special street drop promo discount',
        },
        ...prev.coupons,
      ],
    }));
    triggerSuccess('New discount coupon created.');
  };

  const handleUpdateCoupon = (idx: number, field: string, value: any) => {
    onUpdateCms((prev) => {
      const coupons = [...prev.coupons];
      coupons[idx] = { ...coupons[idx], [field]: value };
      return { ...prev, coupons };
    });
  };

  const handleDeleteCoupon = (idx: number) => {
    onUpdateCms((prev) => ({
      ...prev,
      coupons: prev.coupons.filter((_, i) => i !== idx),
    }));
    triggerSuccess('Coupon removed.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
            Website Sections &amp; CMS Manager
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Full control over every single banner, slide, category card, review, and promo code on teesoulz.in.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessMsg && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>{saveSuccessMsg}</span>
            </span>
          )}
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3 py-2 rounded bg-[#1e1e26] hover:bg-[#282834] text-zinc-400 hover:text-white text-xs font-mono tracking-wider transition-colors cursor-pointer"
            title="Reset all sections to default brand settings"
          >
            RESET DEFAULTS
          </button>
        </div>
      </div>

      {/* Section Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
        {[
          { id: 'announcement', label: '1. Marquee Ticker' },
          { id: 'hero', label: '2. Hero Slides' },
          { id: 'categories', label: '3. 2-Col Categories' },
          { id: 'curated', label: '4. Product Grids' },
          { id: 'campaign', label: '5. Campaign Banners' },
          { id: 'editorial', label: '6. Editorial Statement' },
          { id: 'reviews', label: '7. Customer Reviews' },
          { id: 'perks', label: '8. Trust Perks' },
          { id: 'coupons', label: '9. Promo Coupons' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSection(tab.id as CmsSubSection)}
            className={`px-3 py-2 rounded-[4px] whitespace-nowrap transition-colors cursor-pointer border ${
              activeSection === tab.id
                ? 'bg-white text-black font-bold border-white'
                : 'bg-[#121217] text-zinc-400 hover:text-white border-[#24242e]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= SECTION 1: ANNOUNCEMENT BAR ================= */}
      {activeSection === 'announcement' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222228]">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Top Announcement Marquee Bar
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Infinite animated ticker displayed at the very top of every storefront page.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs">
                <input
                  type="checkbox"
                  checked={cms.announcementBar.enabled}
                  onChange={handleToggleAnnouncement}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                />
                <span className="text-zinc-200 font-bold">
                  {cms.announcementBar.enabled ? 'BAR ENABLED' : 'BAR DISABLED'}
                </span>
              </label>

              <button
                type="button"
                onClick={handleAddTickerItem}
                className="px-3 py-1.5 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD TICKER MSG</span>
              </button>
            </div>
          </div>

          {/* Ticker Items List */}
          <div className="space-y-3">
            {cms.announcementBar.items.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded bg-[#16161c] border border-[#25252e] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center font-mono text-xs"
              >
                <div className="sm:col-span-5">
                  <label className="text-[10px] text-zinc-400 block mb-1">
                    Announcement Message
                  </label>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleUpdateTickerItem(idx, 'text', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white px-2.5 py-1.5 rounded focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] text-zinc-400 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. FREE"
                    value={item.badge}
                    onChange={(e) => handleUpdateTickerItem(idx, 'badge', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white px-2.5 py-1.5 rounded focus:outline-hidden uppercase"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="text-[10px] text-zinc-400 block mb-1">Target Link</label>
                  <input
                    type="text"
                    placeholder="/shop"
                    value={item.link}
                    onChange={(e) => handleUpdateTickerItem(idx, 'link', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white px-2.5 py-1.5 rounded focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-4 sm:pt-0">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-zinc-400">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => handleUpdateTickerItem(idx, 'active', e.target.checked)}
                      className="rounded border-zinc-700 bg-zinc-900"
                    />
                    <span>Active</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteTickerItem(idx)}
                    className="p-1.5 rounded hover:bg-red-950/50 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 2: HERO SLIDES ================= */}
      {activeSection === 'hero' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222228]">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Hero 5-Second Carousel Slides ({cms.heroSlides.length})
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Full-bleed Bonkers Corner style auto-rotating campaign banners.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddHeroSlide}
              className="px-4 py-2 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>ADD SLIDE</span>
            </button>
          </div>

          <div className="space-y-4">
            {cms.heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="p-5 rounded bg-[#16161c] border border-[#25252e] space-y-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#24242e] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                      SLIDE #{idx + 1}
                    </span>
                    <span className="font-bold text-white uppercase">{slide.title}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                      <input
                        type="checkbox"
                        checked={slide.active}
                        onChange={(e) => handleUpdateHeroSlide(idx, 'active', e.target.checked)}
                        className="rounded border-zinc-700 bg-zinc-900"
                      />
                      <span>Active</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleDeleteHeroSlide(idx)}
                      className="p-1.5 rounded hover:bg-red-950 text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Main Headline Title
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateHeroSlide(idx, 'title', e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Subtitle / Dropped Spec
                    </label>
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) => handleUpdateHeroSlide(idx, 'subtitle', e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      CTA Button Text &amp; Destination Link
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Button Text (e.g. EXPLORE DROP)"
                        value={slide.buttonText || 'EXPLORE DROP'}
                        onChange={(e) =>
                          handleUpdateHeroSlide(idx, 'buttonText', e.target.value)
                        }
                        className="bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="/new-in"
                        value={slide.link}
                        onChange={(e) => handleUpdateHeroSlide(idx, 'link', e.target.value)}
                        className="bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Badge Text (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="DROP 04"
                      value={slide.badge || ''}
                      onChange={(e) => handleUpdateHeroSlide(idx, 'badge', e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Desktop Panoramic Image URL
                    </label>
                    <input
                      type="url"
                      value={slide.desktopImage}
                      onChange={(e) =>
                        handleUpdateHeroSlide(idx, 'desktopImage', e.target.value)
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Mobile Story Image URL
                    </label>
                    <input
                      type="url"
                      value={slide.mobileImage}
                      onChange={(e) =>
                        handleUpdateHeroSlide(idx, 'mobileImage', e.target.value)
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden text-[11px]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 3: FEATURED 2-COL CATEGORIES ================= */}
      {activeSection === 'categories' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="pb-4 border-b border-[#222228]">
            <h3 className="text-sm font-bold font-mono uppercase text-white">
              2-Column Horizontal Categories (Shop Mens &amp; Shop Womens)
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Side-by-side portrait banner cards displayed directly under the Hero.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cms.featuredCategories.map((cat, idx) => (
              <div
                key={cat.id || idx}
                className="p-5 rounded bg-[#16161c] border border-[#25252e] space-y-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#24242e] pb-3">
                  <span className="font-bold text-white uppercase text-sm">
                    {cat.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded font-bold">
                    COLUMN #{idx + 1}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={cat.title}
                    onChange={(e) => handleUpdateCategoryCard(idx, 'title', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={cat.buttonText || 'Explore'}
                      onChange={(e) =>
                        handleUpdateCategoryCard(idx, 'buttonText', e.target.value)
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Link</label>
                    <input
                      type="text"
                      value={cat.href}
                      onChange={(e) => handleUpdateCategoryCard(idx, 'href', e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Image URL</label>
                  <input
                    type="url"
                    value={cat.image}
                    onChange={(e) => handleUpdateCategoryCard(idx, 'image', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden text-[11px]"
                  />
                </div>

                {cat.image && (
                  <div className="relative aspect-[16/9] rounded overflow-hidden bg-black border border-[#2c2c38]">
                    <Image
                      src={cat.image}
                      alt={cat.alt || cat.title}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 4: CURATED PRODUCT GRIDS ================= */}
      {activeSection === 'curated' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="pb-4 border-b border-[#222228]">
            <h3 className="text-sm font-bold font-mono uppercase text-white">
              Curated Homepage Collections (Headings &amp; Limits)
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Customize the section headlines, subheads, view all links, and item limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {(
              [
                { key: 'newIn', name: 'Section 1: New In' },
                { key: 'bestSeller', name: 'Section 2: Best Seller' },
                { key: 'shopWomen', name: 'Section 3: Shop Women' },
                { key: 'shopMen', name: 'Section 4: Shop Men' },
              ] as const
            ).map(({ key, name }) => {
              const sec = cms.curatedSections[key];
              return (
                <div
                  key={key}
                  className="p-5 rounded bg-[#16161c] border border-[#25252e] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#24242e] pb-2">
                    <span className="font-bold text-white uppercase">{name}</span>
                    <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                      <input
                        type="checkbox"
                        checked={sec.enabled}
                        onChange={(e) =>
                          handleUpdateCuratedSection(key, 'enabled', e.target.checked)
                        }
                        className="rounded border-zinc-700 bg-zinc-900"
                      />
                      <span>Enabled</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) =>
                        handleUpdateCuratedSection(key, 'title', e.target.value)
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={sec.subtitle}
                      onChange={(e) =>
                        handleUpdateCuratedSection(key, 'subtitle', e.target.value)
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">
                        View All Text
                      </label>
                      <input
                        type="text"
                        value={sec.viewAllText}
                        onChange={(e) =>
                          handleUpdateCuratedSection(key, 'viewAllText', e.target.value)
                        }
                        className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">
                        Display Limit
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="24"
                        value={sec.displayLimit || 8}
                        onChange={(e) =>
                          handleUpdateCuratedSection(
                            key,
                            'displayLimit',
                            Number(e.target.value) || 8
                          )
                        }
                        className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= SECTION 5: CAMPAIGN BANNERS ================= */}
      {activeSection === 'campaign' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="pb-4 border-b border-[#222228]">
            <h3 className="text-sm font-bold font-mono uppercase text-white">
              Mid-Page Streetwear Campaign Banners
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Mid-page hero banner &amp; rotating collection lookbook slides.
            </p>
          </div>

          {/* Single Promo Banner */}
          <div className="p-5 rounded bg-[#16161c] border border-[#25252e] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#24242e] pb-2">
              <span className="font-bold text-white uppercase text-sm">
                Single Promo Campaign Banner
              </span>
              <label className="flex items-center gap-1.5 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={cms.campaignBanners.singleBanner.enabled}
                  onChange={(e) => handleUpdateSingleBanner('enabled', e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900"
                />
                <span>Enabled</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Banner Title</label>
                <input
                  type="text"
                  value={cms.campaignBanners.singleBanner.title}
                  onChange={(e) => handleUpdateSingleBanner('title', e.target.value)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Banner Subtitle
                </label>
                <input
                  type="text"
                  value={cms.campaignBanners.singleBanner.subtitle}
                  onChange={(e) => handleUpdateSingleBanner('subtitle', e.target.value)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Button Text &amp; Link
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cms.campaignBanners.singleBanner.buttonText}
                    onChange={(e) => handleUpdateSingleBanner('buttonText', e.target.value)}
                    className="bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                  />
                  <input
                    type="text"
                    value={cms.campaignBanners.singleBanner.buttonLink}
                    onChange={(e) => handleUpdateSingleBanner('buttonLink', e.target.value)}
                    className="bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Desktop Image URL
                </label>
                <input
                  type="url"
                  value={cms.campaignBanners.singleBanner.desktopImage}
                  onChange={(e) =>
                    handleUpdateSingleBanner('desktopImage', e.target.value)
                  }
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 6: EDITORIAL STATEMENT ================= */}
      {activeSection === 'editorial' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222228]">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Editorial Streetwear Culture Statement (&ldquo;TIME TO GET WEIRD&rdquo;)
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                The brand manifesto section with high-contrast graphic image &amp; capsule CTA.
              </p>
            </div>

            <label className="flex items-center gap-1.5 cursor-pointer font-mono text-xs">
              <input
                type="checkbox"
                checked={cms.editorialCulture.enabled}
                onChange={(e) => handleUpdateEditorial('enabled', e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900"
              />
              <span className="text-zinc-200 font-bold">Enabled</span>
            </label>
          </div>

          <div className="p-5 rounded bg-[#16161c] border border-[#25252e] space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Eyebrow Tag (e.g. EXCLUSIVE CAPSULE DROP)
                </label>
                <input
                  type="text"
                  value={cms.editorialCulture.tag}
                  onChange={(e) => handleUpdateEditorial('tag', e.target.value)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={cms.editorialCulture.title}
                  onChange={(e) => handleUpdateEditorial('title', e.target.value)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">
                Manifesto Description Text
              </label>
              <textarea
                rows={3}
                value={cms.editorialCulture.description}
                onChange={(e) => handleUpdateEditorial('description', e.target.value)}
                className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2.5 rounded focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Button Text</label>
                <input
                  type="text"
                  value={cms.editorialCulture.buttonText}
                  onChange={(e) => handleUpdateEditorial('buttonText', e.target.value)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Button Link</label>
                <input
                  type="text"
                  value={cms.editorialCulture.buttonLink}
                  onChange={(e) => handleUpdateEditorial('buttonLink', e.target.value)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">
                  Background Editorial Image URL
                </label>
                <input
                  type="url"
                  value={cms.editorialCulture.image}
                  onChange={(e) => handleUpdateEditorial('image', e.target.value)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 7: CUSTOMER REVIEWS ================= */}
      {activeSection === 'reviews' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222228]">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Customer Reviews &amp; Testimonials ({cms.customerReviews.reviews.length})
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Manage verified reviews, ratings, and customer feedback cards.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddReview}
              className="px-4 py-2 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>ADD REVIEW</span>
            </button>
          </div>

          <div className="space-y-4">
            {cms.customerReviews.reviews.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className="p-4 rounded bg-[#16161c] border border-[#25252e] space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#24242e] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rev.name}</span>
                    <span className="text-[10px] text-zinc-400">({rev.city})</span>
                    <div className="flex items-center text-amber-400 text-xs ml-2">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReview(idx)}
                    className="p-1.5 rounded hover:bg-red-950 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={rev.name}
                      onChange={(e) => handleUpdateReview(idx, 'name', e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">City</label>
                    <input
                      type="text"
                      value={rev.city}
                      onChange={(e) => handleUpdateReview(idx, 'city', e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Purchased Product
                    </label>
                    <input
                      type="text"
                      value={rev.product}
                      onChange={(e) => handleUpdateReview(idx, 'product', e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Review Title</label>
                  <input
                    type="text"
                    value={rev.title}
                    onChange={(e) => handleUpdateReview(idx, 'title', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Review Body</label>
                  <textarea
                    rows={2}
                    value={rev.review}
                    onChange={(e) => handleUpdateReview(idx, 'review', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 8: TRUST PERKS ================= */}
      {activeSection === 'perks' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="pb-4 border-b border-[#222228]">
            <h3 className="text-sm font-bold font-mono uppercase text-white">
              Trust &amp; Guarantee Perks Strip (4 Cards)
            </h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              The 4 brand assurances displayed above the footer across the website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cms.trustPerks.perks.map((perk, idx) => (
              <div
                key={perk.id || idx}
                className="p-4 rounded bg-[#16161c] border border-[#25252e] space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#24242e] pb-2">
                  <span className="font-bold text-white uppercase">PERK #{idx + 1}</span>
                  <select
                    value={perk.iconName}
                    onChange={(e) => handleUpdatePerk(idx, 'iconName', e.target.value)}
                    className="bg-[#111116] border border-[#2c2c38] text-zinc-300 text-[10px] px-2 py-1 rounded"
                  >
                    <option value="Truck">Truck (Shipping)</option>
                    <option value="RotateCcw">RotateCcw (Returns)</option>
                    <option value="Sparkles">Sparkles (Cotton)</option>
                    <option value="ShieldCheck">ShieldCheck (Security)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Perk Title</label>
                  <input
                    type="text"
                    value={perk.title}
                    onChange={(e) => handleUpdatePerk(idx, 'title', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">
                    Perk Description
                  </label>
                  <input
                    type="text"
                    value={perk.description}
                    onChange={(e) => handleUpdatePerk(idx, 'description', e.target.value)}
                    className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SECTION 9: PROMO COUPONS ================= */}
      {activeSection === 'coupons' && (
        <div className="p-6 rounded-[6px] bg-[#101014] border border-[#222228] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#222228]">
            <div>
              <h3 className="text-sm font-bold font-mono uppercase text-white">
                Store Promo Discount Codes ({cms.coupons.length})
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Active coupons applicable on checkout and cart.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddCoupon}
              className="px-4 py-2 rounded bg-white text-black hover:bg-zinc-200 text-xs font-mono font-bold cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>NEW COUPON</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cms.coupons.map((coupon, idx) => (
              <div
                key={coupon.code || idx}
                className="p-4 rounded bg-[#16161c] border border-[#25252e] space-y-3 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#24242e] pb-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-white uppercase text-sm">
                      {coupon.code}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCoupon(idx)}
                    className="p-1.5 rounded hover:bg-red-950 text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Code</label>
                    <input
                      type="text"
                      value={coupon.code}
                      onChange={(e) =>
                        handleUpdateCoupon(idx, 'code', e.target.value.toUpperCase())
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Type</label>
                    <select
                      value={coupon.discountType}
                      onChange={(e) =>
                        handleUpdateCoupon(idx, 'discountType', e.target.value)
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Flat (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Value ({coupon.discountType === 'percentage' ? '%' : '₹'})
                    </label>
                    <input
                      type="number"
                      value={coupon.discountValue}
                      onChange={(e) =>
                        handleUpdateCoupon(
                          idx,
                          'discountValue',
                          Number(e.target.value) || 0
                        )
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Min Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={coupon.minOrderValue}
                      onChange={(e) =>
                        handleUpdateCoupon(
                          idx,
                          'minOrderValue',
                          Number(e.target.value) || 0
                        )
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">
                      Description Note
                    </label>
                    <input
                      type="text"
                      value={coupon.description}
                      onChange={(e) =>
                        handleUpdateCoupon(idx, 'description', e.target.value)
                      }
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white p-2 rounded focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
