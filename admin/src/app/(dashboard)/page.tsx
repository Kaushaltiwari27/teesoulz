'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  Layers,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // 1. Orders and Revenue
      const { data: orders, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orders && !ordersErr) {
        const paidOrders = orders.filter((o) => o.payment_status === 'Paid');
        const revenue = paidOrders.reduce((sum, o) => sum + (o.total_amount_in_paise || 0), 0);
        const pending = orders.filter((o) =>
          ['Processing', 'Confirmed', 'Packed', 'Shipped'].includes(o.status)
        ).length;

        setStats((prev) => ({
          ...prev,
          revenue: revenue / 100,
          totalOrders: orders.length,
          pendingOrders: pending,
        }));
        setRecentOrders(orders.slice(0, 5));
      }

      // 2. Products count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      setStats((prev) => ({
        ...prev,
        totalProducts: productCount || 0,
      }));

      // 3. Low stock inventory
      const { data: invData } = await supabase
        .from('inventory')
        .select(`
          id, stock_quantity, low_stock_threshold,
          variant:product_variants (
            id, size, color, sku,
            product:products (id, name, slug)
          )
        `)
        .order('stock_quantity', { ascending: true })
        .limit(6);

      if (invData) {
        const filteredLow = invData.filter(
          (item: any) => item.stock_quantity <= (item.low_stock_threshold || 5)
        );
        setLowStockItems(filteredLow);
        setStats((prev) => ({
          ...prev,
          lowStockCount: filteredLow.length,
        }));
      }
    } catch (e) {
      console.warn('[Overview] Fetch exception:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Bar with Quick Sync */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold text-zinc-500 uppercase tracking-wider">
              Connected to Production Supabase
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 font-sans mt-0.5">
            Store Performance
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-black hover:bg-zinc-800 text-xs font-semibold text-white transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Garment</span>
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-medium mb-2">
            <span>TOTAL REVENUE</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-sans">
            ₹{stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Paid customer checkouts</p>
        </Card>

        <Card className="hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-medium mb-2">
            <span>PENDING FULFILLMENT</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-sans">
            {stats.pendingOrders}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            of {stats.totalOrders} total lifetime orders
          </p>
        </Card>

        <Card className="hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-medium mb-2">
            <span>CATALOG STYLES</span>
            <span className="p-1.5 rounded-lg bg-zinc-100 text-zinc-900">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-zinc-950 font-sans">
            {stats.totalProducts}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Published streetwear lines</p>
        </Card>

        <Card className="hover:border-zinc-300 transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-medium mb-2">
            <span>LOW STOCK ALERTS</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-rose-600 font-sans">
            {stats.lowStockCount}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Variants below threshold</p>
        </Card>
      </div>

      {/* Main Grid: Recent Orders & Inventory Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-2">
          <Card
            title="Recent Orders"
            subtitle="Latest purchases across the storefront"
            action={
              <Link
                href="/orders"
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-black hover:underline"
              >
                <span>View all orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {loading ? (
              <LoadingSpinner label="Loading recent orders..." />
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-8 text-xs text-zinc-400 font-mono">
                No orders recorded in database yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-400 font-mono">
                      <th className="pb-3 font-semibold">ORDER</th>
                      <th className="pb-3 font-semibold">CUSTOMER</th>
                      <th className="pb-3 font-semibold">DATE</th>
                      <th className="pb-3 font-semibold">STATUS</th>
                      <th className="pb-3 font-semibold text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-zinc-900">
                          {o.order_number || o.id.slice(0, 8)}
                        </td>
                        <td className="py-3 text-zinc-700">
                          {o.shipping_address?.fullName ||
                            o.shipping_address?.name ||
                            'Customer'}
                        </td>
                        <td className="py-3 text-zinc-400 font-mono">
                          {new Date(o.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              o.status === 'Delivered'
                                ? 'success'
                                : o.status === 'Cancelled'
                                ? 'danger'
                                : 'warning'
                            }
                            size="sm"
                            dot
                          >
                            {o.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-semibold font-mono text-zinc-950">
                          ₹{((o.total_amount_in_paise || 0) / 100).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Low Stock Warnings & Quick Links */}
        <div className="space-y-6">
          <Card
            title="Stock Depletion Watch"
            subtitle="Immediate restock recommendations"
            action={
              <Link
                href="/inventory"
                className="text-xs font-semibold text-zinc-700 hover:text-black hover:underline"
              >
                Inventory &rarr;
              </Link>
            }
          >
            {loading ? (
              <LoadingSpinner label="Auditing stock..." size="sm" />
            ) : lowStockItems.length === 0 ? (
              <div className="flex items-center gap-2.5 p-4 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All product variants are healthy and stocked above threshold.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-zinc-900 truncate max-w-[150px]">
                        {item.variant?.product?.name || 'Garment'}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        {item.variant?.color} &bull; Size {item.variant?.size}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-700">
                        {item.stock_quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Module Shortcuts */}
          <Card title="Quick Management">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/homepage-builder"
                className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 font-medium text-zinc-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-bold">Homepage</span>
                <span className="text-[11px] text-zinc-500">Edit hero banners</span>
              </Link>
              <Link
                href="/coupons"
                className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 font-medium text-zinc-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-bold">Coupons</span>
                <span className="text-[11px] text-zinc-500">New promo code</span>
              </Link>
              <Link
                href="/media"
                className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 font-medium text-zinc-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-bold">Media CDN</span>
                <span className="text-[11px] text-zinc-500">Upload photos</span>
              </Link>
              <Link
                href="/activity-logs"
                className="p-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 font-medium text-zinc-800 flex flex-col gap-1 transition-colors"
              >
                <span className="font-bold">Audit Logs</span>
                <span className="text-[11px] text-zinc-500">View team actions</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
