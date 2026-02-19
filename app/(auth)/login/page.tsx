'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LogIn, Mail, Lock, Github, Chrome } from 'lucide-react';

const OAUTH_ERRORS: Record<string, string> = {
  OAuthSignin: 'Could not start sign-in. Try email/password instead.',
  OAuthCallback: 'Sign-in was cancelled or failed. Try email/password.',
  OAuthCreateAccount: 'Could not create account via OAuth. Try email/password.',
  OAuthAccountNotLinked: 'This email is already registered. Sign in with email/password instead.',
  CredentialsSignin: 'Invalid email or password.',
  SessionRequired: 'Please sign in to continue.',
  Default: 'Something went wrong. Please try again.',
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    if (errorParam) setError(OAUTH_ERRORS[errorParam] ?? OAUTH_ERRORS.Default);
    if (messageParam === 'account-created') setInfo('Account created! Sign in below.');
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError(OAUTH_ERRORS.CredentialsSignin);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    setError('');
    await signIn(provider, { callbackUrl: '/' });
    // If we're back here, it failed
    setError(OAUTH_ERRORS.OAuthCallback);
    setOauthLoading(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-6 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
            <LogIn size={22} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Faro Finance</h1>
          <p className="mt-2 text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {info && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {info}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium text-sm"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              : <><LogIn size={16} />Sign in</>}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-gray-50 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
          >
            {oauthLoading === 'google'
              ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              : <Chrome size={16} />}
            Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            disabled={!!oauthLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50"
          >
            {oauthLoading === 'github'
              ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              : <Github size={16} />}
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-primary font-medium hover:underline">Sign up free</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
