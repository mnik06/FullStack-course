import { z } from 'zod';

export const SortOrderSchema = z.enum(['asc', 'desc']);
export type TSortOrder = z.infer<typeof SortOrderSchema>;

export type TSorting<T> = {
  sortBy?: T;
  sortOrder?: TSortOrder;
}

