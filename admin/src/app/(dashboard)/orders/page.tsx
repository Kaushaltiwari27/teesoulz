'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

const VALID_STATUSES = [
  'Processing',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export default function OrdersPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  // Status & Tracking update form
  const [updateStatus, setUpdateStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: ordErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordErr) throw ordErr;
      setOrders(data || []);
    } catch (err: any) {
      error('Failed to load orders', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const orderNum = (o.order_number || o.id).toLowerCase();
      const custName = (o.shipping_address?.fullName || o.shipping_address?.name || '').toLowerCase();
      const custPhone = (o.shipping_address?.phone || '').toLowerCase();
      const city = (o.shipping_address?.city || '').toLowerCase();

      const matchesSearch =
        orderNum.includes(q) || custName.includes(q) || custPhone.includes(q) || city.includes(q);

      const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatus]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const handleOpenOrder = async (order: any) => {
    setSelectedOrder(order);
    setUpdateStatus(order.status);
    setTrackingNumber(order.tracking_number || '');
    setCarrier(order.carrier || 'BlueDart');
    setLoadingItems(true);

    try {
      const supabase = createClient();
      const { data, error: itemsErr } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      if (itemsErr) throw itemsErr;
      setOrderItems(data || []);
    } catch (e: any) {
      error('Failed to load items', e.message);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const supabase = createClient();
      const { error: upErr } = await supabase
        .from('orders')
        .update({
          status: updateStatus as any,
          tracking_number: trackingNumber.trim() || null,
          carrier: carrier.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedOrder.id);

      if (upErr) throw upErr;

      await logActivity('ORDER_STATUS_UPDATED', 'order', selectedOrder.id, {
        orderNumber: selectedOrder.order_number,
        oldStatus: selectedOrder.status,
        newStatus: updateStatus,
        trackingNumber,
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                status: updateStatus,
                tracking_number: trackingNumber.trim() || null,
                carrier: carrier.trim() || null,
              }
            : o
        )
      );

      success('Order updated', `Order status set to ${updateStatus}.`);
      setSelectedOrder(null);
    } catch (err: any) {
      error('Failed to update status', err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Orders &amp; Dispatch Fulfillment
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {orders.length} total customer purchases recorded in Supabase
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, customer name, phone or city..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-800 focus:outline-hidden cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            {VALID_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Fetching orders from database..." />
        ) : paginatedOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders found"
            description="When customers complete checkout on the storefront, orders will appear here automatically."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">ORDER ID</th>
                  <th className="py-3 px-4 font-semibold">CUSTOMER</th>
                  <th className="py-3 px-4 font-semibold">DATE</th>
                  <th className="py-3 px-4 font-semibold">PAYMENT</th>
                  <th className="py-3 px-4 font-semibold">FULFILLMENT</th>
                  <th className="py-3 px-4 font-semibold text-right">TOTAL</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                      {o.order_number || o.id.slice(0, 8)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900">
                        {o.shipping_address?.fullName ||
                          o.shipping_address?.name ||
                          'Customer'}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {o.shipping_address?.city}, {o.shipping_address?.state}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-500">
                      {new Date(o.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          o.payment_status === 'Paid'
                            ? 'success'
                            : o.payment_status === 'Failed'
                            ? 'danger'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {o.payment_method || 'Card'} &bull; {o.payment_status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          o.status === 'Delivered'
                            ? 'success'
                            : o.status === 'Cancelled'
                            ? 'danger'
                            : o.status === 'Shipped' || o.status === 'Out for Delivery'
                            ? 'info'
                            : 'warning'
                        }
                        size="sm"
                        dot
                      >
                        {o.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-zinc-950">
                      ₹{((o.total_amount_in_paise || 0) / 100).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenOrder(o)}
                        className="px-2.5 py-1 rounded-md border border-zinc-200 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                      >
                        View &amp; Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredOrders.length}
          pageSize={pageSize}
        />
      </Card>

      {/* Order Details & Status Updater Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.order_number || selectedOrder?.id}`}
        description="Fulfillment tracking, line items and shipping breakdown."
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Customer & Address Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
            <div>
              <div className="font-mono font-bold text-zinc-400 uppercase text-[10px] mb-1">
                SHIPPING RECIPIENT
              </div>
              <div className="font-bold text-zinc-950 text-sm">
                {selectedOrder?.shipping_address?.fullName ||
                  selectedOrder?.shipping_address?.name ||
                  'Customer'}
              </div>
              <div className="text-zinc-600 mt-1">
                {selectedOrder?.shipping_address?.streetAddress ||
                  selectedOrder?.shipping_address?.street ||
                  ''}
              </div>
              <div className="text-zinc-600">
                {selectedOrder?.shipping_address?.city},{' '}
                {selectedOrder?.shipping_address?.state} -{' '}
                {selectedOrder?.shipping_address?.pincode ||
                  selectedOrder?.shipping_address?.postalCode}
              </div>
              <div className="text-zinc-900 font-mono mt-1 font-semibold">
                Phone: {selectedOrder?.shipping_address?.phone || 'N/A'}
              </div>
            </div>

            <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-3 sm:pt-0 sm:pl-4">
              <div className="font-mono font-bold text-zinc-400 uppercase text-[10px]">
                PAYMENT BREAKDOWN
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Method:</span>
                <span className="font-semibold text-zinc-900">
                  {selectedOrder?.payment_method || 'Online'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal:</span>
                <span className="font-mono">
                  ₹{((selectedOrder?.subtotal_in_paise || 0) / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Discount:</span>
                <span className="font-mono text-emerald-600">
                  -₹{((selectedOrder?.discount_in_paise || 0) / 100).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                <span>Grand Total:</span>
                <span className="font-mono text-base">
                  ₹{((selectedOrder?.total_amount_in_paise || 0) / 100).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Purchased Line Items */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 mb-2.5">
              Purchased Garment Lines
            </h4>
            {loadingItems ? (
              <LoadingSpinner label="Fetching garments..." size="sm" />
            ) : orderItems.length === 0 ? (
              <div className="text-xs text-zinc-500 italic p-3 bg-zinc-50 rounded-lg">
                No individual item records found for this order.
              </div>
            ) : (
              <div className="space-y-2">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-zinc-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-zinc-900">{item.product_name}</div>
                      <div className="text-zinc-500 font-mono text-[11px] mt-0.5">
                        Color: {item.color} &bull; Size: {item.size} &bull; Qty: {item.quantity}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-zinc-900">
                      ₹{((item.total_price_in_paise || item.unit_price_in_paise * item.quantity) / 100).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Update Form */}
          <form
            onSubmit={handleUpdateOrderStatus}
            className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-4"
          >
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-900">
              Update Dispatch &amp; Courier Status
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Fulfillment Status
                </label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-900"
                >
                  {VALID_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  Courier Carrier
                </label>
                <input
                  type="text"
                  placeholder="BlueDart / Delhivery"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                  AWB Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD891230491"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-mono text-zinc-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Update Fulfillment'}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
