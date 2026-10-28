import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = (body.orderNumber || '').trim();
    const contact = (body.contact || '').trim().toLowerCase();

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Sanitize order number (e.g. TS-123456)
    const sanitizedOrderNumber = orderNumber.toUpperCase();

    const supabase = createAdminClient();

    // Query exact match by order_number or tracking_number (privileged server client)
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        status,
        payment_method,
        payment_status,
        subtotal_in_paise,
        discount_in_paise,
        shipping_fee_in_paise,
        total_amount_in_paise,
        tracking_number,
        carrier,
        estimated_delivery,
        shipping_address
      `)
      .or(`order_number.ilike.${sanitizedOrderNumber},tracking_number.ilike.${sanitizedOrderNumber}`)
      .limit(1)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json(
        { success: false, error: 'No order found matching the provided order or tracking number.' },
        { status: 404 }
      );
    }

    const shippingAddr: any = order.shipping_address || {};

    // If contact (email or phone) was provided, verify it matches the order record
    if (contact) {
      const orderEmail = (shippingAddr.email || '').toLowerCase();
      const orderPhone = (shippingAddr.phone || '').replace(/[^0-9]/g, '');
      const cleanContact = contact.replace(/[^0-9]/g, '');

      const emailMatches = orderEmail === contact;
      const phoneMatches = cleanContact.length >= 6 && orderPhone.includes(cleanContact);

      if (!emailMatches && !phoneMatches) {
        return NextResponse.json(
          {
            success: false,
            error: 'The provided email or phone number does not match our records for this order.',
          },
          { status: 403 }
        );
      }
    }

    // Fetch order line items
    const { data: dbItems } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    // Mask sensitive contact details for privacy protection
    const rawName = shippingAddr.fullName || 'Valued Customer';
    const nameParts = rawName.split(' ');
    const maskedName = nameParts
      .map((part: string) => (part.length > 2 ? `${part[0]}***${part[part.length - 1]}` : part))
      .join(' ');

    const safeShipping = {
      city: shippingAddr.city || 'Verified City',
      state: shippingAddr.state || 'India',
      pincode: shippingAddr.pincode ? `***${shippingAddr.pincode.slice(-3)}` : '******',
      fullName: maskedName,
    };

    const formattedOrder = {
      id: order.id,
      orderNumber: order.order_number,
      date: new Date(order.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: order.status,
      carrier: order.carrier || 'Blue Dart Express',
      trackingNumber: order.tracking_number || undefined,
      estimatedDelivery: order.estimated_delivery
        ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : '3 - 4 Business Days',
      paymentMethod: order.payment_method,
      paymentStatus: order.payment_status,
      subtotal: (order.subtotal_in_paise || 0) / 100,
      discount: (order.discount_in_paise || 0) / 100,
      shippingFee: (order.shipping_fee_in_paise || 0) / 100,
      totalAmount: (order.total_amount_in_paise || 0) / 100,
      shippingAddress: safeShipping,
      items: (dbItems || []).map((item: any) => ({
        productId: item.product_id || '',
        productSlug: item.product_slug,
        name: item.product_name,
        size: item.size,
        color: item.color,
        price: (item.unit_price_in_paise || 0) / 100,
        quantity: item.quantity,
        image: item.image_url,
      })),
    };

    return NextResponse.json({ success: true, order: formattedOrder });
  } catch (err: any) {
    console.error('[Track Order API] Server Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error while retrieving order status.' },
      { status: 500 }
    );
  }
}
