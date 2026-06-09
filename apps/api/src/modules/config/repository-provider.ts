export type RepositoryProvider = 'memory' | 'supabase';

export function getRepositoryProvider(): RepositoryProvider {
  return process.env.REPOSITORY_PROVIDER === 'supabase' ? 'supabase' : 'memory';
}

export function shouldUseSupabase() {
  return getRepositoryProvider() === 'supabase';
}
