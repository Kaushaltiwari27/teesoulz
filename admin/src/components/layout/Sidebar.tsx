'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  Boxes,
  ShoppingBag,
  Users,
  TicketPercent,
  Sliders,
  FileText,
  Compass,
  Image as ImageIcon,
  Search,
  Settings,
  ShieldCheck,
  History,
  ExternalLink,
  Globe,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'COMMERCE',
    items: [
      { label: 'Overview', href: '/', icon: LayoutDashboard },
      { label: 'Products', href: '/products', icon: Package },
      { label: 'Categories', href: '/categories', icon: FolderTree },
      { label: 'Collections', href: '/collections', icon: Layers },
      { label: 'Inventory', href: '/inventory', icon: Boxes },
      { label: 'Orders', href: '/orders', icon: ShoppingBag },
      { label: 'Customers', href: '/customers', icon: Users },
      { label: 'Discounts & Coupons', href: '/coupons', icon: TicketPercent },
    ],
  },
  {
    group: 'STOREFRONT EXPERIENCE',
    items: [
      { label: 'Homepage Builder', href: '/homepage-builder', icon: Sliders, badge: '8 Sections' },
      { label: 'Website Content', href: '/website-content', icon: FileText },
      { label: 'Navigation', href: '/navigation', icon: Compass },
      { label: 'Media Library', href: '/media', icon: ImageIcon },
    ],
  },
  {
    group: 'SYSTEM & SETTINGS',
    items: [
      { label: 'SEO Settings', href: '/seo', icon: Search },
      { label: 'Store Settings', href: '/settings', icon: Settings },
      { label: 'Admin Users', href: '/admin-users', icon: ShieldCheck },
      { label: 'Activity Logs', href: '/activity-logs', icon: History },
    ],
  },
];

function SidebarNavContent({
  pathname,
  storefrontUrl,
  onCloseMobile,
}: {
  pathname: string;
  storefrontUrl: string;
  onCloseMobile?: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/40 shrink-0">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm tracking-wider font-mono shadow-xs group-hover:scale-105 transition-transform">
            TS
          </div>
          <div>
            <div className="font-black text-sm tracking-widest uppercase font-sans text-zinc-950 leading-none">
              TEESOULZ
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tracking-wider mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>CORE ADMIN</span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
            LIVE
          </span>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-black hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        {NAV_GROUPS.map((g) => (
          <div key={g.group}>
            <div className="px-3 mb-2 text-[10px] font-extrabold tracking-wider font-mono text-zinc-400 uppercase">
              {g.group}
            </div>
            <div className="space-y-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-black text-white shadow-xs font-bold'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-700'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-zinc-800 text-zinc-200'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer info & live storefront link */}
      <div className="p-3 border-t border-zinc-100 bg-zinc-50/60 shrink-0">
        <a
          href={storefrontUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 hover:bg-black hover:text-white hover:border-black transition-all shadow-2xs group"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-400" />
            <span>Live Storefront</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
        </a>
      </div>
    </div>
  );
}

export default function Sidebar({
  mobileOpen = false,
  onCloseMobile,
}: {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const storefrontUrl =
    process.env.NEXT_PUBLIC_STOREFRONT_URL || 'https://teesoulz.vercel.app';

  return (
    <>
      {/* 1. Desktop Sidebar: Real flex child in layout (Can NEVER overlap main content) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen bg-white border-r border-zinc-200/90 z-20">
        <SidebarNavContent
          pathname={pathname}
          storefrontUrl={storefrontUrl}
        />
      </aside>

      {/* 2. Mobile Drawer (Only visible on small screens when opened via hamburger) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />
          <aside className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <SidebarNavContent
              pathname={pathname}
              storefrontUrl={storefrontUrl}
              onCloseMobile={onCloseMobile}
            />
          </aside>
        </div>
      )}
    </>
  );
}
