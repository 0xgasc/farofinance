'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  RefreshCw, Target
} from 'lucide-react';

// Demo SaaS data
const monthlyMRR = [
  { month: 'Jul 2025', mrr: 42000, newMRR: 8000, expansionMRR: 3000, contractionMRR: 1500, churnMRR: 2000, customers: 85 },
  { month: 'Aug 2025', mrr: 49500, newMRR: 9500, expansionMRR: 3500, contractionMRR: 2000, churnMRR: 3500, customers: 92 },
  { month: 'Sep 2025', mrr: 55000, newMRR: 8000, expansionMRR: 4000, contractionMRR: 1500, churnMRR: 5000, customers: 97 },
  { month: 'Oct 2025', mrr: 61000, newMRR: 10000, expansionMRR: 4500, contractionMRR: 2500, churnMRR: 6000, customers: 105 },
  { month: 'Nov 2025', mrr: 67000, newMRR: 11000, expansionMRR: 3000, contractionMRR: 3000, churnMRR: 5000, customers: 112 },
  { month: 'Dec 2025', mrr: 72000, newMRR: 9000, expansionMRR: 5000, contractionMRR: 2000, churnMRR: 7000, customers: 118 },
  { month: 'Jan 2026', mrr: 78000, newMRR: 12000, expansionMRR: 4000, contractionMRR: 3000, churnMRR: 7000, customers: 126 },
  { month: 'Feb 2026', mrr: 85000, newMRR: 13000, expansionMRR: 5000, contractionMRR: 2000, churnMRR: 9000, customers: 134 },
];

const cohortData = [
  { cohort: 'Jul 2025', m0: 100, m1: 92, m2: 87, m3: 83, m4: 80, m5: 78, m6: 75 },
  { cohort: 'Aug 2025', m0: 100, m1: 90, m2: 85, m3: 81, m4: 78, m5: 76 },
  { cohort: 'Sep 2025', m0: 100, m1: 93, m2: 88, m3: 84, m4: 82 },
  { cohort: 'Oct 2025', m0: 100, m1: 91, m2: 86, m3: 83 },
  { cohort: 'Nov 2025', m0: 100, m1: 94, m2: 89 },
  { cohort: 'Dec 2025', m0: 100, m1: 92 },
  { cohort: 'Jan 2026', m0: 100 },
];

