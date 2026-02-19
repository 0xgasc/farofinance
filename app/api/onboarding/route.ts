import { NextResponse } from 'next/server';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import dbConnect from '@/lib/mongodb';
import Organization from '@/models/Organization';

export async function GET() {
  try {
    const session = await requireAuth();
    await dbConnect();
    const org = await Organization.findById(session.user.organizationId).select('onboardingCompleted name');
    return NextResponse.json({ onboardingCompleted: org?.onboardingCompleted ?? false, orgName: org?.name });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST() {
  try {
    const session = await requireAuth();
    await dbConnect();
    await Organization.findByIdAndUpdate(session.user.organizationId, { onboardingCompleted: true });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
