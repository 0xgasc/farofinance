import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  // Already logged in — send them to the app
  if (session) redirect('/');
  return <>{children}</>;
}
