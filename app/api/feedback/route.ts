import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';
import { z } from 'zod';

const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'feedback']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  url: z.string().optional().default(''),
  userAgent: z.string().optional().default(''),
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const validated = feedbackSchema.parse(body);
    const feedback = await Feedback.create({
      ...validated,
      organizationId: session.user.organizationId,
      userId: session.user.id,
      userEmail: session.user.email,
    });
    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}

// Admin: GET all feedback (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const filter: Record<string, string> = { organizationId: session.user.organizationId };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const items = await Feedback.find(filter).sort({ createdAt: -1 }).limit(200);
    return NextResponse.json(items);
  } catch (error) {
    return handleAuthError(error);
  }
}
