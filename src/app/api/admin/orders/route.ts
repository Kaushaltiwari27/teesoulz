import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Fetch order line items
    const orderIds = (dbOrders || []).map((o) => o.id);
    const { data: dbItems } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds.length > 0 ? orderIds : ['none']);

    const itemsByOrderId: { [orderId: string]: any[] } = {};
    (dbItems || []).forEach((item: any) => {
      if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
      itemsByOrderId[item.order_id].push({
        productId: item.product_id || '',
        productSlug: item.product_slug,
        name: item.product_name,
        size: item.size,
        color: item.color,
        price: (item.unit_price_in_paise || 0) / 100,
        quantity: item.quantity,
        image: item.image_url,
      });
    });

    const mappedOrders = (dbOrders || []).map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      date: new Date(o.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      items: itemsByOrderId[o.id] || [],
      subtotal: (o.subtotal_in_paise || 0) / 100,
      discount: (o.discount_in_paise || 0) / 100,
      shippingFee: (o.shipping_fee_in_paise || 0) / 100,
      totalAmount: (o.total_amount_in_paise || 0) / 100,
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      shippingAddress: o.shipping_address,
      status: o.status,
      trackingNumber: o.tracking_number || undefined,
      carrier: o.carrier || undefined,
      estimatedDelivery: o.estimated_delivery
        ? new Date(o.estimated_delivery).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '3 - 4 Business Days',
    }));

    return NextResponse.json({ success: true, orders: mappedOrders, count: mappedOrders.length });
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

    const supabase = createAdminClient();
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (trackingNumber !== undefined) updatePayload.tracking_number = trackingNumber;
    if (carrier !== undefined) updatePayload.carrier = carrier;
    if (paymentStatus) updatePayload.payment_status = paymentStatus;

    const { error } = await supabase
      .from('orders')
      .update(updatePayload)
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
