'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  X,
  Check,
  AlertCircle,
  Eye,
  Star,
  Sparkles,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const DEFAULT_COLORS = ['Onyx Black', 'Vintage White', 'Sage Green', 'Washed Grey', 'Cobalt Blue', 'Crimson Red'];

export default function ProductsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    categoryId: '',
    gender: 'unisex',
    price: '',
    mrp: '',
    fitType: 'Oversized Boxy Fit',
    fabricDetails: '100% Combed Cotton, 240 GSM Heavyweight Jersey',
    careInstructions: 'Machine wash cold with like colors. Do not iron directly on print.',
    isPublished: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    isTrending: false,
    selectedCollections: [] as string[],
    images: [] as string[],
    variants: [] as { size: string; color: string; sku: string; stock: number; price: string }[],
  });

  // Image Uploading State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageInputUrl, setImageInputUrl] = useState('');

  // 1. Fetch Products, Categories & Collections
  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      const [prodRes, catRes, colRes] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            category:categories(id, name, slug),
            collections:product_collections(collection:collections(id, name, slug)),
            variants:product_variants(
              id, sku, size, color, price_in_paise,
              inventory(stock_quantity)
            )
          `)
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('collections').select('*').order('name'),
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (colRes.data) setCollections(colRes.data);
    } catch (err: any) {
      error('Failed to load products', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === 'ALL' || p.category_id === selectedCategory;
      const matchesStatus =
        selectedStatus === 'ALL' ||
        (selectedStatus === 'PUBLISHED' && p.is_published) ||
        (selectedStatus === 'DRAFT' && !p.is_published);

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      subtitle: 'Heavyweight Boxy Streetwear Tee',
      description: 'Crafted from 240 GSM luxury combed cotton with drop-shoulder tailoring and a high-rib collar.',
      categoryId: categories[0]?.id || '',
      gender: 'unisex',
      price: '1499',
      mrp: '2499',
      fitType: 'Oversized Boxy Fit',
      fabricDetails: '100% Combed Cotton, 240 GSM Heavyweight Jersey',
      careInstructions: 'Machine wash cold with like colors. Do not iron directly on print.',
      isPublished: true,
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      isTrending: false,
      selectedCollections: [],
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      ],
      variants: [
        { size: 'S', color: 'Onyx Black', sku: 'TS-BLK-S', stock: 25, price: '1499' },
        { size: 'M', color: 'Onyx Black', sku: 'TS-BLK-M', stock: 40, price: '1499' },
        { size: 'L', color: 'Onyx Black', sku: 'TS-BLK-L', stock: 35, price: '1499' },
        { size: 'XL', color: 'Onyx Black', sku: 'TS-BLK-XL', stock: 20, price: '1499' },
      ],
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: any) => {
    setEditingProduct(p);

    const existingVariants = (p.variants || []).map((v: any) => ({
      size: v.size,
      color: v.color,
      sku: v.sku,
      stock: v.inventory?.[0]?.stock_quantity ?? v.inventory?.stock_quantity ?? 0,
      price: v.price_in_paise ? (v.price_in_paise / 100).toString() : (p.price_in_paise / 100).toString(),
    }));

    const existingColls = (p.collections || []).map((c: any) => c.collection?.id).filter(Boolean);

    setFormData({
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle || '',
      description: p.description,
      categoryId: p.category_id || '',
      gender: p.gender || 'unisex',
      price: (p.price_in_paise / 100).toString(),
      mrp: (p.mrp_in_paise / 100).toString(),
      fitType: p.fit_type || 'Oversized Boxy Fit',
      fabricDetails: Array.isArray(p.fabric_details) ? p.fabric_details.join(', ') : '',
      careInstructions: Array.isArray(p.care_instructions) ? p.care_instructions.join(', ') : '',
      isPublished: !!p.is_published,
      isFeatured: !!p.is_featured,
      isBestseller: !!p.is_bestseller,
      isNewArrival: !!p.is_new_arrival,
      isTrending: !!p.is_trending,
      selectedCollections: existingColls,
      images: Array.isArray(p.images) ? p.images : [],
      variants: existingVariants.length > 0 ? existingVariants : [
        { size: 'M', color: 'Onyx Black', sku: `${p.slug}-M`, stock: 20, price: (p.price_in_paise / 100).toString() },
      ],
    });
    setIsModalOpen(true);
  };

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingProduct ? prev.slug : slug,
    }));
  };

  // Upload image to Supabase Storage bucket 'product-images'
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = `products/${filename}`;

      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadErr) {
        throw new Error(uploadErr.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, publicUrl],
      }));
      success('Image uploaded', 'Stored in persistent Supabase CDN storage.');
    } catch (err: any) {
      error('Image upload failed', err.message || 'Make sure storage bucket exists.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!imageInputUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageInputUrl.trim()],
    }));
    setImageInputUrl('');
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Make primary image
  const handleMakePrimary = (index: number) => {
    setFormData((prev) => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: [selected, ...rest] };
    });
  };

  // Save Product (Insert or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const pricePaise = Math.round(parseFloat(formData.price) * 100);
      const mrpPaise = Math.round(parseFloat(formData.mrp) * 100);
      const discount = mrpPaise > pricePaise ? Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100) : 0;

      const fabricArr = formData.fabricDetails.split(',').map((s) => s.trim()).filter(Boolean);
      const careArr = formData.careInstructions.split(',').map((s) => s.trim()).filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        subtitle: formData.subtitle.trim() || null,
        description: formData.description.trim(),
        category_id: formData.categoryId || null,
        gender: formData.gender as any,
        price_in_paise: pricePaise,
        mrp_in_paise: mrpPaise,
        discount_percent: discount,
        fit_type: formData.fitType,
        fabric_details: fabricArr,
        care_instructions: careArr,
        images: formData.images,
        is_published: formData.isPublished,
        is_featured: formData.isFeatured,
        is_bestseller: formData.isBestseller,
        is_new_arrival: formData.isNewArrival,
        is_trending: formData.isTrending,
        available_sizes: Array.from(new Set(formData.variants.map((v) => v.size))),
        available_colors: Array.from(new Set(formData.variants.map((v) => v.color))),
        tags: [formData.gender, formData.fitType.toLowerCase()],
        updated_at: new Date().toISOString(),
      };

      let productId = editingProduct?.id;

      if (editingProduct) {
        // UPDATE PRODUCT
        const { error: updateErr } = await supabase
          .from('products')
          .update(payload)
          .eq('id', editingProduct.id);

        if (updateErr) throw updateErr;

        await logActivity('PRODUCT_UPDATED', 'product', editingProduct.id, { name: payload.name });
      } else {
        // INSERT PRODUCT
        const { data: newProd, error: insertErr } = await supabase
          .from('products')
          .insert(payload)
          .select()
          .single();

        if (insertErr) throw insertErr;
        productId = newProd.id;

        await logActivity('PRODUCT_CREATED', 'product', productId, { name: payload.name });
      }

      // Sync Product Collections
      await supabase.from('product_collections').delete().eq('product_id', productId);
      if (formData.selectedCollections.length > 0) {
        const colPayload = formData.selectedCollections.map((colId) => ({
          product_id: productId,
          collection_id: colId,
        }));
        await supabase.from('product_collections').insert(colPayload);
      }

      // Sync Product Variants & Inventory
      for (const variant of formData.variants) {
        const variantPrice = variant.price ? Math.round(parseFloat(variant.price) * 100) : pricePaise;

        // Check if variant exists
        const { data: existingVariant } = await supabase
          .from('product_variants')
          .select('id')
          .eq('product_id', productId)
          .eq('sku', variant.sku)
          .maybeSingle();

        let variantId = existingVariant?.id;

        if (variantId) {
          await supabase
            .from('product_variants')
            .update({
              size: variant.size as any,
              color: variant.color,
              price_in_paise: variantPrice,
              updated_at: new Date().toISOString(),
            })
            .eq('id', variantId);
        } else {
          const { data: newVar } = await supabase
            .from('product_variants')
            .insert({
              product_id: productId,
              sku: variant.sku,
              size: variant.size as any,
              color: variant.color,
              color_code: '#000000',
              price_in_paise: variantPrice,
            })
            .select()
            .single();
          variantId = newVar?.id;
        }

        // Upsert Inventory
        if (variantId) {
          const { data: invRow } = await supabase
            .from('inventory')
            .select('id')
            .eq('variant_id', variantId)
            .maybeSingle();

          if (invRow) {
            await supabase
              .from('inventory')
              .update({
                stock_quantity: variant.stock,
                updated_at: new Date().toISOString(),
              })
              .eq('id', invRow.id);
          } else {
            await supabase.from('inventory').insert({
              variant_id: variantId,
              stock_quantity: variant.stock,
              low_stock_threshold: 5,
            });
          }
        }
      }

      success(
        editingProduct ? 'Product Updated' : 'Product Published',
        `${formData.name} is now live in Supabase catalog.`
      );
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      error('Failed to save product', err.message || 'Check database permissions');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error: delErr } = await supabase
        .from('products')
        .delete()
        .eq('id', deleteCandidate.id);

      if (delErr) throw delErr;

      await logActivity('PRODUCT_DELETED', 'product', deleteCandidate.id, {
        name: deleteCandidate.name,
      });

      success('Product deleted', `${deleteCandidate.name} has been removed.`);
      setDeleteCandidate(null);
      loadData();
    } catch (err: any) {
      error('Delete failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Products Directory
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {products.length} garments configured across all streetwear categories
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search garments by name or slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
            />
          </div>

          <div className="flex gap-2.5 flex-wrap sm:flex-nowrap">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-800 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Data Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Fetching catalog from Supabase..." />
        ) : paginatedProducts.length === 0 ? (
          <EmptyState
            title="No garments found"
            description="No products match your current search query or filter selection."
            action={{
              label: 'Add First Garment',
              onClick: handleOpenAdd,
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">GARMENT</th>
                  <th className="py-3 px-4 font-semibold">CATEGORY</th>
                  <th className="py-3 px-4 font-semibold">STOCK</th>
                  <th className="py-3 px-4 font-semibold">PRICE</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginatedProducts.map((p) => {
                  const totalStock = (p.variants || []).reduce(
                    (sum: number, v: any) =>
                      sum + (v.inventory?.[0]?.stock_quantity ?? v.inventory?.stock_quantity ?? 0),
                    0
                  );
                  const primaryImage =
                    p.images?.[0] ||
                    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80';

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-md bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                            <Image
                              src={primaryImage}
                              alt={p.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-zinc-950 truncate max-w-[220px]">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-zinc-400 font-mono truncate">
                              /{p.slug}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {p.is_bestseller && (
                                <Badge variant="warning" size="sm">
                                  Bestseller
                                </Badge>
                              )}
                              {p.is_featured && (
                                <Badge variant="street" size="sm">
                                  Featured
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-zinc-600 font-medium">
                        {p.category?.name || 'Uncategorized'}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span
                          className={`font-semibold ${
                            totalStock <= 5
                              ? 'text-rose-600'
                              : totalStock <= 15
                              ? 'text-amber-600'
                              : 'text-zinc-900'
                          }`}
                        >
                          {totalStock} units
                        </span>
                        <div className="text-[10px] text-zinc-400">
                          {p.variants?.length || 0} variants
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                        ₹{(p.price_in_paise / 100).toLocaleString('en-IN')}
                        {p.mrp_in_paise > p.price_in_paise && (
                          <span className="text-[10px] font-normal text-zinc-400 line-through ml-1.5">
                            ₹{(p.mrp_in_paise / 100).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={p.is_published ? 'success' : 'neutral'}
                          size="sm"
                          dot
                        >
                          {p.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            title="Edit Garment"
                            className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(p)}
                            title="Delete Garment"
                            className="p-1.5 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
          totalItems={filteredProducts.length}
          pageSize={pageSize}
        />
      </Card>

      {/* Create / Edit Garment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Streetwear Garment' : 'Create New Garment'}
        description="Sync garment catalog, variant matrix, stock and persistent imagery with Supabase."
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
              1. Basic Garment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acid Wash Heavyweight Tee"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="acid-wash-heavyweight-tee"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Subtitle / Drop Tag
              </label>
              <input
                type="text"
                placeholder="240 GSM Luxury Drop-Shoulder Streetwear"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Editorial garment description..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-950 focus:outline-hidden cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="1499"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Compare at MRP (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="2499"
                  value={formData.mrp}
                  onChange={(e) =>
                    setFormData({ ...formData, mrp: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          </div>

          {/* Persistent Media & Imagery */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
                2. Product Imagery (Persistent Supabase CDN)
              </h4>
              <span className="text-[11px] text-zinc-400">
                {formData.images.length} images added
              </span>
            </div>

            {/* Upload or Add URL */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer shrink-0">
                <Upload className="w-4 h-4 text-zinc-500" />
                <span>{isUploadingImage ? 'Uploading CDN...' : 'Upload Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingImage}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex-1 flex gap-2">
                <input
                  type="url"
                  placeholder="or paste external image URL..."
                  value={imageInputUrl}
                  onChange={(e) => setImageInputUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Thumbnail Preview Matrix */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                {formData.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-lg border border-zinc-200 overflow-hidden aspect-3/4 bg-zinc-100"
                  >
                    <Image
                      src={img}
                      alt={`Product image ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-white uppercase">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleMakePrimary(idx)}
                          className="px-1.5 py-0.5 rounded bg-white text-[9px] font-bold text-black"
                        >
                          Make Primary
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded bg-rose-600 text-white"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Variants & Inventory */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
                3. Variant Matrix &amp; Inventory Stock
              </h4>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    variants: [
                      ...formData.variants,
                      {
                        size: 'M',
                        color: 'Onyx Black',
                        sku: `${formData.slug || 'TS'}-${Date.now().toString().slice(-4)}`,
                        stock: 10,
                        price: formData.price,
                      },
                    ],
                  })
                }
                className="text-xs font-semibold text-black hover:underline cursor-pointer"
              >
                + Add Variant Row
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.variants.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/50"
                >
                  <div className="w-20">
                    <select
                      value={v.size}
                      onChange={(e) => {
                        const updated = [...formData.variants];
                        updated[i].size = e.target.value;
                        setFormData({ ...formData, variants: updated });
                      }}
                      className="w-full px-2 py-1.5 rounded border border-zinc-200 text-xs bg-white text-zinc-950 font-bold"
                    >
                      {DEFAULT_SIZES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Color Name"
                      value={v.color}
                      onChange={(e) => {
                        const updated = [...formData.variants];
                        updated[i].color = e.target.value;
                        setFormData({ ...formData, variants: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs text-zinc-950 bg-white"
                    />
                  </div>

                  <div className="w-28">
                    <input
                      type="text"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => {
                        const updated = [...formData.variants];
                        updated[i].sku = e.target.value;
                        setFormData({ ...formData, variants: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs font-mono text-zinc-950 bg-white"
                    />
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      placeholder="Stock"
                      value={v.stock}
                      onChange={(e) => {
                        const updated = [...formData.variants];
                        updated[i].stock = parseInt(e.target.value) || 0;
                        setFormData({ ...formData, variants: updated });
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-zinc-200 text-xs font-mono font-bold text-zinc-950 bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.variants.filter((_, idx) => idx !== i);
                      setFormData({ ...formData, variants: updated });
                    }}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility and Flags */}
          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 tracking-wider">
              4. Publication &amp; Merchandising Flags
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                  className="rounded text-black focus:ring-0"
                />
                <span className="text-xs font-semibold text-zinc-900">
                  Published
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className="rounded text-black focus:ring-0"
                />
                <span className="text-xs font-semibold text-zinc-900">
                  Featured
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBestseller}
                  onChange={(e) =>
                    setFormData({ ...formData, isBestseller: e.target.checked })
                  }
                  className="rounded text-black focus:ring-0"
                />
                <span className="text-xs font-semibold text-zinc-900">
                  Bestseller
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isTrending}
                  onChange={(e) =>
                    setFormData({ ...formData, isTrending: e.target.checked })
                  }
                  className="rounded text-black focus:ring-0"
                />
                <span className="text-xs font-semibold text-zinc-900">
                  Trending
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-black hover:bg-zinc-800 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Syncing to Supabase...' : editingProduct ? 'Save Changes' : 'Create & Publish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Streetwear Garment"
        message={`Are you sure you want to permanently delete "${deleteCandidate?.name}"? This action will remove associated variants and inventory from the database.`}
        confirmLabel="Permanently Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
