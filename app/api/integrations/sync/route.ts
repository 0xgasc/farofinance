import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { SyncEngine } from '@/lib/integrations/syncEngine';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import Integration from '@/models/Integration';

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const { integrationId } = await request.json();

    if (!integrationId) {
      return NextResponse.json(
        { error: 'Integration ID is required' },
        { status: 400 }
      );
    }

    // Verify the integration belongs to the user's organization
    const integration = await Integration.findOne({
      _id: integrationId,
      organizationId: session.user.organizationId,
    });

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      );
    }

    const syncEngine = new SyncEngine();
    const result = await syncEngine.syncIntegration(integrationId);

    return NextResponse.json(result);
  } catch (error: any) {
    return handleAuthError(error);
  }
}