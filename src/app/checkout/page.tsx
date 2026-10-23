'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, CheckCircle2, ChevronRight, Truck, CreditCard, Banknote, ArrowLeft } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ShippingAddress, OrderItem } from '@/types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    addresses,
    createOrder,
    addToast,
    user,
  } = useStore();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Address Form State
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const [useSavedAddress, setUseSavedAddress] = useState(!!defaultAddress);
  const [selectedSavedId, setSelectedSavedId] = useState(defaultAddress?.id || '');

  const [formData, setFormData] = useState({
    fullName: defaultAddress?.fullName || user?.name || '',
    email: defaultAddress?.email || user?.email || '',
    phone: defaultAddress?.phone || user?.phone || '',
    streetAddress: defaultAddress?.streetAddress || '',
    apartment: defaultAddress?.apartment || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || 'Maharashtra',
    pincode: defaultAddress?.pincode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white py-20 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-xl font-bold uppercase tracking-tight text-black">Your bag is empty</h2>
        <p className="text-xs text-[#666666] mt-1 mb-6">You need items in your shopping bag before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="bg-black text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5"
        >
          Explore Drops
        </Link>
      </div>
    );
  }

  const validateShippingForm = () => {
    if (useSavedAddress && selectedSavedId) return true;

    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = '10-digit mobile number required';
    if (!formData.streetAddress.trim()) errs.streetAddress = 'Delivery street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errs.pincode = '6-digit PIN code required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      addToast('Incomplete Details', 'Please complete all required shipping fields.', 'error');
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      // Determine final shipping address
      let finalAddress: ShippingAddress;
      if (useSavedAddress && selectedSavedId) {
        finalAddress = addresses.find((a) => a.id === selectedSavedId)!;
      } else {
        finalAddress = {
          id: `addr-${Date.now()}`,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        };
      }

      const orderItems: OrderItem[] = cart.map((c) => ({
        productId: c.productId,
        productSlug: c.productSlug,
        name: c.name,
        size: c.selectedSize,
        color: c.selectedColor,
        price: c.price,
        quantity: c.quantity,
        image: c.image,
      }));

      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const newOrder = createOrder({
        items: orderItems,
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shippingFee: paymentMethod === 'COD' ? shippingFee + 50 : shippingFee,
        totalAmount: paymentMethod === 'COD' ? cartTotal + 50 : cartTotal,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
        shippingAddress: finalAddress,
        status: 'Confirmed',
      });

      addToast('Order Placed Successfully!', `Order ${newOrder.orderNumber} confirmed.`, 'success');
      router.push(`/order-confirmation/${newOrder.orderNumber}`);
    } catch (err) {
      addToast('Payment Error', 'Failed to process order. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#E5E5E5] gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-9 h-7">
              <Image src="/teesoulz-logo.png" alt="TEESOULZ" fill sizes="36px" className="object-contain" />
            </div>
            <span className="font-extrabold tracking-tight text-lg text-black">TEESOULZ</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#666666]">
            <Lock className="w-3.5 h-3.5 text-black flex-shrink-0" />
            <span>256-Bit Encrypted Secure Checkout</span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-10 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setStep('shipping')}
            className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-black' : 'text-[#888888]'}`}
          >
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Shipping Address</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#CCCCCC]" />
          <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-black' : 'text-[#888888]'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 'payment' ? 'bg-black text-white' : 'bg-[#E5E5E5] text-[#888888]'
            }`}>
              2
            </span>
            <span>Payment Method</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            {step === 'shipping' ? (
              <form onSubmit={handleContinueToPayment} className="bg-white border border-[#E5E5E5] p-4 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <h2 className="text-base font-bold uppercase tracking-wider text-black">
                    Delivery Address
                  </h2>
                  <span className="text-[11px] text-[#777777]">* Required fields</span>
                </div>

                {/* Saved Address Option if exists */}
                {addresses.length > 0 && (
                  <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] space-y-3">
                    <label className="flex items-center gap-2 text-xs font-bold text-black cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useSavedAddress}
                        onChange={(e) => setUseSavedAddress(e.target.checked)}
                        className="accent-black"
                      />
                      <span>Use a saved address from my account</span>
                    </label>

                    {useSavedAddress && (
                      <div className="space-y-2 pt-2">
                        {addresses.map((addr) => (
                          <label
                            key={addr.id}
                            className={`block p-3 border cursor-pointer text-xs transition-colors ${
                              selectedSavedId === addr.id ? 'border-black bg-white' : 'border-[#E5E5E5]'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <input
                                type="radio"
                                name="saved-addr"
                                checked={selectedSavedId === addr.id}
                                onChange={() => setSelectedSavedId(addr.id)}
                                className="accent-black mt-0.5"
                              />
                              <div>
                                <span className="font-bold text-black">{addr.fullName}</span> ({addr.phone})
                                <p className="text-[#666666] mt-0.5">{addr.streetAddress}, {addr.city}, {addr.state} - {addr.pincode}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Manual Address Fields */}
                {(!useSavedAddress || addresses.length === 0) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full bg-white border border-[#CCCCCC] px-3 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                          placeholder="e.g. Yash Sharma"
                        />
                        {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                          Phone Number (10 Digits) *
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white border border-[#CCCCCC] px-3 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                          placeholder="9876543210"
                        />
                        {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                        Email Address (For Tracking & Invoice) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-[#CCCCCC] px-3 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                        placeholder="yash@example.com"
                      />
                      {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                        Street Address / Building / Flat *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.streetAddress}
                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                        className="w-full bg-white border border-[#CCCCCC] px-3 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                        placeholder="Flat 402, Monolith Heights, Link Road"
                      />
                      {errors.streetAddress && <p className="text-[11px] text-red-600 mt-1">{errors.streetAddress}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-white border border-[#CCCCCC] px-3 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                          placeholder="Mumbai"
                        />
                        {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                          State *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full bg-white border border-[#CCCCCC] px-3 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase text-[#333333] block mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full bg-white border border-[#CCCCCC] px-3 py-2.5 text-xs text-black focus:border-black focus:outline-hidden"
                          placeholder="400050"
                        />
                        {errors.pincode && <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#080808] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
                >
                  Continue to Payment Options →
                </button>
              </form>
            ) : (
              /* Payment Method Selection Step */
              <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <h2 className="text-base font-bold uppercase tracking-wider text-black">
                    Select Payment Method
                  </h2>
                  <button
                    onClick={() => setStep('shipping')}
                    className="text-xs text-[#666666] hover:text-black flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Address
                  </button>
                </div>

                <div className="space-y-3">
                  {/* UPI / Instant Payment */}
                  <label
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'UPI' ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymethod"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="accent-black"
                        />
                        <div>
                          <span className="text-xs font-bold text-black uppercase block">
                            Instant UPI / QR Code (GPay, PhonePe, Paytm)
                          </span>
                          <span className="text-[11px] text-[#666666]">
                            Fastest verification • Instant automated refund if returned
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                        RECOMMENDED
                      </span>
                    </div>
                  </label>

                  {/* Credit / Debit Card / NetBanking */}
                  <label
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'Card' ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymethod"
                        checked={paymentMethod === 'Card'}
                        onChange={() => setPaymentMethod('Card')}
                        className="accent-black"
                      />
                      <CreditCard className="w-5 h-5 text-black" />
                      <div>
                        <span className="text-xs font-bold text-black uppercase block">
                          Credit / Debit Cards & NetBanking
                        </span>
                        <span className="text-[11px] text-[#666666]">
                          All Indian banks, RuPay, Visa, Mastercard supported
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`block p-4 border cursor-pointer transition-colors ${
                      paymentMethod === 'COD' ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymethod"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="accent-black"
                        />
                        <Banknote className="w-5 h-5 text-black" />
                        <div>
                          <span className="text-xs font-bold text-black uppercase block">
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[11px] text-[#666666]">
                            Pay via Cash or UPI QR at your doorstep (+₹50 courier verification fee)
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#888888]">+₹50</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="w-full bg-[#080808] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Processing Secure Order...</span>
                    ) : (
                      <span>
                        Place Order • ₹{(paymentMethod === 'COD' ? cartTotal + 50 : cartTotal).toLocaleString('en-IN')}
                      </span>
                    )}
                  </button>
                  <p className="text-[11px] text-[#777777] text-center mt-3">
                    By confirming your order, you agree to the TEESOULZ Terms of Service and 7-day Exchange Policy.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#E5E5E5] p-4 sm:p-6 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-black pb-3 border-b border-[#E5E5E5]">
                Order Items ({cart.length})
              </h3>

              <div className="divide-y divide-[#E5E5E5] max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-14 h-16 bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-black line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-[#666666]">
                        {item.selectedSize} • {item.selectedColor} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E5E5E5] space-y-1.5 text-xs text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-black">
                    {shippingFee === 0 ? <span className="text-green-700 font-bold uppercase">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                {paymentMethod === 'COD' && (
                  <div className="flex justify-between text-[#333333]">
                    <span>COD Courier Handling Fee</span>
                    <span>₹50</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#E5E5E5] flex justify-between text-sm font-extrabold text-black">
                  <span>Total Amount</span>
                  <span>
                    ₹{(paymentMethod === 'COD' ? cartTotal + 50 : cartTotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E5E5E5] text-xs text-[#666666] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
              <span>Free doorstep size exchange within 7 days of delivery.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
