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
  CheckCircle2,
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

  // Announcement Bar Ticker Items
  const [tickerItems, setTickerItems] = useState<any[]>([
    { id: 't1', text: 'FREE EXPRESS SHIPPING ON ORDERS OVER ₹1,499', badge: 'SHIPPING', active: true },
    { id: 't2', text: 'USE CODE STREET20 FOR 20% OFF AT CHECKOUT', badge: 'PROMO', active: true },
    { id: 't3', text: 'NEW ACID WASH DROP NOW LIVE IN CATALOG', badge: 'DROP #04', active: true },
  ]);

  // Editorial Culture Block
  const [editorialCulture, setEditorialCulture] = useState({
    tag: 'STREET SOUL ARCHIVES',
    title: 'ENGINEERED FOR THE CONCRETE JUNGLE',
    description: 'We reject fleeting trends in favor of enduring silhouettes. Each TEESOULZ piece is created from custom-spun 240 GSM combed cotton.',
    buttonText: 'READ BRAND MANIFESTO',
    buttonLink: '/about',
    enabled: true,
  });

  // Testimonials / Reviews
  const [reviews, setReviews] = useState<any[]>([
    {
      id: 'rev-1',
      name: 'Aarav Mehta',
      city: 'Mumbai',
      rating: 5,
      review: 'The 240 GSM boxy cut is genuinely premium. Fits exactly like high-end Tokyo streetwear.',
      verified: true,
    },
    {
      id: 'rev-2',
      name: 'Rohan Sharma',
      city: 'Delhi',
      rating: 5,
      review: 'Heavyweight collar has not warped after 10 washes. Quality is unreal.',
      verified: true,
    },
  ]);

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
        if (Array.isArray(val.tickerItems)) setTickerItems(val.tickerItems);
        if (val.editorialCulture) setEditorialCulture(val.editorialCulture);
        if (Array.isArray(val.reviews)) setReviews(val.reviews);
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

  const handleSaveContent = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        key: 'website_content',
        value: {
          tickerItems,
          editorialCulture,
          reviews,
          updatedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };

      const { error: saveErr } = await supabase.from('cms_settings').upsert(payload);
      if (saveErr) throw saveErr;

      await logActivity('WEBSITE_CONTENT_SAVED', 'cms', 'website_content', {
        tickersCount: tickerItems.length,
        reviewsCount: reviews.length,
      });

      success('Content Synchronized', 'Website copy and tickers saved to Supabase.');
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
            Website Content &amp; Tickers
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage top announcement marquee lines, brand story storytelling, and customer testimonials
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveContent}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing...' : 'Save & Update Storefront'}</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Fetching website content..." />
      ) : (
        <div className="space-y-8">
          {/* ANNOUNCEMENT TICKER */}
          <Card
            title="Header Announcement Bar Ticker"
            subtitle="Animated kinetic announcement messages displayed above navigation"
            action={
              <button
                type="button"
                onClick={() =>
                  setTickerItems([
                    ...tickerItems,
                    {
                      id: `t-${Date.now()}`,
                      text: 'ENTER NEW PROMOTIONAL ANNOUNCEMENT MESSAGE',
                      badge: 'NEW',
                      active: true,
                    },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline"
              >
                + Add Message
              </button>
            }
          >
            <div className="space-y-3">
              {tickerItems.map((item, i) => (
                <div
                  key={item.id || i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50"
                >
                  <div className="w-28">
                    <input
                      type="text"
                      value={item.badge}
                      placeholder="Badge"
                      onChange={(e) => {
                        const updated = [...tickerItems];
                        updated[i].badge = e.target.value;
                        setTickerItems(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-mono font-bold uppercase text-zinc-950"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.text}
                      placeholder="Ticker announcement text..."
                      onChange={(e) => {
                        const updated = [...tickerItems];
                        updated[i].text = e.target.value;
                        setTickerItems(updated);
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs text-zinc-950"
                    />
                  </div>

                  <label className="flex items-center gap-1.5 text-xs text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => {
                        const updated = [...tickerItems];
                        updated[i].active = e.target.checked;
                        setTickerItems(updated);
                      }}
                      className="rounded text-black focus:ring-0"
                    />
                    <span>Active</span>
                  </label>

                  {tickerItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setTickerItems(tickerItems.filter((_, idx) => idx !== i))
                      }
                      className="p-1 rounded text-zinc-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* EDITORIAL BRAND STORY */}
          <Card
            title="Editorial Culture &amp; Brand Story"
            subtitle="Text block detailing fabric origin, design philosophy and tailoring"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Tag Badge
                </label>
                <input
                  type="text"
                  value={editorialCulture.tag}
                  onChange={(e) =>
                    setEditorialCulture({ ...editorialCulture, tag: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Call to Action Link
                </label>
                <input
                  type="text"
                  value={editorialCulture.buttonLink}
                  onChange={(e) =>
                    setEditorialCulture({
                      ...editorialCulture,
                      buttonLink: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={editorialCulture.title}
                  onChange={(e) =>
                    setEditorialCulture({ ...editorialCulture, title: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-950"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Narrative Paragraph
                </label>
                <textarea
                  rows={3}
                  value={editorialCulture.description}
                  onChange={(e) =>
                    setEditorialCulture({
                      ...editorialCulture,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-950"
                />
              </div>
            </div>
          </Card>

          {/* CUSTOMER REVIEWS */}
          <Card
            title="Customer Reviews &amp; UGC Quotes"
            subtitle="Curated testimonials presented on homepage"
            action={
              <button
                type="button"
                onClick={() =>
                  setReviews([
                    ...reviews,
                    {
                      id: `rev-${Date.now()}`,
                      name: 'Customer Name',
                      city: 'Bengaluru',
                      rating: 5,
                      review: 'Incredible garment silhouette and fabric weight.',
                      verified: true,
                    },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline"
              >
                + Add Review
              </button>
            }
          >
            <div className="space-y-4">
              {reviews.map((rev, i) => (
                <div
                  key={rev.id || i}
                  className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
                    <input
                      type="text"
                      value={rev.name}
                      placeholder="Customer Name"
                      onChange={(e) => {
                        const updated = [...reviews];
                        updated[i].name = e.target.value;
                        setReviews(updated);
                      }}
                      className="px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-bold text-zinc-950"
                    />

                    <input
                      type="text"
                      value={rev.city}
                      placeholder="City (e.g. Mumbai)"
                      onChange={(e) => {
                        const updated = [...reviews];
                        updated[i].city = e.target.value;
                        setReviews(updated);
                      }}
                      className="px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs text-zinc-950"
                    />

                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={rev.rating}
                        onChange={(e) => {
                          const updated = [...reviews];
                          updated[i].rating = parseInt(e.target.value) || 5;
                          setReviews(updated);
                        }}
                        className="w-14 px-2 py-1 rounded border border-zinc-200 bg-white text-xs font-mono font-bold"
                      />
                      <span className="text-zinc-400">Stars</span>
                    </div>

                    <div className="col-span-2 sm:col-span-3">
                      <input
                        type="text"
                        value={rev.review}
                        placeholder="Review quote text..."
                        onChange={(e) => {
                          const updated = [...reviews];
                          updated[i].review = e.target.value;
                          setReviews(updated);
                        }}
                        className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs text-zinc-950"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReviews(reviews.filter((_, idx) => idx !== i))}
                    className="p-1 rounded text-zinc-400 hover:text-rose-600 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
