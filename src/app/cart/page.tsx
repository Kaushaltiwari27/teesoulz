'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    removeFromCart,
    updateCartQuantity,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 1499;
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 pb-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#080808]">
              SHOPPING BAG
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-black hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto border border-[#E5E5E5] bg-[#FAFAFA] p-8">
            <div className="w-16 h-16 rounded-full bg-[#EAEAEA] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-[#888888]" />
            </div>
            <h3 className="text-base font-bold text-[#111111] uppercase tracking-tight">
              Your bag is currently empty
            </h3>
            <p className="text-xs text-[#666666] mt-2 mb-6 leading-relaxed">
              Explore our latest heavyweight drops, graphic collections, and essential streetwear pieces.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#080808] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Items Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Free Shipping Meter */}
              <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                {amountNeeded > 0 ? (
                  <p className="text-xs text-[#333333]">
                    Add <strong className="text-black">₹{amountNeeded}</strong> more to unlock{' '}
                    <strong className="text-black">FREE Express Pan-India Delivery</strong>
                  </p>
                ) : (
                  <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                    <span>🎉</span> You unlocked FREE Pan-India Express Shipping!
                  </p>
                )}
                <div className="w-full bg-[#E5E5E5] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-[#080808] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5]">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="relative w-24 h-32 bg-[#F3F3F3] flex-shrink-0 overflow-hidden border border-[#E5E5E5]"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            href={`/product/${item.productSlug}`}
                            className="text-sm font-bold text-[#111111] hover:underline"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#999999] hover:text-red-600 p-1"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-1 flex items-center gap-3 text-xs text-[#666666]">
                          <span>
                            Size: <strong className="text-black">{item.selectedSize}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Color: <strong className="text-black">{item.selectedColor}</strong>
                          </span>
                        </div>

                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-sm font-extrabold text-[#080808]">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                          {item.mrp > item.price && (
                            <span className="text-xs text-[#888888] line-through">
                              ₹{item.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Subtotal */}
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-[#F3F3F3]">
                        <div className="flex items-center border border-[#CCCCCC]">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs hover:bg-[#F3F3F3]"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-9 text-center text-xs font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="px-2.5 py-1 text-xs hover:bg-[#F3F3F3] disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#888888] uppercase block">Item Total</span>
                          <span className="text-sm font-extrabold text-[#080808]">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-6 space-y-6 sticky top-28">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-black pb-3 border-b border-[#E5E5E5]">
                  ORDER SUMMARY
                </h3>

                {/* Promo Code Box */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#333333] block mb-2">
                    Promo Code / Gift Voucher
                  </label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2.5 rounded text-xs">
                      <div className="flex items-center gap-2 text-green-800">
                        <Tag className="w-4 h-4" />
                        <span>
                          Code <strong>{appliedCoupon.code}</strong> applied (-₹{cartDiscount})
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. SOUL10 or STREET15"
                        className="flex-1 bg-white border border-[#CCCCCC] px-3 py-2 text-xs uppercase placeholder:normal-case focus:border-black focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="bg-[#080808] text-white text-xs font-bold uppercase px-5 py-2 hover:bg-black transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
                </div>

                {/* Calculation Details */}
                <div className="space-y-2 text-xs text-[#555555] pt-2 border-t border-[#E5E5E5]">
                  <div className="flex justify-between">
                    <span>Bag Subtotal ({cartCount} items)</span>
                    <span className="font-semibold text-black">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {cartDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Voucher Discount</span>
                      <span className="font-bold">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-black">
                      {shippingFee === 0 ? (
                        <span className="text-green-700 font-bold uppercase">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#888888] text-[11px]">
                    <span>Goods & Services Tax (GST)</span>
                    <span>Inclusive (12% Apparel)</span>
                  </div>

                  <div className="pt-3 mt-2 border-t border-[#E5E5E5] flex justify-between text-base font-extrabold text-[#080808]">
                    <span>Total Amount</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Proceed to Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full bg-[#080808] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="space-y-2 pt-2 text-[11px] text-[#777777] border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
                    <span>Safe & Secure 256-Bit Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>•</span>
                    <span>Cash on Delivery (COD) available across 27,000+ pin codes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
