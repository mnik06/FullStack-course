import { z } from 'zod';

export const zodParamsArray = (schema: z.ZodSchema) => {
  return z.array(schema).or(schema).optional().transform(val => {
    if (!val) {
      return [];
    }

    return Array.isArray(val) ? val : [val];
  });
};