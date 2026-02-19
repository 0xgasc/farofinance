'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { UserPlus, Mail, Lock, Building2, User, Chrome, Github, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

  const set = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          organizationName: formData.organizationName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        setLoading(false);
        return;
      }

      // Auto sign-in after register
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Account created but auto-login failed — redirect to login with success message
        router.push('/login?message=account-created');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setOauthLoading(provider);
    setError('');
    await signIn(provider, { callbackUrl: '/' });
    setError('OAuth sign-in failed. Try email/password instead.');
    setOauthLoading(null);
  };

  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="max-w-md w-full space-y-6 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
            <UserPlus size={22} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Faro Finance</h1>
          <p className="mt-2 text-gray-500">Create your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text" value={formData.name} onChange={set('name')}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="Jane Smith" required autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text" value={formData.organizationName} onChange={set('organizationName')}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="Acme Inc." required autoComplete="organization"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email" value={formData.email} onChange={set('email')}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="you@company.com" required autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'} value={formData.password} onChange={set('password')}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                placeholder="At least 8 characters" required minLength={8} autoComplete="new-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={set('confirmPassword')}
                className={`w-full pl-9 pr-9 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm ${
                  passwordsMismatch ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Repeat your password" required autoComplete="new-password"
              />
              {passwordsMatch && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm font-bold">✓</span>}
            </div>
            {passwordsMismatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 font-medium text-sm"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              : <><UserPlus size={16} />Create free account</>}
          </button>

          <p className="text-center text-xs text-gray-400">
            By signing up you agree to our Terms of Service and Privacy Policy
          </p>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-gray-50 text-gray-400">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleOAuth('google')} disabled={!!oauthLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50">
            {oauthLoading === 'google' ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> : <Chrome size={16} />}
            Google
          </button>
          <button onClick={() => handleOAuth('github')} disabled={!!oauthLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50">
            {oauthLoading === 'github' ? <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" /> : <Github size={16} />}
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
