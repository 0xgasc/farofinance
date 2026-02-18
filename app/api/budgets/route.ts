import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { budgetSchema } from '@/lib/validations/budget';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const budgets = await Budget.find({ organizationId: session.user.organizationId }).sort({ createdAt: -1 });
    return NextResponse.json(budgets);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const validated = budgetSchema.parse(body);
    const budget = await Budget.create({
      ...validated,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}