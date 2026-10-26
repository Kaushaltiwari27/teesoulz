'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Trash2,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    carrier?: string
  ) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
}

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All Orders', value: 'all' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Packed', value: 'Packed' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Out for Delivery', value: 'Out for Delivery' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

export default function OrdersTab({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
}: OrdersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editStatus, setEditStatus] = useState<OrderStatus>('Processing');
  const [editTracking, setEditTracking] = useState('');
  const [editCarrier, setEditCarrier] = useState('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  // Delete Order State
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        o.orderNumber.toLowerCase().includes(q) ||
        (o.shippingAddress?.fullName || '').toLowerCase().includes(q) ||
        (o.shippingAddress?.email || '').toLowerCase().includes(q) ||
        (o.shippingAddress?.phone || '').includes(q) ||
        (o.shippingAddress?.city || '').toLowerCase().includes(q);

      const matchesStatus =
        selectedStatusTab === 'all' || o.status === selectedStatusTab;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, selectedStatusTab]);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditTracking(order.trackingNumber || '');
    setEditCarrier(order.carrier || 'Blue Dart Express');
  };

  const handleSaveOrderDetails = async () => {
    if (!selectedOrder) return;
    setIsSavingDetails(true);
    try {
      await onUpdateOrderStatus(
        selectedOrder.id,
        editStatus,
        editTracking.trim() || undefined,
        editCarrier.trim() || undefined
      );
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: editStatus,
              trackingNumber: editTracking.trim() || undefined,
              carrier: editCarrier.trim() || undefined,
            }
          : null
      );
    } finally {
      setIsSavingDetails(false);
    }
  };

  const getStatusBadge = (st: OrderStatus) => {
    switch (st) {
      case 'Processing':
      case 'Confirmed':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Packed':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-[6px] bg-[#101014] border border-[#222228] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
            Customer Orders &amp; Fulfillment ({filteredOrders.length})
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Track deliveries, update shipment carriers &amp; dispatch statuses in real time.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order #, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16161c] border border-[#272730] text-zinc-200 pl-9 pr-3 py-2 text-xs font-mono rounded focus:outline-hidden focus:border-zinc-500"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.value === 'all'
              ? orders.length
              : orders.filter((o) => o.status === tab.value).length;
          const isActive = selectedStatusTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatusTab(tab.value)}
              className={`px-3 py-1.5 rounded-[4px] whitespace-nowrap transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-[#121217] text-zinc-400 hover:text-white border-[#24242e]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 text-[9px] px-1.5 py-0.2 rounded font-bold ${
                  isActive ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List Table */}
      <div className="rounded-[6px] border border-[#222228] bg-[#101014] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222228] bg-[#14141a] text-zinc-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Order ID &amp; Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Total &amp; Payment</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1b22]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#14141a]/60 transition-colors group"
                    >
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{order.date}</div>
                        {order.trackingNumber && (
                          <div className="text-[9px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
                            <Truck className="w-3 h-3 text-cyan-400" />
                            <span>{order.trackingNumber}</span>
                          </div>
                        )}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-200">
                          {order.shippingAddress?.fullName || 'Guest Customer'}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {order.shippingAddress?.phone}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </div>
                      </td>

                      {/* Items Preview */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {(order.items || []).slice(0, 3).map((it, idx) => (
                              <div
                                key={idx}
                                className="relative w-7 h-9 rounded overflow-hidden bg-black border border-zinc-700 shrink-0"
                              >
                                {it.image ? (
                                  <Image
                                    src={it.image}
                                    alt={it.name}
                                    fill
                                    sizes="28px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-zinc-800" />
                                )}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="font-bold text-zinc-300">
                              {order.items?.length || 0} item(s)
                            </div>
                            <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                              {order.items && order.items[0]
                                ? `${order.items[0].name} (${order.items[0].size})`
                                : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Total & Payment */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-zinc-400">
                            {order.paymentMethod}
                          </span>
                          <span
                            className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                              order.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : order.paymentStatus === 'Refunded'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            aria-label="Order Status"
                            value={order.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(
                                order.id,
                                e.target.value as OrderStatus,
                                order.trackingNumber,
                                order.carrier
                              )
                            }
                            className={`text-[11px] font-mono rounded px-2.5 py-1.5 border font-bold focus:outline-hidden cursor-pointer ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetails(order)}
                            className="p-1.5 rounded hover:bg-[#22222a] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                            title="Inspect Order Details & Shipping"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrderToDelete(order)}
                            className="p-1.5 rounded hover:bg-red-950/50 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal / Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#101014] border border-[#272730] rounded-[8px] shadow-2xl my-8 overflow-hidden text-zinc-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#222228] flex items-center justify-between bg-[#15151b]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold font-mono tracking-tight text-white uppercase">
                    Order #{selectedOrder.orderNumber}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Placed on {selectedOrder.date} &bull; Payment via {selectedOrder.paymentMethod} (
                  {selectedOrder.paymentStatus})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded bg-[#202028] hover:bg-[#2a2a35] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Shipping & Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded bg-[#16161c] border border-[#25252e]">
                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-white mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Customer Details</span>
                  </h4>
                  <div className="text-xs font-mono space-y-1 text-zinc-300">
                    <div>{selectedOrder.shippingAddress?.fullName}</div>
                    <div className="text-zinc-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{selectedOrder.shippingAddress?.phone}</span>
                    </div>
                    <div className="text-zinc-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{selectedOrder.shippingAddress?.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase font-bold text-white mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Delivery Address</span>
                  </h4>
                  <div className="text-xs font-mono text-zinc-300 space-y-0.5">
                    <div>{selectedOrder.shippingAddress?.streetAddress}</div>
                    {selectedOrder.shippingAddress?.apartment && (
                      <div>{selectedOrder.shippingAddress?.apartment}</div>
                    )}
                    <div>
                      {selectedOrder.shippingAddress?.city},{' '}
                      {selectedOrder.shippingAddress?.state} -{' '}
                      {selectedOrder.shippingAddress?.pincode}
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-white mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Purchased Streetwear Items ({selectedOrder.items?.length || 0})</span>
                </h4>
                <div className="divide-y divide-[#222228] border border-[#222228] rounded-[6px] overflow-hidden bg-[#141419]">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 flex items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded overflow-hidden bg-black shrink-0 border border-zinc-700">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            Size: <span className="text-white font-bold">{item.size}</span> &bull; Color: {item.color}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">
                            Qty: {item.quantity} &times; ₹{item.price}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-white">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded bg-[#16161c] border border-[#25252e] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount Applied</span>
                    <span>-₹{selectedOrder.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping Fee</span>
                  <span>
                    {selectedOrder.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#25252e] flex justify-between text-white font-bold text-sm">
                  <span>Total Amount Paid</span>
                  <span>₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Shipping & Fulfillment Controls */}
              <div className="p-4 rounded bg-[#16161c] border border-[#25252e] space-y-3">
                <h4 className="text-xs font-mono uppercase font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Update Fulfillment &amp; Tracking</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white text-xs font-mono p-2 rounded focus:outline-hidden"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Shipping Carrier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Blue Dart Express"
                      value={editCarrier}
                      onChange={(e) => setEditCarrier(e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white text-xs font-mono p-2 rounded focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                      Tracking Number / AWB
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BD98421038IN"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      className="w-full bg-[#111116] border border-[#2c2c38] text-white text-xs font-mono p-2 rounded focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveOrderDetails}
                    disabled={isSavingDetails}
                    className="px-5 py-2 rounded bg-white text-black text-xs font-mono font-black tracking-wider hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    {isSavingDetails ? 'SAVING...' : 'SAVE DISPATCH INFO'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121217] border border-red-900/50 rounded-[8px] p-6 text-zinc-200 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-mono font-bold uppercase text-white">
                Delete Order Record?
              </h3>
            </div>
            <p className="text-xs font-mono text-zinc-400 mb-4 leading-relaxed">
              Are you sure you want to delete order #{orderToDelete.orderNumber}? This will remove it from the administrative order records.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded bg-[#1e1e26] hover:bg-[#282834] text-zinc-300 text-xs font-mono font-bold cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDeleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold cursor-pointer"
              >
                YES, DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
