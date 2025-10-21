import {
  createSupabaseBrowserClient,
  createSupabaseServerClient,
} from './supabase-client.js';

describe('createSupabaseBrowserClient', () => {
  it('should create browser client with config', () => {
    const client = createSupabaseBrowserClient({
      supabaseUrl: 'https://example.supabase.co',
      supabaseKey: 'test-key',
    });
    expect(client.url).toEqual('https://example.supabase.co');
  });

  it('should return placeholder client structure', () => {
    const client = createSupabaseBrowserClient({
      supabaseUrl: 'https://test.supabase.co',
      supabaseKey: 'key',
    });
    expect(client).toBeDefined();
    expect(typeof client.url).toBe('string');
  });
});

describe('createSupabaseServerClient', () => {
  it('should create server client with config', () => {
    const client = createSupabaseServerClient({
      supabaseUrl: 'https://example.supabase.co',
      supabaseKey: 'test-key',
    });
    expect(client.url).toEqual('https://example.supabase.co');
  });

  it('should return placeholder client structure', () => {
    const client = createSupabaseServerClient({
      supabaseUrl: 'https://test.supabase.co',
      supabaseKey: 'key',
    });
    expect(client).toBeDefined();
    expect(typeof client.url).toBe('string');
  });
});
