-- =============================================================================
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
INSERT INTO public.collections (slug, name, description, is_active)
VALUES
    ('noir-monolith', 'Noir Monolith', 'Curated streetwear collection: Noir Monolith', true),
    ('heavyweight-essentials', 'Heavyweight Essentials', 'Curated streetwear collection: Heavyweight Essentials', true),
    ('cyber-tokyo', 'Cyber Tokyo', 'Curated streetwear collection: Cyber Tokyo', true),
    ('shadow-core', 'Shadow Core', 'Curated streetwear collection: Shadow Core', true)
ON CONFLICT (slug) DO UPDATE
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- 3. STORE COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_order_value_in_paise, description, is_active)
VALUES
    ('SOUL10', 'percentage', 10, 0, '10% off on all orders across storefront', true),
    ('STREET15', 'percentage', 15, 199900, '15% off on streetwear orders over ₹1,999', true),
    ('FIRSTDROP', 'fixed', 30000, 149900, '₹300 flat off on your order over ₹1,499', true),
    ('FREESHIP', 'fixed', 9900, 0, 'Free pan-India express shipping', true)
ON CONFLICT (code) DO UPDATE
SET
    discount_type = EXCLUDED.discount_type,
    discount_value = EXCLUDED.discount_value,
    min_order_value_in_paise = EXCLUDED.min_order_value_in_paise,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active;

-- 4. PRODUCTS, VARIANTS, INVENTORY & REVIEWS
DO $$
DECLARE
    cat_id UUID;
    prod_id UUID;
    var_id UUID;
