export * from './lib/client.js';

// Re-export commonly used types from @supabase/supabase-js for consumer convenience
export type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
