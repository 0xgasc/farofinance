import { z } from 'zod';

export const hiringRoleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string(),
  baseSalary: z.number().positive('Salary must be positive'),
  benefitsMultiplier: z.number().default(1.25),
  equipmentCost: z.number().default(2000),
  startDate: z.string(),
  headcount: z.number().int().positive().default(1),
  status: z.enum(['planned', 'approved', 'hired', 'cancelled']).default('planned'),
});

export const hiringPlanSchema = z.object({
  organization: z.string(),
  name: z.string().min(1, 'Plan name is required'),
  roles: z.array(hiringRoleSchema).default([]),
});

export type HiringPlanInput = z.infer<typeof hiringPlanSchema>;
