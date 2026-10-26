import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 10,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-white">
      <div className="text-xs text-zinc-500 font-mono">
        {totalItems ? (
          <span>
            Showing <strong className="text-zinc-900">{startItem}</strong> -{' '}
            <strong className="text-zinc-900">{endItem}</strong> of{' '}
            <strong className="text-zinc-900">{totalItems}</strong> items
          </span>
        ) : (
          <span>
            Page <strong className="text-zinc-900">{currentPage}</strong> of{' '}
            <strong className="text-zinc-900">{totalPages}</strong>
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-900 font-mono">
          {currentPage} / {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
