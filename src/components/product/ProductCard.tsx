'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart, openQuickView } = useStore();
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors[0]?.name || ''
  );
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddSize, setQuickAddSize] = useState<string | null>(null);

  const isWishlisted = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;
  const isOutOfStock = product.totalStock <= 0;

  // Handle Quick Add directly from card
  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants.find(
      (v) => v.size === size && (!selectedColor || v.color === selectedColor)
    ) || product.variants.find((v) => v.size === size);

    if (variant && variant.stock > 0) {
      addToCart(product, variant, 1);
      setQuickAddSize(size);
      setTimeout(() => setQuickAddSize(null), 1500);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#E5E5E5] hover:border-black transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F3F3]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover transition-opacity duration-500 ${
              isHovered && hasSecondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Secondary Hover Image */}
          {hasSecondaryImage && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-500 scale-100 group-hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-red-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
              Sold Out
            </span>
          ) : (
            <>
              {product.isNewArrival && (
                <span className="bg-[#080808] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                  New Drop
                </span>
              )}
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="bg-[#FFFFFF] text-black border border-black text-[9px] font-extrabold uppercase px-1.5 py-0.5 tracking-wider">
                  {product.discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-xs z-20 focus:outline-hidden"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-600 text-red-600' : ''
            }`}
          />
        </button>

        {/* Quick View Button (Desktop overlay) */}
        <button
          type="button"
          onClick={handleQuickViewClick}
          aria-label="Quick View"
          className="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 items-center gap-1.5 bg-white/95 text-black px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-md hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 z-20"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>

        {/* Slide-up Quick Size Bar */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs border-t border-[#E5E5E5] px-2 py-2 flex items-center justify-center gap-1.5 transition-transform duration-300 md:translate-y-full md:group-hover:translate-y-0 z-20">
            <span className="text-[10px] font-bold text-[#666666] uppercase mr-1 hidden sm:inline">
              Quick Add:
            </span>
            {product.availableSizes.map((sz) => {
              const variant = product.variants.find(
                (v) => v.size === sz && (!selectedColor || v.color === selectedColor)
              );
              const inStock = variant ? variant.stock > 0 : false;
              const isAdded = quickAddSize === sz;

              return (
                <button
                  key={sz}
                  type="button"
                  disabled={!inStock}
                  onClick={(e) => handleQuickAdd(sz, e)}
                  className={`w-7 h-7 text-[10px] font-bold uppercase transition-all flex items-center justify-center border ${
                    isAdded
                      ? 'bg-green-600 text-white border-green-600'
                      : inStock
                      ? 'bg-white text-black border-[#CCCCCC] hover:bg-black hover:text-white hover:border-black'
                      : 'bg-[#F3F3F3] text-[#B8B8B8] border-transparent line-through cursor-not-allowed'
                  }`}
                  title={inStock ? `Add size ${sz}` : `Size ${sz} sold out`}
                >
                  {isAdded ? <Check className="w-3 h-3" /> : sz}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category / Subtitle */}
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#777777] tracking-wider mb-1">
            <span>{product.category.replace('-', ' ')}</span>
            <span>{product.fitType}</span>
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-bold text-[#111111] hover:underline line-clamp-2 min-h-[32px] sm:min-h-[40px] block"
          >
            {product.name}
          </Link>

          {/* Color Swatches */}
          {product.availableColors.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.availableColors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor === c.name
                      ? 'ring-1 ring-black ring-offset-1 border-black scale-110'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c.code }}
                  title={c.name}
                  aria-label={`Select ${c.name}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-2 border-t border-[#F3F3F3] flex flex-wrap items-baseline justify-between gap-1">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-[#080808]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.mrp > product.price && (
              <span className="text-[10px] sm:text-xs text-[#888888] line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="text-[9px] sm:text-[10px] font-bold text-green-700">
              Save ₹{(product.mrp - product.price).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
