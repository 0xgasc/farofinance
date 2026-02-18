import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { budgetSchema } from '@/lib/validations/budget';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const budget = await Budget.findOne({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const validated = budgetSchema.parse(body);
    const budget = await Budget.findOneAndUpdate(
      { _id: params.id, organizationId: session.user.organizationId },
      { ...validated, updatedAt: new Date() },
      { new: true }
    );
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const budget = await Budget.findOneAndDelete({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    return handleAuthError(error);
  }
}
