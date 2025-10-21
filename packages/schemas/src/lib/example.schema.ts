import { z } from 'zod';

/**
 * Placeholder schema for Phase 1 walking skeleton validation.
 * Demonstrates Zod schema definition and TypeScript type inference.
 * Real schemas will be added in Stage 5.2 (health check) and beyond.
 */
export const exampleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.date(),
});

/**
 * TypeScript type inferred from the Zod schema.
 * This pattern ensures runtime validation and compile-time type safety.
 */
export type Example = z.infer<typeof exampleSchema>;
