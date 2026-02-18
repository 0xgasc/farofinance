import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Entity from '@/models/Entity';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const entities = await Entity.find({ organizationId: session.user.organizationId }).sort({ createdAt: -1 });
    return NextResponse.json(entities);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const entity = await Entity.create({
      ...body,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(entity, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}