import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const FALLBACK_SUPABASE_URL = 'https://rcxvyfgeduyokdahkrow.supabase.co';

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
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    FALLBACK_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for server admin operations.'
    );
  }

  return createSupabaseClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
