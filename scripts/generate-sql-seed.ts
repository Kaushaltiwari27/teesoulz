import * as fs from 'fs';
import * as path from 'path';
import { PRODUCTS, STORE_COUPONS } from '../src/data/mockData';

function escapeSql(str: string): string {
  return str.replace(/'/g, "''");
}

function escapeSqlArray(arr: string[]): string {
  if (!arr || arr.length === 0) return "'{}'";
  const escaped = arr.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',');
  return `'{${escaped.replace(/'/g, "''")}}'`;
}

function generateSqlSeed(): string {
  let sql = `-- =============================================================================
-- TEESOULZ STREETWEAR E-COMMERCE -- SUPABASE INITIAL SEED DATA
-- Generated from src/data/mockData.ts
-- Completely idempotent: safe to execute multiple times
-- =============================================================================

-- 1. CATEGORIES
INSERT INTO public.categories (slug, name, description, is_active, display_order)
VALUES
    ('t-shirts', 'T-Shirts', 'Premium cotton classic streetwear tees', true, 1),
    ('oversized-t-shirts', 'Oversized T-Shirts', 'Heavyweight boxy cut drop-shoulder tees', true, 2),
    ('graphic-tees', 'Graphic Tees', 'Original artwork and typography screenprints', true, 3),
    ('hoodies-sweatshirts', 'Hoodies & Sweatshirts', '380+ GSM ultra-dense fleece pullovers', true, 4),
    ('bottomwear', 'Bottomwear', 'Relaxed cargo pants, joggers, and streetwear denim', true, 5),
    ('accessories', 'Accessories', 'Streetwear caps, beanies, socks, and tote bags', true, 6)
ON CONFLICT (slug) DO UPDATE
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    display_order = EXCLUDED.display_order;

-- 2. COLLECTIONS
`;

  // Collect all unique collections
  const collectionsSet = new Set<string>();
  PRODUCTS.forEach(p => {
    (p.collections || []).forEach(c => collectionsSet.add(c));
  });

  sql += `INSERT INTO public.collections (slug, name, description, is_active)
VALUES\n`;
  const collectionList = Array.from(collectionsSet);
  sql += collectionList.map(slug => {
    const formattedName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return `    ('${escapeSql(slug)}', '${escapeSql(formattedName)}', 'Curated streetwear collection: ${escapeSql(formattedName)}', true)`;
  }).join(',\n');
  sql += `\nON CONFLICT (slug) DO UPDATE
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;\n\n`;

  // 3. COUPONS
  sql += `-- 3. STORE COUPONS\n`;
  sql += `INSERT INTO public.coupons (code, discount_type, discount_value, min_order_value_in_paise, description, is_active)
VALUES\n`;
  sql += STORE_COUPONS.map(c => {
    const minValPaise = Math.round((c.minOrderValue || 0) * 100);
    const discVal = c.discountType === 'fixed' ? Math.round(c.discountValue * 100) : c.discountValue;
    return `    ('${escapeSql(c.code)}', '${escapeSql(c.discountType)}', ${discVal}, ${minValPaise}, '${escapeSql(c.description)}', true)`;
  }).join(',\n');
  sql += `\nON CONFLICT (code) DO UPDATE
SET
    discount_type = EXCLUDED.discount_type,
    discount_value = EXCLUDED.discount_value,
    min_order_value_in_paise = EXCLUDED.min_order_value_in_paise,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;\n\n`;

  // 4. PRODUCTS & VARIANTS & INVENTORY
  sql += `-- 4. PRODUCTS, VARIANTS, INVENTORY & REVIEWS\n`;
  sql += `DO $$
DECLARE
    cat_id UUID;
    prod_id UUID;
    var_id UUID;
BEGIN\n\n`;

  PRODUCTS.forEach((p, idx) => {
    const pricePaise = Math.round(p.price * 100);
    const mrpPaise = Math.round(p.mrp * 100);
    const discount = p.discountPercent || Math.round(((p.mrp - p.price) / p.mrp) * 100);
    const colorsJson = JSON.stringify(p.availableColors || []).replace(/'/g, "''");

    sql += `    -- Product ${idx + 1}: ${escapeSql(p.name)} (${p.slug})\n`;
    sql += `    SELECT id INTO cat_id FROM public.categories WHERE slug = '${escapeSql(p.category)}';\n`;
    sql += `    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        '${escapeSql(p.slug)}',
        '${escapeSql(p.name)}',
        ${p.subtitle ? `'${escapeSql(p.subtitle)}'` : 'NULL'},
        '${escapeSql(p.description)}',
        ${escapeSqlArray(p.fabricDetails || [])},
        '${escapeSql(p.fitType || 'Regular Fit')}',
        ${escapeSqlArray(p.careInstructions || [])},
        cat_id,
        '${escapeSql(p.gender || 'unisex')}',
        ${pricePaise},
        ${mrpPaise},
        ${discount},
        ${escapeSqlArray(p.images || [])},
        '${colorsJson}'::jsonb,
        ${escapeSqlArray(p.availableSizes || [])},
        ${escapeSqlArray(p.tags || [])},
        ${p.isNewArrival ? 'true' : 'false'},
        ${p.isBestseller ? 'true' : 'false'},
        ${p.isTrending ? 'true' : 'false'},
        ${p.isFeatured ? 'true' : 'false'},
        true,
        ${p.rating || 0},
        ${p.reviewCount || 0}
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        subtitle = EXCLUDED.subtitle,
        description = EXCLUDED.description,
        fabric_details = EXCLUDED.fabric_details,
        fit_type = EXCLUDED.fit_type,
        care_instructions = EXCLUDED.care_instructions,
        category_id = EXCLUDED.category_id,
        gender = EXCLUDED.gender,
        price_in_paise = EXCLUDED.price_in_paise,
        mrp_in_paise = EXCLUDED.mrp_in_paise,
        discount_percent = EXCLUDED.discount_percent,
        images = EXCLUDED.images,
        available_colors = EXCLUDED.available_colors,
        available_sizes = EXCLUDED.available_sizes,
        tags = EXCLUDED.tags,
        is_new_arrival = EXCLUDED.is_new_arrival,
        is_bestseller = EXCLUDED.is_bestseller,
        is_trending = EXCLUDED.is_trending,
        is_featured = EXCLUDED.is_featured,
        is_published = EXCLUDED.is_published,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count
    RETURNING id INTO prod_id;\n\n`;

    // Collections junction
    if (p.collections && p.collections.length > 0) {
      p.collections.forEach(colSlug => {
        sql += `    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = '${escapeSql(colSlug)}'
    ON CONFLICT DO NOTHING;\n`;
      });
    }

    // Variants and Inventory
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        const variantPrice = v.price ? Math.round(v.price * 100) : 'NULL';
        sql += `    -- Variant: ${escapeSql(v.sku)}\n`;
        sql += `    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, '${escapeSql(v.sku)}', '${escapeSql(v.size)}', '${escapeSql(v.color)}', '${escapeSql(v.colorCode)}', ${variantPrice})
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;\n`;

        sql += `    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, ${v.stock || 0}, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;\n`;
      });
    }

    // Reviews
    if (p.reviews && p.reviews.length > 0) {
      p.reviews.forEach(r => {
        sql += `    INSERT INTO public.reviews (
        product_id, user_name, rating, title, comment, verified_purchase, size_purchased, fit_feedback, is_approved
    ) VALUES (
        prod_id,
        '${escapeSql(r.userName)}',
        ${r.rating},
        '${escapeSql(r.title || 'Review')}',
        '${escapeSql(r.comment)}',
        ${r.verifiedPurchase ? 'true' : 'false'},
        ${r.sizePurchased ? `'${escapeSql(r.sizePurchased)}'` : 'NULL'},
        ${r.fitFeedback ? `'${escapeSql(r.fitFeedback)}'` : 'NULL'},
        true
    ) ON CONFLICT DO NOTHING;\n`;
      });
    }

    sql += `\n`;
  });

  sql += `END $$;\n`;
  return sql;
}

const outputPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
fs.writeFileSync(outputPath, generateSqlSeed(), 'utf-8');
console.log(`Generated SQL seed at ${outputPath} with ${PRODUCTS.length} products.`);
