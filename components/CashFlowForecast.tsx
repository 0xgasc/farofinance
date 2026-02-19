'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { Wallet, ArrowUpRight, ArrowDownRight, Edit3, Check } from 'lucide-react';
import { useDataModeStore } from '@/lib/stores/dataModeStore';

interface WeeklyData {
  week: string;
  cashIn: number;
  cashOut: number;
  netFlow: number;
  endingBalance: number;
  isOverride: boolean;
}

function generateWeeks(): WeeklyData[] {
  const weeks: WeeklyData[] = [];
  let balance = 3000000;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);

  for (let i = 0; i < 13; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i * 7);
    const label = `W${i + 1} (${(d.getMonth() + 1)}/${d.getDate()})`;

    const cashIn = 15000 + Math.random() * 8000 + (i % 4 === 0 ? 20000 : 0);
    const cashOut = 25000 + Math.random() * 10000 + (i % 2 === 0 ? 5000 : 0);
    const netFlow = cashIn - cashOut;
    balance += netFlow;

    weeks.push({
      week: label,
      cashIn: Math.round(cashIn),
      cashOut: Math.round(cashOut),
      netFlow: Math.round(netFlow),
      endingBalance: Math.round(balance),
      isOverride: false,
    });
  }
  return weeks;
}

export default function CashFlowForecast() {
  const { demoMode } = useDataModeStore();
  const [weeks, setWeeks] = useState<WeeklyData[]>(generateWeeks);
  const [editingWeek, setEditingWeek] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({ cashIn: '', cashOut: '' });

  const totals = useMemo(() => {
    const totalIn = weeks.reduce((s, w) => s + w.cashIn, 0);
    const totalOut = weeks.reduce((s, w) => s + w.cashOut, 0);
    return { totalIn, totalOut, netFlow: totalIn - totalOut };
  }, [weeks]);

  const startEdit = (index: number) => {
    setEditingWeek(index);
    setEditValues({
      cashIn: weeks[index].cashIn.toString(),
      cashOut: weeks[index].cashOut.toString(),
    });
  };

  const saveEdit = (index: number) => {
    const newWeeks = [...weeks];
    const cashIn = parseFloat(editValues.cashIn) || 0;
    const cashOut = parseFloat(editValues.cashOut) || 0;
    newWeeks[index] = {
      ...newWeeks[index],
      cashIn,
      cashOut,
      netFlow: cashIn - cashOut,
      isOverride: true,
    };
    // Recalculate balances from this point forward
    for (let i = index; i < newWeeks.length; i++) {
      const prevBalance = i === 0 ? 3000000 : newWeeks[i - 1].endingBalance;
      newWeeks[i].endingBalance = prevBalance + newWeeks[i].netFlow;
    }
    setWeeks(newWeeks);
    setEditingWeek(null);
  };

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };


  if (!demoMode) return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Wallet size={26} className="text-gray-300" />
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={18} className="text-green-600" />
            <span className="text-sm font-medium text-gray-600">13-Week Cash In</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{fmt(totals.totalIn)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight size={18} className="text-red-500" />
            <span className="text-sm font-medium text-gray-600">13-Week Cash Out</span>
          </div>
          <p className="text-2xl font-bold text-red-500">{fmt(totals.totalOut)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Net Cash Flow</span>
          </div>
          <p className={`text-2xl font-bold ${totals.netFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {fmt(totals.netFlow)}
          </p>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Cash Flow</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeks}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="cashIn" name="Cash In" fill="#10b981" radius={[2, 2, 0, 0]} />
            <Bar dataKey="cashOut" name="Cash Out" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold">13-Week Cash Flow Detail</h3>
          <p className="text-sm text-gray-500 mt-1">Click the edit icon to override projected values</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Week</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Cash In</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Cash Out</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Net Flow</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Ending Balance</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, idx) => (
                <tr key={week.week} className={`border-t border-gray-100 ${week.isOverride ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-4 py-3 font-medium">{week.week}</td>
                  <td className="text-right px-4 py-3">
                    {editingWeek === idx ? (
                      <input
                        type="number"
                        value={editValues.cashIn}
                        onChange={(e) => setEditValues({ ...editValues, cashIn: e.target.value })}
                        className="w-24 px-2 py-1 border rounded text-right text-sm"
                      />
                    ) : (
                      <span className="text-green-600">{fmt(week.cashIn)}</span>
                    )}
                  </td>
                  <td className="text-right px-4 py-3">
                    {editingWeek === idx ? (
                      <input
                        type="number"
                        value={editValues.cashOut}
                        onChange={(e) => setEditValues({ ...editValues, cashOut: e.target.value })}
                        className="w-24 px-2 py-1 border rounded text-right text-sm"
                      />
                    ) : (
                      <span className="text-red-500">{fmt(week.cashOut)}</span>
                    )}
                  </td>
                  <td className={`text-right px-4 py-3 font-medium ${week.netFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {fmt(week.netFlow)}
                  </td>
                  <td className="text-right px-4 py-3 font-semibold">{fmt(week.endingBalance)}</td>
                  <td className="text-center px-4 py-3">
                    {editingWeek === idx ? (
                      <button onClick={() => saveEdit(idx)} className="text-green-600 hover:text-green-800">
                        <Check size={16} />
                      </button>
                    ) : (
                      <button onClick={() => startEdit(idx)} className="text-gray-400 hover:text-gray-600">
                        <Edit3 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                <td className="px-4 py-3">Total</td>
                <td className="text-right px-4 py-3 text-green-600">{fmt(totals.totalIn)}</td>
                <td className="text-right px-4 py-3 text-red-500">{fmt(totals.totalOut)}</td>
                <td className={`text-right px-4 py-3 ${totals.netFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {fmt(totals.netFlow)}
                </td>
                <td className="text-right px-4 py-3">{fmt(weeks[weeks.length - 1]?.endingBalance || 0)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
