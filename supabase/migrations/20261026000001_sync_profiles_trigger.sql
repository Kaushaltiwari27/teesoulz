-- =============================================================================
-- TEESOULZ STREETWEAR - SYNC PROFILES & AUTH TRIGGER
-- Migration: 20261026000001_sync_profiles_trigger.sql
-- =============================================================================

-- 1. Ensure public schema permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;

-- 2. Security Definer function to automatically create profile on Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, phone, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(
            NULLIF(NEW.raw_user_meta_data->>'name', ''),
            NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
            split_part(NEW.email, '@', 1)
        ),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'role', 'CUSTOMER')
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        name = COALESCE(NULLIF(EXCLUDED.name, ''), public.profiles.name),
        email = EXCLUDED.email,
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$;

-- 3. Re-create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Ensure RLS policies allow inserting and reading profiles
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
    FOR INSERT TO authenticated, anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT TO public
    USING (true);

-- 5. Immediately sync any existing auth.users into public.profiles
INSERT INTO public.profiles (id, name, email, phone, role)
SELECT 
    id,
    COALESCE(
        NULLIF(raw_user_meta_data->>'name', ''),
        NULLIF(raw_user_meta_data->>'full_name', ''),
        split_part(email, '@', 1)
    ) as name,
    email,
    raw_user_meta_data->>'phone' as phone,
    COALESCE(raw_user_meta_data->>'role', 'CUSTOMER') as role
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET 
    name = COALESCE(NULLIF(EXCLUDED.name, ''), public.profiles.name),
    email = EXCLUDED.email,
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    updated_at = timezone('utc', now());
