'use client';

import React, { useEffect, useState } from 'react';
import {
  TicketPercent,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function CouponsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '20',
    minOrderValue: '999',
    description: '',
    usageLimit: '',
    expiresAt: '',
    isActive: true,
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: coupErr } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (coupErr) throw coupErr;
      setCoupons(data || []);
    } catch (err: any) {
      error('Failed to load coupons', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: 'SUMMER20',
      discountType: 'percentage',
      discountValue: '20',
      minOrderValue: '999',
      description: 'Get 20% off on all streetwear drops over ₹999.',
      usageLimit: '500',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discount_type,
      discountValue: c.discount_type === 'percentage'
        ? c.discount_value.toString()
        : (c.discount_value / 100).toString(),
      minOrderValue: ((c.min_order_value_in_paise || 0) / 100).toString(),
      description: c.description || '',
      usageLimit: c.usage_limit ? c.usage_limit.toString() : '',
      expiresAt: c.expires_at ? c.expires_at.split('T')[0] : '',
      isActive: !!c.is_active,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (c: any) => {
    try {
      const supabase = createClient();
      const updatedStatus = !c.is_active;

      const { error: upErr } = await supabase
        .from('coupons')
        .update({ is_active: updatedStatus })
        .eq('id', c.id);

      if (upErr) throw upErr;

      setCoupons((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, is_active: updatedStatus } : item))
      );
      success('Status updated', `${c.code} is now ${updatedStatus ? 'active' : 'inactive'}.`);
    } catch (err: any) {
      error('Toggle failed', err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const discVal = parseFloat(formData.discountValue);
      const discountValueFinal = formData.discountType === 'percentage'
        ? discVal
        : Math.round(discVal * 100);

      const minOrderPaise = Math.round(parseFloat(formData.minOrderValue || '0') * 100);

      const payload = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discountType,
        discount_value: discountValueFinal,
        min_order_value_in_paise: minOrderPaise,
        description: formData.description.trim(),
        usage_limit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        expires_at: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
        is_active: formData.isActive,
      };

      if (editingCoupon) {
        const { error: upErr } = await supabase
          .from('coupons')
          .update(payload)
          .eq('id', editingCoupon.id);
        if (upErr) throw upErr;

        await logActivity('COUPON_UPDATED', 'coupon', editingCoupon.id, { code: payload.code });
        success('Coupon saved', `${payload.code} updated.`);
      } else {
        const { error: inErr } = await supabase.from('coupons').insert(payload);
        if (inErr) throw inErr;

        await logActivity('COUPON_CREATED', 'coupon', null, { code: payload.code });
        success('Coupon created', `${payload.code} is now live.`);
      }

      setIsModalOpen(false);
      loadCoupons();
    } catch (err: any) {
      error('Failed to save coupon', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error: delErr } = await supabase
        .from('coupons')
        .delete()
        .eq('id', deleteCandidate.id);

      if (delErr) throw delErr;

      await logActivity('COUPON_DELETED', 'coupon', deleteCandidate.id, {
        code: deleteCandidate.code,
      });

      success('Coupon deleted', `${deleteCandidate.code} has been deleted.`);
      setDeleteCandidate(null);
      loadCoupons();
    } catch (err: any) {
      error('Delete failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Discounts &amp; Promo Campaigns
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure percentage and flat discount codes for checkout carts
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupons by code or campaign details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading coupons from Supabase..." />
        ) : filteredCoupons.length === 0 ? (
          <EmptyState
            icon={TicketPercent}
            title="No promotional coupons active"
            description="Create coupons like 'WELCOME10', 'STREET20', or 'FESTIVE500'."
            action={{ label: 'Create First Coupon', onClick: handleOpenAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">PROMO CODE</th>
                  <th className="py-3 px-4 font-semibold">DISCOUNT</th>
                  <th className="py-3 px-4 font-semibold">MIN CART</th>
                  <th className="py-3 px-4 font-semibold">REDEMPTIONS</th>
                  <th className="py-3 px-4 font-semibold">EXPIRATION</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCoupons.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sm text-zinc-950">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
                        {c.code}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-zinc-900 font-mono">
                      {c.discount_type === 'percentage'
                        ? `${c.discount_value}% OFF`
                        : `₹${(c.discount_value / 100).toLocaleString('en-IN')} FLAT`}
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-600">
                      ₹{((c.min_order_value_in_paise || 0) / 100).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-600">
                      {c.times_used || 0}{' '}
                      {c.usage_limit ? `/ ${c.usage_limit}` : 'uses'}
                    </td>

                    <td className="py-3 px-4 text-zinc-500 font-mono">
                      {c.expires_at ? (
                        new Date(c.expires_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      ) : (
                        <span className="text-zinc-400">Never</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c)}
                        className="cursor-pointer"
                      >
                        <Badge variant={c.is_active ? 'success' : 'neutral'} size="sm" dot>
                          {c.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(c)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        description="Set promotional rules and thresholds for checkout."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="STREET20"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono font-bold text-zinc-950 uppercase focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Discount Type *
              </label>
              <select
                value={formData.discountType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountType: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-950"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '20' : '500'}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono font-bold text-zinc-950 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Minimum Cart Subtotal (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="999"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Marketing Campaign Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. 20% off all drops above ₹999."
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Usage Limit (Optional)
              </label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="e.g. 500"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded text-black focus:ring-0"
            />
            <span className="text-xs font-semibold text-zinc-900">
              Coupon is Active and Redeemable
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-black hover:bg-zinc-800 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message={`Delete "${deleteCandidate?.code}"? Customers will no longer be able to apply this code during checkout.`}
        confirmLabel="Delete Coupon"
        isLoading={isDeleting}
      />
    </div>
  );
}
