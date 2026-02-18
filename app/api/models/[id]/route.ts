import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import FinancialModel from '@/models/Model';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { financialModelSchema } from '@/lib/validations/model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const model = await FinancialModel.findOne({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(model);
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
    const validated = financialModelSchema.parse(body);
    const model = await FinancialModel.findOneAndUpdate(
      { _id: params.id, organizationId: session.user.organizationId },
      { ...validated, updatedAt: new Date() },
      { new: true }
    );
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(model);
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
    const model = await FinancialModel.findOneAndDelete({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    return handleAuthError(error);
  }
}