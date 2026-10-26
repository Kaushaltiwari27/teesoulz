'use client';

import React, { useState } from 'react';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <AdminAuthProvider>
        <div className="min-h-screen bg-[#fbfbfb] text-zinc-950 flex flex-col antialiased">
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
            <Header onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

            <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminAuthProvider>
    </ToastProvider>
  );
}
