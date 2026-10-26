import { NextRequest, NextResponse } from 'next/server';
import { getStoredOrders, saveStoredOrders } from '@/lib/storeData';
import { Order, OrderStatus } from '@/types';

export async function GET() {
  try {
    const orders = getStoredOrders();
    return NextResponse.json({ success: true, orders, count: orders.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, trackingNumber, carrier, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const orders = getStoredOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId || o.orderNumber === orderId) {
        return {
          ...o,
          ...(status ? { status: status as OrderStatus } : {}),
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          ...(carrier !== undefined ? { carrier } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
        };
      }
      return o;
    });

    saveStoredOrders(updated);
    const updatedOrder = updated.find((o) => o.id === orderId || o.orderNumber === orderId);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
