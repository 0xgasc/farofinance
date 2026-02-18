import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './options';

export interface AuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    organizationId: string;
    role: 'admin' | 'editor' | 'viewer' | 'investor';
  };
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).organizationId) {
    return null;
  }
  return session as unknown as AuthSession;
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getAuthSession();
  if (!session) {
    throw new AuthError('Unauthorized', 401);
  }
  return session;
}

export async function requireRole(roles: string[]): Promise<AuthSession> {
  const session = await requireAuth();
  if (!roles.includes(session.user.role)) {
    throw new AuthError('Forbidden', 403);
  }
  return session;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
