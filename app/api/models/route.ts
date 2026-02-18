import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FinancialModel from '@/models/Model';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { financialModelSchema } from '@/lib/validations/model';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const models = await FinancialModel.find({ organizationId: session.user.organizationId }).sort({ createdAt: -1 });
    return NextResponse.json(models);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const validated = financialModelSchema.parse(body);
    const model = await FinancialModel.create({
      ...validated,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}