'use client';

import React, { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isLoading, isAdmin } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfbfb] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-mono font-black text-sm mb-4">
          TS
        </div>
        <LoadingSpinner size="md" label="Verifying authorized admin access..." />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
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
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <DashboardContent>{children}</DashboardContent>
      </AdminAuthProvider>
    </ToastProvider>
  );
}
