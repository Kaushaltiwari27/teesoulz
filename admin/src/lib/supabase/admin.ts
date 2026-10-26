import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

/**
 * Privileged Supabase Admin Client for TEESOULZ Admin Portal
 *
 * CRITICAL SECURITY GUARD:
 * Uses SUPABASE_SERVICE_ROLE_KEY and bypasses PostgreSQL RLS.
 * Must ONLY be executed in server environments (Server Actions, Route Handlers).
 * NEVER expose this client or SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'FATAL SECURITY VIOLATION: createAdminClient cannot be called from the browser.'
    );
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn(
      '[Supabase Service Role] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  return createSupabaseClient<Database>(
    supabaseUrl || 'https://placeholder.supabase.co',
    serviceRoleKey || 'placeholder-service-role-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
