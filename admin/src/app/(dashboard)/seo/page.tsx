'use client';

import React, { useEffect, useState } from 'react';
import { Search, Save, Upload, Sparkles, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SeoSettingsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    siteTitle: 'TEESOULZ | Heavyweight Streetwear & Boxy Luxury Garments',
    titleTemplate: '%s | TEESOULZ Streetwear',
    metaDescription: 'Shop premium 240 GSM luxury combed cotton boxy tees, oversized streetwear apparel, and curated drop capsules. Free express delivery in India.',
    keywords: 'streetwear india, oversized t-shirts, boxy fit tee, heavyweight cotton, luxury street fashion, drop shoulder',
    ogImageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80',
    googleAnalyticsId: 'G-TEESOULZ2026',
    metaPixelId: '',
  });

  const loadSeo = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'seo_settings')
        .maybeSingle();

      if (data && data.value) {
        setFormData((prev) => ({ ...prev, ...(data.value as any) }));
      }
    } catch (e: any) {
      console.warn('Could not load SEO settings, using defaults:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `seo/og-image-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      setFormData((prev) => ({ ...prev, ogImageUrl: publicUrl }));
      success('OG Image uploaded', 'Share image saved to Supabase storage.');
    } catch (err: any) {
      error('Upload failed', err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const payload = {
        key: 'seo_settings',
        value: {
          ...formData,
          updatedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };

      const { error: saveErr } = await supabase.from('cms_settings').upsert(payload);
      if (saveErr) throw saveErr;

      await logActivity('SEO_SETTINGS_SAVED', 'seo', 'seo_settings');
      success('SEO Saved', 'Storefront search metadata saved in Supabase.');
    } catch (err: any) {
      error('Save failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            SEO &amp; Search Engine Metadata
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure OpenGraph social preview cards, Google indexing titles, and analytics
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveSeo}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing...' : 'Save Metadata'}</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Auditing SEO configuration..." />
      ) : (
        <form onSubmit={handleSaveSeo} className="space-y-6">
          <Card title="Meta Tags &amp; Title Configuration">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Default Site Meta Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.siteTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, siteTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Page Title Template
                </label>
                <input
                  type="text"
                  required
                  value={formData.titleTemplate}
                  onChange={(e) =>
                    setFormData({ ...formData, titleTemplate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, metaDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 font-mono"
                />
              </div>
            </div>
          </Card>

          <Card title="Social OpenGraph Sharing Card">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  OpenGraph Image URL (1200x630px recommended)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.ogImageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, ogImageUrl: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                  />
                  <label className="px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 cursor-pointer flex items-center gap-1.5 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleOgImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Analytics &amp; Conversion Trackers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={formData.googleAnalyticsId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      googleAnalyticsId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Meta Pixel ID
                </label>
                <input
                  type="text"
                  placeholder="XXXXXXXXXXXXXXX"
                  value={formData.metaPixelId}
                  onChange={(e) =>
                    setFormData({ ...formData, metaPixelId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                />
              </div>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
