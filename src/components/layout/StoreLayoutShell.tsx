'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CartDrawer from '@/components/common/CartDrawer';
import SearchModal from '@/components/common/SearchModal';
import QuickViewModal from '@/components/common/QuickViewModal';
import SizeGuideModal from '@/components/common/SizeGuideModal';
import ToastContainer from '@/components/common/ToastContainer';
import { CmsProvider } from '@/context/CmsContext';

export default function StoreLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <CmsProvider>
      {isAdmin ? (
        // Dedicated Isolated Admin Portal (No Storefront Header/Footer/Drawers)
        <div className="min-h-screen bg-[#080808] text-white">
          {children}
          <ToastContainer />
        </div>
      ) : (
        // Standard Customer Storefront Layout
        <>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Interactive Global Drawers & Modals */}
          <CartDrawer />
          <SearchModal />
          <QuickViewModal />
          <SizeGuideModal />
          <ToastContainer />
        </>
      )}
    </CmsProvider>
  );
}
