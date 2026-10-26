'use client';

import React, { useEffect, useState } from 'react';
import {
  Compass,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  MoveVertical,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function NavigationPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [headerLinks, setHeaderLinks] = useState<any[]>([
    { id: 'h1', label: 'NEW IN', href: '/new-in', highlight: true },
    { id: 'h2', label: 'BESTSELLERS', href: '/bestsellers', highlight: false },
    { id: 'h3', label: 'SHOP ALL', href: '/shop', highlight: false },
    { id: 'h4', label: 'COLLECTIONS', href: '/collections', highlight: false },
    { id: 'h5', label: 'SALE', href: '/sale', highlight: true },
  ]);

  const [footerLinks, setFooterLinks] = useState<any[]>([
    { id: 'f1', group: 'HELP', label: 'Track Order', href: '/track-order' },
    { id: 'f2', group: 'HELP', label: 'Shipping & Delivery', href: '/policies' },
    { id: 'f3', group: 'HELP', label: 'Returns & Exchange', href: '/policies' },
    { id: 'f4', group: 'ABOUT', label: 'Brand Manifesto', href: '/about' },
    { id: 'f5', group: 'ABOUT', label: 'Contact Us', href: '/contact' },
    { id: 'f6', group: 'LEGAL', label: 'Privacy Policy', href: '/policies' },
    { id: 'f7', group: 'LEGAL', label: 'Terms of Service', href: '/policies' },
  ]);

  const loadNav = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'navigation_menu')
        .maybeSingle();

      if (data && data.value) {
        const val: any = data.value;
        if (Array.isArray(val.headerLinks)) setHeaderLinks(val.headerLinks);
        if (Array.isArray(val.footerLinks)) setFooterLinks(val.footerLinks);
      }
    } catch (e: any) {
      console.warn('Could not load nav, using defaults:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNav();
  }, []);

  const handleSaveNav = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        key: 'navigation_menu',
        value: {
          headerLinks,
          footerLinks,
          updatedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };

      const { error: saveErr } = await supabase.from('cms_settings').upsert(payload);
      if (saveErr) throw saveErr;

      await logActivity('NAVIGATION_UPDATED', 'cms', 'navigation_menu', {
        headerCount: headerLinks.length,
        footerCount: footerLinks.length,
      });

      success('Navigation Saved', 'Header and footer link structures saved to Supabase.');
    } catch (err: any) {
      error('Failed to save navigation', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Storefront Navigation
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure header desktop/mobile menu links and footer column hierarchies
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveNav}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing...' : 'Save Navigation'}</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading navigation menus..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HEADER NAV */}
          <Card
            title="Header Navbar Menu"
            subtitle="Top storefront navigation items"
            action={
              <button
                type="button"
                onClick={() =>
                  setHeaderLinks([
                    ...headerLinks,
                    {
                      id: `h-${Date.now()}`,
                      label: 'NEW LINK',
                      href: '/shop',
                      highlight: false,
                    },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline"
              >
                + Add Link
              </button>
            }
          >
            <div className="space-y-2.5">
              {headerLinks.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50"
                >
                  <span className="font-mono text-zinc-400 text-xs w-5 text-center">
                    {idx + 1}
                  </span>

                  <input
                    type="text"
                    value={item.label}
                    placeholder="Link Label"
                    onChange={(e) => {
                      const updated = [...headerLinks];
                      updated[idx].label = e.target.value;
                      setHeaderLinks(updated);
                    }}
                    className="w-36 px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-bold text-zinc-950"
                  />

                  <input
                    type="text"
                    value={item.href}
                    placeholder="/shop"
                    onChange={(e) => {
                      const updated = [...headerLinks];
                      updated[idx].href = e.target.value;
                      setHeaderLinks(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-mono text-zinc-950"
                  />

                  <label className="flex items-center gap-1 text-[11px] text-zinc-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.highlight}
                      onChange={(e) => {
                        const updated = [...headerLinks];
                        updated[idx].highlight = e.target.checked;
                        setHeaderLinks(updated);
                      }}
                      className="rounded text-black focus:ring-0"
                    />
                    <span>Badge</span>
                  </label>

                  {headerLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setHeaderLinks(headerLinks.filter((_, i) => i !== idx))
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

          {/* FOOTER NAV */}
          <Card
            title="Footer Column Directories"
            subtitle="Customer support and brand links"
            action={
              <button
                type="button"
                onClick={() =>
                  setFooterLinks([
                    ...footerLinks,
                    {
                      id: `f-${Date.now()}`,
                      group: 'HELP',
                      label: 'FAQ Page',
                      href: '/faq',
                    },
                  ])
                }
                className="text-xs font-semibold text-black hover:underline"
              >
                + Add Footer Link
              </button>
            }
          >
            <div className="space-y-2.5">
              {footerLinks.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50"
                >
                  <input
                    type="text"
                    value={item.group}
                    placeholder="Group (e.g. HELP)"
                    onChange={(e) => {
                      const updated = [...footerLinks];
                      updated[idx].group = e.target.value.toUpperCase();
                      setFooterLinks(updated);
                    }}
                    className="w-24 px-2 py-1.5 rounded border border-zinc-200 bg-white text-[11px] font-mono font-bold text-zinc-600"
                  />

                  <input
                    type="text"
                    value={item.label}
                    placeholder="Label"
                    onChange={(e) => {
                      const updated = [...footerLinks];
                      updated[idx].label = e.target.value;
                      setFooterLinks(updated);
                    }}
                    className="flex-1 px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-bold text-zinc-950"
                  />

                  <input
                    type="text"
                    value={item.href}
                    placeholder="/policies"
                    onChange={(e) => {
                      const updated = [...footerLinks];
                      updated[idx].href = e.target.value;
                      setFooterLinks(updated);
                    }}
                    className="w-32 px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs font-mono text-zinc-950"
                  />

                  {footerLinks.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setFooterLinks(footerLinks.filter((_, i) => i !== idx))
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
        </div>
      )}
    </div>
  );
}
