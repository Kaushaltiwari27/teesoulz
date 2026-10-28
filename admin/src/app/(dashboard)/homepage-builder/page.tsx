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
  Image as ImageIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomepageBuilderPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'categories' | 'grids' | 'banners'>('hero');
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

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

  // 4. Mid-page Campaign Banners (Single & Slideshow)
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

  const loadCmsData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: fetchErr } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'homepage_cms')
        .maybeSingle();

      if (data && data.value) {
        const val: any = data.value;
        if (Array.isArray(val.heroSlides) && val.heroSlides.length > 0) setHeroSlides(val.heroSlides);
        if (Array.isArray(val.featuredCategories) && val.featuredCategories.length > 0) setFeaturedCategories(val.featuredCategories);
        if (val.curatedSections) {
          setCuratedSections((prev) => ({
            ...prev,
            newIn: { ...prev.newIn, ...(val.curatedSections.newIn || {}) },
            bestSeller: { ...prev.bestSeller, ...(val.curatedSections.bestSeller || {}) },
            shopWomen: { ...prev.shopWomen, ...(val.curatedSections.shopWomen || {}) },
            shopMen: { ...prev.shopMen, ...(val.curatedSections.shopMen || {}) },
          }));
        }
        if (val.campaignBanner) setCampaignBanner((prev) => ({ ...prev, ...val.campaignBanner }));
        if (val.campaignSlideshow) setCampaignSlideshow((prev) => ({ ...prev, ...val.campaignSlideshow }));
      }
    } catch (err: any) {
      console.warn('Could not load CMS settings from DB, using defaults:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  // Generic image upload handler to persistent Supabase Storage bucket
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

  const handleSaveHomepage = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        key: 'homepage_cms',
        value: {
          heroSlides,
          featuredCategories,
          curatedSections,
          campaignBanner,
          campaignSlideshow,
          updatedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };

      const { error: saveErr } = await supabase
        .from('cms_settings')
        .upsert(payload);

      if (saveErr) throw saveErr;

      await logActivity('HOMEPAGE_CMS_SAVED', 'cms', 'homepage_cms', {
        slidesCount: heroSlides.length,
        featuredCategoriesCount: featuredCategories.length,
      });

      success('Homepage Saved & Published', 'All homepage sections updated in Supabase database & storefront synced.');
    } catch (err: any) {
      error('Save failed', err.message || 'Check database permissions');
    } finally {
      setIsSaving(false);
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Homepage Visual Builder
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Full control over every visual section, image, and copy across the homepage
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveHomepage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing to Supabase...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>1. Hero Carousel ({heroSlides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>2. Category Gallery (2-Col)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('grids')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'grids'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>3. Curated Grids (4 Sections)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('banners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>4. Promo & Slideshow Banners</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading homepage configuration..." />
      ) : (
        <div className="space-y-6">
          {/* ========================================================
              TAB 1: HERO SLIDES
             ======================================================== */}
          {activeTab === 'hero' && (
            <Card
              title="Hero Billboard Slides"
              subtitle="Full-bleed rotating hero banner displayed at the top of the storefront"
              action={
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Hero Slide</span>
                </button>
              }
            >
              <div className="space-y-6">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/60 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-zinc-900 bg-zinc-200 px-2 py-0.5 rounded">
                          SLIDE #{idx + 1}
                        </span>
                        {slide.badge && (
                          <Badge variant="neutral">{slide.badge}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={slide.active}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[idx].active = e.target.checked;
                              setHeroSlides(updated);
                            }}
                            className="rounded text-black focus:ring-0"
                          />
                          <span>Active on Storefront</span>
                        </label>
                        {heroSlides.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlide(idx)}
                            className="p-1 rounded text-zinc-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Slide"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-950"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Badge Tag Text (e.g. DROP 04)
                        </label>
                        <input
                          type="text"
                          value={slide.badge || ''}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].badge = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono"
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
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950"
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
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950"
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
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                          Desktop Image URL
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
                            className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono"
                          />
                          <label className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0">
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
                          Mobile Image URL (Optional)
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
                            className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono"
                          />
                          <label className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0">
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
              title="Featured 2-Column Category Cards"
              subtitle="The high-impact 2-box section displaying SHOP MENS and SHOP WOMENS right under the hero"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredCategories.map((cat, idx) => (
                  <div
                    key={cat.id || idx}
                    className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-zinc-900 bg-zinc-200 px-2.5 py-0.5 rounded">
                        CARD #{idx + 1}: {cat.title}
                      </span>
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
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-950"
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
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950"
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
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950"
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
                            className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950 font-mono"
                          />
                          <label className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0">
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
              title="Curated Homepage Product Sections"
              subtitle="Configure titles, subtitles, display limits and toggle visibility of product grids"
            >
              <div className="space-y-6">
                {[
                  { key: 'newIn', name: '1. New In Drops Collection' },
                  { key: 'bestSeller', name: '2. All-Time Bestsellers Collection' },
                  { key: 'shopWomen', name: '3. Women Streetwear Capsule' },
                  { key: 'shopMen', name: '4. Men Heavyweight Collection' },
                ].map(({ key, name }) => {
                  const section = (curatedSections as any)[key];
                  return (
                    <div
                      key={key}
                      className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-4"
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
                            className="rounded text-black focus:ring-0"
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
                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-950"
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
                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950"
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
                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950"
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
                            className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950"
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
                            className="w-32 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950"
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
                title="Mid-Page Promo Campaign Banner"
                subtitle="Full-bleed visual banner situated between product grids"
                action={
                  <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaignBanner.enabled}
                      onChange={(e) =>
                        setCampaignBanner({ ...campaignBanner, enabled: e.target.checked })
                      }
                      className="rounded text-black focus:ring-0"
                    />
                    <span>Enabled</span>
                  </label>
                }
              >
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
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950 font-bold"
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
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950"
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
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950"
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
                        className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
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
                          className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950 font-mono"
                        />
                        <label className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
