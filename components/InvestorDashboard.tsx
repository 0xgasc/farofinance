'use client';

import { useState } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Eye, Share2, Lock, Link2, Copy, Check,
  TrendingUp, DollarSign, Users, Flame, Clock
} from 'lucide-react';

const mrrData = [
  { month: 'Jul', mrr: 42000 }, { month: 'Aug', mrr: 49500 }, { month: 'Sep', mrr: 55000 },
  { month: 'Oct', mrr: 61000 }, { month: 'Nov', mrr: 67000 }, { month: 'Dec', mrr: 72000 },
  { month: 'Jan', mrr: 78000 }, { month: 'Feb', mrr: 85000 },
];

const revenueVsBurn = [
  { month: 'Jul', revenue: 45000, burn: 115000 }, { month: 'Aug', revenue: 52000, burn: 118000 },
  { month: 'Sep', revenue: 58000, burn: 120000 }, { month: 'Oct', revenue: 64000, burn: 122000 },
  { month: 'Nov', revenue: 70000, burn: 125000 }, { month: 'Dec', revenue: 75000, burn: 128000 },
  { month: 'Jan', revenue: 81000, burn: 130000 }, { month: 'Feb', revenue: 88000, burn: 132000 },
];

export default function InvestorDashboard() {
  const [shareModal, setShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareLink = 'https://app.farofinance.io/shared/inv-abc123def';

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  const metrics = [
    { label: 'MRR', value: '$85K', change: '+9.7%', positive: true, icon: DollarSign, color: 'blue' },
    { label: 'ARR', value: '$1.02M', change: '+102% YoY', positive: true, icon: TrendingUp, color: 'green' },
    { label: 'Customers', value: '134', change: '+8 this month', positive: true, icon: Users, color: 'purple' },
    { label: 'Net Burn', value: '$47K', change: '-12% MoM', positive: true, icon: Flame, color: 'orange' },
    { label: 'Runway', value: '46 mo', change: 'Healthy', positive: true, icon: Clock, color: 'teal' },
    { label: 'Gross Margin', value: '72%', change: '+2pp MoM', positive: true, icon: TrendingUp, color: 'emerald' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Share */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Eye size={20} className="text-primary" />
          <span className="text-sm text-gray-500">This is a preview of what investors will see</span>
        </div>
        <button
          onClick={() => setShareModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90"
        >
          <Share2 size={16} />
          Share Dashboard
        </button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{m.label}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{m.value}</p>
              <p className={`text-sm mt-1 ${m.positive ? 'text-green-600' : 'text-red-500'}`}>{m.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Growth */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-1">MRR Growth</h3>
          <p className="text-sm text-gray-500 mb-4">Monthly Recurring Revenue trajectory</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mrrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Area type="monotone" dataKey="mrr" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue vs Burn */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-1">Revenue vs Burn</h3>
          <p className="text-sm text-gray-500 mb-4">Path to profitability</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueVsBurn}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="burn" name="Expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-green-600 uppercase tracking-wide">Wins</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>Crossed $1M ARR milestone</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>Net revenue retention at 115% (up from 108%)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                <span>Signed 3 enterprise pilots (potential $50K+ ACV each)</span>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Focus Areas</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>Reducing churn from 8.5% to target 5%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>Hiring 2 senior engineers for enterprise features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span>Launching self-serve onboarding to improve CAC</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Investor Dashboard</h3>
              <button onClick={() => setShareModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Share Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-50 border rounded-lg text-sm">
                    <Link2 size={14} className="text-gray-400" />
                    <span className="text-gray-600 truncate">{shareLink}</span>
                  </div>
                  <button
                    onClick={copyLink}
                    className="px-3 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Settings</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <Lock size={14} />
                    <span>Require password</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <Clock size={14} />
                    <span>Expire after 30 days</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setShareModal(false)}
                className="w-full bg-primary text-white py-2 rounded-lg text-sm hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
