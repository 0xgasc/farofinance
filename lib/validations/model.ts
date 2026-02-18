import { z } from 'zod';

export const driverSchema = z.object({
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  category: z.enum(['revenue', 'expense', 'headcount', 'custom']),
  formula: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
});

export const scenarioSchema = z.object({
  name: z.string(),
  description: z.string(),
  drivers: z.array(driverSchema),
  assumptions: z.record(z.any()),
});

export const financialModelSchema = z.object({
  name: z.string().min(1, 'Model name is required'),
  description: z.string().optional(),
  organization: z.string(),
  drivers: z.array(driverSchema).default([]),
  scenarios: z.array(scenarioSchema).default([]),
  dimensions: z.array(z.object({
    name: z.string(),
    values: z.array(z.string()),
  })).default([]),
  timeRange: z.object({
    start: z.string(),
    end: z.string(),
    granularity: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).default('monthly'),
  }),
});

export type FinancialModelInput = z.infer<typeof financialModelSchema>;