BEGIN

    -- Product 1: Noir Heavyweight Oversized Tee (noir-heavyweight-oversized-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'oversized-t-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'noir-heavyweight-oversized-tee',
        'Noir Heavyweight Oversized Tee',
        'Signature 260 GSM Super-combed French Terry Drop-Shoulder',
        'Engineered with our proprietary 260 GSM high-density combed cotton, the Noir Heavyweight Oversized Tee represents the pinnacle of minimal Indian streetwear. Featuring an exaggerated drop-shoulder cut, reinforced ribbed collar, and anti-pilling bio-wash treatment.',
        '{"260 GSM 100% Super-Combed Compact Cotton","Bio-washed & silicone softened for luxurious handfeel","Preshrunk fabric to prevent post-wash shrinkage","Reinforced 1x1 rib neckline that retains shape"}',
        'Oversized Boxy',
        '{"Machine wash cold inside-out on gentle cycle","Do not bleach or dry clean","Tumble dry low or hang dry in shade","Iron inside out on low heat; avoid print areas"}',
        cat_id,
        'unisex',
        129900,
        199900,
        35,
        '{"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Pitch Black","code":"#080808"},{"name":"Off White","code":"#F5F5F5"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Bestseller","Heavyweight","Drop-Shoulder","Essential"}',
        false,
        true,
        true,
        true,
        true,
        4.9,
        148
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-NOIR-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-NOIR-BLK-S', 'S', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 18, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-NOIR-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-NOIR-BLK-M', 'M', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 24, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-NOIR-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-NOIR-BLK-L', 'L', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-NOIR-BLK-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-NOIR-BLK-XL', 'XL', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 10, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-NOIR-WHT-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-NOIR-WHT-S', 'S', 'Off White', '#F5F5F5', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-NOIR-WHT-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-NOIR-WHT-M', 'M', 'Off White', '#F5F5F5', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 20, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-NOIR-WHT-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-NOIR-WHT-L', 'L', 'Off White', '#F5F5F5', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 8, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    INSERT INTO public.reviews (
        product_id, user_name, rating, title, comment, verified_purchase, size_purchased, fit_feedback, is_approved
    ) VALUES (
        prod_id,
        'Aakash Verma',
        5,
        'Insane fabric quality and perfect drape',
        'Easily comparable to international streetwear brands priced 3x. The 260 GSM fabric has substantial weight without feeling suffocating in Mumbai weather.',
        true,
        'L',
        'Oversized Fit',
        true
    ) ON CONFLICT DO NOTHING;
    INSERT INTO public.reviews (
        product_id, user_name, rating, title, comment, verified_purchase, size_purchased, fit_feedback, is_approved
    ) VALUES (
        prod_id,
        'Rhea Sengupta',
        5,
        'The neckline does not bacon after wash',
        'Wash test passed with flying colors. Collar stayed perfectly intact and rigid.',
        true,
        'M',
        'True to Size',
        true
    ) ON CONFLICT DO NOTHING;

    -- Product 2: Cyber Tokyo Archival Graphic Tee (tokyo-drift-cyber-graphic-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'graphic-tees';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'tokyo-drift-cyber-graphic-tee',
        'Cyber Tokyo Archival Graphic Tee',
        'Limited Drop Screenprinted High-Definition Graphic',
        'Inspired by brutalist cyberpunk typography and neo-Tokyo subcultures. Multi-pass silkscreen printing with crack-resistant plastisol inks across the front chest and exaggerated spinal canvas back.',
        '{"240 GSM 100% Ring-spun Combed Cotton","High-density screen print with matte rubberized finish","Double needle stitching along hemline and cuffs","Custom TEESOULZ woven hem label"}',
        'Oversized Boxy',
        '{"Machine wash inside out in cold water","Never iron directly on the print","Dry in shade to preserve deep monochrome ink depth"}',
        cat_id,
        'unisex',
        139900,
        219900,
        36,
        '{"https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Washed Charcoal","code":"#262626"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Graphic","Archival","Limited Drop"}',
        true,
        false,
        true,
        false,
        true,
        4.8,
        94
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'cyber-tokyo'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CYBER-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CYBER-BLK-S', 'S', 'Washed Charcoal', '#262626', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CYBER-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CYBER-BLK-M', 'M', 'Washed Charcoal', '#262626', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 22, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CYBER-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CYBER-BLK-L', 'L', 'Washed Charcoal', '#262626', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 19, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CYBER-BLK-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CYBER-BLK-XL', 'XL', 'Washed Charcoal', '#262626', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 6, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    INSERT INTO public.reviews (
        product_id, user_name, rating, title, comment, verified_purchase, size_purchased, fit_feedback, is_approved
    ) VALUES (
        prod_id,
        'Vikramaditya Roy',
        5,
        'Back print goes crazy',
        'Detailed graphics, crisp line art, and the washed charcoal vintage look is 10/10.',
        true,
        'XL',
        'Oversized Fit',
        true
    ) ON CONFLICT DO NOTHING;

    -- Product 3: Shadow Core 420 GSM Boxy Hoodie (shadow-core-heavy-hoodie)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'hoodies-sweatshirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'shadow-core-heavy-hoodie',
        'Shadow Core 420 GSM Boxy Hoodie',
        'Ultra-Heavy French Terry with Double-Layered Geometric Hood',
        'Engineered for sub-zero style and commanding presence. Constructed from authentic 420 GSM unbrushed loopback cotton French Terry. Featuring seamless kangaroo pocket integration, dropped shoulders, and no drawstring hood for architectural clarity.',
        '{"420 GSM 100% French Terry Cotton","Loopback interior for year-round breathability & weight","Structural double-panel seamless hood","Reinforced spandex-ribbed cuffs and hem"}',
        'Oversized Boxy',
        '{"Hand wash or machine wash cold gentle","Dry flat to avoid stretching the heavy knit","Cool iron if necessary"}',
        cat_id,
        'unisex',
        269900,
        399900,
        32,
        '{"https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Onyx Black","code":"#0a0a0a"},{"name":"Concrete Grey","code":"#8E8E93"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Heavyweight","Winter Essential","Bestseller"}',
        false,
        true,
        false,
        true,
        true,
        4.9,
        112
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'shadow-core'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-HOOD-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HOOD-BLK-S', 'S', 'Onyx Black', '#0a0a0a', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 10, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-HOOD-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HOOD-BLK-M', 'M', 'Onyx Black', '#0a0a0a', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-HOOD-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HOOD-BLK-L', 'L', 'Onyx Black', '#0a0a0a', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-HOOD-BLK-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HOOD-BLK-XL', 'XL', 'Onyx Black', '#0a0a0a', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 5, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-HOOD-GRY-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HOOD-GRY-M', 'M', 'Concrete Grey', '#8E8E93', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 9, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-HOOD-GRY-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HOOD-GRY-L', 'L', 'Concrete Grey', '#8E8E93', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 7, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    INSERT INTO public.reviews (
        product_id, user_name, rating, title, comment, verified_purchase, size_purchased, fit_feedback, is_approved
    ) VALUES (
        prod_id,
        'Zorawar Singh',
        5,
        'The hood stands upright on its own!',
        'Structure is phenomenal. The hood has two thick layers so it does not collapse or look floppy.',
        true,
        'L',
        'Oversized Fit',
        true
    ) ON CONFLICT DO NOTHING;

    -- Product 4: Tactical Parachute Wide-Leg Cargos (tactical-parachute-cargo-pants)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'bottomwear';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'tactical-parachute-cargo-pants',
        'Tactical Parachute Wide-Leg Cargos',
        'Technical Matte Nylon-Cotton Blend with Ankle Cinchers',
        'Balancing utilitarian functionality with street-ready drape. Features deep bellow pockets, articulated knee pleats, and adjustable bungee toggles at the hem to switch between wide-leg and tapered parachute silhouettes.',
        '{"Matte Cotton-Nylon High-Density Ripstop Blend","Water-repellent DWR surface finish","Custom matte black metal eyelets and cord locks","Elasticated waistband with inner climbing-grade drawstring"}',
        'Relaxed Fit',
        '{"Machine wash gentle cold","Do not tumble dry","Line dry in shade"}',
        cat_id,
        'unisex',
        249900,
        349900,
        28,
        '{"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Stealth Black","code":"#111111"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Cargos","Utility","Trending"}',
        false,
        false,
        true,
        false,
        true,
        4.7,
        76
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'cyber-tokyo'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CRG-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CRG-BLK-S', 'S', 'Stealth Black', '#111111', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 8, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CRG-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CRG-BLK-M', 'M', 'Stealth Black', '#111111', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CRG-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CRG-BLK-L', 'L', 'Stealth Black', '#111111', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CRG-BLK-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CRG-BLK-XL', 'XL', 'Stealth Black', '#111111', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 6, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    INSERT INTO public.reviews (
        product_id, user_name, rating, title, comment, verified_purchase, size_purchased, fit_feedback, is_approved
    ) VALUES (
        prod_id,
        'Tanmay Mehta',
        5,
        'Silhouette is unmatched with sneakers',
        'Pairs flawlessly with chunky sneakers or retro runners. The adjustable bottom cinch is high grade.',
        true,
        'M',
        'True to Size',
        true
    ) ON CONFLICT DO NOTHING;

    -- Product 5: Acid Wash Mineral Heavy Tee (monochrome-acid-wash-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'oversized-t-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'monochrome-acid-wash-tee',
        'Acid Wash Mineral Heavy Tee',
        'Artisanal Mineral Wash 250 GSM Drop-Shoulder',
        'Each piece undergoes a meticulous stone and mineral acid bath treatment, creating a one-of-a-kind vintage marbled patina with raw edge seams.',
        '{"250 GSM 100% Cotton with Mineral Wash treatment","Unique wash pattern on every garment","Twin-needle hem and collar construction"}',
        'Drop Shoulder',
        '{"Wash separately first 2 cycles","Cold water wash only","Dry flat"}',
        cat_id,
        'men',
        139900,
        199900,
        30,
        '{"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Mineral Grey","code":"#4A4A4A"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Acid Wash","Vintage","New In"}',
        true,
        false,
        false,
        false,
        true,
        4.8,
        52
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-ACID-GRY-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-GRY-S', 'S', 'Mineral Grey', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ACID-GRY-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-GRY-M', 'M', 'Mineral Grey', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 16, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ACID-GRY-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-GRY-L', 'L', 'Mineral Grey', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 11, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ACID-GRY-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-GRY-XL', 'XL', 'Mineral Grey', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 5, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 6: TEESOULZ Infinity Dad Cap (infinity-signature-embroidered-cap)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'accessories';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'infinity-signature-embroidered-cap',
        'TEESOULZ Infinity Dad Cap',
        'Low Profile 6-Panel Heavy Twill with 3D Monogram Embroidery',
        'Crafted from 100% heavy brushed cotton twill. Features precise raised 3D tonal embroidery of the official TEESOULZ Infinity monogram, an antique silver strap clasp, and custom taped internal seams.',
        '{"100% Heavy Brushed Cotton Twill","High-definition 3D puff embroidery","Embossed silver-finish metal buckle closure","Structured buckram front panels"}',
        'Regular Fit',
        '{"Spot clean only with damp cloth","Do not submerge or machine wash"}',
        cat_id,
        'unisex',
        89900,
        149900,
        40,
        '{"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Pitch Black","code":"#080808"},{"name":"Silver Stone","code":"#B8B8B8"}]'::jsonb,
        '{"M"}',
        '{"Accessory","Headwear","Iconic"}',
        false,
        true,
        false,
        false,
        true,
        4.9,
        88
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CAP-BLK
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CAP-BLK', 'M', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 35, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CAP-SLV
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CAP-SLV', 'M', 'Silver Stone', '#B8B8B8', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 20, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 7: Womens Oversized Sculpted Crop Tee (oversized-heavy-raw-cut-tee-women)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'oversized-t-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'oversized-heavy-raw-cut-tee-women',
        'Womens Oversized Sculpted Crop Tee',
        'Drop Shoulder Boxy Silhouette with Raw Edge Seaming',
        'Designed exclusively for women who demand streetwear without compromise. Cut in an architectural cropped boxy frame that pairs effortlessly with high-waisted cargos or denim.',
        '{"240 GSM Super-combed Combed Cotton","Raw edge roll-resistant waist hem","Dropped shoulder sleeve design"}',
        'Oversized Boxy',
        '{"Machine wash cold","Wash with similar colors","Do not tumble dry"}',
        cat_id,
        'women',
        119900,
        179900,
        33,
        '{"https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Pure Noir","code":"#080808"}]'::jsonb,
        '{"XS","S","M"}',
        '{"Women","Cropped","Minimalist"}',
        false,
        false,
        true,
        false,
        true,
        4.8,
        63
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-WCRP-BLK-XS
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WCRP-BLK-XS', 'XS', 'Pure Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-WCRP-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WCRP-BLK-S', 'S', 'Pure Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 18, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-WCRP-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WCRP-BLK-M', 'M', 'Pure Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 8: Archival Heavyweight Crewneck Sweatshirt (heavyweight-minimal-crewneck-sweatshirt)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'hoodies-sweatshirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'heavyweight-minimal-crewneck-sweatshirt',
        'Archival Heavyweight Crewneck Sweatshirt',
        '380 GSM Heavy French Terry with Ribbed Side Gussets',
        'A tribute to athletic heritage reimagined through high-fashion streetwear. Ribbed side panels allow unrestricted movement, while dense loopback knit maintains a razor-sharp structural profile.',
        '{"380 GSM 100% Cotton Heavy Terry","Cross-grain cut to prevent vertical shrinkage","Subtle monochrome embroidered logo at left wrist"}',
        'Relaxed Fit',
        '{"Machine wash cold gentle","Hang dry inside-out"}',
        cat_id,
        'unisex',
        219900,
        329900,
        33,
        '{"https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Heather Ash","code":"#CCCCCC"}]'::jsonb,
        '{"S","M","L"}',
        '{"Crewneck","Layering","Warmth"}',
        false,
        false,
        false,
        false,
        true,
        4.7,
        45
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CRW-SLV-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CRW-SLV-S', 'S', 'Heather Ash', '#CCCCCC', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 9, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CRW-SLV-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CRW-SLV-M', 'M', 'Heather Ash', '#CCCCCC', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CRW-SLV-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CRW-SLV-L', 'L', 'Heather Ash', '#CCCCCC', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 9: TEESOULZ Heavy Utility Canvas Tote (oversized-heavy-canvas-tote-bag)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'accessories';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'oversized-heavy-canvas-tote-bag',
        'TEESOULZ Heavy Utility Canvas Tote',
        '16oz Waterproof Waxed Canvas with Laptop Sleeve',
        'Designed for daily carry, city commuting, and street aesthetics. Built with ultra-durable 16oz cotton canvas, reinforced dual webbing handles, internal zip organizer, and padded 15" laptop divider.',
        '{"16oz Heavyweight Cotton Duck Canvas","Matte black reinforced metal hardware","Padded internal tech compartment"}',
        'Regular Fit',
        '{"Wipe clean with a damp sponge","Do not machine wash or soak"}',
        cat_id,
        'unisex',
        99900,
        169900,
        41,
        '{"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Raw Noir","code":"#111111"}]'::jsonb,
        '{"M"}',
        '{"Tote Bag","Utility","Daily Essential"}',
        false,
        false,
        false,
        false,
        true,
        4.9,
        39
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-TOTE-BLK
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-TOTE-BLK', 'M', 'Raw Noir', '#111111', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 28, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 10: Relic Skull Gothic Backprint Tee (relic-skull-acid-backprint-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'graphic-tees';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'relic-skull-acid-backprint-tee',
        'Relic Skull Gothic Backprint Tee',
        'Distressed Graphic Art on Vintage Washed Cotton',
        'Featuring dark renaissance iconography reimagined for modern streetwear. Custom discharge printing method ensures zero hand-feel texture on the artwork while preserving maximum breathability.',
        '{"240 GSM 100% Super-Combed Cotton","Zero-feel breathable discharge print","Distressed seam detailing at cuffs"}',
        'Oversized Boxy',
        '{"Machine wash inside out cold","Do not tumble dry"}',
        cat_id,
        'men',
        134900,
        199900,
        32,
        '{"https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Washed Black","code":"#1c1c1c"}]'::jsonb,
        '{"S","M","L"}',
        '{"Gothic","Backprint","Graphic"}',
        false,
        false,
        true,
        false,
        true,
        4.8,
        41
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'shadow-core'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-SKULL-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-SKULL-BLK-S', 'S', 'Washed Black', '#1c1c1c', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 11, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-SKULL-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-SKULL-BLK-M', 'M', 'Washed Black', '#1c1c1c', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 19, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-SKULL-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-SKULL-BLK-L', 'L', 'Washed Black', '#1c1c1c', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 11: Heavy Knit Relaxed Sweatpants (monochrome-heavy-knit-joggers)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'bottomwear';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'monochrome-heavy-knit-joggers',
        'Heavy Knit Relaxed Sweatpants',
        '380 GSM Diagonal Loop Terry with Deep Concealed Pockets',
        'Crafted with generous thigh clearance and clean straight drape down to the ankles. Built with matte black zippered pockets to keep your phone and essentials secure.',
        '{"380 GSM Heavy French Terry Cotton","Concealed YKK zipper pocket closures","Chunky braided drawcord with metal aglets"}',
        'Relaxed Fit',
        '{"Machine wash cold with like colors","Line dry in shade"}',
        cat_id,
        'unisex',
        219900,
        319900,
        31,
        '{"https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Jet Black","code":"#080808"}]'::jsonb,
        '{"S","M","L"}',
        '{"Sweatpants","Lounge","Heavyweight"}',
        false,
        false,
        false,
        false,
        true,
        4.7,
        38
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-JOG-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-JOG-BLK-S', 'S', 'Jet Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 8, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-JOG-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-JOG-BLK-M', 'M', 'Jet Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-JOG-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-JOG-BLK-L', 'L', 'Jet Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 12: Archival White Oversized Tee (pure-white-minimal-oversized-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'oversized-t-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'pure-white-minimal-oversized-tee',
        'Archival White Oversized Tee',
        'Zero Transparency 260 GSM Heavy Optical White Cotton',
        'The holy grail of white tees. Engineered with tight yarn density so it has completely zero transparency under any light. Thick ribbed collar that stays crisp and never sags.',
        '{"260 GSM 100% Super-Combed Compact Yarn","Optical brightener-free pure white finish","Double enzyme wash for ultra-smooth handfeel"}',
        'Oversized Boxy',
        '{"Wash with whites only","Warm iron on reverse","Do not tumble dry"}',
        cat_id,
        'unisex',
        129900,
        199900,
        35,
        '{"https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1618354691438-25bc04584c03?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Pure White","code":"#FFFFFF"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Essential","White Tee","Bestseller"}',
        false,
        true,
        false,
        false,
        true,
        4.9,
        96
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-WHT-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WHT-S', 'S', 'Pure White', '#FFFFFF', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 20, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-WHT-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WHT-M', 'M', 'Pure White', '#FFFFFF', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 25, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-WHT-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WHT-L', 'L', 'Pure White', '#FFFFFF', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 18, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-WHT-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WHT-XL', 'XL', 'Pure White', '#FFFFFF', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 10, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 13: Matrix Cyber Distortion Tee (matrix-cyber-distortion-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'graphic-tees';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'matrix-cyber-distortion-tee',
        'Matrix Cyber Distortion Tee',
        '260 GSM Heavyweight Screenprinted Acid Tee',
        'A dark visual exploration of digital glitches, coded matrix sequences, and underground club culture. Printed on heavyweight 260 GSM combed cotton with high-definition non-fade pigment inks.',
        '{"260 GSM 100% Super-Combed Compact Cotton","High-definition silkscreen print with matte finish","Pre-shrunk fabric with bio-wash softness","Reinforced drop-shoulder boxy drape"}',
        'Oversized Boxy',
        '{"Machine wash cold inside out","Do not iron directly on print","Dry in shade"}',
        cat_id,
        'unisex',
        139900,
        219900,
        36,
        '{"https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Onyx Black","code":"#0A0A0A"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Cyberpunk","Graphic Tee","New Drop"}',
        true,
        false,
        true,
        false,
        true,
        4.8,
        47
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'cyber-tokyo'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-MAT-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MAT-BLK-S', 'S', 'Onyx Black', '#0A0A0A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-MAT-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MAT-BLK-M', 'M', 'Onyx Black', '#0A0A0A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 22, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-MAT-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MAT-BLK-L', 'L', 'Onyx Black', '#0A0A0A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 16, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-MAT-BLK-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MAT-BLK-XL', 'XL', 'Onyx Black', '#0A0A0A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 9, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 14: Vintage Mineral Washed Boxy Tee (vintage-mineral-washed-boxy-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'oversized-t-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'vintage-mineral-washed-boxy-tee',
        'Vintage Mineral Washed Boxy Tee',
        '280 GSM Mineral Acid Enzyme Wash Hand-Distressed',
        'Each unit undergoes a proprietary 4-stage mineral enzyme wash to achieve authentic vintage character, subtle seam abrasion, and a broken-in luxury hand-feel from day one.',
        '{"280 GSM Heavy French Terry Cotton","Individual artisan mineral wash treatment","1.25-inch thick ribbed zero-sag collar","Double-needle chain-stitched hemline"}',
        'Oversized Boxy',
        '{"Wash separately with darks","Tumble dry low","Warm iron on reverse"}',
        cat_id,
        'men',
        149900,
        229900,
        35,
        '{"https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Mineral Grey","code":"#3D3D3D"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Mineral Wash","Vintage","Heavyweight"}',
        false,
        true,
        false,
        false,
        true,
        4.9,
        62
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-MIN-GRY-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MIN-GRY-S', 'S', 'Mineral Grey', '#3D3D3D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-MIN-GRY-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MIN-GRY-M', 'M', 'Mineral Grey', '#3D3D3D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 18, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-MIN-GRY-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MIN-GRY-L', 'L', 'Mineral Grey', '#3D3D3D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-MIN-GRY-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-MIN-GRY-XL', 'XL', 'Mineral Grey', '#3D3D3D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 8, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 15: Tactical Parachute Cargo Trousers (tactical-parachute-cargo-trousers)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'bottomwear';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'tactical-parachute-cargo-trousers',
        'Tactical Parachute Cargo Trousers',
        'Weather-Resistant Ripstop Cotton with 6 Flap Pockets',
        'Engineered for utilitarian streetwear aesthetics. Features adjustable bungee cord ankle cinches to effortlessly toggle between stacked and relaxed wide-leg silhouettes.',
        '{"290 GSM Heavy Cotton-Nylon Ripstop weave","6 Multi-compartment accordion flap pockets","Dual bungee hem adjusters with zinc alloy toggles","Elasticated waistband with thick tactical drawcord"}',
        'Relaxed Wide-Leg',
        '{"Machine wash cold","Do not bleach","Hang dry in shade"}',
        cat_id,
        'unisex',
        269900,
        399900,
        33,
        '{"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Stealth Black","code":"#0D0D0D"}]'::jsonb,
        '{"S","M","L"}',
        '{"Techwear","Cargo","Parachute Pants"}',
        false,
        false,
        true,
        false,
        true,
        4.8,
        54
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CARGO-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CARGO-BLK-S', 'S', 'Stealth Black', '#0D0D0D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 10, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CARGO-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CARGO-BLK-M', 'M', 'Stealth Black', '#0D0D0D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CARGO-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CARGO-BLK-L', 'L', 'Stealth Black', '#0D0D0D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 16: Archival Minimal Half-Zip Sweatshirt (archival-minimal-half-zip-sweatshirt)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'hoodies-sweatshirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'archival-minimal-half-zip-sweatshirt',
        'Archival Minimal Half-Zip Sweatshirt',
        '400 GSM French Terry with Gunmetal YKK Hardware',
        'A sharp, structured half-zip pullover designed with double-layer stand collar and seamless drop-shoulder drape. Premium gunmetal hardware with custom TEESOULZ branded puller.',
        '{"400 GSM Heavyweight Diagonal French Terry","Matte gunmetal YKK zipper with storm flap backing","Heavy-ribbed cuffs and waistband with shape retention","Zero synthetic blend: 100% natural cotton breathability"}',
        'Oversized Boxy',
        '{"Machine wash cold inside out","Flat dry recommended","Low iron if needed"}',
        cat_id,
        'unisex',
        249900,
        369900,
        32,
        '{"https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Pitch Black","code":"#080808"}]'::jsonb,
        '{"S","M","L"}',
        '{"Half-Zip","Sweatshirt","Minimalist"}',
        true,
        false,
        false,
        false,
        true,
        4.9,
        33
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-HZ-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HZ-BLK-S', 'S', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 9, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-HZ-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HZ-BLK-M', 'M', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 16, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-HZ-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-HZ-BLK-L', 'L', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 11, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 17: Women’s Heavyweight Boxy Crop Tee (womens-heavyweight-boxy-crop-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 't-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'womens-heavyweight-boxy-crop-tee',
        'Women’s Heavyweight Boxy Crop Tee',
        '240 GSM Combed Cotton Architectural Crop Cut',
        'Designed specifically for the modern female streetwear silhouette. Cut with an exaggerated wide torso, high crew neckline, and waist-grazing clean hem.',
        '{"240 GSM 100% Combed Cotton Single Jersey","Clean wide drop-shoulder construction","Anti-shrinkage preshrunk finish","Dense 1x1 rib neckline"}',
        'Boxy Cropped',
        '{"Machine wash cold gentle","Do not tumble dry","Warm iron on reverse"}',
        cat_id,
        'women',
        119900,
        179900,
        33,
        '{"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Noir Black","code":"#0D0D0D"}]'::jsonb,
        '{"S","M","L"}',
        '{"Cropped","Women","Boxy Tee"}',
        false,
        false,
        true,
        false,
        true,
        4.9,
        42
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CROP-BLK-XS
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CROP-BLK-XS', 'S', 'Noir Black', '#0D0D0D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CROP-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CROP-BLK-S', 'M', 'Noir Black', '#0D0D0D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 18, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CROP-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CROP-BLK-M', 'L', 'Noir Black', '#0D0D0D', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 18: Concrete Melange Architectural Hoodie (concrete-melange-architectural-hoodie)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'hoodies-sweatshirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'concrete-melange-architectural-hoodie',
        'Concrete Melange Architectural Hoodie',
        '420 GSM Ultra-Dense Brushed Cotton Fleece',
        'Constructed from heathered concrete melange brushed fleece. Features our signature double-layered structured crossover hood, eliminated drawstrings for clean minimalism, and reinforced side pockets.',
        '{"420 GSM Heavyweight 3-Thread Brushed Fleece","Heathered concrete grey melange yarn","Double-stitched stress points for lifelong endurance","No drawstrings for architectural structure"}',
        'Oversized Boxy',
        '{"Machine wash cold with like colors","Do not wring","Line dry in shade"}',
        cat_id,
        'unisex',
        279900,
        399900,
        30,
        '{"https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Concrete Grey","code":"#8C8C8C"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Hoodie","Heavyweight 420 GSM","Bestseller"}',
        false,
        true,
        false,
        false,
        true,
        5,
        78
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CON-GRY-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CON-GRY-S', 'S', 'Concrete Grey', '#8C8C8C', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 8, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CON-GRY-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CON-GRY-M', 'M', 'Concrete Grey', '#8C8C8C', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CON-GRY-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CON-GRY-L', 'L', 'Concrete Grey', '#8C8C8C', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CON-GRY-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CON-GRY-XL', 'XL', 'Concrete Grey', '#8C8C8C', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 7, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 19: Neo-Tokyo Kanji Heavy Long-Sleeve Tee (neo-tokyo-kanji-heavy-longsleeve)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'graphic-tees';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'neo-tokyo-kanji-heavy-longsleeve',
        'Neo-Tokyo Kanji Heavy Long-Sleeve Tee',
        '260 GSM Ribbed Cuff with Industrial Sleeve Typography',
        'A tribute to Tokyo underground night racing and industrial visual identities. Printed with high-density monochrome kanji characters running down both sleeves and oversized typographic drop back.',
        '{"260 GSM 100% Ring-Spun Combed Cotton","Dense 2.5-inch ribbed wrist cuffs","Crack-resistant high-density silkscreen ink","Reinforced shoulder-to-shoulder neck tape"}',
        'Oversized Boxy',
        '{"Machine wash cold inside out","Do not iron on print","Dry flat"}',
        cat_id,
        'unisex',
        159900,
        239900,
        33,
        '{"https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Washed Black","code":"#1A1A1A"}]'::jsonb,
        '{"S","M","L"}',
        '{"Long Sleeve","Kanji","Graphic"}',
        true,
        false,
        false,
        false,
        true,
        4.8,
        39
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'cyber-tokyo'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-LS-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-LS-BLK-S', 'S', 'Washed Black', '#1A1A1A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 11, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-LS-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-LS-BLK-M', 'M', 'Washed Black', '#1A1A1A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 17, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-LS-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-LS-BLK-L', 'L', 'Washed Black', '#1A1A1A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 20: Noir Raw Cut Wide-Leg Denim (noir-raw-cut-wide-leg-denim)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'bottomwear';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'noir-raw-cut-wide-leg-denim',
        'Noir Raw Cut Wide-Leg Denim',
        '14oz Heavy Rigid Cotton Denim with Distressed Seams',
        'Cut from authentic 14oz shuttle-woven rigid black denim. Features a true wide-leg drape from hip to floor, custom matte black rivet hardware, and unhemmed raw edge detailing.',
        '{"14oz 100% Rigid Heavyweight Cotton Denim","Matte black anti-corrosion branded hardware","Raw cut fraying hem with stay-stitch reinforcement","Deep front pocket bags with concealed coin slot"}',
        'Wide Leg Loose',
        '{"Wash inside out in cold water","Wash sparingly to preserve black sulfur dye","Line dry only"}',
        cat_id,
        'unisex',
        299900,
        449900,
        33,
        '{"https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Raw Noir","code":"#080808"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Denim","Wide Leg","14oz Heavy"}',
        false,
        false,
        true,
        false,
        true,
        4.9,
        45
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-DNM-BLK-28
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-DNM-BLK-28', 'S', 'Raw Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 7, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-DNM-BLK-30
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-DNM-BLK-30', 'M', 'Raw Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 13, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-DNM-BLK-32
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-DNM-BLK-32', 'L', 'Raw Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 10, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-DNM-BLK-34
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-DNM-BLK-34', 'XL', 'Raw Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 6, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 21: Distressed Metal Tag Dad Cap (distressed-metal-tag-dad-cap)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'accessories';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'distressed-metal-tag-dad-cap',
        'Distressed Metal Tag Dad Cap',
        '100% Cotton Chino Twill with Matte Gunmetal Buckle',
        'Unstructured 6-panel silhouette featuring subtle hand-distressed brim abrasions, tonal 3D embroidery on the crown, and a custom gunmetal logo bar riveted to the side.',
        '{"Heavy 320 GSM Cotton Chino Twill","High-relief 3D tonal embroidery","Antiqued gunmetal clasp with strap tuck-in","Moisture-absorbing cotton sweatband"}',
        'One Size Adjustable',
        '{"Spot clean with damp cloth","Do not submerge or machine wash"}',
        cat_id,
        'unisex',
        89900,
        149900,
        40,
        '{"https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Washed Pitch","code":"#111111"}]'::jsonb,
        '{"M"}',
        '{"Cap","Headwear","Street Accessory"}',
        false,
        true,
        false,
        false,
        true,
        4.8,
        68
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CAP-BLK
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CAP-BLK', 'M', 'Washed Pitch', '#111111', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 35, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 22: Acid Stone-Wash Oversized Heavy Tee (acid-stone-wash-oversized-heavy-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'oversized-t-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'acid-stone-wash-oversized-heavy-tee',
        'Acid Stone-Wash Oversized Heavy Tee',
        '260 GSM Vintage Hand-Dipped Marble Acid Texture',
        'Featuring distinctive marbled grey streaks created by volcanic stone enzyme washing. No two garments are identical, giving you an entirely 1-of-1 streetwear masterpiece.',
        '{"260 GSM 100% Super-Combed Cotton","Artisanal volcanic stone acid wash","Reinforced drop-shoulder pattern","Anti-curl neckline ribbing"}',
        'Oversized Boxy',
        '{"Wash inside out cold","Do not tumble dry","Warm iron on reverse"}',
        cat_id,
        'unisex',
        139900,
        209900,
        33,
        '{"https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Marble Smoke","code":"#4A4A4A"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Acid Wash","Marble","Heavyweight"}',
        false,
        false,
        true,
        false,
        true,
        4.9,
        52
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'shadow-core'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-ACID-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-S', 'S', 'Marble Smoke', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 15, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ACID-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-M', 'M', 'Marble Smoke', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 20, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ACID-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-L', 'L', 'Marble Smoke', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 16, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ACID-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ACID-XL', 'XL', 'Marble Smoke', '#4A4A4A', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 8, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 23: Cyber Glitch Typography Statement Tee (cyber-glitch-typography-statement-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'graphic-tees';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'cyber-glitch-typography-statement-tee',
        'Cyber Glitch Typography Statement Tee',
        '240 GSM Silicon Puff 3D Chest and Back Graphics',
        'High-energy streetwear featuring kinetic typographic glitch prints across the chest and back. Crafted using embossed 3D silicon puff inks that raise 1mm off the fabric surface.',
        '{"240 GSM Ring-Spun Combed Cotton","Tactile 1mm embossed 3D silicone puff print","Double-stitched ribbed neckline","Ultra-deep jet black dye recipe"}',
        'Oversized Boxy',
        '{"Machine wash cold gentle","Never iron on puff print","Dry in shade"}',
        cat_id,
        'unisex',
        144900,
        219900,
        34,
        '{"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Jet Black","code":"#080808"}]'::jsonb,
        '{"S","M","L"}',
        '{"Puff Print","Glitch","Graphic"}',
        true,
        false,
        false,
        false,
        true,
        4.8,
        36
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'cyber-tokyo'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-GLI-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-GLI-BLK-S', 'S', 'Jet Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-GLI-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-GLI-BLK-M', 'M', 'Jet Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 19, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-GLI-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-GLI-BLK-L', 'L', 'Jet Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 24: Women’s Parachute High-Waist Cargo (womens-parachute-high-waist-cargo)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'bottomwear';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'womens-parachute-high-waist-cargo',
        'Women’s Parachute High-Waist Cargo',
        'Bungee-cord Hem Adjusters with Relaxed Balloon Fit',
        'Ultra-lightweight yet structured parachute cargo pants for women. High-waisted elastic casing with internal drawstrings and cinched ankles for an effortless streetwear silhouette.',
        '{"Technical Matte Nylon-Cotton Blend","Adjustable bungee cords at leg openings","4 Ergonomic slant and side cargo pockets","Wrinkle-resistant travel friendly fabric"}',
        'High-Rise Balloon',
        '{"Machine wash cold gentle cycle","Low tumble dry","Cool iron if needed"}',
        cat_id,
        'women',
        249900,
        359900,
        31,
        '{"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Matte Carbon","code":"#141414"}]'::jsonb,
        '{"S","M","L"}',
        '{"Women Cargo","Parachute","High Waist"}',
        false,
        false,
        true,
        false,
        true,
        4.9,
        48
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-WCARGO-XS
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WCARGO-XS', 'S', 'Matte Carbon', '#141414', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 10, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-WCARGO-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WCARGO-S', 'M', 'Matte Carbon', '#141414', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 16, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-WCARGO-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-WCARGO-M', 'L', 'Matte Carbon', '#141414', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 12, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 25: Heavyweight Oversized Muscle Tank (heavyweight-oversized-muscle-tank)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 't-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'heavyweight-oversized-muscle-tank',
        'Heavyweight Oversized Muscle Tank',
        '240 GSM Raw Cut Armholes with Combed Cotton Softness',
        'Designed for summer layering or high-intensity street styling. Features wide-cut shoulders, dropped raw-cut arm openings, and a relaxed boxy trunk.',
        '{"240 GSM 100% Super-Combed Cotton Jersey","Reinforced raw-edge drop armholes","Heavy 1-inch crewneck collar","Zero synthetic blend"}',
        'Oversized Boxy Tank',
        '{"Machine wash cold","Hang dry in shade"}',
        cat_id,
        'men',
        99900,
        159900,
        38,
        '{"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Pitch Black","code":"#080808"}]'::jsonb,
        '{"S","M","L"}',
        '{"Muscle Tank","Summer Streetwear","Oversized"}',
        false,
        false,
        false,
        false,
        true,
        4.7,
        31
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-TANK-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-TANK-BLK-S', 'S', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-TANK-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-TANK-BLK-M', 'M', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 22, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-TANK-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-TANK-BLK-L', 'L', 'Pitch Black', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 16, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 26: Boxy Heavy Fleece Two-Way Zip Hoodie (boxy-heavy-fleece-two-way-zip-hoodie)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'hoodies-sweatshirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'boxy-heavy-fleece-two-way-zip-hoodie',
        'Boxy Heavy Fleece Two-Way Zip Hoodie',
        '420 GSM Double-Zip with Architectural Drop-Shoulder',
        'The definitive streetwear zip-up. Built with custom two-way heavy metal YKK zippers allowing dual styling options. Seamless drop-shoulders with double-layered hood.',
        '{"420 GSM 100% French Terry Loopback Cotton","YKK heavy two-way metal reversible zipper","Double-ply thermal hood structure","Split kangaroo front pockets with bar-tack reinforcement"}',
        'Oversized Boxy',
        '{"Wash cold inside out","Flat dry recommended","Do not bleach"}',
        cat_id,
        'unisex',
        289900,
        419900,
        31,
        '{"https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Onyx Noir","code":"#080808"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Zip Hoodie","Two-Way Zip","Heavy 420 GSM"}',
        false,
        true,
        false,
        false,
        true,
        5,
        65
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-ZIP-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ZIP-BLK-S', 'S', 'Onyx Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 9, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ZIP-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ZIP-BLK-M', 'M', 'Onyx Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 18, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ZIP-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ZIP-BLK-L', 'L', 'Onyx Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 14, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-ZIP-BLK-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-ZIP-BLK-XL', 'XL', 'Onyx Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 7, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 27: Heavy Ribbed Streetwear Socks 3-Pack (heavy-ribbed-streetwear-socks-3pack)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'accessories';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'heavy-ribbed-streetwear-socks-3pack',
        'Heavy Ribbed Streetwear Socks 3-Pack',
        'Arch-Support Combed Cotton in Black, Chalk & Charcoal',
        'High-cushion crew socks engineered for chunky sneakers and streetwear boots. Features engineered arch compression, reinforced heel and toe, and subtle embroidered monogram.',
        '{"85% Combed Cotton, 12% Spandex, 3% Elastic","Cushioned terry footbed for all-day comfort","Stay-up ribbed leg that never slides down","Pack includes 1x Black, 1x Chalk White, 1x Charcoal"}',
        'One Size (UK 6 - 11)',
        '{"Machine wash warm","Tumble dry medium"}',
        cat_id,
        'unisex',
        59900,
        99900,
        40,
        '{"https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Monochrome Pack","code":"#333333"}]'::jsonb,
        '{"M"}',
        '{"Socks","Trio Pack","Essentials"}',
        false,
        false,
        false,
        false,
        true,
        4.8,
        88
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'heavyweight-essentials'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-SCK-TRIO
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-SCK-TRIO', 'M', 'Monochrome Pack', '#333333', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 45, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

    -- Product 28: Brutalist Chrome Monogram Heavy Tee (brutalist-chrome-monogram-heavy-tee)
    SELECT id INTO cat_id FROM public.categories WHERE slug = 'oversized-t-shirts';
    INSERT INTO public.products (
        slug, name, subtitle, description, fabric_details, fit_type, care_instructions,
        category_id, gender, price_in_paise, mrp_in_paise, discount_percent, images,
        available_colors, available_sizes, tags, is_new_arrival, is_bestseller,
        is_trending, is_featured, is_published, rating, review_count
    ) VALUES (
        'brutalist-chrome-monogram-heavy-tee',
        'Brutalist Chrome Monogram Heavy Tee',
        '280 GSM Liquid Metal High-Reflective Silicone Print',
        'Featuring our flagship TEESOULZ architectural emblem printed with reflective liquid chrome silicone ink. Shimmers under direct studio light and flash photography.',
        '{"280 GSM 100% Super-Combed Compact Cotton","Reflective liquid chrome silicone relief print","Anti-shrinkage pre-washed finish","Heavy 1.25-inch high-density ribbed collar"}',
        'Oversized Boxy',
        '{"Wash inside out cold gentle","Do not iron on chrome emblem","Dry flat in shade"}',
        cat_id,
        'unisex',
        149900,
        229900,
        35,
        '{"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=85","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85"}',
        '[{"name":"Chrome Noir","code":"#080808"}]'::jsonb,
        '{"S","M","L","XL"}',
        '{"Chrome","Monogram","Signature Drop"}',
        false,
        true,
        false,
        true,
        true,
        5,
        94
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
    RETURNING id INTO prod_id;

    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'noir-monolith'
    ON CONFLICT DO NOTHING;
    INSERT INTO public.product_collections (product_id, collection_id)
    SELECT prod_id, id FROM public.collections WHERE slug = 'cyber-tokyo'
    ON CONFLICT DO NOTHING;
    -- Variant: TS-CHR-BLK-S
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CHR-BLK-S', 'S', 'Chrome Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 16, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CHR-BLK-M
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CHR-BLK-M', 'M', 'Chrome Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 24, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CHR-BLK-L
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CHR-BLK-L', 'L', 'Chrome Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 18, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;
    -- Variant: TS-CHR-BLK-XL
    INSERT INTO public.product_variants (product_id, sku, size, color, color_code, price_in_paise)
    VALUES (prod_id, 'TS-CHR-BLK-XL', 'XL', 'Chrome Noir', '#080808', NULL)
    ON CONFLICT (sku) DO UPDATE SET
        size = EXCLUDED.size,
        color = EXCLUDED.color,
        color_code = EXCLUDED.color_code,
        price_in_paise = EXCLUDED.price_in_paise
    RETURNING id INTO var_id;
    INSERT INTO public.inventory (variant_id, stock_quantity, reserved_quantity, low_stock_threshold)
    VALUES (var_id, 11, 0, 5)
    ON CONFLICT (variant_id) DO UPDATE SET
        stock_quantity = EXCLUDED.stock_quantity;

END $$;
