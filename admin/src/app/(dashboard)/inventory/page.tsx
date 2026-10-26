'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Filter,
  AlertTriangle,
  Check,
  Edit2,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

export default function InventoryPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [inventoryList, setInventoryList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Quick Edit Modal
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);
  const [thresholdInput, setThresholdInput] = useState<number>(5);
  const [isSaving, setIsSaving] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: invErr } = await supabase
        .from('inventory')
        .select(`
          id,
          variant_id,
          stock_quantity,
          reserved_quantity,
          low_stock_threshold,
          updated_at,
          variant:product_variants (
            id,
            sku,
            size,
            color,
            price_in_paise,
            product:products (
              id,
              name,
              slug,
              is_published
            )
          )
        `)
        .order('stock_quantity', { ascending: true });

      if (invErr) throw invErr;
      setInventoryList(data || []);
    } catch (err: any) {
      error('Failed to load inventory', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredItems = useMemo(() => {
    return inventoryList.filter((item) => {
      const prodName = item.variant?.product?.name?.toLowerCase() || '';
      const sku = item.variant?.sku?.toLowerCase() || '';
      const color = item.variant?.color?.toLowerCase() || '';
      const q = searchQuery.toLowerCase();

      const matchesSearch = prodName.includes(q) || sku.includes(q) || color.includes(q);
      const isLow = item.stock_quantity <= (item.low_stock_threshold || 5);

      if (filterLowStock && !isLow) return false;
      return matchesSearch;
    });
  }, [inventoryList, searchQuery, filterLowStock]);

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setStockInput(item.stock_quantity);
    setThresholdInput(item.low_stock_threshold || 5);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);

    try {
      const supabase = createClient();
      const newStock = Math.max(0, Number(stockInput));
      const newThreshold = Math.max(1, Number(thresholdInput));

      const { error: upErr } = await supabase
        .from('inventory')
        .update({
          stock_quantity: newStock,
          low_stock_threshold: newThreshold,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingItem.id);

      if (upErr) throw upErr;

      await logActivity('STOCK_UPDATED', 'inventory', editingItem.id, {
        sku: editingItem.variant?.sku,
        previousStock: editingItem.stock_quantity,
        newStock,
      });

      // Update state in memory
      setInventoryList((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, stock_quantity: newStock, low_stock_threshold: newThreshold }
            : i
        )
      );

      success('Inventory adjusted', `${editingItem.variant?.sku} stock updated to ${newStock}.`);
      setEditingItem(null);
    } catch (err: any) {
      error('Failed to update stock', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Inventory &amp; Stock Matrix
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitor real-time warehouse levels across all SKUs, colors and size variants
          </p>
        </div>

        <button
          type="button"
          onClick={loadInventory}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Levels</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by SKU, garment title or color..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
            />
          </div>

          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 bg-white cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => {
                setFilterLowStock(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded text-black focus:ring-0"
            />
            <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Low Stock Only
            </span>
          </label>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Auditing warehouse stock levels..." />
        ) : paginatedItems.length === 0 ? (
          <EmptyState
            icon={Boxes}
            title="No inventory records"
            description="Variants and stock levels are automatically recorded when garments are created."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">SKU &amp; PRODUCT</th>
                  <th className="py-3 px-4 font-semibold">SIZE</th>
                  <th className="py-3 px-4 font-semibold">COLOR</th>
                  <th className="py-3 px-4 font-semibold">AVAILABLE STOCK</th>
                  <th className="py-3 px-4 font-semibold">THRESHOLD</th>
                  <th className="py-3 px-4 font-semibold">HEALTH</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedItems.map((item) => {
                  const isDepleted = item.stock_quantity === 0;
                  const isLow = item.stock_quantity <= (item.low_stock_threshold || 5);

                  return (
                    <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-zinc-950">
                          {item.variant?.sku || 'NO-SKU'}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                          {item.variant?.product?.name || 'Garment'}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-xs">
                          {item.variant?.size}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-zinc-700 font-medium">
                        {item.variant?.color}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-sm">
                        <span
                          className={
                            isDepleted
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-zinc-950'
                          }
                        >
                          {item.stock_quantity}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-zinc-400">
                        &le; {item.low_stock_threshold || 5}
                      </td>

                      <td className="py-3 px-4">
                        {isDepleted ? (
                          <Badge variant="danger" size="sm" dot>
                            Sold Out
                          </Badge>
                        ) : isLow ? (
                          <Badge variant="warning" size="sm" dot>
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge variant="success" size="sm" dot>
                            In Stock
                          </Badge>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 rounded-md border border-zinc-200 hover:bg-zinc-100 text-zinc-800 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredItems.length}
          pageSize={pageSize}
        />
      </Card>

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title="Adjust Variant Stock"
        description={`SKU: ${editingItem?.variant?.sku} (${editingItem?.variant?.product?.name})`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveStock} className="space-y-4">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Garment:</span>
              <span className="font-semibold text-zinc-900">
                {editingItem?.variant?.product?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Variant:</span>
              <span className="font-mono font-semibold text-zinc-900">
                {editingItem?.variant?.color} / Size {editingItem?.variant?.size}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Physical Available Stock (Units) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={stockInput}
              onChange={(e) => setStockInput(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono font-bold text-zinc-950 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Low Stock Warning Threshold
            </label>
            <input
              type="number"
              min="1"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(parseInt(e.target.value) || 5)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-black hover:bg-zinc-800 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Save Stock'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
