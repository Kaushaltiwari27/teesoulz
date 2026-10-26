'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Search,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logActivity } from '@/lib/activity';
import { useToast } from '@/context/ToastContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import EmptyState from '@/components/ui/EmptyState';

export default function MediaLibraryPage() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const [deleteCandidate, setDeleteCandidate] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      // List files from products folder
      const { data, error: listErr } = await supabase.storage
        .from('product-images')
        .list('products', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listErr) {
        console.warn('Storage list warning:', listErr.message);
        // Fallback or empty
        setFiles([]);
      } else {
        const enriched = (data || []).map((file) => {
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(`products/${file.name}`);
          return {
            ...file,
            publicUrl,
          };
        });
        setFiles(enriched);
      }
    } catch (err: any) {
      error('Failed to load media', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setIsUploading(true);
    try {
      const supabase = createClient();

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const ext = file.name.split('.').pop() || 'jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
        const filePath = `products/${filename}`;

        const { error: upErr } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { upsert: true });

        if (upErr) throw upErr;
      }

      await logActivity('MEDIA_UPLOADED', 'storage', 'product-images', {
        count: fileList.length,
      });

      success('Assets uploaded', 'Files are available in Supabase CDN storage.');
      loadMedia();
    } catch (err: any) {
      error('Upload failed', err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    success('URL Copied', 'Asset public CDN link copied to clipboard.');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { error: delErr } = await supabase.storage
        .from('product-images')
        .remove([`products/${deleteCandidate.name}`]);

      if (delErr) throw delErr;

      await logActivity('MEDIA_DELETED', 'storage', deleteCandidate.name);
      success('File deleted', `${deleteCandidate.name} removed from storage.`);
      setDeleteCandidate(null);
      loadMedia();
    } catch (err: any) {
      error('Delete failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-950 font-sans">
            Media Storage Library
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Cloud assets stored on the persistent Supabase <code className="text-zinc-700 bg-zinc-100 px-1 py-0.5 rounded font-mono">product-images</code> CDN bucket
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadMedia}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:border-black"
          />
        </div>
      </Card>

      <Card>
        {loading ? (
          <LoadingSpinner label="Auditing Supabase Storage bucket..." />
        ) : filteredFiles.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No media files uploaded"
            description="Upload garment photography, drop lookbooks and editorial assets directly to Supabase CDN."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id || file.name}
                className="group relative rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden flex flex-col"
              >
                <div className="aspect-3/4 relative bg-zinc-100 overflow-hidden">
                  <Image
                    src={file.publicUrl}
                    alt={file.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(file.publicUrl)}
                      title="Copy CDN Link"
                      className="p-2 rounded-full bg-white text-black hover:bg-zinc-200"
                    >
                      {copiedUrl === file.publicUrl ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={file.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open full size"
                      className="p-2 rounded-full bg-white text-black hover:bg-zinc-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(file)}
                      title="Delete asset"
                      className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2 bg-white border-t border-zinc-100">
                  <div className="text-[11px] font-mono text-zinc-900 truncate" title={file.name}>
                    {file.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {file.metadata?.size
                      ? `${(file.metadata.size / 1024).toFixed(0)} KB`
                      : 'CDN Asset'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete CDN Asset"
        message={`Permanently delete "${deleteCandidate?.name}" from Supabase Storage? Garments referencing this URL will no longer be able to display this image.`}
        confirmLabel="Delete Asset"
        isLoading={isDeleting}
      />
    </div>
  );
}
