import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CashPosition from '@/models/CashPosition';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { cashPositionSchema } from '@/lib/validations/cash';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const positions = await CashPosition.find({ organizationId: session.user.organizationId }).sort({ date: -1 }).limit(limit);
    return NextResponse.json(positions);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const validated = cashPositionSchema.parse(body);
    const position = await CashPosition.create({
      ...validated,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
