import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Integration from '@/models/Integration';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const query: any = { organizationId: session.user.organizationId };
    if (type) query.type = type;
    if (status) query.status = status;

    const integrations = await Integration.find(query).sort({ createdAt: -1 });
    return NextResponse.json(integrations);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const integration = await Integration.create({
      ...body,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(integration, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}