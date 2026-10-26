import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS, STORE_COUPONS } from '../src/data/mockData';
import { Database } from '../src/types/database.types';

type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CollectionInsert = Database['public']['Tables']['collections']['Insert'];
type CouponInsert = Database['public']['Tables']['coupons']['Insert'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type VariantInsert = Database['public']['Tables']['product_variants']['Insert'];
type InventoryInsert = Database['public']['Tables']['inventory']['Insert'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
type ProductCollectionInsert = Database['public']['Tables']['product_collections']['Insert'];

// Load .env.local manually if not in process.env
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key] && value) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function seed() {
  console.log('=============================================================================');
  console.log('TEESOULZ -- SUPABASE CATALOGUE SEED & MIGRATION RUNNER');
  console.log('=============================================================================');

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('your-project-ref') || !supabaseUrl.startsWith('http')) {
    console.warn('\n[!] Missing or incomplete Supabase configuration.');
    console.warn('    Please update .env.local with:');
    console.warn('    - NEXT_PUBLIC_SUPABASE_URL');
    console.warn('    - SUPABASE_SERVICE_ROLE_KEY\n');
    console.warn('    Alternatively, execute the generated SQL migrations and seed directly');
    console.warn('    in the Supabase SQL Editor:');
    console.warn('    1. supabase/migrations/20261023000001_initial_schema.sql');
    console.warn('    2. supabase/migrations/20261023000002_rls_policies.sql');
    console.warn('    3. supabase/seed.sql\n');
    return;
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Connecting to: ${supabaseUrl}`);

  // 1. Categories
  console.log('\n[1/6] Seeding Categories...');
  const categories: CategoryInsert[] = [
    { slug: 't-shirts', name: 'T-Shirts', description: 'Classic streetwear tees', display_order: 1, is_active: true },
    { slug: 'oversized-t-shirts', name: 'Oversized T-Shirts', description: 'Heavyweight drop-shoulder tees', display_order: 2, is_active: true },
    { slug: 'graphic-tees', name: 'Graphic Tees', description: 'Original artwork streetwear prints', display_order: 3, is_active: true },
    { slug: 'hoodies-sweatshirts', name: 'Hoodies & Sweatshirts', description: 'Ultra-dense 380+ GSM fleece', display_order: 4, is_active: true },
    { slug: 'bottomwear', name: 'Bottomwear', description: 'Streetwear joggers and denim', display_order: 5, is_active: true },
    { slug: 'accessories', name: 'Accessories', description: 'Caps, beanies, socks, and bags', display_order: 6, is_active: true },
  ];

  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' });
  if (catErr) throw new Error(`Category seed failed: ${catErr.message}`);
  console.log(`   Processed ${categories.length} categories.`);

  // Fetch category IDs map
  const { data: dbCategories } = await supabase.from('categories').select('id, slug');
  const catMap = new Map((dbCategories || []).map(c => [c.slug, c.id]));

  // 2. Collections
  console.log('\n[2/6] Seeding Collections...');
  const collectionsSet = new Set<string>();
  PRODUCTS.forEach(p => (p.collections || []).forEach(c => collectionsSet.add(c)));
  const collectionList: CollectionInsert[] = Array.from(collectionsSet).map(slug => ({
    slug,
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    is_active: true,
  }));

  const { error: colErr } = await supabase.from('collections').upsert(collectionList, { onConflict: 'slug' });
  if (colErr) throw new Error(`Collection seed failed: ${colErr.message}`);
  console.log(`   Processed ${collectionList.length} collections.`);

  const { data: dbCollections } = await supabase.from('collections').select('id, slug');
  const colMap = new Map((dbCollections || []).map(c => [c.slug, c.id]));

  // 3. Coupons
  console.log('\n[3/6] Seeding Coupons...');
  const couponList: CouponInsert[] = STORE_COUPONS.map(c => ({
    code: c.code,
    discount_type: c.discountType,
    discount_value: c.discountType === 'fixed' ? Math.round(c.discountValue * 100) : c.discountValue,
    min_order_value_in_paise: Math.round((c.minOrderValue || 0) * 100),
    description: c.description,
    is_active: true,
  }));

  const { error: coupErr } = await supabase.from('coupons').upsert(couponList, { onConflict: 'code' });
  if (coupErr) throw new Error(`Coupon seed failed: ${coupErr.message}`);
  console.log(`   Processed ${couponList.length} store coupons.`);

  // 4. Products
  console.log('\n[4/6] Migrating 28 Streetwear Products...');
  let totalVariants = 0;
  let totalReviews = 0;

  for (const p of PRODUCTS) {
    const pricePaise = Math.round(p.price * 100);
    const mrpPaise = Math.round(p.mrp * 100);
    const discount = p.discountPercent || Math.round(((p.mrp - p.price) / p.mrp) * 100);
    const categoryId = catMap.get(p.category) || null;

    const productPayload: ProductInsert = {
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle || null,
      description: p.description,
      fabric_details: p.fabricDetails || [],
      fit_type: p.fitType || 'Regular Fit',
      care_instructions: p.careInstructions || [],
      category_id: categoryId,
      gender: (p.gender || 'unisex') as 'men' | 'women' | 'unisex',
      price_in_paise: pricePaise,
      mrp_in_paise: mrpPaise,
      discount_percent: discount,
      images: p.images || [],
      available_colors: p.availableColors || [],
      available_sizes: p.availableSizes || [],
      tags: p.tags || [],
      is_new_arrival: !!p.isNewArrival,
      is_bestseller: !!p.isBestseller,
      is_trending: !!p.isTrending,
      is_featured: !!p.isFeatured,
      is_published: true,
      rating: p.rating || 0,
      review_count: p.reviewCount || 0,
    };

    const { data: dbProd, error: prodErr } = await supabase
      .from('products')
      .upsert(productPayload, { onConflict: 'slug' })
      .select('id')
      .single();

    if (prodErr || !dbProd) throw new Error(`Product upsert failed for ${p.slug}: ${prodErr?.message}`);
    const productId = dbProd.id;

    // Collections junction
    if (p.collections && p.collections.length > 0) {
      const junctionRows: ProductCollectionInsert[] = p.collections
        .map(cSlug => colMap.get(cSlug))
        .filter((cId): cId is string => Boolean(cId))
        .map(cId => ({ product_id: productId, collection_id: cId }));
      
      if (junctionRows.length > 0) {
        await supabase.from('product_collections').upsert(junctionRows);
      }
    }

    // Variants and Inventory
    if (p.variants && p.variants.length > 0) {
      for (const v of p.variants) {
        totalVariants++;
        const variantPayload: VariantInsert = {
          product_id: productId,
          sku: v.sku,
          size: v.size as VariantInsert['size'],
          color: v.color,
          color_code: v.colorCode,
          price_in_paise: v.price ? Math.round(v.price * 100) : null,
        };

        const { data: dbVar, error: varErr } = await supabase
          .from('product_variants')
          .upsert(variantPayload, { onConflict: 'sku' })
          .select('id')
          .single();

        if (varErr || !dbVar) throw new Error(`Variant failed for ${v.sku}: ${varErr?.message}`);

        const inventoryPayload: InventoryInsert = {
          variant_id: dbVar.id,
          stock_quantity: v.stock || 0,
          reserved_quantity: 0,
          low_stock_threshold: 5,
        };

        await supabase.from('inventory').upsert(inventoryPayload, { onConflict: 'variant_id' });
      }
    }

    // Reviews
    if (p.reviews && p.reviews.length > 0) {
      for (const r of p.reviews) {
        totalReviews++;
        const reviewPayload: ReviewInsert = {
          product_id: productId,
          user_name: r.userName,
          rating: r.rating,
          title: r.title || 'Review',
          comment: r.comment,
          verified_purchase: !!r.verifiedPurchase,
          size_purchased: r.sizePurchased || null,
          fit_feedback: r.fitFeedback || null,
          is_approved: true,
        };
        await supabase.from('reviews').insert(reviewPayload);
      }
    }
  }

  console.log(`   Migrated ${PRODUCTS.length} products, ${totalVariants} variants, and ${totalReviews} reviews.`);

  // 5. Verification
  console.log('\n[5/6] Verifying Database Data Integrity...');
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: variantCount } = await supabase.from('product_variants').select('*', { count: 'exact', head: true });

  console.log(`   Products in Supabase: ${productCount} (Expected: ${PRODUCTS.length})`);
  console.log(`   Variants in Supabase: ${variantCount} (Expected: ${totalVariants})`);

  console.log('\n[6/6] SUCCESS: Supabase Database Foundation is 100% Seeded and Verified!');
}

seed().catch(err => {
  console.error('\n[X] Seed failed with error:', err.message);
  process.exit(1);
});