export default function SaaSMetrics() {
  const [period, setPeriod] = useState<'6m' | '12m'>('6m');

  const latest = monthlyMRR[monthlyMRR.length - 1];
  const prev = monthlyMRR[monthlyMRR.length - 2];

  const arr = latest.mrr * 12;
  const mrrGrowth = ((latest.mrr - prev.mrr) / prev.mrr) * 100;
  const grossChurn = (latest.churnMRR / prev.mrr) * 100;
  const netChurn = ((latest.churnMRR + latest.contractionMRR - latest.expansionMRR) / prev.mrr) * 100;
  const quickRatio = (latest.newMRR + latest.expansionMRR) / (latest.churnMRR + latest.contractionMRR);

  // CAC / LTV calculations (using averages)
  const avgMonthlySpend = 35000; // marketing + sales spend
  const newCustomersPerMonth = 12;
  const cac = avgMonthlySpend / newCustomersPerMonth;
  const arpu = latest.mrr / latest.customers;
  const monthlyChurnRate = grossChurn / 100;
  const ltv = arpu / monthlyChurnRate;
  const ltvCacRatio = ltv / cac;
  const cacPaybackMonths = cac / arpu;

  const waterfallData = monthlyMRR.map((m) => ({
    month: m.month,
    'New MRR': m.newMRR,
    'Expansion': m.expansionMRR,
    'Contraction': -m.contractionMRR,
    'Churn': -m.churnMRR,
  }));

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  const metrics = [
    { label: 'MRR', value: fmt(latest.mrr), change: `+${mrrGrowth.toFixed(1)}%`, positive: true, icon: DollarSign },
    { label: 'ARR', value: fmt(arr), change: `${fmt(arr - prev.mrr * 12)} YoY`, positive: true, icon: TrendingUp },
    { label: 'Customers', value: latest.customers.toString(), change: `+${latest.customers - prev.customers}`, positive: true, icon: Users },
    { label: 'ARPU', value: fmt(arpu), change: `${fmt(arpu - prev.mrr / prev.customers)}`, positive: arpu > prev.mrr / prev.customers, icon: Target },
    { label: 'Gross Churn', value: `${grossChurn.toFixed(1)}%`, change: grossChurn < 5 ? 'Healthy' : 'High', positive: grossChurn < 5, icon: RefreshCw },
    { label: 'Net Churn', value: `${netChurn.toFixed(1)}%`, change: netChurn < 0 ? 'Net Negative!' : 'Positive', positive: netChurn < 0, icon: TrendingDown },
    { label: 'Quick Ratio', value: quickRatio.toFixed(2), change: quickRatio > 4 ? 'Excellent' : quickRatio > 2 ? 'Good' : 'Needs work', positive: quickRatio > 2, icon: BarChart3 },
    { label: 'LTV:CAC', value: `${ltvCacRatio.toFixed(1)}x`, change: ltvCacRatio > 3 ? 'Healthy' : 'Improve', positive: ltvCacRatio > 3, icon: DollarSign },
  ];

  const getHeatColor = (val: number) => {
    if (val >= 90) return 'bg-green-100 text-green-800';
    if (val >= 80) return 'bg-green-50 text-green-700';
    if (val >= 70) return 'bg-yellow-50 text-yellow-700';
    return 'bg-red-50 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-gray-400" />
                <span className="text-xs font-medium text-gray-500 uppercase">{m.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{m.value}</p>
              <p className={`text-xs mt-1 ${m.positive ? 'text-green-600' : 'text-red-500'}`}>
                {m.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Unit Economics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <p className="text-sm font-medium text-blue-600 mb-1">Customer Acquisition Cost</p>
          <p className="text-3xl font-bold text-blue-900">{fmt(cac)}</p>
          <p className="text-xs text-blue-600 mt-2">Based on {fmt(avgMonthlySpend)}/mo spend, {newCustomersPerMonth} new customers/mo</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
          <p className="text-sm font-medium text-green-600 mb-1">Customer Lifetime Value</p>
          <p className="text-3xl font-bold text-green-900">{fmt(ltv)}</p>
          <p className="text-xs text-green-600 mt-2">ARPU: {fmt(arpu)}/mo, Churn: {grossChurn.toFixed(1)}%/mo</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
          <p className="text-sm font-medium text-purple-600 mb-1">CAC Payback Period</p>
          <p className="text-3xl font-bold text-purple-900">{cacPaybackMonths.toFixed(1)} mo</p>
          <p className="text-xs text-purple-600 mt-2">{cacPaybackMonths < 12 ? 'Healthy: under 12 months' : 'Warning: over 12 months'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MRR Growth */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">MRR Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyMRR}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Area type="monotone" dataKey="mrr" name="MRR" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* MRR Waterfall */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">MRR Waterfall</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={waterfallData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Legend />
              <Bar dataKey="New MRR" stackId="pos" fill="#10b981" />
              <Bar dataKey="Expansion" stackId="pos" fill="#3b82f6" />
              <Bar dataKey="Contraction" stackId="neg" fill="#f59e0b" />
              <Bar dataKey="Churn" stackId="neg" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cohort Retention Heatmap */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Cohort Retention (% of customers)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-3 py-2 font-medium text-gray-600">Cohort</th>
                {['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map((m) => (
                  <th key={m} className="text-center px-3 py-2 font-medium text-gray-600">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohortData.map((row) => (
                <tr key={row.cohort} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium text-gray-700">{row.cohort}</td>
                  {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((val, idx) => (
                    <td key={idx} className="text-center px-3 py-2">
                      {val !== undefined ? (
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getHeatColor(val)}`}>
                          {val}%
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
