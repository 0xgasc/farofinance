import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Entity from '@/models/Entity';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const entity = await Entity.findOne({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }
    return NextResponse.json(entity);
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
    const entity = await Entity.findOneAndUpdate(
      { _id: params.id, organizationId: session.user.organizationId },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }
    return NextResponse.json(entity);
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
    const entity = await Entity.findOneAndDelete({
      _id: params.id,
      organizationId: session.user.organizationId,
    });
    if (!entity) {
      return NextResponse.json({ error: 'Entity not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Entity deleted successfully' });
  } catch (error) {
    return handleAuthError(error);
  }
}
