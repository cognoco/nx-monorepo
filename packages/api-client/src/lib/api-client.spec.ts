import { createApiClient } from './api-client.js';

describe('createApiClient', () => {
  it('should create client with baseUrl', () => {
    const client = createApiClient({ baseUrl: 'http://localhost:3000' });
    expect(client.baseUrl).toEqual('http://localhost:3000');
  });

  it('should return placeholder client structure', () => {
    const client = createApiClient({ baseUrl: 'http://example.com' });
    expect(client).toBeDefined();
    expect(typeof client.baseUrl).toBe('string');
  });
});
