'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Tag,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import ProductFormModal from '../ProductFormModal';

interface ProductsTabProps {
  products: Product[];
  onAddProduct: (productData: any) => Promise<Product>;
  onUpdateProduct: (product: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
}

export default function ProductsTab({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: ProductsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete Confirm State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'in') matchesStock = p.totalStock >= 15;
      if (stockFilter === 'low') matchesStock = p.totalStock > 0 && p.totalStock < 15;
      if (stockFilter === 'out') matchesStock = p.totalStock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: any) => {
    if (editingProduct) {
      await onUpdateProduct({ ...editingProduct, ...productData });
    } else {
      await onAddProduct(productData);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await onDeleteProduct(productToDelete.id);
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Stock Increment (+10)
  const handleQuickAddStock = (prod: Product, amount: number) => {
    const updatedVariants = (prod.variants || []).map((v) => ({
      ...v,
      stock: (v.stock || 0) + amount,
    }));
    const totalStock = updatedVariants.reduce((a, b) => a + (b.stock || 0), 0);
    onUpdateProduct({
      ...prod,
      variants: updatedVariants,
      totalStock,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[6px] bg-[#101014] border border-[#222228]">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
            Product Catalogue &amp; Inventory ({filteredProducts.length} items)
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Create, edit prices, manage size variants, and upload streetwear photos.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[4px] bg-white text-black hover:bg-zinc-200 text-xs font-black font-mono tracking-wider transition-colors cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, slug, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121217] border border-[#272730] text-zinc-200 pl-9 pr-3 py-2 text-xs font-mono rounded focus:outline-hidden focus:border-zinc-500"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#121217] border border-[#272730] text-zinc-200 px-3 py-2 text-xs font-mono rounded focus:outline-hidden focus:border-zinc-500 cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="oversized-t-shirts">Oversized T-Shirts</option>
          <option value="graphic-tees">Graphic Tees</option>
          <option value="hoodies-sweatshirts">Hoodies &amp; Sweatshirts</option>
          <option value="bottomwear">Bottomwear &amp; Cargos</option>
          <option value="accessories">Accessories</option>
          <option value="t-shirts">Classic T-Shirts</option>
        </select>

        {/* Stock Filter */}
        <div className="flex rounded border border-[#272730] overflow-hidden bg-[#121217] text-xs font-mono">
          <button
            type="button"
            onClick={() => setStockFilter('all')}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
              stockFilter === 'all' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Stock
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('low')}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
              stockFilter === 'low'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-amber-400/80 hover:text-amber-400'
            }`}
          >
            Low (&lt;15)
          </button>
          <button
            type="button"
            onClick={() => setStockFilter('out')}
            className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
              stockFilter === 'out'
                ? 'bg-red-500 text-white font-bold'
                : 'text-red-400/80 hover:text-red-400'
            }`}
          >
            Out (0)
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-[6px] border border-[#222228] bg-[#101014] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222228] bg-[#14141a] text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Total Stock</th>
                <th className="py-3 px-4">Badges</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1b22]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 font-mono">
                    No products found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isLow = prod.totalStock < 15 && prod.totalStock > 0;
                  const isOut = prod.totalStock === 0;

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-[#14141a]/60 transition-colors group"
                    >
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded overflow-hidden bg-black shrink-0 border border-[#2a2a34]">
                            {prod.images && prod.images[0] ? (
                              <Image
                                src={prod.images[0]}
                                alt={prod.name}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[9px]">
                                NO IMG
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white leading-tight">
                              {prod.name}
                            </div>
                            <div className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[220px]">
                              {prod.subtitle || prod.fitType}
                            </div>
                            <div className="text-[9px] text-zinc-400 mt-0.5">
                              ID: {prod.id} &bull; Slug: /{prod.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Gender */}
                      <td className="py-3 px-4">
                        <span className="capitalize text-zinc-300">
                          {prod.category.replace(/-/g, ' ')}
                        </span>
                        <div className="text-[10px] text-zinc-400 capitalize">
                          {prod.gender}
                        </div>
                      </td>

                      {/* Price & MRP */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">₹{prod.price}</div>
                        <div className="text-[10px] text-zinc-400 line-through">
                          ₹{prod.mrp}
                        </div>
                      </td>

                      {/* Discount % */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                          {prod.discountPercent || Math.max(0, Math.round(((prod.mrp - prod.price) / prod.mrp) * 100))}% OFF
                        </span>
                      </td>

                      {/* Stock & Quick Restock */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOut
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : isLow
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {prod.totalStock} {isOut ? '(OUT)' : isLow ? '(LOW)' : 'IN STOCK'}
                          </span>

                          {/* Quick +10 stock button */}
                          <button
                            type="button"
                            onClick={() => handleQuickAddStock(prod, 10)}
                            className="px-1.5 py-0.5 rounded bg-[#1e1e26] hover:bg-[#282834] text-zinc-300 hover:text-white text-[9px] font-mono border border-zinc-700 cursor-pointer"
                            title="Quick add +10 stock across all sizes"
                          >
                            +10
                          </button>
                        </div>

                        {/* Variant sizes indicators */}
                        <div className="flex gap-1 mt-1 text-[9px] text-zinc-400">
                          {(prod.variants || []).slice(0, 4).map((v) => (
                            <span key={v.id || v.size}>
                              {v.size}:{v.stock}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {prod.isNewArrival && (
                            <span className="text-[8px] px-1 py-0.5 bg-blue-500/20 text-blue-300 rounded font-bold">
                              NEW
                            </span>
                          )}
                          {prod.isBestseller && (
                            <span className="text-[8px] px-1 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">
                              BEST
                            </span>
                          )}
                          {prod.isTrending && (
                            <span className="text-[8px] px-1 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold">
                              TREND
                            </span>
                          )}
                          {prod.isFeatured && (
                            <span className="text-[8px] px-1 py-0.5 bg-cyan-500/20 text-cyan-300 rounded font-bold">
                              FEAT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View on website */}
                          <Link
                            href={`/product/${prod.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-[#22222a] text-zinc-400 hover:text-white transition-colors"
                            title="Preview on live store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit Product */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 rounded hover:bg-[#22222a] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Product */}
                          <button
                            type="button"
                            onClick={() => setProductToDelete(prod)}
                            className="p-1.5 rounded hover:bg-red-950/50 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121217] border border-red-900/50 rounded-[8px] p-6 text-zinc-200 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-mono font-bold uppercase text-white">
                Delete Product?
              </h3>
            </div>
            <p className="text-xs font-mono text-zinc-400 mb-4 leading-relaxed">
              Are you sure you want to permanently delete &ldquo;{productToDelete.name}&rdquo;? This will remove it from the live catalog.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded bg-[#1e1e26] hover:bg-[#282834] text-zinc-300 text-xs font-mono font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold cursor-pointer"
              >
                {isDeleting ? 'DELETING...' : 'YES, DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
