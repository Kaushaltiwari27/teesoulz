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
  Sliders,
  Globe,
  Boxes,
  TicketPercent,
  Sparkles,
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

  const storefrontUrl =
    process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://teesoulz.vercel.app';

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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome & Top Sync Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200/90 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
              Live Database Connected
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-950 font-sans mt-1">
            Store Performance & Catalog
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Real-time telemetry, orders lifecycle, and inventory velocity across your storefront.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-bold text-zinc-700 transition-colors shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Storefront</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          <button
            type="button"
            onClick={loadDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-700 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </Link>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/products"
          className="group p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-black hover:shadow-card-hover transition-all flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-zinc-950 truncate font-sans">
              Garments Catalog
            </div>
            <div className="text-[11px] text-zinc-400 truncate">
              {stats.totalProducts} active styles
            </div>
          </div>
        </Link>

        <Link
          href="/homepage-builder"
          className="group p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-black hover:shadow-card-hover transition-all flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-zinc-950 truncate font-sans">
              Homepage Builder
            </div>
            <div className="text-[11px] text-zinc-400 truncate">
              8 visual sections
            </div>
          </div>
        </Link>

        <Link
          href="/orders"
          className="group p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-black hover:shadow-card-hover transition-all flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-zinc-950 truncate font-sans">
              Order Fulfillment
            </div>
            <div className="text-[11px] text-zinc-400 truncate">
              {stats.pendingOrders} to dispatch
            </div>
          </div>
        </Link>

        <Link
          href="/inventory"
          className="group p-4 rounded-2xl border border-zinc-200/90 bg-white hover:border-black hover:shadow-card-hover transition-all flex items-center gap-3.5"
        >
          <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-zinc-800 transition-colors shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black text-zinc-950 truncate font-sans">
              Inventory Matrix
            </div>
            <div className="text-[11px] text-zinc-400 truncate">
              Variant SKU stock
            </div>
          </div>
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-zinc-300 transition-all shadow-soft">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-bold mb-3">
            <span>TOTAL REVENUE</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-zinc-950 font-sans tracking-tight">
            ₹{stats.revenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-zinc-400">Paid customer checkouts</span>
          </div>
        </Card>

        <Card className="hover:border-zinc-300 transition-all shadow-soft">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-bold mb-3">
            <span>PENDING FULFILLMENT</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-zinc-950 font-sans tracking-tight">
            {stats.pendingOrders}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-zinc-400">
              of {stats.totalOrders} total lifetime orders
            </span>
          </div>
        </Card>

        <Card className="hover:border-zinc-300 transition-all shadow-soft">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-bold mb-3">
            <span>CATALOG STYLES</span>
            <span className="p-2 rounded-xl bg-zinc-100 text-zinc-900">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-zinc-950 font-sans tracking-tight">
            {stats.totalProducts}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-zinc-400">Active garments in database</span>
          </div>
        </Card>

        <Card className="hover:border-zinc-300 transition-all shadow-soft">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono font-bold mb-3">
            <span>LOW STOCK ALERTS</span>
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-rose-600 font-sans tracking-tight">
            {stats.lowStockCount}
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-zinc-400">Variants below threshold</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Orders & Inventory Watch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Orders */}
        <div className="lg:col-span-2">
          <Card
            title="Recent Orders"
            subtitle="Latest purchases processed across your storefront"
            action={
              <Link
                href="/orders"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 hover:text-black hover:underline"
              >
                <span>View all orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            {loading ? (
              <LoadingSpinner label="Loading recent orders..." />
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 mb-1">No Orders Yet</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                  New orders from your storefront will automatically appear here with full customer, dispatch, and tracking details.
                </p>
                <a
                  href={storefrontUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold shadow-xs hover:bg-zinc-800 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Test Storefront Checkout</span>
                </a>
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
                        <td className="py-3.5 font-mono font-bold text-zinc-900">
                          {o.order_number || o.id.slice(0, 8)}
                        </td>
                        <td className="py-3.5 font-medium text-zinc-800">
                          {o.shipping_address?.fullName ||
                            o.shipping_address?.name ||
                            'Customer'}
                        </td>
                        <td className="py-3.5 text-zinc-400 font-mono">
                          {new Date(o.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-3.5">
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
                        <td className="py-3.5 text-right font-bold font-mono text-zinc-950">
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
                className="text-xs font-bold text-zinc-900 hover:text-black hover:underline"
              >
                Inventory &rarr;
              </Link>
            }
          >
            {loading ? (
              <LoadingSpinner label="Auditing stock..." size="sm" />
            ) : lowStockItems.length === 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/60 text-emerald-900 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All product variants are stocked above the warning threshold.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 flex items-center justify-between text-xs hover:border-zinc-300 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-zinc-900 truncate max-w-[150px]">
                        {item.variant?.product?.name || 'Garment'}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        {item.variant?.color} &bull; Size {item.variant?.size}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-rose-100 text-rose-700">
                        {item.stock_quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Module Shortcuts */}
          <Card title="Quick Management Hub" subtitle="One-click store operations">
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <Link
                href="/homepage-builder"
                className="p-3.5 rounded-xl border border-zinc-200 hover:border-black hover:shadow-2xs font-medium text-zinc-800 flex flex-col gap-1 transition-all group bg-zinc-50/50 hover:bg-white"
              >
                <span className="font-black group-hover:text-black flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black" />
                  Homepage
                </span>
                <span className="text-[11px] text-zinc-400">8 visual sections</span>
              </Link>
              <Link
                href="/coupons"
                className="p-3.5 rounded-xl border border-zinc-200 hover:border-black hover:shadow-2xs font-medium text-zinc-800 flex flex-col gap-1 transition-all group bg-zinc-50/50 hover:bg-white"
              >
                <span className="font-black group-hover:text-black flex items-center gap-1.5">
                  <TicketPercent className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black" />
                  Coupons
                </span>
                <span className="text-[11px] text-zinc-400">Promo discounts</span>
              </Link>
              <Link
                href="/categories"
                className="p-3.5 rounded-xl border border-zinc-200 hover:border-black hover:shadow-2xs font-medium text-zinc-800 flex flex-col gap-1 transition-all group bg-zinc-50/50 hover:bg-white"
              >
                <span className="font-black group-hover:text-black flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black" />
                  Categories
                </span>
                <span className="text-[11px] text-zinc-400">Taxonomy trees</span>
              </Link>
              <Link
                href="/media"
                className="p-3.5 rounded-xl border border-zinc-200 hover:border-black hover:shadow-2xs font-medium text-zinc-800 flex flex-col gap-1 transition-all group bg-zinc-50/50 hover:bg-white"
              >
                <span className="font-black group-hover:text-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-500 group-hover:text-black" />
                  Media CDN
                </span>
                <span className="text-[11px] text-zinc-400">Supabase storage</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
