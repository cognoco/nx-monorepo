import {
  createSupabaseBrowserClient,
  createSupabaseServerClient,
  validateSupabaseConfig,
} from './client.js';

jest.mock('@supabase/ssr', () => {
  return {
    createBrowserClient: jest.fn(() => ({ kind: 'browser' })),
    createServerClient: jest.fn(() => ({ kind: 'server' })),
  };
});
import {
  createBrowserClient,
  createServerClient,
  type SupabaseClientOptions,
} from '@supabase/ssr';

// Type definitions for test helpers
type CookieConfig = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

type ServerClientConfig = {
  cookies: {
    getAll: () => CookieConfig[];
    setAll: (cookies: CookieConfig[]) => void;
  };
};

const cookieStore = {
  getAll: jest.fn(() => [{ name: 'a', value: '1' }]),
  set: jest.fn(),
};
jest.mock('next/headers', () => ({
  cookies: jest.fn(async () => cookieStore),
}));

const originalEnv = { ...process.env };
const originalWindow = globalThis.window;

beforeEach(() => {
  process.env = { ...originalEnv };
  globalThis.window = {} as Window & typeof globalThis;
  jest.clearAllMocks();
  cookieStore.getAll.mockClear();
  cookieStore.set.mockClear();
});

afterEach(() => {
  process.env = originalEnv;
  globalThis.window = originalWindow;
});

describe('createSupabaseBrowserClient', () => {
  it('creates browser client with env', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    createSupabaseBrowserClient();
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon',
      undefined
    );
  });

  it('throws if URL missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    expect(() => createSupabaseBrowserClient()).toThrow(
      /NEXT_PUBLIC_SUPABASE_URL/
    );
  });

  it('throws if anon key missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect(() => createSupabaseBrowserClient()).toThrow(
      /NEXT_PUBLIC_SUPABASE_ANON_KEY/
    );
  });

  it('validates URL format', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://bad-url';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    expect(() => createSupabaseBrowserClient()).toThrow(/invalid format/);
  });

  it('throws when called server-side (no window)', () => {
    delete (globalThis as { window?: unknown }).window;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    expect(() => createSupabaseBrowserClient()).toThrow(
      /must be called in the browser/
    );
  });

  it('passes options through to createBrowserClient', () => {
    globalThis.window = {} as Window & typeof globalThis;
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    const options: Partial<SupabaseClientOptions<unknown>> = {
      global: { headers: { 'x-test': '1' } },
    };
    createSupabaseBrowserClient(options);
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'anon',
      options
    );
  });
});

describe('createSupabaseServerClient', () => {
  it('creates server client and awaits cookies()', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    const { cookies: mockedCookies } = jest.requireMock('next/headers');
    await createSupabaseServerClient();
    expect(mockedCookies as unknown as jest.Mock).toHaveBeenCalled();
    // getAll is called lazily by the adapter when cookies are read; ensure adapter was passed
    const [, , cfg] = (
      createServerClient as jest.MockedFunction<typeof createServerClient>
    ).mock.calls[0] as [string, string, ServerClientConfig];
    expect(cfg.cookies.getAll()).toEqual([{ name: 'a', value: '1' }]);
    expect(createServerClient).toHaveBeenCalled();
  });

  it('throws when envs missing', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    await expect(createSupabaseServerClient()).rejects.toThrow();
  });

  it('setAll tries to set cookies and swallows errors in SC context', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    cookieStore.set.mockImplementationOnce(() => {
      throw new Error('cannot set in SC');
    });
    await createSupabaseServerClient();
    // invoke setAll manually via last call config to ensure coverage
    const [, , cfg] = (
      createServerClient as jest.MockedFunction<typeof createServerClient>
    ).mock.calls[0] as [string, string, ServerClientConfig];
    expect(cfg).toBeDefined();
    expect(() =>
      cfg.cookies.setAll([{ name: 's', value: 'v', options: {} }])
    ).not.toThrow();
  });

  it('passes options through to createServerClient', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    const options: Partial<SupabaseClientOptions<unknown>> = {
      global: {
        fetch: (() => Promise.resolve({})) as unknown as typeof fetch,
      },
    };
    await createSupabaseServerClient(options);
    const [, , cfg] = (
      createServerClient as jest.MockedFunction<typeof createServerClient>
    ).mock.calls[0] as [string, string, ServerClientConfig];
    expect(cfg).toEqual(expect.objectContaining(options));
  });
});

describe('validateSupabaseConfig', () => {
  it('exposes config validation helper', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon';
    expect(() => validateSupabaseConfig()).not.toThrow();
  });
});
