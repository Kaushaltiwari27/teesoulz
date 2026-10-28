-- =============================================================================
-- TEESOULZ STREETWEAR - RESTORE ORDERS & ADDRESSES PRIVACY RLS POLICIES
-- Migration: 20261027000001_fix_orders_rls_privacy.sql
-- Description: Closes the critical data privacy leak where public users could
--              enumerate all customer orders and personal addresses. Restores
--              least-privilege access control.
-- =============================================================================

-- 1. Ensure RLS is active on orders, order_items, and addresses
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- 2. ORDERS POLICIES
-- Drop insecure public select policies
DROP POLICY IF EXISTS "orders_select_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_select_own_or_admin" ON public.orders;

-- Secure select policy: Authenticated users can only see their own orders; Admin/Staff can see all
CREATE POLICY "orders_select_own_or_admin" ON public.orders
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- Allow checkout insert for both guests and authenticated customers
DROP POLICY IF EXISTS "orders_insert_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_policy" ON public.orders
    FOR INSERT TO public
    WITH CHECK (true);

-- Only Admin/Staff can update order status or tracking details
DROP POLICY IF EXISTS "orders_admin_all" ON public.orders;
CREATE POLICY "orders_admin_update" ON public.orders
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. ORDER ITEMS POLICIES
-- Drop insecure public select policy
DROP POLICY IF EXISTS "order_items_select_policy" ON public.order_items;
DROP POLICY IF EXISTS "order_items_select_own_or_admin" ON public.order_items;

-- Secure select policy: Line items are only viewable by the order's owner or Admin/Staff
CREATE POLICY "order_items_select_own_or_admin" ON public.order_items
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id
            AND (o.user_id = auth.uid() OR public.is_admin())
        )
    );

-- Allow inserting line items during checkout
DROP POLICY IF EXISTS "order_items_insert_policy" ON public.order_items;
CREATE POLICY "order_items_insert_policy" ON public.order_items
    FOR INSERT TO public
    WITH CHECK (true);

-- Only Admin/Staff can mutate line items after creation
DROP POLICY IF EXISTS "order_items_admin_update" ON public.order_items;
CREATE POLICY "order_items_admin_update" ON public.order_items
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. ADDRESSES POLICIES
-- Drop insecure public select policy
DROP POLICY IF EXISTS "addresses_select_policy" ON public.addresses;
DROP POLICY IF EXISTS "addresses_select_own" ON public.addresses;
DROP POLICY IF EXISTS "addresses_select_own_or_admin" ON public.addresses;

-- Secure select policy: Delivery addresses are strictly private to the user who owns them or Admin/Staff
CREATE POLICY "addresses_select_own_or_admin" ON public.addresses
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());

-- Allow saving delivery address during checkout
DROP POLICY IF EXISTS "addresses_insert_policy" ON public.addresses;
CREATE POLICY "addresses_insert_policy" ON public.addresses
    FOR INSERT TO public
    WITH CHECK (true);

-- Allow owner or admin to update addresses
DROP POLICY IF EXISTS "addresses_update_own_or_admin" ON public.addresses;
CREATE POLICY "addresses_update_own_or_admin" ON public.addresses
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id OR public.is_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_admin());
