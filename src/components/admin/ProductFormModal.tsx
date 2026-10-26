'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  Star,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { Product, ProductCategory, ProductGender, ProductVariant } from '@/types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => Promise<void>;
  initialProduct?: Product | null;
}

const CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: 'Oversized T-Shirts', value: 'oversized-t-shirts' },
  { label: 'Graphic Tees', value: 'graphic-tees' },
  { label: 'Hoodies & Sweatshirts', value: 'hoodies-sweatshirts' },
  { label: 'Bottomwear & Cargos', value: 'bottomwear' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Classic T-Shirts', value: 't-shirts' },
];

const GENDERS: { label: string; value: ProductGender }[] = [
  { label: 'Unisex', value: 'unisex' },
  { label: 'Men', value: 'men' },
  { label: 'Women', value: 'women' },
];

const FIT_TYPES = ['Oversized Boxy', 'Relaxed Fit', 'Drop Shoulder', 'Regular Fit', 'Tactical Wide-Leg'];

const SIZES: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}: ProductFormModalProps) {
  const isEditing = !!initialProduct;

  // Form State
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('oversized-t-shirts');
  const [gender, setGender] = useState<ProductGender>('unisex');
  const [fitType, setFitType] = useState('Oversized Boxy');
  const [price, setPrice] = useState<number>(1299);
  const [mrp, setMrp] = useState<number>(1999);
  const [description, setDescription] = useState('');
  const [fabricDetailsText, setFabricDetailsText] = useState('');
  const [careInstructionsText, setCareInstructionsText] = useState('');
  const [tagsText, setTagsText] = useState('');

  // Badges
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Photos
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Colors
  const [colorName, setColorName] = useState('Pitch Black');
  const [colorCode, setColorCode] = useState('#080808');

  // Size stock matrix
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({
    XS: 0,
    S: 15,
    M: 20,
    L: 15,
    XL: 10,
    XXL: 5,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hydrate form when initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setSubtitle(initialProduct.subtitle || '');
      setCategory(initialProduct.category);
      setGender(initialProduct.gender);
      setFitType(initialProduct.fitType);
      setPrice(initialProduct.price);
      setMrp(initialProduct.mrp);
      setDescription(initialProduct.description);
      setFabricDetailsText((initialProduct.fabricDetails || []).join('\n'));
      setCareInstructionsText((initialProduct.careInstructions || []).join('\n'));
      setTagsText((initialProduct.tags || []).join(', '));
      setIsNewArrival(!!initialProduct.isNewArrival);
      setIsBestseller(!!initialProduct.isBestseller);
      setIsTrending(!!initialProduct.isTrending);
      setIsFeatured(!!initialProduct.isFeatured);
      setImages(initialProduct.images || []);

      if (initialProduct.availableColors && initialProduct.availableColors.length > 0) {
        setColorName(initialProduct.availableColors[0].name);
        setColorCode(initialProduct.availableColors[0].code);
      }

      const map: Record<string, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
      if (initialProduct.variants) {
        initialProduct.variants.forEach((v) => {
          map[v.size] = (map[v.size] || 0) + (v.stock || 0);
        });
      }
      setSizeStock(map);
    } else {
      // Defaults for new product
      setName('');
      setSubtitle('260 GSM Super-combed French Terry Drop-Shoulder');
      setCategory('oversized-t-shirts');
      setGender('unisex');
      setFitType('Oversized Boxy');
      setPrice(1299);
      setMrp(1999);
      setDescription('Engineered with high-density combed cotton for an exaggerated street silhouette.');
      setFabricDetailsText('260 GSM 100% Super-Combed Compact Cotton\nBio-washed & silicone softened\nPreshrunk fabric\nReinforced 1x1 rib neckline');
      setCareInstructionsText('Machine wash cold inside-out\nDo not bleach\nDry in shade\nIron inside out');
      setTagsText('New Drop, Heavyweight, Streetwear');
      setIsNewArrival(true);
      setIsBestseller(false);
      setIsTrending(false);
      setIsFeatured(false);
      setImages([
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
      ]);
      setColorName('Pitch Black');
      setColorCode('#080808');
      setSizeStock({ XS: 0, S: 15, M: 20, L: 15, XL: 10, XXL: 5 });
    }
    setErrorMsg('');
  }, [initialProduct, isOpen]);

  // Calculate discount percent
  const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  // Total stock
  const totalStock = Object.values(sizeStock).reduce((a, b) => a + Number(b || 0), 0);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg('');

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          setImages((prev) => [...prev, data.url]);
        } else {
          setErrorMsg(data.error || 'Upload failed');
        }
      }
    } catch (err: any) {
      setErrorMsg('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  // Add Image URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Move to Primary
  const handleMakePrimary = (index: number) => {
    setImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [selected, ...rest];
    });
  };

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }
    if (images.length === 0) {
      setErrorMsg('Please upload or provide at least one photo.');
      return;
    }
    if (price <= 0 || mrp <= 0) {
      setErrorMsg('Price and MRP must be greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Build variants
      const activeSizes = SIZES.filter((sz) => sizeStock[sz] > 0);
      const variants: ProductVariant[] = SIZES.map((sz, idx) => ({
        id: `v-${Date.now()}-${sz.toLowerCase()}`,
        sku: `TS-${name.slice(0, 4).toUpperCase()}-${sz}-${idx + 1}`,
        size: sz,
        color: colorName,
        colorCode: colorCode,
        stock: sizeStock[sz] || 0,
        price,
      }));

      const fabricDetails = fabricDetailsText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const careInstructions = careInstructionsText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      const tags = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const productPayload: Partial<Product> = {
        ...(initialProduct ? { id: initialProduct.id } : {}),
        name: name.trim(),
        subtitle: subtitle.trim() || undefined,
        category,
        gender,
        fitType,
        price,
        mrp,
        discountPercent,
        description: description.trim(),
        fabricDetails,
        careInstructions,
        tags,
        images,
        isNewArrival,
        isBestseller,
        isTrending,
        isFeatured,
        variants,
        availableColors: [{ name: colorName, code: colorCode }],
        availableSizes: activeSizes.length > 0 ? activeSizes : ['M', 'L'],
        totalStock,
      };

      await onSave(productPayload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#101014] border border-[#272730] rounded-[8px] shadow-2xl my-8 overflow-hidden text-zinc-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222228] flex items-center justify-between bg-[#15151b]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
                {isEditing ? 'UPDATE' : 'CREATE'}
              </span>
              <h2 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
                {isEditing ? `Edit: ${initialProduct?.name}` : 'Add New Streetwear Product'}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Updates pricing, photos, variants, stock, and live store catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded bg-[#202028] hover:bg-[#2a2a35] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded bg-red-950/40 border border-red-800/50 text-red-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SECTION 1: PHOTOS & MEDIA */}
          <div className="space-y-3 p-4 rounded-[6px] bg-[#16161c] border border-[#25252e]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                <span>Product Photos ({images.length})</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">
                First image is storefront thumbnail
              </span>
            </div>

            {/* Upload Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Dropzone */}
              <label className="border-2 border-dashed border-[#2f2f3b] hover:border-zinc-500 rounded-[6px] p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#111116] hover:bg-[#181820]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                <span className="text-xs font-mono font-bold text-white">
                  {isUploading ? 'Uploading file...' : 'Upload Photos from Device'}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono mt-1">
                  JPG, PNG, WEBP &bull; Max 10MB
                </span>
              </label>

              {/* Paste URL */}
              <div className="flex flex-col justify-between p-4 rounded-[6px] bg-[#111116] border border-[#23232c]">
                <span className="text-xs font-mono text-zinc-300 font-bold mb-2">
                  Or Add Image URL (Unsplash / CDN)
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-[#181820] text-zinc-200 border border-[#2a2a35] text-xs font-mono px-3 py-2 rounded focus:outline-hidden focus:border-zinc-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-white text-black text-xs font-mono font-bold rounded hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
                  >
                    ADD URL
                  </button>
                </div>
              </div>
            </div>

            {/* Photos Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-[4px] overflow-hidden bg-black border border-[#2c2c38]"
                  >
                    <Image
                      src={img}
                      alt={`Product Photo ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />

                    {/* Primary Badge */}
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 text-[8px] font-mono px-1.5 py-0.5 rounded bg-emerald-500 text-black font-extrabold uppercase tracking-wider z-10">
                        PRIMARY
                      </span>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleMakePrimary(idx)}
                          className="px-2 py-1 bg-white text-black text-[9px] font-mono font-bold rounded hover:bg-zinc-200 cursor-pointer"
                        >
                          SET PRIMARY
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="px-2 py-1 bg-red-600 text-white text-[9px] font-mono font-bold rounded hover:bg-red-700 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: BASIC PRODUCT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Noir Heavyweight Oversized Tee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono px-3.5 py-2.5 rounded focus:outline-hidden focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                Subtitle / Spec Tagline
              </label>
              <input
                type="text"
                placeholder="e.g. 260 GSM Super-combed French Terry Drop-Shoulder"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono px-3.5 py-2.5 rounded focus:outline-hidden focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono px-3.5 py-2.5 rounded focus:outline-hidden focus:border-zinc-500 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                  Gender Target
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as ProductGender)}
                  className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono px-3 py-2.5 rounded focus:outline-hidden focus:border-zinc-500 cursor-pointer"
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                  Fit Type
                </label>
                <select
                  value={fitType}
                  onChange={(e) => setFitType(e.target.value)}
                  className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono px-3 py-2.5 rounded focus:outline-hidden focus:border-zinc-500 cursor-pointer"
                >
                  {FIT_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRICING & DISCOUNTS */}
          <div className="p-4 rounded-[6px] bg-[#16161c] border border-[#25252e]">
            <h3 className="text-xs font-mono uppercase font-bold text-white mb-3">
              Pricing &amp; Margins
            </h3>
            <div className="grid grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value) || 0)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white text-sm font-mono font-bold px-3 py-2 rounded focus:outline-hidden focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                  MRP Price (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={mrp}
                  onChange={(e) => setMrp(Number(e.target.value) || 0)}
                  className="w-full bg-[#111116] border border-[#2c2c38] text-white text-sm font-mono font-bold px-3 py-2 rounded focus:outline-hidden focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                  Discount Calculated
                </label>
                <div className="h-[38px] px-3 rounded bg-[#111116] border border-[#2c2c38] flex items-center justify-between font-mono text-sm font-bold text-emerald-400">
                  <span>{discountPercent}% OFF</span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    Save ₹{Math.max(0, mrp - price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: COLOR & SIZE STOCK INVENTORY */}
          <div className="p-4 rounded-[6px] bg-[#16161c] border border-[#25252e] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase font-bold text-white">
                  Variants &amp; Stock Inventory
                </h3>
                <p className="text-[11px] font-mono text-zinc-400">
                  Total live inventory: <span className="text-emerald-400 font-bold">{totalStock} units</span>
                </p>
              </div>

              {/* Color Details */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                  className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                  title="Pick Color Swatch"
                />
                <input
                  type="text"
                  placeholder="Color Name"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  className="w-32 bg-[#111116] border border-[#2c2c38] text-xs font-mono px-2 py-1.5 rounded focus:outline-hidden"
                />
              </div>
            </div>

            {/* Size Stock Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
              {SIZES.map((sz) => (
                <div
                  key={sz}
                  className="p-3 rounded bg-[#111116] border border-[#24242e] flex flex-col items-center"
                >
                  <span className="text-xs font-mono font-black text-white mb-1.5">
                    SIZE {sz}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={sizeStock[sz] || 0}
                    onChange={(e) =>
                      setSizeStock((prev) => ({
                        ...prev,
                        [sz]: Math.max(0, parseInt(e.target.value, 10) || 0),
                      }))
                    }
                    className="w-full text-center bg-[#181820] border border-[#2c2c38] text-xs font-mono font-bold text-zinc-200 py-1 rounded focus:outline-hidden focus:border-zinc-500"
                  />
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">units in stock</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: BADGES & STORE FLAGS */}
          <div className="p-4 rounded-[6px] bg-[#16161c] border border-[#25252e]">
            <h3 className="text-xs font-mono uppercase font-bold text-white mb-3">
              Storefront Badges &amp; Drop Tags
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <label className="flex items-center gap-2 p-2.5 rounded bg-[#111116] border border-[#24242e] cursor-pointer hover:border-zinc-500">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                />
                <span className="text-xs font-mono font-bold text-zinc-200">New Drop</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#111116] border border-[#24242e] cursor-pointer hover:border-zinc-500">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                />
                <span className="text-xs font-mono font-bold text-zinc-200">Bestseller</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#111116] border border-[#24242e] cursor-pointer hover:border-zinc-500">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                />
                <span className="text-xs font-mono font-bold text-zinc-200">Trending</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded bg-[#111116] border border-[#24242e] cursor-pointer hover:border-zinc-500">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-900 text-white focus:ring-0"
                />
                <span className="text-xs font-mono font-bold text-zinc-200">Featured</span>
              </label>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase text-zinc-400 block mb-1">
                Custom Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Heavyweight, 260 GSM, Bio-washed, Oversized"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full bg-[#111116] border border-[#2a2a35] text-xs font-mono px-3 py-2 rounded focus:outline-hidden focus:border-zinc-500"
              />
            </div>
          </div>

          {/* SECTION 6: DESCRIPTION & SPECIFICATIONS */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                placeholder="Product description detailing fabric, silhouette, and story..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono p-3 rounded focus:outline-hidden focus:border-zinc-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                  Fabric Details (1 per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="260 GSM 100% Super-Combed Compact Cotton&#10;Bio-washed & silicone softened"
                  value={fabricDetailsText}
                  onChange={(e) => setFabricDetailsText(e.target.value)}
                  className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono p-3 rounded focus:outline-hidden focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase font-bold text-zinc-300 block mb-1">
                  Care Instructions (1 per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Machine wash cold inside-out&#10;Do not bleach&#10;Tumble dry low"
                  value={careInstructionsText}
                  onChange={(e) => setCareInstructionsText(e.target.value)}
                  className="w-full bg-[#16161c] border border-[#2a2a35] text-white text-xs font-mono p-3 rounded focus:outline-hidden focus:border-zinc-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-[#222228] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded bg-[#1e1e26] hover:bg-[#282834] text-zinc-300 text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded bg-white hover:bg-zinc-200 text-black text-xs font-mono font-black tracking-wider transition-colors cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>SAVING...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'UPDATE PRODUCT' : 'PUBLISH PRODUCT'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
