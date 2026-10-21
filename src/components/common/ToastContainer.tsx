'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#080808] text-white p-4 shadow-2xl border border-[#262626] flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3"
          >
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-[#B8B8B8] flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                {toast.title}
              </h5>
              {toast.message && (
                <p className="text-xs text-[#CCCCCC] mt-0.5 leading-snug">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#888888] hover:text-white p-1 -mr-1 -mt-1"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
