-- =============================================================================
-- TEESOULZ STREETWEAR - ADMIN EXTENSIONS & CMS STORE SETTINGS
-- Migration: 20261026000004_admin_extensions.sql
-- Description: Forward-only migration adding persistent CMS configuration,
--              store settings, navigation menus, and administrative activity logs.
-- =============================================================================

-- 1. CMS & STORE SETTINGS TABLE (Unified Key-Value JSONB store)
CREATE TABLE IF NOT EXISTS public.cms_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Schema Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.cms_settings TO anon, authenticated, service_role;

-- Enable RLS
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

-- Public can read published CMS and store configs
DROP POLICY IF EXISTS "cms_settings_public_read" ON public.cms_settings;
CREATE POLICY "cms_settings_public_read" ON public.cms_settings
    FOR SELECT TO public
    USING (true);

-- Only Admin / Staff can modify CMS and store configs
DROP POLICY IF EXISTS "cms_settings_admin_all" ON public.cms_settings;
CREATE POLICY "cms_settings_admin_all" ON public.cms_settings
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 2. ADMINISTRATIVE ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

GRANT ALL ON TABLE public.activity_logs TO anon, authenticated, service_role;

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Only Admin / Staff can view activity logs
DROP POLICY IF EXISTS "activity_logs_admin_select" ON public.activity_logs;
CREATE POLICY "activity_logs_admin_select" ON public.activity_logs
    FOR SELECT TO authenticated
    USING (public.is_admin());

-- Authenticated admins or service role can insert activity logs
DROP POLICY IF EXISTS "activity_logs_admin_insert" ON public.activity_logs;
CREATE POLICY "activity_logs_admin_insert" ON public.activity_logs
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());
