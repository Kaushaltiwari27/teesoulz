'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  Truck,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ShippingAddress } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    logout,
    orders,
    addresses,
    addAddress,
    deleteAddress,
    wishlistCount,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // New address form state
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    email: '',
    streetAddress: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.streetAddress || !newAddr.pincode) return;
    addAddress({
      ...newAddr,
      isDefault: addresses.length === 0,
    });
    setNewAddr({
      fullName: '',
      phone: '',
      email: '',
      streetAddress: '',
      city: '',
      state: 'Maharashtra',
      pincode: '',
    });
    setShowAddAddressModal(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Hero Banner */}
        <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#080808] text-white flex items-center justify-center font-bold text-xl uppercase">
              {user ? user.name.charAt(0) : 'G'}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#777777] block">
                {isAuthenticated ? 'VERIFIED MEMBER' : 'GUEST SESSION'}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold uppercase text-black">
                {user ? user.name : 'Welcome, Guest'}
              </h1>
              <p className="text-xs text-[#666666]">
                {user ? user.email : 'Sign in to access synchronized orders and saved addresses.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                href="/account/login"
                className="bg-[#080808] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Layout: Sidebar Tabs + Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation: Horizontal scrollable tabs on mobile, vertical sidebar on desktop */}
          <div className="lg:col-span-3 flex lg:flex-col overflow-x-auto no-scrollbar gap-2 lg:gap-0 lg:space-y-1 pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-shrink-0 whitespace-nowrap lg:w-full flex items-center justify-between px-4 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                activeTab === 'orders'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#444444] border-[#E5E5E5] hover:border-black'
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Orders ({orders.length})</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex-shrink-0 whitespace-nowrap lg:w-full flex items-center justify-between px-4 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#444444] border-[#E5E5E5] hover:border-black'
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Address Book ({addresses.length})</span>
              </span>
            </button>

            <Link
              href="/wishlist"
              className="flex-shrink-0 whitespace-nowrap lg:w-full flex items-center justify-between px-4 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider bg-white text-[#444444] border border-[#E5E5E5] hover:border-black transition-colors"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </span>
              <span className="text-xs bg-[#F3F3F3] text-black px-2 py-0.5 rounded-full font-bold ml-2">
                {wishlistCount}
              </span>
            </Link>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-shrink-0 whitespace-nowrap lg:w-full flex items-center justify-between px-4 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                activeTab === 'profile'
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-[#444444] border-[#E5E5E5] hover:border-black'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Account Profile</span>
              </span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 bg-white border border-[#E5E5E5] p-6 sm:p-8">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-black">
                    Your Order History ({orders.length})
                  </h2>
                  <Link
                    href="/track-order"
                    className="text-xs text-[#555555] hover:text-black font-semibold underline flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Track Shipment
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#666666]">
                    <Package className="w-10 h-10 text-[#CCCCCC] mx-auto mb-3" />
                    <p className="font-semibold text-black text-sm">No orders placed yet</p>
                    <p className="mt-1 mb-4">When you place an order, its live tracking and invoice will appear here.</p>
                    <Link
                      href="/shop"
                      className="inline-block bg-[#080808] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-[#E5E5E5] p-5 space-y-4">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F3F3F3] text-xs gap-2">
                          <div>
                            <span className="text-[#888888] block text-[10px] uppercase font-bold">
                              Order ID
                            </span>
                            <span className="font-mono font-bold text-sm text-black">
                              {order.orderNumber}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#888888] block text-[10px] uppercase font-bold">
                              Placed On
                            </span>
                            <span className="font-medium text-black">{order.date}</span>
                          </div>

                          <div>
                            <span className="text-[#888888] block text-[10px] uppercase font-bold">
                              Status
                            </span>
                            <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 font-bold text-[10px] uppercase rounded">
                              {order.status}
                            </span>
                          </div>

                          <div>
                            <span className="text-[#888888] block text-[10px] uppercase font-bold">
                              Total
                            </span>
                            <span className="font-extrabold text-black">
                              ₹{order.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-[#F3F3F3]">
                          {order.items.map((item, i) => (
                            <div key={i} className="py-3 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-14 bg-[#F3F3F3] border border-[#E5E5E5] overflow-hidden flex-shrink-0">
                                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                                </div>
                                <div>
                                  <Link
                                    href={`/product/${item.productSlug}`}
                                    className="text-xs font-bold text-black hover:underline line-clamp-1"
                                  >
                                    {item.name}
                                  </Link>
                                  <span className="text-[10px] text-[#666666]">
                                    Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-black">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Tracking */}
                        <div className="pt-3 border-t border-[#F3F3F3] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2 text-[#555555]">
                            <Truck className="w-3.5 h-3.5 text-black" />
                            <span>AWB Tracking: <strong>{order.trackingNumber || 'In transit'}</strong></span>
                          </div>
                          <Link
                            href={`/order-confirmation/${order.orderNumber}`}
                            className="text-xs font-bold text-black hover:underline flex items-center gap-1"
                          >
                            <span>View Full Invoice & Receipt</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-black">
                    Saved Shipping Addresses
                  </h2>
                  <button
                    onClick={() => setShowAddAddressModal(true)}
                    className="flex items-center gap-1.5 bg-[#080808] text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="border border-[#E5E5E5] p-5 flex flex-col justify-between space-y-4 hover:border-black transition-colors"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-sm text-black">{addr.fullName}</strong>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold uppercase bg-black text-white px-2 py-0.5 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <p className="text-[#555555]">{addr.streetAddress}</p>
                        <p className="text-[#555555]">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-[#555555] pt-1">Phone: {addr.phone}</p>
                      </div>

                      <div className="pt-3 border-t border-[#F3F3F3] flex justify-end">
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Address Modal */}
                {showAddAddressModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                      onClick={() => setShowAddAddressModal(false)}
                      className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                    />
                    <div className="relative bg-white border border-[#E5E5E5] p-6 max-w-md w-full z-10 space-y-4 shadow-xl">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                        Add New Delivery Address
                      </h3>
                      <form onSubmit={handleCreateAddress} className="space-y-3">
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          className="w-full border border-[#CCCCCC] p-2 text-xs focus:border-black focus:outline-hidden"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number (10 Digits)"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          className="w-full border border-[#CCCCCC] p-2 text-xs focus:border-black focus:outline-hidden"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Street Address, Building, Apartment"
                          value={newAddr.streetAddress}
                          onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                          className="w-full border border-[#CCCCCC] p-2 text-xs focus:border-black focus:outline-hidden"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="City"
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full border border-[#CCCCCC] p-2 text-xs focus:border-black focus:outline-hidden"
                          />
                          <input
                            type="text"
                            required
                            placeholder="PIN Code"
                            maxLength={6}
                            value={newAddr.pincode}
                            onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                            className="w-full border border-[#CCCCCC] p-2 text-xs focus:border-black focus:outline-hidden"
                          />
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddAddressModal(false)}
                            className="px-4 py-2 text-xs border hover:bg-[#F3F3F3]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 text-xs bg-black text-white font-bold uppercase"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-lg">
                <div className="pb-4 border-b border-[#E5E5E5]">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-black">
                    Client Details
                  </h2>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[#777777] uppercase font-bold block mb-1">Full Name</label>
                    <p className="font-bold text-black text-sm">{user?.name || 'Yash Sharma'}</p>
                  </div>
                  <div>
                    <label className="text-[#777777] uppercase font-bold block mb-1">Email</label>
                    <p className="font-medium text-black">{user?.email || 'yash@teesoulz.in'}</p>
                  </div>
                  <div>
                    <label className="text-[#777777] uppercase font-bold block mb-1">Mobile Phone</label>
                    <p className="font-medium text-black">{user?.phone || '+91 98765 43210'}</p>
                  </div>
                  <div>
                    <label className="text-[#777777] uppercase font-bold block mb-1">Member Since</label>
                    <p className="font-medium text-black">{user?.joinedDate || 'October 2026'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
