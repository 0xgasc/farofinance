import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import HiringPlan from '@/models/HiringPlan';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { hiringPlanSchema } from '@/lib/validations/hiring';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const plans = await HiringPlan.find({ organizationId: session.user.organizationId }).sort({ createdAt: -1 });
    return NextResponse.json(plans);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const validated = hiringPlanSchema.parse(body);
    const plan = await HiringPlan.create({
      ...validated,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}
