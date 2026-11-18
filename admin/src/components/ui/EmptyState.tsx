import React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-zinc-50/60 rounded-2xl border border-dashed border-zinc-300">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-sm font-bold text-zinc-950">{title}</h3>
      <p className="text-xs text-zinc-500 max-w-sm mt-1.5 mb-5 leading-relaxed">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
