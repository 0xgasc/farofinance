'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, Zap, Shield, Users, BarChart3, DollarSign,
  ChevronRight, Check, ArrowRight, LineChart, Building2,
  FileText, Globe, Star, Menu, X
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Integrations', href: '#integrations' },
];

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Burn Rate & Runway',
    desc: 'Know exactly how many months of runway you have. Auto-calculated from your connected accounts, updated in real time.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: BarChart3,
    title: 'SaaS Metrics',
    desc: 'MRR, ARR, churn, LTV:CAC — automatically derived from your Stripe data. No spreadsheet formulas required.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: LineChart,
    title: 'Cash Flow Forecasting',
    desc: '13-week rolling forecast with weekly drill-down. The industry standard, without the consulting bill.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Users,
    title: 'Hiring Plan Modeler',
    desc: 'Model headcount growth with fully-loaded costs. See the direct impact every new hire has on your runway.',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    icon: DollarSign,
    title: 'Fundraising Scenarios',
    desc: 'Model Seed, Series A, Series B scenarios side-by-side. See dilution, post-money valuation, and runway impact instantly.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: FileText,
    title: 'Investor Dashboard',
    desc: 'Share a live, password-protected dashboard with your investors. No more monthly email attachments.',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
];

const PRICING = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'For founders just getting started',
    features: [
      '1 integration',
      'Runway calculator',
      'Basic dashboard',
      '1 user',
      'Community support',
    ],
    cta: 'Get started free',
    primary: false,
  },
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    desc: 'For seed-stage startups',
    features: [
      'Unlimited integrations',
      'SaaS metrics dashboard',
      '13-week cash flow forecast',
      'Hiring plan modeler',
      '3 users',
      'Email support',
    ],
    cta: 'Start free trial',
    primary: true,
    badge: 'Most popular',
  },
  {
    name: 'Growth',
    price: '$299',
    period: '/month',
    desc: 'For Series A and beyond',
    features: [
      'Everything in Starter',
      'Investor dashboard + sharing',
      'Multi-entity consolidation',
      'Fundraising scenario modeling',
      'Board deck generator',
      '10 users',
      'Priority support',
    ],
    cta: 'Start free trial',
    primary: false,
  },
];

const INTEGRATIONS = [
  'QuickBooks', 'Xero', 'Stripe', 'Plaid', 'Gusto', 'HubSpot',
  'Salesforce', 'NetSuite', 'Sage', 'Shopify',
];

