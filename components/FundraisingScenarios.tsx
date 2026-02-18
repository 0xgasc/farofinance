'use client';

import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { Rocket, DollarSign, TrendingUp, Clock, Plus, Trash2 } from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  raiseAmount: number;
  preMoneyValuation: number;
  dilution: number;
  expectedCloseDate: string;
  useOfFunds: { category: string; percentage: number }[];
  color: string;
}

const defaultScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Seed Round',
    raiseAmount: 3000000,
    preMoneyValuation: 12000000,
    dilution: 20,
    expectedCloseDate: '2026-06-01',
    useOfFunds: [
      { category: 'Engineering', percentage: 45 },
      { category: 'Sales & Marketing', percentage: 25 },
      { category: 'Operations', percentage: 15 },
      { category: 'G&A', percentage: 15 },
    ],
    color: '#3b82f6',
  },
  {
    id: '2',
    name: 'Series A',
    raiseAmount: 8000000,
    preMoneyValuation: 35000000,
    dilution: 18.6,
    expectedCloseDate: '2027-03-01',
    useOfFunds: [
      { category: 'Engineering', percentage: 35 },
      { category: 'Sales & Marketing', percentage: 35 },
      { category: 'Operations', percentage: 15 },
      { category: 'G&A', percentage: 15 },
    ],
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Bridge Round',
    raiseAmount: 1500000,
    preMoneyValuation: 15000000,
    dilution: 9.1,
    expectedCloseDate: '2026-04-01',
    useOfFunds: [
      { category: 'Engineering', percentage: 50 },
      { category: 'Sales & Marketing', percentage: 30 },
      { category: 'Operations', percentage: 10 },
      { category: 'G&A', percentage: 10 },
    ],
    color: '#f59e0b',
  },
];

export default function FundraisingScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>(defaultScenarios);
  const [selected, setSelected] = useState<string>(defaultScenarios[0].id);
  const [showAdd, setShowAdd] = useState(false);

  const currentCash = 3000000;
  const monthlyBurn = 65000;
  const currentRunway = Math.floor(currentCash / monthlyBurn);

  const selectedScenario = scenarios.find((s) => s.id === selected)!;

  const projectionData = useMemo(() => {
    const data: any[] = [];
    const now = new Date();

    scenarios.forEach((scenario) => {
      let balance = currentCash;
      const closeDate = new Date(scenario.expectedCloseDate);
      const monthsToClose = Math.max(0, (closeDate.getFullYear() - now.getFullYear()) * 12 + closeDate.getMonth() - now.getMonth());

      for (let i = 0; i <= 24; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

        if (!data[i]) data[i] = { month: label };

        if (i === monthsToClose) {
          balance += scenario.raiseAmount;
        }
        balance -= monthlyBurn;
        data[i][scenario.name] = Math.max(0, Math.round(balance));
      }
    });

    // Add no-raise baseline
    let baseline = currentCash;
    for (let i = 0; i <= 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!data[i]) data[i] = { month: label };
      data[i]['No Raise'] = Math.max(0, Math.round(baseline));
      baseline -= monthlyBurn;
    }

    return data;
  }, [scenarios, currentCash, monthlyBurn]);

  const postRaiseRunway = (scenario: Scenario) => {
    const closeDate = new Date(scenario.expectedCloseDate);
    const now = new Date();
    const monthsToClose = Math.max(0, (closeDate.getFullYear() - now.getFullYear()) * 12 + closeDate.getMonth() - now.getMonth());
    const cashAtClose = currentCash - (monthlyBurn * monthsToClose) + scenario.raiseAmount;
    return Math.floor(cashAtClose / monthlyBurn);
  };

  const fmt = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
    if (selected === id) setSelected(scenarios[0]?.id || '');
  };

  return (
    <div className="space-y-6">
      {/* Current Position */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Current Cash</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{fmt(currentCash)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Current Runway</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{currentRunway} months</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Rocket size={18} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Recommended Action</span>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {currentRunway <= 6 ? 'Raise Now' : currentRunway <= 12 ? 'Start Fundraising' : 'Monitor'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Most rounds take 3-6 months to close
          </p>
        </div>
      </div>

      {/* Scenario Comparison Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Runway Projections by Scenario</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => fmt(v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend />
            <Line type="monotone" dataKey="No Raise" stroke="#9ca3af" strokeWidth={2} strokeDasharray="5 5" />
            {scenarios.map((s) => (
              <Line key={s.id} type="monotone" dataKey={s.name} stroke={s.color} strokeWidth={2} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const postRunway = postRaiseRunway(scenario);
          const postMoney = scenario.preMoneyValuation + scenario.raiseAmount;
          return (
            <div
              key={scenario.id}
              onClick={() => setSelected(scenario.id)}
              className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all ${
                selected === scenario.id ? 'border-primary shadow-md' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scenario.color }} />
                  <h4 className="font-semibold">{scenario.name}</h4>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeScenario(scenario.id); }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Raise Amount</span>
                  <span className="font-semibold">{fmt(scenario.raiseAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pre-Money</span>
                  <span className="font-semibold">{fmt(scenario.preMoneyValuation)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Post-Money</span>
                  <span className="font-semibold">{fmt(postMoney)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dilution</span>
                  <span className="font-semibold">{scenario.dilution.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Post-Raise Runway</span>
                  <span className={`font-semibold ${postRunway > 18 ? 'text-green-600' : postRunway > 12 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {postRunway} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Close</span>
                  <span className="font-semibold">
                    {new Date(scenario.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Use of Funds */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">USE OF FUNDS</p>
                {scenario.useOfFunds.map((item) => (
                  <div key={item.category} className="flex items-center gap-2 mb-1">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-0.5">
                        <span>{item.category}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div
                          className="h-1.5 rounded-full"
                          style={{ width: `${item.percentage}%`, backgroundColor: scenario.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dilution Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Dilution Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Scenario</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Raise</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Pre-Money</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Post-Money</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Dilution</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Founder Ownership (Est.)</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Post-Raise Runway</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => {
                const postMoney = s.preMoneyValuation + s.raiseAmount;
                const founderOwnership = (1 - s.dilution / 100) * 80; // assuming 80% founder ownership pre-raise
                return (
                  <tr key={s.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="text-right px-4 py-3">{fmt(s.raiseAmount)}</td>
                    <td className="text-right px-4 py-3">{fmt(s.preMoneyValuation)}</td>
                    <td className="text-right px-4 py-3 font-semibold">{fmt(postMoney)}</td>
                    <td className="text-right px-4 py-3 text-red-500">{s.dilution.toFixed(1)}%</td>
                    <td className="text-right px-4 py-3">{founderOwnership.toFixed(1)}%</td>
                    <td className="text-right px-4 py-3 font-semibold">{postRaiseRunway(s)} mo</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
