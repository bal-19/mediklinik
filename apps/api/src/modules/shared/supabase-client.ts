import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { shouldUseSupabase } from '../config/repository-provider';

let client: SupabaseClient | null = null;

export function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createSupabaseAdminClient() {
  if (!hasSupabaseConfig()) {
    throw new Error('SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi untuk provider supabase.');
  }

  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseAdminClient() {
  if (!client) {
    client = createSupabaseAdminClient();
  }

  return client;
}

export function canUseSupabaseRepositories() {
  return shouldUseSupabase() && hasSupabaseConfig();
}
