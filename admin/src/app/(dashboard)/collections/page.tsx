'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Layers, Upload, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CollectionsPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    bannerUrl: '',
    isActive: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: colErr } = await supabase
        .from('collections')
        .select(`
          *,
          product_collections(count)
        `)
        .order('created_at', { ascending: false });

      if (colErr) throw colErr;
      setCollections(data || []);
    } catch (err: any) {
      error('Failed to load collections', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      slug: '',
      description: 'Curated streetwear collection line.',
      bannerUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCollection(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      bannerUrl: c.banner_url || '',
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
      slug: editingCollection ? prev.slug : slug,
    }));
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `collections/${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      setFormData((prev) => ({ ...prev, bannerUrl: publicUrl }));
      success('Banner uploaded', 'Stored in Supabase persistent storage.');
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
        banner_url: formData.bannerUrl.trim() || null,
        is_active: formData.isActive,
        updated_at: new Date().toISOString(),
      };

      if (editingCollection) {
        const { error: upErr } = await supabase
          .from('collections')
          .update(payload)
          .eq('id', editingCollection.id);
        if (upErr) throw upErr;
        await logActivity('COLLECTION_UPDATED', 'collection', editingCollection.id, { name: payload.name });
        success('Collection updated', `${payload.name} saved.`);
      } else {
        const { error: inErr } = await supabase.from('collections').insert(payload);
        if (inErr) throw inErr;
        await logActivity('COLLECTION_CREATED', 'collection', null, { name: payload.name });
        success('Collection launched', `${payload.name} created.`);
      }

      setIsModalOpen(false);
      loadCollections();
    } catch (err: any) {
      error('Failed to save collection', err.message);
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
        .from('collections')
        .delete()
        .eq('id', deleteCandidate.id);

      if (delErr) throw delErr;

      await logActivity('COLLECTION_DELETED', 'collection', deleteCandidate.id, {
        name: deleteCandidate.name,
      });

      success('Collection removed', `${deleteCandidate.name} has been deleted.`);
      setDeleteCandidate(null);
      loadCollections();
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
            Curated Collections &amp; Drops
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage lookbook lines, seasonal drops and limited capsules
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection Drop</span>
        </button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collections by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner label="Loading collections..." />
        ) : filteredCollections.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No collections created"
            description="Create editorial capsules like 'Winter Drop '26', 'Cyberpunk Capsule', or 'Monochrome Series'."
            action={{ label: 'Create First Collection', onClick: handleOpenAdd }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-500 font-mono">
                  <th className="py-3 px-4 font-semibold">COLLECTION DROP</th>
                  <th className="py-3 px-4 font-semibold">SLUG</th>
                  <th className="py-3 px-4 font-semibold">GARMENTS LINKED</th>
                  <th className="py-3 px-4 font-semibold">STATUS</th>
                  <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCollections.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                          {c.banner_url ? (
                            <Image
                              src={c.banner_url}
                              alt={c.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Layers className="w-5 h-5 text-zinc-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-950">{c.name}</div>
                          {c.description && (
                            <div className="text-[11px] text-zinc-400 truncate max-w-[240px]">
                              {c.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-500">
                      /{c.slug}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <span className="font-semibold text-zinc-900">
                        {c.product_collections?.[0]?.count ?? 0}
                      </span>{' '}
                      garments
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={c.is_active ? 'street' : 'neutral'} size="sm" dot>
                        {c.is_active ? 'Live Drop' : 'Archived'}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? 'Edit Collection Drop' : 'Create Collection Drop'}
        description="Curate lookbook imagery and linked products."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">
              Collection Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Acid Rain Capsule '26"
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
              Editorial Description
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
              Drop Banner Image
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
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
                  onChange={handleBannerUpload}
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
              Published and Active
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
              {isSaving ? 'Saving...' : 'Save Drop'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete Collection Drop"
        message={`Delete "${deleteCandidate?.name}"? Garments will remain in the catalog but will be unlinked from this collection.`}
        confirmLabel="Delete Collection"
        isLoading={isDeleting}
      />
    </div>
  );
}
