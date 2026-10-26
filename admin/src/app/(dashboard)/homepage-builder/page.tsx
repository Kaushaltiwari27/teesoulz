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
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const [heroSlides, setHeroSlides] = useState<any[]>([
    {
      id: 'slide-1',
      title: 'STREET SOUL. RAW LUXURY.',
      subtitle: 'Winter 2026 drop featuring 240 GSM oversized boxy essentials.',
      link: '/shop',
      desktopImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80',
      badge: 'DROP #04 LIVE',
      buttonText: 'SHOP THE DROP',
      active: true,
    },
    {
      id: 'slide-2',
      title: 'HEAVYWEIGHT BOX-FIT ESSENTIALS',
      subtitle: 'Combed cotton tees built for enduring street silhouette.',
      link: '/category/t-shirts',
      desktopImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1600&auto=format&fit=crop&q=80',
      badge: 'BESTSELLER RESTOCK',
      buttonText: 'EXPLORE TEES',
      active: true,
    },
  ]);

  const [campaignBanner, setCampaignBanner] = useState({
    title: 'THE OVERSIZED REVOLUTION',
    subtitle: 'Limited release streetwear capsules engineered with high-density drop stitching.',
    buttonText: 'VIEW THE CAPSULE',
    buttonLink: '/collections',
    desktopImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1400&auto=format&fit=crop&q=80',
    enabled: true,
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
        if (Array.isArray(val.heroSlides)) setHeroSlides(val.heroSlides);
        if (val.campaignBanner) setCampaignBanner(val.campaignBanner);
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

  const handleUploadHeroImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `homepage/hero-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      const updated = [...heroSlides];
      updated[index].desktopImage = publicUrl;
      setHeroSlides(updated);
      success('Image uploaded', 'Updated hero slide image in Supabase persistent storage.');
    } catch (err: any) {
      error('Upload failed', err.message);
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
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
          campaignBanner,
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
      });

      success('Homepage Saved', 'Changes persisted in Supabase database.');
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
        subtitle: 'Exclusive limited pieces released today.',
        link: '/shop',
        desktopImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Homepage Visual Builder
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure primary 3D hero banners, promotional carousels and visual drops
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

      {loading ? (
        <LoadingSpinner label="Loading homepage configuration..." />
      ) : (
        <div className="space-y-8">
          {/* SECTION 1: HERO SLIDES */}
          <Card
            title="Hero Visual Slides"
            subtitle="Full-bleed editorial billboard banners displayed at top of homepage"
            action={
              <button
                type="button"
                onClick={handleAddSlide}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800"
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
                  className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-zinc-900">
                      SLIDE #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
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
                        <span>Active</span>
                      </label>
                      {heroSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlide(idx)}
                          className="p-1 rounded text-zinc-400 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Main Display Heading
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
                        Tag Badge Text
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
                        Subtitle Text
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
                        Button Label
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
                        Target Link
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

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Slide Background Photography URL
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
                          className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-950"
                        />
                        <label className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadingIndex === idx ? 'Uploading...' : 'Upload'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingIndex !== null}
                            onChange={(e) => handleUploadHeroImage(idx, e)}
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

          {/* SECTION 2: EDITORIAL CAMPAIGN BANNER */}
          <Card
            title="Middle Editorial Campaign Banner"
            subtitle="Full-width brand culture banner between product grids"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Banner Title
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

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Campaign Photography URL
                  </label>
                  <input
                    type="url"
                    value={campaignBanner.desktopImage}
                    onChange={(e) =>
                      setCampaignBanner({
                        ...campaignBanner,
                        desktopImage: e.target.value,
                      })
                    }
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950 font-mono"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
