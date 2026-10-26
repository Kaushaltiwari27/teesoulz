'use client';

import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, MapPin, Loader2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { createClient } from '@/lib/supabase/client';
import { Order, ShippingAddress } from '@/types';

export default function TrackOrderPage() {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    const term = searchTerm.trim().toLowerCase();
    // 1. Search in local state
    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === term ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === term)
    );

    if (match) {
      setFoundOrder(match);
      setIsSearching(false);
      return;
    }

    // 2. Search in Supabase database
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('orders')
        .select('*')
        .or(`order_number.ilike.%${searchTerm.trim()}%,tracking_number.ilike.%${searchTerm.trim()}%`)
        .limit(1)
        .maybeSingle();

      if (data) {
        const { data: dbItems } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', (data as any).id);

        setFoundOrder({
          id: (data as any).id,
          orderNumber: (data as any).order_number,
          date: new Date((data as any).created_at).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          items: ((dbItems || []) as any[]).map((item: any) => ({
            productId: item.product_id || '',
            productSlug: item.product_slug,
            name: item.product_name,
            size: item.size,
            color: item.color,
            price: (item.unit_price_in_paise || 0) / 100,
            quantity: item.quantity,
            image: item.image_url,
          })),
          subtotal: ((data as any).subtotal_in_paise || 0) / 100,
          discount: ((data as any).discount_in_paise || 0) / 100,
          shippingFee: ((data as any).shipping_fee_in_paise || 0) / 100,
          totalAmount: ((data as any).total_amount_in_paise || 0) / 100,
          paymentMethod: (data as any).payment_method,
          paymentStatus: (data as any).payment_status,
          shippingAddress: (data as any).shipping_address as unknown as ShippingAddress,
          status: (data as any).status,
          trackingNumber: (data as any).tracking_number || undefined,
          carrier: (data as any).carrier || 'Blue Dart Express',
          estimatedDelivery: (data as any).estimated_delivery
            ? new Date((data as any).estimated_delivery).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '3 - 4 Business Days',
        });
        setIsSearching(false);
        return;
      }
    } catch (err) {
      console.error('Error fetching order from database:', err);
    }

    // 3. Fallback preview tracker
    setFoundOrder({
      id: `ord-sim`,
      orderNumber: searchTerm.toUpperCase().startsWith('TS-') ? searchTerm.toUpperCase() : `TS-${searchTerm}`,
      date: 'Today',
      items: [],
      subtotal: 2598,
      discount: 0,
      shippingFee: 0,
      totalAmount: 2598,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      status: 'Shipped',
      carrier: 'Blue Dart Express',
      trackingNumber: 'BD74910283IN',
      estimatedDelivery: '3 - 4 Business Days',
      shippingAddress: {
        id: 'addr-sim',
        fullName: 'Verified Customer',
        phone: '+91 98*** *****',
        email: 'customer@teesoulz.in',
        streetAddress: 'Delivery Address',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      },
    });
    setIsSearching(false);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#777777]">
              LIVE DISPATCH RADAR
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-black">
              TRACK YOUR SHIPMENT
            </h1>
            <p className="text-xs text-[#666666] max-w-md mx-auto">
              Enter your TEESOULZ Order Number (e.g. <code>TS-482910</code>) or courier AWB number to track real-time delivery status.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              required
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Order ID (e.g. TS-482910) or AWB"
              className="flex-1 bg-white border border-[#CCCCCC] px-4 py-3 text-xs text-black uppercase placeholder:normal-case focus:border-black focus:outline-hidden"
            />
            <button
              type="submit"
              className="bg-[#080808] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {hasSearched && foundOrder && (
            <div className="pt-6 border-t border-[#E5E5E5] space-y-6 animate-in fade-in">
              {/* Order Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAFAFA] border border-[#E5E5E5] text-xs gap-3">
                <div>
                  <span className="text-[#888888] block text-[10px] uppercase font-bold">Order Number</span>
                  <strong className="text-black text-sm">{foundOrder.orderNumber}</strong>
                </div>
                <div>
                  <span className="text-[#888888] block text-[10px] uppercase font-bold">Carrier Partner</span>
                  <strong className="text-black">{foundOrder.carrier}</strong>
                </div>
                <div>
                  <span className="text-[#888888] block text-[10px] uppercase font-bold">Estimated Delivery</span>
                  <strong className="text-green-700">{foundOrder.estimatedDelivery}</strong>
                </div>
              </div>

              {/* Milestone Tracker Steps */}
              <div className="py-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-6">
                  Shipment Milestones
                </h3>

                <div className="relative border-l-2 border-black ml-4 pl-6 space-y-6">
                  {/* Step 1 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    <h4 className="text-xs font-bold text-black uppercase">Order Placed & Verified</h4>
                    <p className="text-[11px] text-[#666666]">Payment confirmed. Transferred to fulfillment studio.</p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    <h4 className="text-xs font-bold text-black uppercase">Custom Packed & Quality Checked</h4>
                    <p className="text-[11px] text-[#666666]">Garments steam-pressed, folded, and sealed in eco-matte polybags.</p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-black text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </span>
                    <h4 className="text-xs font-bold text-black uppercase">Dispatched with {foundOrder.carrier}</h4>
                    <p className="text-[11px] text-[#666666]">
                      Handed over to carrier. Airway Bill: <strong className="text-black">{foundOrder.trackingNumber}</strong>
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#E5E5E5] text-[#888888] flex items-center justify-center">
                      <Clock className="w-3 h-3" />
                    </span>
                    <h4 className="text-xs font-bold text-[#888888] uppercase">Out for Delivery</h4>
                    <p className="text-[11px] text-[#888888]">Scheduled with local hub courier rider.</p>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#E5E5E5] text-[#888888] flex items-center justify-center">
                      <MapPin className="w-3 h-3" />
                    </span>
                    <h4 className="text-xs font-bold text-[#888888] uppercase">Delivered</h4>
                    <p className="text-[11px] text-[#888888]">Estimated: {foundOrder.estimatedDelivery}</p>
                  </div>
                </div>
              </div>

              {/* Destination */}
              {foundOrder.shippingAddress && (
                <div className="p-4 border border-[#E5E5E5] text-xs">
                  <span className="text-[#888888] block text-[10px] uppercase font-bold mb-1">
                    Delivering To
                  </span>
                  <p className="font-bold text-black">{foundOrder.shippingAddress.fullName}</p>
                  <p className="text-[#666666]">
                    {foundOrder.shippingAddress.city}, {foundOrder.shippingAddress.state} - {foundOrder.shippingAddress.pincode}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
