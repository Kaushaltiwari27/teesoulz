'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Lock background scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1499;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 animate-in slide-in-from-right">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold uppercase tracking-tight text-[#080808]">
              Your Bag
            </h3>
            <span className="text-xs bg-[#F3F3F3] text-[#444444] font-semibold px-2 py-0.5 rounded-full">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
            className="p-1.5 text-[#555555] hover:text-black hover:bg-[#F3F3F3] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FAFAFA] px-6 py-3 border-b border-[#E5E5E5]">
          {amountNeededForFreeShipping > 0 ? (
            <p className="text-xs text-[#333333]">
              Add <span className="font-bold text-[#080808]">₹{amountNeededForFreeShipping}</span> more for{' '}
              <span className="font-bold text-[#080808]">FREE Pan-India Express Delivery</span>
            </p>
          ) : (
            <p className="text-xs text-green-700 font-semibold flex items-center gap-1.5">
              <span>🎉</span> Congratulations! You unlocked FREE Pan-India Delivery
            </p>
          )}
          <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#080808] h-full rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Item List / Empty State */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E5E5E5]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F3F3F3] flex items-center justify-center mb-4">
                <Tag className="w-8 h-8 text-[#B8B8B8]" />
              </div>
              <h4 className="text-base font-bold text-[#080808]">Your shopping bag is empty</h4>
              <p className="text-xs text-[#666666] max-w-xs mt-1 mb-6">
                Explore our latest drops, heavyweight silhouettes and limited collections.
              </p>
              <Link
                href="/shop"
                onClick={() => setIsCartOpen(false)}
                className="inline-block bg-[#080808] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-black transition-colors"
              >
                Explore Drops
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {/* Thumbnail */}
                <Link
                  href={`/product/${item.productSlug}`}
                  onClick={() => setIsCartOpen(false)}
                  className="relative w-20 h-24 bg-[#F3F3F3] flex-shrink-0 overflow-hidden border border-[#E5E5E5]"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.productSlug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-xs font-bold text-[#111111] hover:underline line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#999999] hover:text-red-600 p-1 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#666666]">
                      <span>Size: <strong className="text-[#111111]">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-[#111111]">{item.selectedColor}</strong></span>
                    </div>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs font-extrabold text-[#080808]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[10px] text-[#888888] line-through">
                          ₹{item.mrp.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#E5E5E5] rounded">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#666666] hover:text-black hover:bg-[#F3F3F3] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 text-[#666666] hover:text-black hover:bg-[#F3F3F3] transition-colors disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#111111]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="border-t border-[#E5E5E5] p-6 bg-[#FAFAFA] space-y-4">
            {/* Promo code input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded text-xs">
                  <div className="flex items-center gap-1.5 text-green-800 font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      Code <strong>{appliedCoupon.code}</strong> applied (-₹{cartDiscount})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. SOUL10)"
                    className="flex-1 bg-white border border-[#E5E5E5] px-3 py-2 text-xs uppercase placeholder:normal-case focus:border-black focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="bg-[#080808] text-white text-xs font-bold uppercase px-4 py-2 hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 text-xs text-[#555555]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#111111]">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Coupon Discount</span>
                  <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[#111111]">
                  {shippingFee === 0 ? (
                    <span className="text-green-700 uppercase font-bold text-[11px]">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-2 flex justify-between text-sm font-extrabold text-[#080808]">
                <span>Total Amount</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout & View Bag CTA */}
            <div className="space-y-2 pt-2">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full block text-center py-2.5 text-xs font-semibold text-[#444444] hover:text-black uppercase tracking-wider border border-[#E5E5E5] hover:bg-white transition-colors"
              >
                View Full Bag & Details
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#777777] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>100% Secure Checkout • 7-Day Easy Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
