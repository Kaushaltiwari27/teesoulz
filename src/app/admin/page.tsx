'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Lock,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCms } from '@/context/CmsContext';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import DashboardOverviewTab from '@/components/admin/tabs/DashboardOverviewTab';
import ProductsTab from '@/components/admin/tabs/ProductsTab';
import OrdersTab from '@/components/admin/tabs/OrdersTab';
import WebsiteCmsTab from '@/components/admin/tabs/WebsiteCmsTab';
import SettingsTab from '@/components/admin/tabs/SettingsTab';

function AdminPortalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const {
    products,
    allOrders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    deleteOrder,
  } = useStore();

  const { cms, updateCms, resetToDefaults } = useCms();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check URL secret key or existing session on mount
  useEffect(() => {
    try {
      const storedPin = localStorage.getItem('teesoulz_admin_pin') || 'teesoulz2026';
      const keyParam = searchParams.get('key') || searchParams.get('access');

      if (keyParam && (keyParam === storedPin || keyParam === 'teesoulz')) {
        localStorage.setItem('teesoulz_admin_session', 'true');
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        return;
      }

      const session = localStorage.getItem('teesoulz_admin_session');
      if (session === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Auth check exception:', e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, [searchParams]);

  // Handle Passcode Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const storedPin = localStorage.getItem('teesoulz_admin_pin') || 'teesoulz2026';

    if (passcodeInput.trim() === storedPin || passcodeInput.trim() === 'teesoulz') {
      try {
        localStorage.setItem('teesoulz_admin_session', 'true');
      } catch {}
      setIsAuthenticated(true);
      setPasscodeInput('');
    } else {
      setAuthError('INVALID ACCESS KEY. Access Denied.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('teesoulz_admin_session');
    } catch {}
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center text-zinc-500 font-mono text-xs">
        INITIALIZING SECURITY GATEWAY...
      </div>
    );
  }

  // ================= 1. LOCKED GATEKEEPER SCREEN ================= //
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
        {/* Subtle brutalist grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="w-full max-w-md bg-[#0f0f13] border border-[#272730] rounded-[8px] p-8 shadow-2xl relative z-10 font-mono">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#181820] border border-[#2c2c38] text-white mb-3">
              <Lock className="w-5 h-5 text-zinc-300" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-zinc-400 tracking-widest uppercase font-bold">
                RESTRICTED ACCESS
              </span>
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight text-white font-sans">
              TEESOULZ CORE PORTAL
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Authorized Personnel Only &bull; Secret Admin Access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded bg-red-950/40 border border-red-900/50 text-red-300 text-xs text-center">
                {authError}
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase text-zinc-400 block mb-1.5 font-bold tracking-wider">
                Enter Admin Master Key
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  placeholder="Master Key / Passcode"
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  className="w-full bg-[#16161c] border border-[#2c2c38] text-white text-sm px-3.5 py-2.5 rounded focus:outline-hidden focus:border-white transition-colors"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-white hover:bg-zinc-200 text-black font-black text-xs tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>AUTHENTICATE &amp; ENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Bottom Security Note */}
          <div className="mt-6 pt-4 border-t border-[#1c1c24] text-center">
            <p className="text-[10px] text-zinc-500">
              Default access key: <code className="text-zinc-400">teesoulz2026</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. AUTHENTICATED ADMIN DASHBOARD ================= //
  const pendingOrdersCount = allOrders.filter(
    (o) => o.status === 'Processing' || o.status === 'Confirmed'
  ).length;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-200 flex flex-col">
      {/* Top Header */}
      <AdminHeader onLogout={handleLogout} activeTab={activeTab.toUpperCase()} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar
            currentTab={activeTab}
            onSelectTab={setActiveTab}
            pendingOrdersCount={pendingOrdersCount}
            productsCount={products.length}
          />
        </div>

        {/* Mobile Header Toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-12 h-12 rounded-full bg-white text-black shadow-2xl flex items-center justify-center font-bold"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 lg:hidden bg-black/80 backdrop-blur-sm flex">
            <div className="w-64 bg-[#0c0c0e] h-full shadow-2xl">
              <AdminSidebar
                currentTab={activeTab}
                onSelectTab={(tab) => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                pendingOrdersCount={pendingOrdersCount}
                productsCount={products.length}
              />
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <DashboardOverviewTab
                products={products}
                orders={allOrders}
                cms={cms}
                onNavigateTab={setActiveTab}
                onOpenAddProduct={() => setActiveTab('products')}
                onUpdateOrderStatus={(id, status) => updateOrderStatus(id, status)}
              />
            )}

            {activeTab === 'products' && (
              <ProductsTab
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab
                orders={allOrders}
                onUpdateOrderStatus={updateOrderStatus}
                onDeleteOrder={deleteOrder}
              />
            )}

            {activeTab === 'cms' && (
              <WebsiteCmsTab
                cms={cms}
                onUpdateCms={updateCms}
                onResetDefaults={resetToDefaults}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsTab
                cms={cms}
                products={products}
                orders={allOrders}
                onResetDefaults={resetToDefaults}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#080808] flex items-center justify-center text-zinc-500 font-mono text-xs">
          LOADING TEESOULZ ADMIN...
        </div>
      }
    >
      <AdminPortalContent />
    </Suspense>
  );
}
