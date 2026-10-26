'use client';

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Shirt,
  AlertTriangle,
  ArrowRight,
  Plus,
  Sliders,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Product, Order, OrderStatus } from '@/types';
import { WebsiteCmsData } from '@/types/cms';
import { AdminTab } from '../AdminSidebar';

interface DashboardOverviewTabProps {
  products: Product[];
  orders: Order[];
  cms: WebsiteCmsData;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenAddProduct: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export default function DashboardOverviewTab({
  products,
  orders,
  cms,
  onNavigateTab,
  onOpenAddProduct,
  onUpdateOrderStatus,
}: DashboardOverviewTabProps) {
  // Compute analytics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(
    (o) => o.status === 'Processing' || o.status === 'Confirmed'
  );
  const shippedOrders = orders.filter(
    (o) => o.status === 'Shipped' || o.status === 'Out for Delivery'
  );
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered');

  const lowStockProducts = products.filter(
    (p) => p.totalStock < 15 && p.totalStock > 0
  );
  const outOfStockProducts = products.filter((p) => p.totalStock === 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-[8px] bg-gradient-to-r from-[#121216] via-[#16161b] to-[#121216] border border-[#27272f]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              OPERATIONAL
            </span>
            <span className="text-xs font-mono text-zinc-400">
              TEESOULZ STREETWEAR PORTAL
            </span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white font-sans">
            Storefront Command Center
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Live management of your product catalog, prices, customer orders, and all homepage sections connected to teesoulz.in.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-white text-black hover:bg-zinc-200 text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('cms')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#222228] text-white hover:bg-[#2c2c34] border border-[#32323c] text-xs font-bold font-mono tracking-wider transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4" />
            <span>EDIT SECTIONS</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228]">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              Total Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">
            From {orders.filter((o) => o.paymentStatus === 'Paid').length} paid orders
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228]">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              All Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {orders.length}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1.5">
            <span className="text-amber-400 font-bold">{pendingOrders.length} pending</span>
            <span>&bull;</span>
            <span className="text-emerald-400">{deliveredOrders.length} delivered</span>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228]">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              Active Catalog
            </span>
            <Shirt className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {products.length}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">
            Total items in store
          </div>
        </div>

        {/* Low / Out of Stock */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228]">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">
              Stock Warnings
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {lowStockProducts.length + outOfStockProducts.length}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 mt-1">
            {outOfStockProducts.length} out of stock &bull; {lowStockProducts.length} low
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Quick CMS Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Feed (2 Columns) */}
        <div className="lg:col-span-2 p-5 rounded-[6px] bg-[#101014] border border-[#222228] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                  Recent Customer Orders
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Real-time incoming orders from the store
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>VIEW ALL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#1e1e24]">
              {orders.slice(0, 5).map((order) => {
                const getStatusColor = (st: OrderStatus) => {
                  switch (st) {
                    case 'Confirmed':
                    case 'Processing':
                      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                    case 'Shipped':
                    case 'Out for Delivery':
                      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
                    case 'Delivered':
                      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                    case 'Cancelled':
                      return 'bg-red-500/10 text-red-400 border-red-500/30';
                    default:
                      return 'bg-zinc-800 text-zinc-300 border-zinc-700';
                  }
                };

                return (
                  <div
                    key={order.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded bg-[#1c1c22] border border-[#2a2a34] flex items-center justify-center font-mono text-xs font-bold text-zinc-300 shrink-0">
                        {order.orderNumber.slice(-4)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {order.shippingAddress?.fullName} &bull; {order.items?.length || 0}{' '}
                          item(s) &bull; {order.paymentMethod} ({order.paymentStatus})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">{order.date}</div>
                      </div>

                      {/* Quick Status Dropdown */}
                      <select
                        aria-label="Order Status"
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-[#18181f] text-zinc-200 border border-[#2a2a34] text-[11px] font-mono rounded px-2 py-1.5 focus:outline-hidden focus:border-zinc-500 cursor-pointer"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Website CMS & Sections Quick Overview (1 Column) */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
                  Live Website Status
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Managed homepage sections
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('cms')}
                className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>EDIT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Announcement Bar */}
              <div className="p-3 rounded bg-[#16161c] border border-[#24242c] flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-[11px]">ANNOUNCEMENT BAR</div>
                  <div className="text-[10px] text-zinc-400">
                    {cms.announcementBar.items.filter((i) => i.active).length} ticker items active
                  </div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    cms.announcementBar.enabled
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {cms.announcementBar.enabled ? 'ON' : 'OFF'}
                </span>
              </div>

              {/* Hero Slides */}
              <div className="p-3 rounded bg-[#16161c] border border-[#24242c] flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-[11px]">HERO 5S SLIDESHOW</div>
                  <div className="text-[10px] text-zinc-400">
                    {cms.heroSlides.filter((s) => s.active).length} slides rotating (5s interval)
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-cyan-500/20 text-cyan-400">
                  {cms.heroSlides.length} SLIDES
                </span>
              </div>

              {/* Featured Categories */}
              <div className="p-3 rounded bg-[#16161c] border border-[#24242c] flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-[11px]">2-COL FEATURED CARDS</div>
                  <div className="text-[10px] text-zinc-400">SHOP MENS &amp; SHOP WOMENS</div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-zinc-800 text-zinc-300">
                  {cms.featuredCategories.length} CARDS
                </span>
              </div>

              {/* Editorial Culture */}
              <div className="p-3 rounded bg-[#16161c] border border-[#24242c] flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-[11px]">EDITORIAL CULTURE</div>
                  <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                    &ldquo;{cms.editorialCulture.title}&rdquo;
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-red-500/20 text-red-400">
                  CAPSULE
                </span>
              </div>

              {/* Active Coupons */}
              <div className="p-3 rounded bg-[#16161c] border border-[#24242c] flex items-center justify-between">
                <div>
                  <div className="text-white font-bold text-[11px]">STORE DISCOUNT CODES</div>
                  <div className="text-[10px] text-zinc-400">
                    {cms.coupons.map((c) => c.code).join(', ')}
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/20 text-amber-400">
                  {cms.coupons.length} CODES
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1e1e24] mt-4">
            <button
              type="button"
              onClick={() => onNavigateTab('cms')}
              className="w-full py-2.5 rounded bg-[#1f1f26] hover:bg-[#282832] text-white text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer text-center"
            >
              CONFIGURE HOMEPAGE CMS &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
