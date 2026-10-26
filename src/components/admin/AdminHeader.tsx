'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Lock, ShieldCheck, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
  activeTab: string;
}

export default function AdminHeader({ onLogout, activeTab }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-[#222225] bg-[#0c0c0e] px-4 sm:px-8 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-[#a1a1aa] uppercase hidden sm:inline">
            CORE OS v2.6 // LIVE
          </span>
        </div>
        <span className="text-zinc-600 hidden sm:inline">/</span>
        <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
          {activeTab}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Storefront Link */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#1a1a1d] hover:bg-[#25252a] text-zinc-300 hover:text-white border border-[#2a2a30] text-xs font-mono tracking-wider transition-colors"
          title="Open customer storefront in a new tab"
        >
          <span>VIEW STORE</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Lock / Exit Admin Session */}
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 border border-red-900/40 text-xs font-mono tracking-wider transition-colors cursor-pointer"
          title="Lock and sign out of admin session"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">LOCK PORTAL</span>
        </button>
      </div>
    </header>
  );
}
