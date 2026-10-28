'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Save,
  Plus,
  Trash2,
  Megaphone,
  Star,
  Quote,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Layers,
  Sparkles,
  Truck,
  RotateCcw,
  Globe,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function WebsiteContentPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'ticker' | 'manifesto' | 'reviews' | 'trust' | 'footer'>('ticker');
  const [isUploading, setIsUploading] = useState(false);

  // 1. Announcement Bar
  const [announcementBar, setAnnouncementBar] = useState({
    enabled: true,
    speed: 'normal' as 'slow' | 'normal' | 'fast',
    items: [
      { id: 't1', text: 'FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,499', badge: 'SHIPPING', link: '/shop', active: true },
      { id: 't2', text: 'USE CODE STREET20 FOR 20% OFF AT CHECKOUT', badge: 'PROMO', link: '/shop', active: true },
      { id: 't3', text: 'NEW ACID WASH DROP NOW LIVE IN CATALOG', badge: 'DROP #04', link: '/new-in', active: true },
    ],
  });

  // 2. Editorial Culture Manifesto Block
  const [editorialCulture, setEditorialCulture] = useState({
    tag: 'EXCLUSIVE CAPSULE DROP',
    title: 'TIME TO GET WEIRD',
    description: "If found possessed, blame the fashion. Heavyweight boxy silhouettes, brutalist typography, and drops you didn't see coming.",
    buttonText: 'Explore Capsule',
    buttonLink: '/collections/noir-monolith',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=2000&q=85',
    enabled: true,
  });

  // 3. Customer Reviews / Testimonials
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
      },
      {
        id: 'rev-2',
        name: 'Rhea S.',
        city: 'Bengaluru',
        rating: 5,
        title: 'Perfect boxy street drape',
        review: 'The fit is super flattering. Dropped shoulders are exact streetwear proportion. Arrived in 2 days in sustainable packaging.',
        verified: true,
      },
    ],
  });

  // 4. Trust Perks Guarantee Strip
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

  // 5. Footer & Brand Links
  const [footer, setFooter] = useState({
    tagline: 'HEAVYWEIGHT STREETWEAR',
    instagramUrl: 'https://instagram.com',
    twitterUrl: 'https://twitter.com',
    youtubeUrl: 'https://youtube.com',
    spotifyUrl: 'https://spotify.com',
    copyrightText: '© 2026 TEESOULZ APPAREL PVT LTD. All Rights Reserved.',
  });

  const loadContent = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'website_content')
        .maybeSingle();

      if (data && data.value) {
        const val: any = data.value;
        if (val.announcementBar) {
          setAnnouncementBar((prev) => ({ ...prev, ...val.announcementBar }));
        } else if (Array.isArray(val.tickerItems)) {
          setAnnouncementBar((prev) => ({ ...prev, items: val.tickerItems }));
        }

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

        if (val.footer) setFooter((prev) => ({ ...prev, ...val.footer }));
      }
    } catch (e: any) {
      console.warn('Could not load website content, using defaults:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleUploadImage = async (file: File, onSuccess: (url: string) => void) => {
    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `website-content/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      onSuccess(publicUrl);
      success('Image Uploaded', 'Saved to persistent storage.');
    } catch (err: any) {
      error('Upload Failed', err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        key: 'website_content',
        value: {
          announcementBar,
          tickerItems: announcementBar.items,
          editorialCulture,
          customerReviews,
          reviews: customerReviews.reviews,
          trustPerks,
          footer,
          updatedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };

      const { error: saveErr } = await supabase.from('cms_settings').upsert(payload);
      if (saveErr) throw saveErr;

      await logActivity('WEBSITE_CONTENT_SAVED', 'cms', 'website_content', {
        tickersCount: announcementBar.items.length,
        reviewsCount: customerReviews.reviews.length,
      });

      success('Content Synchronized', 'Website content, tickers, manifesto, reviews, and footer saved to Supabase.');
    } catch (err: any) {
      error('Save failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleAddReview = () => {
    setCustomerReviews({
      ...customerReviews,
      reviews: [
        ...customerReviews.reviews,
        {
          id: `rev-${Date.now()}`,
          name: 'Verified Customer',
          city: 'Delhi',
          rating: 5,
          title: 'Exceptional Quality',
          review: '260 GSM fabric has substantial weight and perfect drape. Super happy with the purchase.',
          verified: true,
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Website Content & Copy
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage announcement tickers, brand editorial manifesto, reviews, trust perks, and footer
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveContent}
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
          onClick={() => setActiveTab('ticker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'ticker'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>1. Announcement Bar ({announcementBar.items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manifesto')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'manifesto'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. Editorial Manifesto</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>3. Customer Reviews ({customerReviews.reviews.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trust')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'trust'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>4. Trust Perks Strip</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'footer'
              ? 'bg-black text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>5. Footer & Social Links</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading website content..." />
      ) : (
        <div className="space-y-6">
          {/* ========================================================
              TAB 1: ANNOUNCEMENT BAR & TICKERS
             ======================================================== */}
          {activeTab === 'ticker' && (
            <Card
              title="Header Promotional Announcement Ticker"
              subtitle="The scrolling marquee bar at the very top of the storefront"
              action={
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementBar.enabled}
                      onChange={(e) =>
                        setAnnouncementBar({ ...announcementBar, enabled: e.target.checked })
                      }
                      className="rounded text-black focus:ring-0"
                    />
                    <span>Show Ticker Bar</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTicker}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Ticker Message</span>
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-700">Scrolling Speed:</span>
                  <select
                    value={announcementBar.speed}
                    onChange={(e: any) =>
                      setAnnouncementBar({ ...announcementBar, speed: e.target.value })
                    }
                    className="px-3 py-1 rounded border border-zinc-300 bg-white text-xs font-mono"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal (Default)</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>

                <div className="space-y-3">
                  {announcementBar.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 flex flex-col md:flex-row items-start md:items-center gap-3"
                    >
                      <span className="font-mono text-xs font-bold text-zinc-400 shrink-0">
                        #{idx + 1}
                      </span>

                      <div className="w-32 shrink-0">
                        <input
                          type="text"
                          placeholder="Badge (e.g. PROMO)"
                          value={item.badge || ''}
                          onChange={(e) => {
                            const updated = [...announcementBar.items];
                            updated[idx].badge = e.target.value;
                            setAnnouncementBar({ ...announcementBar, items: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono uppercase text-zinc-950 font-bold"
                        />
                      </div>

                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          placeholder="Announcement message text..."
                          value={item.text}
                          onChange={(e) => {
                            const updated = [...announcementBar.items];
                            updated[idx].text = e.target.value;
                            setAnnouncementBar({ ...announcementBar, items: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-950"
                        />
                      </div>

                      <div className="w-44 shrink-0">
                        <input
                          type="text"
                          placeholder="Link (e.g. /shop)"
                          value={item.link || ''}
                          onChange={(e) => {
                            const updated = [...announcementBar.items];
                            updated[idx].link = e.target.value;
                            setAnnouncementBar({ ...announcementBar, items: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-950"
                        />
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
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
                            onClick={() => {
                              setAnnouncementBar({
                                ...announcementBar,
                                items: announcementBar.items.filter((_, i) => i !== idx),
                              });
                            }}
                            className="p-1 rounded text-zinc-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 2: EDITORIAL MANIFESTO BLOCK
             ======================================================== */}
          {activeTab === 'manifesto' && (
            <Card
              title="Editorial Brand Culture Statement (Manifesto)"
              subtitle="The high-contrast brutalist manifesto block on the homepage"
              action={
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editorialCulture.enabled}
                    onChange={(e) =>
                      setEditorialCulture({ ...editorialCulture, enabled: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Show Manifesto Section</span>
                </label>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Category Tag (e.g. EXCLUSIVE CAPSULE DROP)
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.tag}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, tag: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Main Heading (e.g. TIME TO GET WEIRD)
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.title}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, title: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-950 uppercase"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Manifesto Paragraph
                    </label>
                    <textarea
                      rows={3}
                      value={editorialCulture.description}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, description: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.buttonText}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, buttonText: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Button Link (e.g. /collections/noir-monolith)
                    </label>
                    <input
                      type="text"
                      value={editorialCulture.buttonLink}
                      onChange={(e) =>
                        setEditorialCulture({ ...editorialCulture, buttonLink: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Background Photography Image URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={editorialCulture.image}
                        onChange={(e) =>
                          setEditorialCulture({ ...editorialCulture, image: e.target.value })
                        }
                        className="flex-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                      />
                      <label className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-xs font-semibold text-zinc-800 cursor-pointer flex items-center gap-1.5 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            handleUploadImage(file, (url) => {
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
              TAB 3: CUSTOMER REVIEWS & TESTIMONIALS
             ======================================================== */}
          {activeTab === 'reviews' && (
            <Card
              title="Customer Reviews & Testimonials Carousel"
              subtitle="Social proof testimonials displayed in carousel format"
              action={
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customerReviews.enabled}
                      onChange={(e) =>
                        setCustomerReviews({ ...customerReviews, enabled: e.target.checked })
                      }
                      className="rounded text-black focus:ring-0"
                    />
                    <span>Show Reviews Section</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddReview}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Review</span>
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-zinc-200">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                      Section Badge (e.g. 4.9 / 5.0 (1,280+ Reviews))
                    </label>
                    <input
                      type="text"
                      value={customerReviews.badgeText}
                      onChange={(e) =>
                        setCustomerReviews({ ...customerReviews, badgeText: e.target.value })
                      }
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950 font-semibold"
                    />
                  </div>

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
                      className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-950 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {customerReviews.reviews.map((rev, idx) => (
                    <div
                      key={rev.id || idx}
                      className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-zinc-500">
                          REVIEW #{idx + 1}
                        </span>
                        {customerReviews.reviews.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomerReviews({
                                ...customerReviews,
                                reviews: customerReviews.reviews.filter((_, i) => i !== idx),
                              });
                            }}
                            className="p-1 rounded text-zinc-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-600 mb-0.5">
                            Customer Name
                          </label>
                          <input
                            type="text"
                            value={rev.name}
                            onChange={(e) => {
                              const updated = [...customerReviews.reviews];
                              updated[idx].name = e.target.value;
                              setCustomerReviews({ ...customerReviews, reviews: updated });
                            }}
                            className="w-full px-2.5 py-1 rounded border border-zinc-200 bg-white text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-600 mb-0.5">
                            City / Location
                          </label>
                          <input
                            type="text"
                            value={rev.city || ''}
                            onChange={(e) => {
                              const updated = [...customerReviews.reviews];
                              updated[idx].city = e.target.value;
                              setCustomerReviews({ ...customerReviews, reviews: updated });
                            }}
                            className="w-full px-2.5 py-1 rounded border border-zinc-200 bg-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-600 mb-0.5">
                            Rating (1 to 5 Stars)
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={rev.rating || 5}
                            onChange={(e) => {
                              const updated = [...customerReviews.reviews];
                              updated[idx].rating = parseInt(e.target.value) || 5;
                              setCustomerReviews({ ...customerReviews, reviews: updated });
                            }}
                            className="w-full px-2.5 py-1 rounded border border-zinc-200 bg-white text-xs font-mono"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-semibold text-zinc-600 mb-0.5">
                            Customer Review Text
                          </label>
                          <textarea
                            rows={2}
                            value={rev.review}
                            onChange={(e) => {
                              const updated = [...customerReviews.reviews];
                              updated[idx].review = e.target.value;
                              setCustomerReviews({ ...customerReviews, reviews: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 4: TRUST PERKS STRIP (GUARANTEES)
             ======================================================== */}
          {activeTab === 'trust' && (
            <Card
              title="Trust Perks Strip (Brand Guarantees)"
              subtitle="The 4-column trust guarantee icons situated above the footer"
              action={
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trustPerks.enabled}
                    onChange={(e) =>
                      setTrustPerks({ ...trustPerks, enabled: e.target.checked })
                    }
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Show Trust Strip</span>
                </label>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trustPerks.perks.map((perk, idx) => (
                  <div
                    key={perk.id || idx}
                    className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-zinc-800">
                        PERK #{idx + 1} ({perk.iconName})
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-600 mb-0.5">
                          Perk Title
                        </label>
                        <input
                          type="text"
                          value={perk.title}
                          onChange={(e) => {
                            const updated = [...trustPerks.perks];
                            updated[idx].title = e.target.value;
                            setTrustPerks({ ...trustPerks, perks: updated });
                          }}
                          className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-bold text-zinc-950 uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-600 mb-0.5">
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
                          className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs text-zinc-950"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ========================================================
              TAB 5: FOOTER & SOCIAL LINKS
             ======================================================== */}
          {activeTab === 'footer' && (
            <Card
              title="Footer Brand & Social Links"
              subtitle="Brand tagline, social URLs, and copyright line displayed across the storefront"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={footer.tagline}
                    onChange={(e) => setFooter({ ...footer, tagline: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={footer.instagramUrl}
                    onChange={(e) => setFooter({ ...footer, instagramUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Twitter / X Profile URL
                  </label>
                  <input
                    type="url"
                    value={footer.twitterUrl}
                    onChange={(e) => setFooter({ ...footer, twitterUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={footer.youtubeUrl}
                    onChange={(e) => setFooter({ ...footer, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Spotify Playlist URL
                  </label>
                  <input
                    type="url"
                    value={footer.spotifyUrl}
                    onChange={(e) => setFooter({ ...footer, spotifyUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                    Copyright Notice Text
                  </label>
                  <input
                    type="text"
                    value={footer.copyrightText}
                    onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium"
                  />
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
