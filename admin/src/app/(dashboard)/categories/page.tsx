'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, FolderTree, Upload, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CategoriesPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: catErr } = await supabase
        .from('categories')
        .select(`
          *,
          products(count)
        `)
        .order('display_order', { ascending: true });

      if (catErr) throw catErr;
      setCategories(data || []);
    } catch (err: any) {
      error('Failed to load categories', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: 'Streetwear category line.',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      imageUrl: c.image_url || '',
      displayOrder: c.display_order || 0,
      isActive: !!c.is_active,
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: editingCategory ? prev.slug : slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `categories/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      setFormData((prev) => ({ ...prev, imageUrl: publicUrl }));
      success('Category image uploaded', 'Stored in Supabase persistent storage.');
    } catch (err: any) {
      error('Upload failed', err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        image_url: formData.imageUrl.trim() || null,
        display_order: Number(formData.displayOrder) || 0,
        is_active: formData.isActive,
        updated_at: new Date().toISOString(),
      };

      if (editingCategory) {
        const { error: upErr } = await supabase
          .from('categories')
          .update(payload)
          .eq('id', editingCategory.id);
        if (upErr) throw upErr;
        await logActivity('CATEGORY_UPDATED', 'category', editingCategory.id, { name: payload.name });
        success('Category updated', `${payload.name} has been updated.`);
      } else {
        const { error: inErr } = await supabase.from('categories').insert(payload);
        if (inErr) throw inErr;
        await logActivity('CATEGORY_CREATED', 'category', null, { name: payload.name });
        success('Category created', `${payload.name} is now active.`);
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      error('Failed to save category', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error: delErr } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteCandidate.id);

      if (delErr) throw delErr;

      await logActivity('CATEGORY_DELETED', 'category', deleteCandidate.id, {
        name: deleteCandidate.name,
      });

      success('Category removed', `${deleteCandidate.name} deleted.`);
      setDeleteCandidate(null);
      loadCategories();
    } catch (err: any) {
      error('Delete failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Product Categories
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Organize catalog navigation, gender taxonomies, and filter badges
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading categories..." />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No categories found"
            description="Create categories like T-Shirts, Hoodies, Cargo Pants, or Accessories."
            action={{ label: 'Create First Category', onClick: handleOpenAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">CATEGORY</th>
                  <th className="py-3 px-4 font-semibold">SLUG</th>
                  <th className="py-3 px-4 font-semibold">ORDER</th>
                  <th className="py-3 px-4 font-semibold">PRODUCTS</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCategories.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                          {c.image_url ? (
                            <Image
                              src={c.image_url}
                              alt={c.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <FolderTree className="w-5 h-5 text-zinc-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-950">{c.name}</div>
                          {c.description && (
                            <div className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                              {c.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-500">
                      /{c.slug}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-zinc-700">
                      #{c.display_order}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-zinc-900">
                        {c.products?.[0]?.count ?? 0}
                      </span>{' '}
                      items
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={c.is_active ? 'success' : 'neutral'} size="sm" dot>
                        {c.is_active ? 'Active' : 'Disabled'}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(c)}
                          className="p-1.5 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        description="Configure taxonomy slug, cover image and store sequence."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Oversized T-Shirts"
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Display Sequence Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono text-zinc-950 focus:outline-hidden focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Cover Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-950 focus:outline-hidden focus:border-black"
              />
              <label className="px-3 py-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-700 cursor-pointer flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? '...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded text-black focus:ring-0"
            />
            <span className="text-xs font-semibold text-zinc-900">
              Active in Storefront Navigation
            </span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-black hover:bg-zinc-800 text-xs font-semibold text-white disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Delete "${deleteCandidate?.name}"? Any products assigned to this category will become uncategorized.`}
        confirmLabel="Delete Category"
        isLoading={isDeleting}
      />
    </div>
  );
}
