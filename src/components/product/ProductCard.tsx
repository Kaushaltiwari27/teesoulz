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
      className="group flex flex-col bg-white transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Container: Clean 3:4 Aspect Ratio like Bonkers Corner */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] bg-[#F5F5F5]">
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
            className={`object-cover object-center transition-transform duration-700 ease-out will-change-transform group-hover:scale-105 ${
              isHovered && hasSecondaryImage ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Secondary Alternate Image on Hover */}
          {hasSecondaryImage && (
            <Image
              src={product.images[1]}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-700 ease-out will-change-transform scale-100 group-hover:scale-105 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Bonkers Corner Style Badges (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none flex flex-col gap-1 items-start">
          {isOutOfStock ? (
            <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px]">
              Sold Out
            </span>
          ) : product.discountPercent && product.discountPercent > 0 ? (
            <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px]">
              Save {product.discountPercent}%
            </span>
          ) : product.isNewArrival ? (
            <span className="bg-black text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px]">
              New In
            </span>
          ) : null}
        </div>

        {/* Wishlist Button (Top-Right) */}
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

        {/* Quick Size Bar: Slides up on desktop hover, compact on mobile */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-gray-100 px-1.5 sm:px-2 py-1.5 sm:py-2 flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-300 md:translate-y-full md:group-hover:translate-y-0 z-20 overflow-x-auto no-scrollbar">
            <span className="text-[9px] font-bold text-gray-500 uppercase mr-0.5 hidden sm:inline flex-shrink-0">
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
                  className={`w-6 h-6 sm:w-7 sm:h-7 text-[9px] sm:text-[10px] font-bold uppercase transition-all flex items-center justify-center border rounded-[2px] flex-shrink-0 ${
                    isAdded
                      ? 'bg-black text-white border-black'
                      : inStock
                      ? 'bg-white text-black border-gray-300 hover:bg-black hover:text-white hover:border-black'
                      : 'bg-gray-100 text-gray-400 border-transparent line-through cursor-not-allowed'
                  }`}
                  title={inStock ? `Add size ${sz}` : `Size ${sz} sold out`}
                >
                  {isAdded ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : sz}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Section: Clean, Left-Aligned typography exactly like Bonkers Corner */}
      <div className="pt-3 pb-2 flex flex-col flex-1 justify-between">
        <div>
          <Link
            href={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-medium text-black hover:text-gray-600 line-clamp-1 block leading-snug transition-colors"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing Row */}
        <div className="mt-1 flex items-baseline gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-black">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
          )}
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="text-[11px] font-semibold text-red-600">
              ({product.discountPercent}% OFF)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
