import { z } from 'zod';

export const revenueRecordSchema = z.object({
  organization: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  product: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  type: z.enum(['new', 'expansion', 'contraction', 'churn', 'reactivation']),
  isRecurring: z.boolean().default(true),
  period: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  source: z.enum(['manual', 'stripe', 'integration']).default('manual'),
  metadata: z.record(z.any()).optional(),
});

export type RevenueRecordInput = z.infer<typeof revenueRecordSchema>;
