import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Metric from '@/models/Metric';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query: any = { organizationId: session.user.organizationId };
    if (category) query.category = category;
    const metrics = await Metric.find(query).sort({ createdAt: -1 });
    return NextResponse.json(metrics);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const metric = await Metric.create({
      ...body,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(metric, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}