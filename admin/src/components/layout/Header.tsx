'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, Shield } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import Badge from '../ui/Badge';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: 'Live commerce metrics, active sales & orders' },
  '/products': { title: 'Products Catalog', subtitle: 'Manage garment lines, inventory variants & imagery' },
  '/categories': { title: 'Categories', subtitle: 'Store taxonomy, navigation tags & display order' },
  '/collections': { title: 'Curated Collections', subtitle: 'Manage drops, seasonal lines & editorial capsules' },
  '/inventory': { title: 'Inventory Matrix', subtitle: 'Real-time variant stock tracking & low inventory warnings' },
  '/orders': { title: 'Order Fulfillment', subtitle: 'Customer orders, dispatch lifecycle & courier tracking' },
  '/customers': { title: 'Customer Directory', subtitle: 'Registered customer profiles & lifetime order insights' },
  '/coupons': { title: 'Discounts & Coupons', subtitle: 'Promotional codes, cart thresholds & validity' },
  '/homepage-builder': { title: 'Homepage Builder', subtitle: 'Hero visual slides, banners, and curated grid sections' },
  '/website-content': { title: 'Website Content', subtitle: 'Live announcement tickers, brand story & customer reviews' },
  '/navigation': { title: 'Store Navigation', subtitle: 'Configure header menu hierarchies & footer links' },
  '/media': { title: 'Media Storage Library', subtitle: 'Persistent Supabase CDN assets & product image bucket' },
  '/seo': { title: 'SEO & Metadata', subtitle: 'Search engine titles, meta descriptions & OpenGraph cards' },
  '/settings': { title: 'Store Settings', subtitle: 'Business identity, contact credentials, tax & shipping rules' },
  '/admin-users': { title: 'Admin & Staff Access', subtitle: 'Authorized team credentials & role enforcement' },
  '/activity-logs': { title: 'System Activity Logs', subtitle: 'Audit trail of administrative mutations & changes' },
};

export default function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const { profile, signOut } = useAdminAuth();

  const currentInfo =
    PAGE_TITLES[pathname] || {
      title: 'TEESOULZ Admin',
      subtitle: 'Streetwear commerce system',
    };

  return (
    <header className="h-16 px-6 border-b border-zinc-200 bg-white flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base font-bold text-zinc-950 truncate tracking-tight">
            {currentInfo.title}
          </h1>
          <p className="hidden sm:block text-xs text-zinc-500 truncate">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Badge */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50">
          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
            <Shield className="w-3.5 h-3.5 text-zinc-200" />
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-zinc-900 leading-none truncate max-w-[140px]">
              {profile?.name || profile?.email?.split('@')[0] || 'Admin'}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 leading-none">
              {profile?.email || 'admin@teesoulz.com'}
            </div>
          </div>
          <Badge
            variant={profile?.role === 'ADMIN' ? 'street' : 'neutral'}
            size="sm"
          >
            {profile?.role || 'STAFF'}
          </Badge>
        </div>

        {/* Sign out */}
        <button
          type="button"
          onClick={() => signOut()}
          title="Sign out of Admin Portal"
          className="p-2 rounded-lg border border-zinc-200 text-zinc-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
