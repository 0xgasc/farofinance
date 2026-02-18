import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Metric from '@/models/Metric';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const metric = await Metric.findOne({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!metric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }
    return NextResponse.json(metric);
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
    const metric = await Metric.findOneAndUpdate(
      { _id: params.id, organizationId: session.user.organizationId },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    if (!metric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }
    return NextResponse.json(metric);
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
    const metric = await Metric.findOneAndDelete({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!metric) {
      return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Metric deleted successfully' });
  } catch (error) {
    return handleAuthError(error);
  }
}
