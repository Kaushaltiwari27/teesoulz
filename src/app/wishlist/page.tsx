'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { PRODUCTS } from '@/data/mockData';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useStore();

  const handleAddToCart = (productId: string) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const variant = product.variants.find((v) => v.stock > 0) || product.variants[0];
    if (variant) {
      addToCart(product, variant, 1);
      removeFromWishlist(productId);
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pb-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
              YOUR WISHLIST
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto border border-[#E5E5E5] bg-[#FAFAFA] p-8">
            <div className="w-16 h-16 rounded-full bg-[#EAEAEA] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[#888888]" />
            </div>
            <h3 className="text-base font-bold text-[#111111] uppercase tracking-tight">
              Your wishlist is empty
            </h3>
            <p className="text-xs text-[#666666] mt-2 mb-6 leading-relaxed">
              Save your favorite oversized drops, boxy tees, and limited-edition outerwear so you can easily grab them later.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#080808] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-black transition-colors"
            >
              Explore Drops
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className="bg-white border border-[#E5E5E5] flex flex-col justify-between hover:border-black transition-colors group"
              >
                <div className="relative aspect-[3/4] bg-[#F3F3F3] overflow-hidden">
                  <Link href={`/product/${item.productSlug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-600 hover:bg-black hover:text-white transition-colors"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">
                      {item.category.replace('-', ' ')}
                    </span>
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="text-xs sm:text-sm font-bold text-[#111111] hover:underline line-clamp-1 block mt-0.5"
                    >
                      {item.name}
                    </Link>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs sm:text-sm font-extrabold text-[#080808]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[10px] sm:text-xs text-[#888888] line-through">
                          ₹{item.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-[#F3F3F3]">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={!item.inStock}
                      className="w-full bg-[#080808] text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{item.inStock ? 'Move to Bag' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
