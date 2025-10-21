import { exampleSchema, type Example } from './example.schema.js';

describe('exampleSchema', () => {
  it('should validate correct data', () => {
    const validData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Example',
      createdAt: new Date(),
    };

    const result = exampleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid UUID', () => {
    const invalidData = {
      id: 'not-a-uuid',
      name: 'Test Example',
      createdAt: new Date(),
    };

    const result = exampleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty name', () => {
    const invalidData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: '',
      createdAt: new Date(),
    };

    const result = exampleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should infer correct TypeScript type', () => {
    // Type test - this will fail at compile time if types are wrong
    const example: Example = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Example',
      createdAt: new Date(),
    };

    expect(example).toBeDefined();
  });
});
