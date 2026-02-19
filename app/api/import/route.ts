import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import Metric from '@/models/Metric';
import RevenueRecord from '@/models/RevenueRecord';
import HiringPlan from '@/models/HiringPlan';

const ImportSchema = z.object({
  type: z.enum(['budgets', 'metrics', 'revenue', 'hiring']),
  rows: z.array(z.record(z.string())).min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();

    const body = await request.json();
    const { type, rows } = ImportSchema.parse(body);

    const orgId = session.user.organizationId;
    const errors: string[] = [];
    let imported = 0;

    if (type === 'budgets') {
      // Group rows by period, create one Budget doc per period
      const byPeriod: Record<string, typeof rows> = {};
      for (const row of rows) {
        const period = (row.period || 'Imported').trim();
        if (!byPeriod[period]) byPeriod[period] = [];
        byPeriod[period].push(row);
      }

      for (const [period, periodRows] of Object.entries(byPeriod)) {
        const items = periodRows.map((r, i) => {
          const planned = parseFloat(r.planned) || 0;
          const actual = parseFloat(r.actual) || 0;
          return {
            category: (r.category || 'Uncategorized').trim(),
            subcategory: (r.subcategory || '').trim(),
            planned,
            actual,
            variance: actual - planned,
            period,
          };
        });

        const totalPlanned = items.reduce((s, i) => s + i.planned, 0);
        const totalActual = items.reduce((s, i) => s + i.actual, 0);

        try {
          await Budget.create({
            organizationId: orgId,
            name: `Budget — ${period}`,
            fiscal_year: new Date().getFullYear(),
            items,
            total_planned: totalPlanned,
            total_actual: totalActual,
            total_variance: totalActual - totalPlanned,
            status: 'draft',
          });
          imported += items.length;
        } catch (e: any) {
          errors.push(`Period ${period}: ${e.message}`);
        }
      }
    }

    if (type === 'metrics') {
      for (const row of rows) {
        try {
          await Metric.create({
            organizationId: orgId,
            name: (row.name || 'Unnamed Metric').trim(),
            category: (row.category || 'custom').trim().toLowerCase(),
            unit: (row.unit || '').trim(),
            target: row.target ? parseFloat(row.target) : undefined,
            data: [{ date: new Date().toISOString().slice(0, 7), value: parseFloat(row.value) || 0 }],
            tags: [],
          });
          imported++;
        } catch (e: any) {
          errors.push(`Row "${row.name}": ${e.message}`);
        }
      }
    }

    if (type === 'revenue') {
      for (const row of rows) {
        try {
          await RevenueRecord.create({
            organizationId: orgId,
            customer: (row.customer || 'Unknown').trim(),
            amount: parseFloat(row.amount) || 0,
            type: (['new', 'expansion', 'contraction', 'churn'].includes(row.type) ? row.type : 'new'),
            period: (row.period || new Date().toISOString().slice(0, 7)).trim(),
            product: (row.product || '').trim(),
          });
          imported++;
        } catch (e: any) {
          errors.push(`Row "${row.customer}": ${e.message}`);
        }
      }
    }

    if (type === 'hiring') {
      // HiringPlan has roles[] array — create one doc per upload batch
      const roles = rows.map((row) => ({
        title: (row.title || 'Unnamed Role').trim(),
        department: (row.department || 'General').trim(),
        salary: parseFloat(row.salary) || 0,
        benefits: parseFloat(row.benefits) || 0,
        startDate: row.startDate ? new Date(row.startDate) : new Date(),
        status: 'planned' as const,
      }));

      try {
        await HiringPlan.create({
          organizationId: orgId,
          name: 'Imported Hiring Plan',
          roles,
          total_headcount: roles.length,
          total_cost: roles.reduce((s, r) => s + r.salary + r.benefits, 0),
          currency: 'USD',
        });
        imported = roles.length;
      } catch (e: any) {
        errors.push(`Hiring plan: ${e.message}`);
      }
    }

    return NextResponse.json({ imported, errors, ok: errors.length === 0 });
  } catch (error) {
    return handleAuthError(error);
  }
}
