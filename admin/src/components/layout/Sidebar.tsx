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
      { label: 'Homepage Builder', href: '/homepage-builder', icon: Sliders },
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
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-black text-sm tracking-wider font-mono">
              TS
            </span>
            <div>
              <div className="font-black text-sm tracking-widest uppercase font-sans text-zinc-950">
                TEESOULZ
              </div>
              <div className="text-[10px] text-zinc-400 font-mono tracking-wider">
                CORE ADMIN
              </div>
            </div>
          </Link>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-bold border border-zinc-200">
            PROD
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((g) => (
            <div key={g.group}>
              <div className="px-3 mb-2 text-[10px] font-bold tracking-wider font-mono text-zinc-400 uppercase">
                {g.group}
              </div>
              <div className="space-y-0.5">
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
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-900 text-white font-semibold'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-zinc-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 font-bold">
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
        <div className="p-3 border-t border-zinc-100 bg-zinc-50/50">
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg border border-zinc-200 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              Live Storefront
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </aside>
    </>
  );
}
