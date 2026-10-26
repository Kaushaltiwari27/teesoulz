import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

const FALLBACK_SUPABASE_URL = 'https://rcxvyfgeduyokdahkrow.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'sb_publishable_V5k0p-NiVUOmWMvW5TptAw_WddPESHK';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    FALLBACK_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}
