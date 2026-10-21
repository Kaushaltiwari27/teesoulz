'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Truck, MapPin } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const { getOrderById } = useStore();
  const order = getOrderById(orderId);

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 shadow-sm space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 pb-8 border-b border-[#E5E5E5]">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-green-700 block">
              PAYMENT & ORDER CONFIRMED
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
              THANK YOU FOR YOUR ORDER
            </h1>
            <p className="text-xs text-[#666666] max-w-md mx-auto leading-relaxed">
              We are preparing your garments for dispatch from our Mumbai facility. A confirmation email and SMS with live tracking updates have been sent.
            </p>
          </div>

          {/* Key Order Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAFAFA] border border-[#E5E5E5] text-xs">
            <div>
              <span className="text-[#888888] block text-[10px] uppercase font-bold">Order Number</span>
              <strong className="text-black text-sm">{order ? order.orderNumber : orderId}</strong>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase font-bold">Date</span>
              <strong className="text-black">{order?.date || 'October 2026'}</strong>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase font-bold">Estimated Delivery</span>
              <strong className="text-green-700">{order?.estimatedDelivery || '3-4 Business Days'}</strong>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase font-bold">Payment Method</span>
              <strong className="text-black">{order?.paymentMethod || 'UPI Instant'}</strong>
            </div>
          </div>

          {/* Tracking Number Banner */}
          <div className="flex items-center justify-between p-4 bg-[#080808] text-white text-xs">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-white" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#B8B8B8] block">
                  Courier Partner: {order?.carrier || 'Blue Dart Express'}
                </span>
                <span className="font-mono font-bold text-sm">
                  Tracking AWB: {order?.trackingNumber || 'BD58291039IN'}
                </span>
              </div>
            </div>
            <Link
              href="/track-order"
              className="text-xs font-bold underline underline-offset-2 hover:text-[#B8B8B8]"
            >
              Track Live
            </Link>
          </div>

          {/* Items Summary */}
          {order && order.items && order.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Purchased Garments ({order.items.length})
              </h3>
              <div className="divide-y divide-[#E5E5E5] border border-[#E5E5E5]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center gap-4">
                    <div className="relative w-16 h-20 bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-black">{item.name}</h4>
                      <p className="text-[11px] text-[#666666] mt-0.5">
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Address */}
          {order?.shippingAddress && (
            <div className="p-4 border border-[#E5E5E5] text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-black mb-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Shipping Address</span>
              </div>
              <p className="font-semibold text-black">{order.shippingAddress.fullName}</p>
              <p className="text-[#666666]">{order.shippingAddress.streetAddress}</p>
              <p className="text-[#666666]">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-[#666666]">Contact: {order.shippingAddress.phone}</p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/shop"
              className="w-full sm:flex-1 bg-[#080808] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-black text-center transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/account"
              className="w-full sm:flex-1 border border-[#080808] text-black py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#F3F3F3] text-center transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
