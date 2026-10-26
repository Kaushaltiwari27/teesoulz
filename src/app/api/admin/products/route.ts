import { NextRequest, NextResponse } from 'next/server';
import { getStoredProducts, saveStoredProducts } from '@/lib/storeData';
import { Product } from '@/types';

export async function GET() {
  try {
    const products = getStoredProducts();
    return NextResponse.json({ success: true, products, count: products.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = getStoredProducts();

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const newProduct: Product = {
      ...body,
      id: body.id || `ts-${Date.now()}`,
      slug,
      createdAt: body.createdAt || new Date().toISOString(),
      rating: body.rating ?? 5.0,
      reviewCount: body.reviewCount ?? 1,
      totalStock:
        body.totalStock ??
        (body.variants || []).reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0),
    };

    const updated = [newProduct, ...products.filter((p) => p.id !== newProduct.id)];
    saveStoredProducts(updated);

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

    const products = getStoredProducts();
    const updated = products.map((p) => {
      if (p.id === body.id) {
        const totalStock =
          body.variants && body.variants.length > 0
            ? body.variants.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0)
            : body.totalStock ?? p.totalStock;

        return {
          ...p,
          ...body,
          totalStock,
        };
      }
      return p;
    });

    saveStoredProducts(updated);

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

    const products = getStoredProducts();
    const filtered = products.filter((p) => p.id !== id);
    saveStoredProducts(filtered);

    return NextResponse.json({ success: true, count: filtered.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
