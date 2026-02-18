import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AccountingRule from '@/models/AccountingRule';
import { requireAuth, handleAuthError } from '@/lib/auth/middleware';

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const ruleType = searchParams.get('type');
    const isActive = searchParams.get('active');

    const query: any = { organizationId: session.user.organizationId };
    if (ruleType) query.ruleType = ruleType;
    if (isActive !== null) query.isActive = isActive === 'true';

    const rules = await AccountingRule.find(query).sort({ priority: -1 });
    return NextResponse.json(rules);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    await dbConnect();
    const body = await request.json();
    const rule = await AccountingRule.create({
      ...body,
      organizationId: session.user.organizationId,
    });
    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    return handleAuthError(error);
  }
}