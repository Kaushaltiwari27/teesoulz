'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const [selectedColor] = useState(product.availableColors[0]?.name || '');
  const [isHovered, setIsHovered] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const isWishlisted = isInWishlist(product.id);
  const hasSecondaryImage = product.images.length > 1;
  const isOutOfStock = product.totalStock <= 0;

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant =
      product.variants.find(
        (v) => v.size === size && (!selectedColor || v.color === selectedColor)
      ) || product.variants.find((v) => v.size === size);

    if (variant && variant.stock > 0) {
      addToCart(product, variant, 1);
      setAddedSize(size);
      setTimeout(() => setAddedSize(null), 1500);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group flex flex-col bg-white border border-[#E5E5E5] hover:border-black transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container: Pure 3:4 Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3F3F3]">
        <Link
          href={`/product/${product.slug}`}
          className="block w-full h-full focus:outline-hidden"
          aria-label={`View ${product.name}`}
        >
          {/* Primary Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform group-hover:scale-105 ${
              isHovered && hasSecondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Secondary Alternate Image */}
          {hasSecondaryImage && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform scale-100 group-hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Minimal Discrete Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-[#111111] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
              Sold Out
            </span>
          ) : product.discountPercent && product.discountPercent > 0 ? (
            <span className="bg-white text-black border border-black text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
              {product.discountPercent}% OFF
            </span>
          ) : product.isNewArrival ? (
            <span className="bg-[#080808] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
              New Drop
            </span>
          ) : null}
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

        {/* Quick Size Bar: Clean, Accessible */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-[#E5E5E5] px-2 py-2 flex items-center justify-center gap-1.5 transition-transform duration-300 md:translate-y-full md:group-hover:translate-y-0 z-20">
            <span className="text-[9px] font-bold text-[#666666] uppercase mr-1 hidden sm:inline">
              Sizes:
            </span>
            {product.availableSizes.map((sz) => {
              const variant = product.variants.find(
                (v) => v.size === sz && (!selectedColor || v.color === selectedColor)
              );
              const inStock = variant ? variant.stock > 0 : false;
              const isAdded = addedSize === sz;

              return (
                <button
                  key={sz}
                  type="button"
                  disabled={!inStock}
                  onClick={(e) => handleQuickAdd(sz, e)}
                  className={`w-7 h-7 text-[10px] font-bold uppercase transition-all flex items-center justify-center border ${
                    isAdded
                      ? 'bg-black text-white border-black'
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

      {/* Info Section: Generous Spacing, Clean Typography */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-1">
          {/* Subtitle / Category metadata */}
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#777777]">
            <span>{product.fitType || 'Oversized Fit'}</span>
          </div>

          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-bold text-[#111111] hover:underline line-clamp-2 min-h-[32px] sm:min-h-[40px] block leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing Row */}
        <div className="mt-3 pt-2 border-t border-[#F3F3F3] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
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
            <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">
              SAVE ₹{(product.mrp - product.price).toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
