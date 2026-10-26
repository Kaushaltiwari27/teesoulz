'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, Shield, Store, CreditCard, Truck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function StoreSettingsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    storeName: 'TEESOULZ STREETWEAR',
    supportEmail: 'care@teesoulz.com',
    supportPhone: '+91 98765 43210',
    warehouseAddress: 'Building 4, Industrial Textile Hub, Mumbai, Maharashtra 400013',
    currency: 'INR (₹)',
    defaultShippingFee: '99',
    freeShippingThreshold: '1499',
    enableCOD: true,
    enableUPI: true,
  });

  const loadSettings = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('cms_settings')
        .select('*')
        .eq('key', 'store_settings')
        .maybeSingle();

      if (data && data.value) {
        setFormData((prev) => ({ ...prev, ...(data.value as any) }));
      }
    } catch (e: any) {
      console.warn('Could not load settings, using defaults:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const payload = {
        key: 'store_settings',
        value: {
          ...formData,
          updatedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };

      const { error: saveErr } = await supabase.from('cms_settings').upsert(payload);
      if (saveErr) throw saveErr;

      await logActivity('STORE_SETTINGS_SAVED', 'settings', 'store_settings');
      success('Settings updated', 'Store configuration saved to Supabase.');
    } catch (err: any) {
      error('Failed to save settings', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Store Identity &amp; Operations
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure contact parameters, shipping tiers, and checkout options
          </p>
        </div>

        <button
          type="button"
          disabled={isSaving}
          onClick={handleSaveSettings}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Syncing...' : 'Save Settings'}</span>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Auditing store settings..." />
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <Card title="Brand &amp; Support Identity">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Store Public Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) =>
                    setFormData({ ...formData, storeName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Customer Care Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.supportEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, supportEmail: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Helpline / WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.supportPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, supportPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Warehouse Dispatch Address
                </label>
                <input
                  type="text"
                  value={formData.warehouseAddress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      warehouseAddress: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950"
                />
              </div>
            </div>
          </Card>

          <Card title="Shipping &amp; Checkout Logic">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Standard Flat Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.defaultShippingFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defaultShippingFee: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Free Express Shipping Cart Threshold (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.freeShippingThreshold}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      freeShippingThreshold: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono font-bold text-zinc-950"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-4 border-t border-zinc-100 mt-4">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableUPI}
                  onChange={(e) =>
                    setFormData({ ...formData, enableUPI: e.target.checked })
                  }
                  className="rounded text-black focus:ring-0"
                />
                <span>Enable UPI / Card Instant Payments</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-zinc-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableCOD}
                  onChange={(e) =>
                    setFormData({ ...formData, enableCOD: e.target.checked })
                  }
                  className="rounded text-black focus:ring-0"
                />
                <span>Enable Cash on Delivery (COD)</span>
              </label>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
}
