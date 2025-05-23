import { z } from 'zod';

export const HealthMetricsSchema = z.object({
  isOk: z.boolean(),
  serviceName: z.string(),
  errorMessage: z.unknown().optional()
});

export type THealthMetrics = z.infer<typeof HealthMetricsSchema>;