import { afterEach, describe, expect, test } from 'bun:test';
import { getRepositoryProvider } from '../src/modules/config/repository-provider';
import { canUseSupabaseRepositories, hasSupabaseConfig } from '../src/modules/shared/supabase-client';

const originalProvider = process.env.REPOSITORY_PROVIDER;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

afterEach(() => {
  process.env.REPOSITORY_PROVIDER = originalProvider;
  process.env.SUPABASE_URL = originalSupabaseUrl;
  process.env.SUPABASE_SERVICE_ROLE_KEY = originalServiceKey;
});

describe('Repository provider', () => {
  test('defaults to memory', () => {
    delete process.env.REPOSITORY_PROVIDER;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(getRepositoryProvider()).toBe('memory');
    expect(hasSupabaseConfig()).toBe(false);
    expect(canUseSupabaseRepositories()).toBe(false);
  });

  test('requires env to activate supabase repositories', () => {
    process.env.REPOSITORY_PROVIDER = 'supabase';
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    expect(getRepositoryProvider()).toBe('supabase');
    expect(canUseSupabaseRepositories()).toBe(false);
  });
});
