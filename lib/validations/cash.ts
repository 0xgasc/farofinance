import { z } from 'zod';

export const cashPositionSchema = z.object({
  organization: z.string(),
  accountName: z.string().min(1, 'Account name is required'),
  balance: z.number(),
  currency: z.string().default('USD'),
  date: z.string(),
  source: z.enum(['manual', 'plaid', 'integration']).default('manual'),
  sourceIntegrationId: z.string().optional(),
  notes: z.string().optional(),
});

export type CashPositionInput = z.infer<typeof cashPositionSchema>;
