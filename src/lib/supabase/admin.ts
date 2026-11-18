import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

/**
 * Privileged Supabase Admin Client
 * 
 * CRITICAL SECURITY NOTICE:
 * This client uses the SUPABASE_SERVICE_ROLE_KEY and completely bypasses Row Level Security (RLS).
 * It must ONLY be imported and executed in server-side contexts (Server Actions, Route Handlers,
 * seed scripts, or webhooks).
 * 
 * NEVER expose this client or SUPABASE_SERVICE_ROLE_KEY to the browser.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('FATAL SECURITY VIOLATION: createAdminClient cannot be called from the browser.');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://rcxvyfgeduyokdahkrow.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

  if (!serviceRoleKey) {
    console.warn('[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY is not configured.');
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
