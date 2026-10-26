-- =============================================================================
-- TEESOULZ STREETWEAR - PRODUCT IMAGES SUPABASE STORAGE BUCKET & RLS POLICIES
-- Migration: 20261026000003_product_images_storage.sql
-- Description: Provision persistent storage bucket for product media and enforce
--              public read with admin/staff-only write/delete permissions.
-- =============================================================================

-- 1. Create or update the 'product-images' public bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    10485760, -- 10MB per image limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Ensure schema permissions on storage objects for client roles
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.objects TO anon, authenticated, service_role;
GRANT ALL ON TABLE storage.buckets TO anon, authenticated, service_role;

-- 3. Storage Object RLS Policies

-- Public read access: Anyone (anon & authenticated) can view/download product images
DROP POLICY IF EXISTS "product_images_public_read" ON storage.objects;
CREATE POLICY "product_images_public_read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'product-images');

-- Admin/Staff insert: Only authenticated users with ADMIN or STAFF role can upload
DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
CREATE POLICY "product_images_admin_insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'product-images'
        AND public.is_admin()
    );

-- Admin/Staff update: Only authenticated users with ADMIN or STAFF role can update existing objects
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (
        bucket_id = 'product-images'
        AND public.is_admin()
    )
    WITH CHECK (
        bucket_id = 'product-images'
        AND public.is_admin()
    );

-- Admin/Staff delete: Only authenticated users with ADMIN or STAFF role can delete objects
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'product-images'
        AND public.is_admin()
    );
