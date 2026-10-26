import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Product, ProductVariant, ProductReview, ProductCategory, ProductGender } from '@/types';
import { PRODUCTS } from '@/data/mockData';
import { Database } from '@/types/database.types';

// Lightweight, cookie-free client for public storefront catalog queries (works in SSG, SSR, & Client)
function getPublicCatalogClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rcxvyfgeduyokdahkrow.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_V5k0p-NiVUOmWMvW5TptAw_WddPESHK';
  return createSupabaseClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Map raw database row to frontend Product type
export function mapDatabaseProductToProduct(row: any): Product {
  const variants: ProductVariant[] = (row.variants || []).map((v: any) => ({
    id: v.id,
    sku: v.sku,
    size: v.size,
    color: v.color,
    colorCode: v.color_code,
    stock: Array.isArray(v.inventory)
      ? (v.inventory[0]?.stock_quantity ?? 0)
      : (v.inventory?.stock_quantity ?? 0),
    price: v.price_in_paise ? v.price_in_paise / 100 : undefined,
  }));

  const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);

  const reviews: ProductReview[] = (row.reviews || []).map((r: any) => ({
    id: r.id,
    userName: r.user_name,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    date: new Date(r.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    verifiedPurchase: !!r.verified_purchase,
    sizePurchased: r.size_purchased || undefined,
    fitFeedback: r.fit_feedback || undefined,
  }));

  const collections: string[] = (row.collections || [])
    .map((c: any) => c.collection?.slug || c.slug)
    .filter(Boolean);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle || undefined,
    description: row.description,
    fabricDetails: row.fabric_details || [],
    fitType: row.fit_type,
    careInstructions: row.care_instructions || [],
    category: (row.category?.slug || 't-shirts') as ProductCategory,
    gender: (row.gender || 'unisex') as ProductGender,
    collections,
    price: row.price_in_paise / 100,
    mrp: row.mrp_in_paise / 100,
    discountPercent: row.discount_percent || 0,
    images: row.images || [],
    variants,
    availableColors: row.available_colors || [],
    availableSizes: row.available_sizes || [],
    tags: row.tags || [],
    isNewArrival: !!row.is_new_arrival,
    isBestseller: !!row.is_bestseller,
    isTrending: !!row.is_trending,
    isFeatured: !!row.is_featured,
    totalStock,
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count || 0,
    reviews,
    createdAt: row.created_at,
  };
}

export interface GetProductsOptions {
  category?: string;
  collection?: string;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  isTrending?: boolean;
  limit?: number;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  try {
    const supabase = getPublicCatalogClient();
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(slug, name),
        collections:product_collections(collection:collections(slug)),
        variants:product_variants(
          id, sku, size, color, color_code, price_in_paise,
          inventory(stock_quantity)
        ),
        reviews(*)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (options.isFeatured !== undefined) {
      query = query.eq('is_featured', options.isFeatured);
    }
    if (options.isBestseller !== undefined) {
      query = query.eq('is_bestseller', options.isBestseller);
    }
    if (options.isNewArrival !== undefined) {
      query = query.eq('is_new_arrival', options.isNewArrival);
    }
    if (options.isTrending !== undefined) {
      query = query.eq('is_trending', options.isTrending);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (error) console.warn('[Supabase Products] Fetch fallback triggered:', error.message);
      return filterMockProducts(options);
    }

    let products = data.map(mapDatabaseProductToProduct);

    if (options.category && options.category !== 'all') {
      products = products.filter((p) => p.category === options.category);
    }
    if (options.collection) {
      products = products.filter((p) => p.collections.includes(options.collection!));
    }

    return products;
  } catch (err: unknown) {
    console.warn('[Supabase Products] Fetch exception, using fallback:', err);
    return filterMockProducts(options);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = getPublicCatalogClient();
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(slug, name),
        collections:product_collections(collection:collections(slug)),
        variants:product_variants(
          id, sku, size, color, color_code, price_in_paise,
          inventory(stock_quantity)
        ),
        reviews(*)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      // Fallback to catalog source
      return getCatalogSource().find((p) => p.slug === slug) || null;
    }

    return mapDatabaseProductToProduct(data);
  } catch (err: unknown) {
    console.warn('[Supabase Products] Single fetch exception:', err);
    return getCatalogSource().find((p) => p.slug === slug) || null;
  }
}

// Fallback helper using mockData.ts and custom products
function getCatalogSource(): Product[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('teesoulz_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return PRODUCTS;
  }
  // Server-side
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'src', 'data', 'customProducts.json');
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return PRODUCTS;
}

function filterMockProducts(options: GetProductsOptions): Product[] {
  let list = [...getCatalogSource()];
  if (options.category && options.category !== 'all') {
    list = list.filter((p) => p.category === options.category);
  }
  if (options.collection) {
    list = list.filter((p) => p.collections.includes(options.collection!));
  }
  if (options.isFeatured !== undefined) {
    list = list.filter((p) => !!p.isFeatured === options.isFeatured);
  }
  if (options.isBestseller !== undefined) {
    list = list.filter((p) => !!p.isBestseller === options.isBestseller);
  }
  if (options.isNewArrival !== undefined) {
    list = list.filter((p) => !!p.isNewArrival === options.isNewArrival);
  }
  if (options.isTrending !== undefined) {
    list = list.filter((p) => !!p.isTrending === options.isTrending);
  }
  if (options.limit) {
    list = list.slice(0, options.limit);
  }
  return list;
}
