import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/supabase/products';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ success: true, products, count: products.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = createAdminClient();

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const pricePaise = Math.round((Number(body.price) || 0) * 100);
    const mrpPaise = Math.round((Number(body.mrp) || Number(body.price) || 0) * 100);
    const discount = mrpPaise > pricePaise ? Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100) : 0;

    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({
        name: body.name.trim(),
        slug,
        subtitle: body.subtitle || null,
        description: body.description || '',
        category_id: body.categoryId || null,
        gender: body.gender || 'unisex',
        price_in_paise: pricePaise,
        mrp_in_paise: mrpPaise,
        discount_percent: discount,
        fit_type: body.fitType || 'Oversized Boxy Fit',
        fabric_details: Array.isArray(body.fabricDetails) ? body.fabricDetails : [body.fabricDetails || '100% Combed Cotton'],
        care_instructions: Array.isArray(body.careInstructions) ? body.careInstructions : [body.careInstructions || 'Machine wash cold'],
        images: body.images || [],
        is_published: body.isPublished !== undefined ? body.isPublished : true,
        is_featured: !!body.isFeatured,
        is_bestseller: !!body.isBestseller,
        is_new_arrival: !!body.isNewArrival,
        is_trending: !!body.isTrending,
        available_sizes: body.availableSizes || ['S', 'M', 'L', 'XL'],
        available_colors: body.availableColors || ['Black'],
        tags: body.tags || [body.gender || 'unisex'],
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.name) updatePayload.name = body.name.trim();
    if (body.slug) updatePayload.slug = body.slug.trim();
    if (body.price !== undefined) updatePayload.price_in_paise = Math.round(Number(body.price) * 100);
    if (body.mrp !== undefined) updatePayload.mrp_in_paise = Math.round(Number(body.mrp) * 100);
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.isPublished !== undefined) updatePayload.is_published = body.isPublished;
    if (body.images) updatePayload.images = body.images;

    const { error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', body.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    const supabase = createAdminClient();
    // Delete variants and inventory cascades
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
