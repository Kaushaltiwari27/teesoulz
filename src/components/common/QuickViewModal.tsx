'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, Heart, ShieldCheck, ArrowRight, Ruler } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openSizeGuide,
  } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Sync state when quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.images[0] || '');
      const firstVariant = quickViewProduct.variants.find((v) => v.stock > 0) || quickViewProduct.variants[0];
      if (firstVariant) {
        setSelectedSize(firstVariant.size);
        setSelectedColor(firstVariant.color);
      }
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const currentVariant = quickViewProduct.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || quickViewProduct.variants.find((v) => v.size === selectedSize) || quickViewProduct.variants[0];

  const isOutOfStock = !currentVariant || currentVariant.stock <= 0;
  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;
    addToCart(quickViewProduct, currentVariant, quantity);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative min-h-screen sm:min-h-0 sm:max-w-4xl sm:mx-auto sm:my-12 bg-white sm:shadow-2xl z-10 transition-all p-6 sm:p-8">
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 p-2 text-[#777777] hover:text-black hover:bg-[#F3F3F3] rounded-full z-20"
          aria-label="Close quick view"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery Column */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden">
              <Image
                src={selectedImage || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
                priority
              />
              {quickViewProduct.discountPercent && (
                <span className="absolute top-3 left-3 bg-[#080808] text-white text-[10px] font-extrabold uppercase px-2 py-1 tracking-wider">
                  {quickViewProduct.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail row */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {quickViewProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 flex-shrink-0 bg-[#F3F3F3] border-2 transition-all ${
                      selectedImage === img ? 'border-black' : 'border-[#E5E5E5] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`View ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#777777]">
                {quickViewProduct.category.replace('-', ' ')}
              </span>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#080808] mt-1">
                {quickViewProduct.name}
              </h2>

              {quickViewProduct.subtitle && (
                <p className="text-xs text-[#666666] mt-1 font-medium">
                  {quickViewProduct.subtitle}
                </p>
              )}

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-xl font-extrabold text-[#080808]">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.mrp > quickViewProduct.price && (
                  <span className="text-sm text-[#888888] line-through">
                    ₹{quickViewProduct.mrp.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs text-[#22c55e] font-bold">Inclusive of all taxes</span>
              </div>

              {/* Color selection */}
              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-2">
                  Color: <span className="font-normal text-[#111111]">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {quickViewProduct.availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        selectedColor === color.name ? 'border-black ring-2 ring-black/20' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    >
                      {selectedColor === color.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.code.toLowerCase() === '#ffffff' || color.code.toLowerCase() === '#f5f5f5'
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#333333]">
                    Select Size
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      closeQuickView();
                      openSizeGuide();
                    }}
                    className="text-xs text-[#555555] hover:text-black underline flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.availableSizes.map((sz) => {
                    const match = quickViewProduct.variants.find(
                      (v) => v.size === sz && (!selectedColor || v.color === selectedColor)
                    );
                    const stock = match ? match.stock : 0;
                    const isSelected = selectedSize === sz;

                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        disabled={stock <= 0}
                        className={`w-12 h-11 text-xs font-bold uppercase border transition-all ${
                          isSelected
                            ? 'bg-[#080808] text-white border-[#080808]'
                            : stock > 0
                            ? 'bg-white text-[#111111] border-[#E5E5E5] hover:border-black'
                            : 'bg-[#F3F3F3] text-[#B8B8B8] border-transparent line-through cursor-not-allowed'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
                {currentVariant && (
                  <p className="text-[11px] text-[#666666] mt-2">
                    {currentVariant.stock <= 5 && currentVariant.stock > 0 ? (
                      <span className="text-amber-600 font-semibold">
                        Only {currentVariant.stock} left in stock - order soon
                      </span>
                    ) : currentVariant.stock > 0 ? (
                      <span className="text-green-700 font-medium">✓ In stock and ready to ship</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Out of Stock</span>
                    )}
                  </p>
                )}
              </div>

              {/* Quantity Stepper */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#333333]">Quantity:</span>
                <div className="flex items-center border border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-1 text-xs hover:bg-[#F3F3F3]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-black">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(currentVariant?.stock || 5, q + 1))}
                    className="px-2.5 py-1 text-xs hover:bg-[#F3F3F3]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 mt-6 border-t border-[#E5E5E5] space-y-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3.5 border transition-colors ${
                    isWishlisted ? 'border-red-600 text-red-600 bg-red-50' : 'border-[#E5E5E5] text-black hover:bg-[#F3F3F3]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-600' : ''}`} />
                </button>
              </div>

              <Link
                href={`/product/${quickViewProduct.slug}`}
                onClick={closeQuickView}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#555555] hover:text-black py-2"
              >
                <span>View Full Product Specifications & Reviews</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#777777]">
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Pan-India 2-4 Days Express Shipping • 7-Day Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
