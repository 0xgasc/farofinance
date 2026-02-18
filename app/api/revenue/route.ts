import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import RevenueRecord from '@/models/RevenueRecord';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { revenueRecordSchema } from '@/lib/validations/revenue';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '12');
    const since = new Date();
    since.setMonth(since.getMonth() - months);
    const records = await RevenueRecord.find({
      organizationId: session.user.organizationId,
      period: { $gte: since }
    }).sort({ period: -1 });
    return NextResponse.json(records);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const validated = revenueRecordSchema.parse(body);
    const record = await RevenueRecord.create({
      ...validated,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
