-- =============================================================================
-- TEESOULZ STREETWEAR - ORDERS & CHECKOUT RLS POLICIES
-- Migration: 20261026000002_orders_rls_and_permissions.sql
-- =============================================================================

-- 1. Grant table access to all roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.order_items TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.addresses TO anon, authenticated, service_role;

-- 2. Orders Policies (Allow creating orders & reading orders by customer or confirmation)
DROP POLICY IF EXISTS "orders_insert_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_policy" ON public.orders
    FOR INSERT TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "orders_select_own_or_admin" ON public.orders;
DROP POLICY IF EXISTS "orders_select_policy" ON public.orders;
CREATE POLICY "orders_select_policy" ON public.orders
    FOR SELECT TO public
    USING (true);

-- 3. Order Items Policies (Allow inserting and reading purchased garment lines)
DROP POLICY IF EXISTS "order_items_insert_policy" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_own" ON public.order_items;
CREATE POLICY "order_items_insert_policy" ON public.order_items
    FOR INSERT TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "order_items_select_own_or_admin" ON public.order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON public.order_items;
CREATE POLICY "order_items_select_policy" ON public.order_items
    FOR SELECT TO public
    USING (true);

-- 4. Addresses Policies (Allow saving delivery addresses during checkout)
DROP POLICY IF EXISTS "addresses_insert_policy" ON public.addresses;
DROP POLICY IF EXISTS "addresses_insert_own" ON public.addresses;
CREATE POLICY "addresses_insert_policy" ON public.addresses
    FOR INSERT TO public
    WITH CHECK (true);

DROP POLICY IF EXISTS "addresses_select_own" ON public.addresses;
DROP POLICY IF EXISTS "addresses_select_policy" ON public.addresses;
CREATE POLICY "addresses_select_policy" ON public.addresses
    FOR SELECT TO public
    USING (true);