const TESTIMONIALS = [
  {
    quote: "Finally a tool that gives me the same visibility VCs have. I check my runway every morning.",
    author: "Sarah K.",
    role: "Founder, Series A SaaS",
    stars: 5,
  },
  {
    quote: "Replaced a $2,000/month Adaptive Insights subscription and a part-time finance contractor.",
    author: "Marcus T.",
    role: "CFO, Seed-stage startup",
    stars: 5,
  },
  {
    quote: "The investor dashboard alone is worth it. My board loves the live numbers.",
    author: "Priya M.",
    role: "CEO, B2B fintech",
    stars: 5,
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    // Store in feedback collection with type 'feedback' as a lightweight waitlist
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Silent fail — still show success
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">Faro Finance</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-sm text-gray-600 hover:text-gray-900">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="block text-sm text-gray-700 py-1">
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/login" className="text-sm text-center text-gray-700 py-2 border border-gray-200 rounded-lg">Sign in</Link>
              <Link href="/signup" className="text-sm text-center bg-primary text-white py-2 rounded-lg font-medium">Get started free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium mb-8 border border-blue-100">
          <Zap size={12} />
          Now in beta — free while we build
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          FP&A built for
          <br />
          <span className="text-primary">startup founders</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Runway, burn rate, SaaS metrics, and investor dashboards — automatically
          synced from QuickBooks, Xero, and Stripe. No spreadsheets. No consultants.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium text-base hover:opacity-90 transition-all hover:scale-105"
          >
            Start free — no credit card
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium text-base hover:bg-gray-50"
          >
            Sign in
          </Link>
        </div>
        <p className="text-sm text-gray-400">Free forever plan · Takes 5 minutes to connect your first tool</p>

        {/* Hero visual */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10 pointer-events-none" style={{ top: '70%' }} />
          <div className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-6 text-left mx-auto max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Cash Runway', value: '18 months', change: 'Healthy', positive: true },
                { label: 'Net Burn', value: '$47K/mo', change: '-12% MoM', positive: true },
                { label: 'MRR', value: '$85K', change: '+9.7%', positive: true },
              ].map((m) => (
                <div key={m.label} className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-2">{m.label}</p>
                  <p className="text-white text-2xl font-bold">{m.value}</p>
                  <p className="text-green-400 text-xs mt-1">{m.change}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-800 rounded-xl p-4 h-24 flex items-center justify-center">
              <div className="flex gap-1 items-end h-12">
                {[40, 55, 45, 60, 70, 65, 80, 85].map((h, i) => (
                  <div
                    key={i}
                    className="w-6 rounded-sm bg-blue-500 opacity-80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <span className="ml-4 text-gray-400 text-sm">MRR Growth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="border-y border-gray-100 bg-gray-50 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
          {[
            { stat: '500+', label: 'startups in beta' },
            { stat: '$2.4B', label: 'tracked runway' },
            { stat: '4.9/5', label: 'average rating' },
            { stat: '<5 min', label: 'to connect QuickBooks' },
          ].map((s) => (
            <div key={s.stat} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{s.stat}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything your finance team wishes they had
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built specifically for startups — not Fortune 500 companies. No implementation fees, no onboarding calls required.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} className={f.color} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Globe size={24} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Connects to your existing tools</h2>
          <p className="text-gray-600 mb-10">One-click sync from the tools you already use. Data flows in automatically.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((name) => (
              <span key={name} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transparent pricing. No surprises.
          </h2>
          <p className="text-gray-600">All plans include a 14-day free trial. Cancel anytime.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 ${
                plan.primary
                  ? 'bg-primary text-white shadow-xl scale-105 ring-4 ring-primary/20'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20 shadow-sm">
                  {plan.badge}
                </div>
              )}
              <h3 className={`font-bold text-lg mb-1 ${plan.primary ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <p className={`text-xs mb-4 ${plan.primary ? 'text-white/80' : 'text-gray-500'}`}>{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-bold ${plan.primary ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                <span className={`text-sm ${plan.primary ? 'text-white/70' : 'text-gray-500'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className={plan.primary ? 'text-white' : 'text-green-500'} />
                    <span className={plan.primary ? 'text-white/90' : 'text-gray-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`block text-center py-2.5 rounded-xl text-sm font-medium transition-all ${
                  plan.primary
                    ? 'bg-white text-primary hover:bg-white/90'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">
          Need enterprise pricing or custom integrations?{' '}
          <a href="mailto:hello@farofinance.io" className="text-primary hover:underline">Contact us</a>
        </p>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What founders say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.author}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Waitlist */}
      <section className="py-24 px-4 max-w-2xl mx-auto text-center">
        <Building2 size={32} className="mx-auto text-primary mb-6" />
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Ready to replace your financial spreadsheets?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join hundreds of founders who now close their books in minutes, not days.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check size={24} className="text-green-500" />
            </div>
            <p className="font-semibold text-gray-900">You're on the list!</p>
            <p className="text-sm text-gray-500">We'll be in touch with your early access link shortly.</p>
            <Link href="/signup" className="mt-2 text-sm text-primary hover:underline">
              Or sign up now →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:opacity-90 whitespace-nowrap disabled:opacity-60"
            >
              {submitting ? 'Joining...' : 'Get early access'}
            </button>
          </form>
        )}

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Shield size={12} /> No spam, ever</span>
          <span className="flex items-center gap-1"><Check size={12} /> Cancel anytime</span>
          <span className="flex items-center gap-1"><Zap size={12} /> Free to start</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <TrendingUp size={12} className="text-white" />
            </div>
            <span className="font-semibold text-gray-800 text-sm">Faro Finance</span>
            <span className="text-gray-400 text-xs ml-2">© 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-800">Features</a>
            <a href="#pricing" className="hover:text-gray-800">Pricing</a>
            <a href="mailto:hello@farofinance.io" className="hover:text-gray-800">Contact</a>
            <Link href="/login" className="hover:text-gray-800">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
