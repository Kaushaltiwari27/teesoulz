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
  Sparkles,
  Globe,
  Radio,
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
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-zinc-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-sm lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/40">
          <Link href="/" className="flex items-center gap-2.5 group">
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

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60">
            LIVE
          </span>
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
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/60">
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
      </aside>
    </>
  );
}
