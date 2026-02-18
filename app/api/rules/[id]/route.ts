import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AccountingRule from '@/models/AccountingRule';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const rule = await AccountingRule.findOne({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    return NextResponse.json(rule);
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
    const rule = await AccountingRule.findOneAndUpdate(
      { _id: params.id, organizationId: session.user.organizationId },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    return NextResponse.json(rule);
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
    const rule = await AccountingRule.findOneAndDelete({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Rule deleted successfully' });
  } catch (error) {
    return handleAuthError(error);
  }
}
