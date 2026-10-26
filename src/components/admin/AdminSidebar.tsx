'use client';

import React from 'react';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Sliders,
  Settings,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export type AdminTab = 'overview' | 'products' | 'orders' | 'cms' | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  pendingOrdersCount: number;
  productsCount: number;
}

export default function AdminSidebar({
  currentTab,
  onSelectTab,
  pendingOrdersCount,
  productsCount,
}: AdminSidebarProps) {
  const menuItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Dashboard',
      sublabel: 'Metrics & Performance',
      icon: LayoutDashboard,
    },
    {
      id: 'products' as AdminTab,
      label: 'Products',
      sublabel: 'Inventory & Pricing',
      icon: Shirt,
      badge: productsCount,
    },
    {
      id: 'orders' as AdminTab,
      label: 'Orders',
      sublabel: 'Fulfillment & Status',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} NEW` : undefined,
      badgeColor: 'bg-amber-500 text-black',
    },
    {
      id: 'cms' as AdminTab,
      label: 'Website Sections',
      sublabel: 'Banners, Ticker & CMS',
      icon: Sliders,
    },
    {
      id: 'settings' as AdminTab,
      label: 'Security & Backup',
      sublabel: 'Access Keys & Config',
      icon: Shield,
    },
  ];

  return (
    <aside className="w-64 border-r border-[#222225] bg-[#0c0c0e] flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1c1c1f]">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-black tracking-tighter text-white font-sans uppercase">
              TEESOULZ
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold tracking-widest border border-zinc-700">
              ADMIN
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-400">
            STREETWEAR MANAGEMENT CONSOLE
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[6px] transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-[#18181c]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-black' : 'text-zinc-400'
                    }`}
                  />
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider leading-none">
                      {item.label}
                    </div>
                    <div
                      className={`text-[10px] mt-0.5 font-sans ${
                        isActive ? 'text-zinc-700' : 'text-zinc-400'
                      }`}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold tracking-wider ${
                      item.badgeColor ||
                      (isActive
                        ? 'bg-black text-white'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Pill */}
      <div className="p-4 border-t border-[#1c1c1f] text-[11px] font-mono text-zinc-400 space-y-1 bg-[#09090b]">
        <div className="flex items-center justify-between text-zinc-400">
          <span>STORE STATUS</span>
          <span className="text-emerald-400 font-bold">CONNECTED</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>CATALOG SYNC</span>
          <span className="text-zinc-400">REAL-TIME</span>
        </div>
        <div className="pt-2 text-[10px] text-zinc-500 text-center">
          TEESOULZ INDIA &copy; 2026
        </div>
      </div>
    </aside>
  );
}
