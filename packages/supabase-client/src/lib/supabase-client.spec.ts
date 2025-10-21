import { supabaseClient } from './supabase-client.js';

describe('supabaseClient', () => {
  it('should work', () => {
    expect(supabaseClient()).toEqual('supabase-client');
  });
});
