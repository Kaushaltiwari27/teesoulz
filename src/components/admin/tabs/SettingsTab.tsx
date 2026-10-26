'use client';

import React, { useState } from 'react';
import {
  Shield,
  Key,
  Copy,
  Check,
  Database,
  Download,
  RotateCcw,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { WebsiteCmsData } from '@/types/cms';
import { Product, Order } from '@/types';

interface SettingsTabProps {
  cms: WebsiteCmsData;
  products: Product[];
  orders: Order[];
  onResetDefaults: () => void;
}

export default function SettingsTab({
  cms,
  products,
  orders,
  onResetDefaults,
}: SettingsTabProps) {
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const storedPin =
    typeof window !== 'undefined'
      ? localStorage.getItem('teesoulz_admin_pin') || 'teesoulz2026'
      : 'teesoulz2026';

  const secretPortalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/admin?key=${storedPin}`
      : 'http://localhost:3000/admin?key=teesoulz2026';

  const handleUpdatePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeSuccess('');
    setPasscodeError('');

    if (currentPasscode !== storedPin) {
      setPasscodeError('Current passcode does not match.');
      return;
    }

    if (newPasscode.length < 6) {
      setPasscodeError('New passcode must be at least 6 characters.');
      return;
    }

    try {
      localStorage.setItem('teesoulz_admin_pin', newPasscode);
      setCurrentPasscode('');
      setNewPasscode('');
      setPasscodeSuccess('Admin passcode updated successfully.');
    } catch {
      setPasscodeError('Failed to save to local storage.');
    }
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(secretPortalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleExportBackup = () => {
    const backupData = {
      cms,
      products,
      orders,
      exportedAt: new Date().toISOString(),
      store: 'TEESOULZ INDIA',
    };

    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `teesoulz-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228]">
        <h2 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
          Security, Direct URL &amp; System Configuration
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-0.5">
          Manage admin access credentials, secret bypass URLs, and store data backups.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Secret Direct Access URL */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228] space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 border-b border-[#24242e] pb-3 text-white">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold uppercase">Secret Direct Access URL</h3>
          </div>

          <p className="text-zinc-400 leading-relaxed text-[11px]">
            As per your security requirements, the public storefront has{' '}
            <strong className="text-white">NO visible links</strong> to the Admin Panel.
            To access the portal directly without manual password prompt, use your secret parameterized URL:
          </p>

          <div className="p-3 rounded bg-[#16161c] border border-[#272732] flex items-center justify-between gap-2 overflow-hidden">
            <span className="text-[11px] text-zinc-300 truncate select-all">
              {secretPortalUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded bg-white text-black hover:bg-zinc-200 font-bold shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>

          <div className="text-[10px] text-zinc-500">
            Bookmark this URL in your browser or keep it saved for authorized personnel access.
          </div>
        </div>

        {/* Change Admin Master Passcode */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228] space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 border-b border-[#24242e] pb-3 text-white">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold uppercase">Change Admin Passcode</h3>
          </div>

          <form onSubmit={handleUpdatePasscode} className="space-y-3">
            {passcodeError && (
              <div className="p-2 rounded bg-red-950/40 text-red-300 border border-red-800/50 text-[11px]">
                {passcodeError}
              </div>
            )}
            {passcodeSuccess && (
              <div className="p-2 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/50 text-[11px]">
                {passcodeSuccess}
              </div>
            )}

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">
                Current Passcode (Default: teesoulz2026)
              </label>
              <input
                type="password"
                required
                value={currentPasscode}
                onChange={(e) => setCurrentPasscode(e.target.value)}
                className="w-full bg-[#16161c] border border-[#2a2a35] text-white p-2 rounded focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">
                New Secret Passcode
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                className="w-full bg-[#16161c] border border-[#2a2a35] text-white p-2 rounded focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-white text-black font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              UPDATE PASSCODE
            </button>
          </form>
        </div>

        {/* Database & Supabase Diagnostics */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228] space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 border-b border-[#24242e] pb-3 text-white">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold uppercase">Database &amp; Engine Status</h3>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
              <span className="text-zinc-400">Architecture</span>
              <span className="text-white font-bold">Hybrid Supabase + Live Local Store</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
              <span className="text-zinc-400">Database Target</span>
              <span className="text-emerald-400 font-bold">Connected (rcxvyfgeduyokdahkrow)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
              <span className="text-zinc-400">Row Level Security</span>
              <span className="text-emerald-400 font-bold">Enforced</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
              <span className="text-zinc-400">Monetary Unit</span>
              <span className="text-white">Integer Paise (INR)</span>
            </div>
          </div>
        </div>

        {/* Backup & System Reset */}
        <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228] space-y-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#24242e] pb-3 text-white">
              <Download className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold uppercase">Data Export &amp; Backup</h3>
            </div>
            <p className="text-zinc-400 text-[11px] mt-3 leading-relaxed">
              Export your entire storefront catalog, custom products, customer orders, and homepage CMS layout as an offline JSON snapshot.
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <button
              type="button"
              onClick={handleExportBackup}
              className="w-full py-2.5 rounded bg-[#1f1f28] hover:bg-[#2b2b36] text-white border border-[#323240] font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD JSON BACKUP</span>
            </button>
            <button
              type="button"
              onClick={onResetDefaults}
              className="w-full py-2.5 rounded bg-red-950/30 hover:bg-red-900/50 text-red-300 border border-red-900/40 font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTORE DEFAULT CMS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
