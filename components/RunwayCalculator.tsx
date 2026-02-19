'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Flame, TrendingDown, Clock, DollarSign, Plus, Trash2,
  AlertTriangle, CheckCircle
} from 'lucide-react';
import { useDataModeStore } from '@/lib/stores/dataModeStore';

interface CashEntry {
  id: string;
  date: string;
  balance: number;
  accountName: string;
}

interface ExpenseEntry {
  month: string;
  revenue: number;
  expenses: number;
}

const defaultCashEntries: CashEntry[] = [
  { id: '1', date: '2026-01-01', balance: 2400000, accountName: 'Main Operating' },
  { id: '2', date: '2026-01-01', balance: 600000, accountName: 'Savings Reserve' },
];

const defaultMonthlyData: ExpenseEntry[] = [
  { month: 'Sep 2025', revenue: 45000, expenses: 120000 },
  { month: 'Oct 2025', revenue: 52000, expenses: 125000 },
  { month: 'Nov 2025', revenue: 58000, expenses: 128000 },
  { month: 'Dec 2025', revenue: 61000, expenses: 132000 },
  { month: 'Jan 2026', revenue: 67000, expenses: 135000 },
  { month: 'Feb 2026', revenue: 72000, expenses: 138000 },
];

export default function RunwayCalculator() {
  const { demoMode } = useDataModeStore();
  const [cashEntries, setCashEntries] = useState<CashEntry[]>(defaultCashEntries);
  const [monthlyData, setMonthlyData] = useState<ExpenseEntry[]>(defaultMonthlyData);
  const [showAddCash, setShowAddCash] = useState(false);
  const [newEntry, setNewEntry] = useState({ accountName: '', balance: '', date: '' });

  const totalCash = useMemo(() =>
    cashEntries.reduce((sum, e) => sum + e.balance, 0),
    [cashEntries]
  );

  const last3Months = monthlyData.slice(-3);
  const avgRevenue = last3Months.reduce((s, m) => s + m.revenue, 0) / 3;
  const avgExpenses = last3Months.reduce((s, m) => s + m.expenses, 0) / 3;
  const grossBurn = avgExpenses;
  const netBurn = avgExpenses - avgRevenue;
  const runwayMonths = netBurn > 0 ? Math.floor(totalCash / netBurn) : Infinity;

  const projectionData = useMemo(() => {
    const data: { month: string; cashBalance: number; cumRevenue: number; cumExpenses: number }[] = [];
    let balance = totalCash;
    const now = new Date();
    for (let i = 0; i <= Math.min(runwayMonths + 3, 24); i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      data.push({
        month: label,
        cashBalance: Math.max(0, Math.round(balance)),
        cumRevenue: Math.round(avgRevenue * i),
        cumExpenses: Math.round(avgExpenses * i),
      });
      balance -= netBurn;
    }
    return data;
  }, [totalCash, netBurn, avgRevenue, avgExpenses, runwayMonths]);

  const burnTrendData = monthlyData.map((m) => ({
    ...m,
    netBurn: m.expenses - m.revenue,
  }));

  const addCashEntry = () => {
    if (!newEntry.accountName || !newEntry.balance || !newEntry.date) return;
    setCashEntries([...cashEntries, {
      id: Date.now().toString(),
      accountName: newEntry.accountName,
      balance: parseFloat(newEntry.balance),
      date: newEntry.date,
    }]);
    setNewEntry({ accountName: '', balance: '', date: '' });
    setShowAddCash(false);
  };

  const removeCashEntry = (id: string) => {
    setCashEntries(cashEntries.filter((e) => e.id !== id));
  };

  const fmt = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  const runwayColor = runwayMonths > 18 ? 'text-green-600' : runwayMonths > 12 ? 'text-blue-600' : runwayMonths > 6 ? 'text-yellow-600' : 'text-red-600';
  const runwayBg = runwayMonths > 18 ? 'bg-green-50' : runwayMonths > 12 ? 'bg-blue-50' : runwayMonths > 6 ? 'bg-yellow-50' : 'bg-red-50';


  if (!demoMode) return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Flame size={26} className="text-gray-300" />
      </div>
      <h3 className="font-semibold text-gray-700 mb-1">No live data yet</h3>
      <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
        Connect integrations or import CSVs to populate this view with your real numbers.
      </p>
      <button
        onClick={() => useDataModeStore.getState().setDemoMode(true)}
        className="text-sm text-primary hover:underline underline-offset-2"
      >
        ← View demo data
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${runwayBg} rounded-xl p-5 border`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className={runwayColor} />
            <span className="text-sm font-medium text-gray-600">Runway</span>
          </div>
          <p className={`text-3xl font-bold ${runwayColor}`}>
            {runwayMonths === Infinity ? 'Infinite' : `${runwayMonths} mo`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {runwayMonths > 12 ? 'Healthy runway' : runwayMonths > 6 ? 'Consider fundraising' : 'Urgent: fundraise now'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total Cash</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{fmt(totalCash)}</p>
          <p className="text-xs text-gray-500 mt-1">{cashEntries.length} account(s)</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Net Burn</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{fmt(netBurn)}</p>
          <p className="text-xs text-gray-500 mt-1">Avg last 3 months</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-red-500" />
            <span className="text-sm font-medium text-gray-600">Gross Burn</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{fmt(grossBurn)}</p>
          <p className="text-xs text-gray-500 mt-1">Total monthly expenses</p>
        </div>
      </div>

      {/* Runway Projection Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Cash Runway Projection</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <Area
              type="monotone"
              dataKey="cashBalance"
              name="Cash Balance"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Burn Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Burn Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={burnTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="netBurn" name="Net Burn" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cash Accounts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Cash Accounts</h3>
            <button
              onClick={() => setShowAddCash(!showAddCash)}
              className="flex items-center gap-1 text-sm text-primary hover:opacity-80"
            >
              <Plus size={16} />
              Add Account
            </button>
          </div>

          {showAddCash && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <input
                type="text"
                placeholder="Account name"
                value={newEntry.accountName}
                onChange={(e) => setNewEntry({ ...newEntry, accountName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Balance"
                  value={newEntry.balance}
                  onChange={(e) => setNewEntry({ ...newEntry, balance: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button onClick={addCashEntry} className="w-full bg-primary text-white py-2 rounded-lg text-sm">
                Add
              </button>
            </div>
          )}

          <div className="space-y-3">
            {cashEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{entry.accountName}</p>
                  <p className="text-xs text-gray-500">as of {entry.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{fmt(entry.balance)}</span>
                  <button onClick={() => removeCashEntry(entry.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            <span className="font-semibold text-gray-900">Total Cash</span>
            <span className="font-bold text-lg text-gray-900">{fmt(totalCash)}</span>
          </div>
        </div>
      </div>

      {/* Runway Alert */}
      {runwayMonths <= 12 && runwayMonths !== Infinity && (
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${
          runwayMonths <= 6 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          <AlertTriangle size={20} className={runwayMonths <= 6 ? 'text-red-600' : 'text-yellow-600'} />
          <div>
            <p className={`font-semibold ${runwayMonths <= 6 ? 'text-red-800' : 'text-yellow-800'}`}>
              {runwayMonths <= 6 ? 'Critical: Low Runway' : 'Heads Up: Consider Fundraising'}
            </p>
            <p className={`text-sm mt-1 ${runwayMonths <= 6 ? 'text-red-700' : 'text-yellow-700'}`}>
              {runwayMonths <= 6
                ? `At current burn rate, you have ~${runwayMonths} months of runway. Start fundraising immediately or reduce expenses.`
                : `With ${runwayMonths} months of runway, it's a good time to start planning your next raise. Most rounds take 3-6 months.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
