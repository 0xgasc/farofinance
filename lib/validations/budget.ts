import { z } from 'zod';

export const budgetItemSchema = z.object({
  category: z.string(),
  subcategory: z.string().optional(),
  planned: z.number(),
  actual: z.number().default(0),
  variance: z.number().default(0),
  period: z.string(),
});

export const budgetSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  organization: z.string(),
  fiscal_year: z.number().int().min(2020).max(2050),
  items: z.array(budgetItemSchema).default([]),
  status: z.enum(['draft', 'approved', 'closed']).default('draft'),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
