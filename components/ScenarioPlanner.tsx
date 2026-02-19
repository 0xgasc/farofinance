'use client';

import { useState } from 'react';
import { GitBranch, Plus, Copy, Trash2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDataModeStore } from '@/lib/stores/dataModeStore';

export default function ScenarioPlanner() {
  const { demoMode } = useDataModeStore();
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: 'Base Case',
      description: 'Conservative growth projection',
      color: '#3b82f6',
      assumptions: {
        revenue_growth: 15,
        expense_growth: 10,
        headcount_growth: 8
      },
      active: true
    },
    {
      id: 2,
      name: 'Optimistic',
      description: 'Aggressive expansion scenario',
      color: '#10b981',
      assumptions: {
        revenue_growth: 35,
        expense_growth: 20,
        headcount_growth: 25
      },
      active: true
    },
    {
      id: 3,
      name: 'Pessimistic',
      description: 'Economic downturn scenario',
      color: '#ef4444',
      assumptions: {
        revenue_growth: 5,
        expense_growth: 5,
        headcount_growth: 0
      },
      active: false
    }
  ]);

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);

  const generateProjectionData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseRevenue = 1000000;

    return months.map((month, index) => {
      const dataPoint: any = { month };
      scenarios.forEach(scenario => {
        if (scenario.active) {
          const monthlyGrowth = scenario.assumptions.revenue_growth / 100 / 12;
          dataPoint[scenario.name] = Math.round(baseRevenue * Math.pow(1 + monthlyGrowth, index + 1));
        }
      });
      return dataPoint;
    });
  };

  const projectionData = generateProjectionData();

  const toggleScenario = (id: number) => {
    setScenarios(scenarios.map(s =>
      s.id === id ? { ...s, active: !s.active } : s
    ));
  };

  const duplicateScenario = (scenario: any) => {
    const newScenario = {
      ...scenario,
      id: Math.max(...scenarios.map(s => s.id)) + 1,
      name: `${scenario.name} (Copy)`,
      color: '#8b5cf6'
    };
    setScenarios([...scenarios, newScenario]);
  };


  if (!demoMode) return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <GitBranch size={26} className="text-gray-300" />
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scenario Planning</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
          <Plus size={20} />
          New Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Projections</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `$${(value / 1000000).toFixed(2)}M`} />
                <Legend />
                {scenarios.filter(s => s.active).map(scenario => (
                  <Line
                    key={scenario.id}
                    type="monotone"
                    dataKey={scenario.name}
                    stroke={scenario.color}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Metric</th>
                    {scenarios.filter(s => s.active).map(scenario => (
                      <th key={scenario.id} className="text-right p-3">{scenario.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Year-End Revenue</td>
                    {scenarios.filter(s => s.active).map(scenario => (
                      <td key={scenario.id} className="text-right p-3">
                        ${(1000000 * (1 + scenario.assumptions.revenue_growth / 100)).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Headcount</td>
                    {scenarios.filter(s => s.active).map(scenario => (
                      <td key={scenario.id} className="text-right p-3">
                        {Math.round(45 * (1 + scenario.assumptions.headcount_growth / 100))}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Burn Rate</td>
                    {scenarios.filter(s => s.active).map(scenario => (
                      <td key={scenario.id} className="text-right p-3">
                        ${Math.round(850000 * (1 + scenario.assumptions.expense_growth / 100) / 12).toLocaleString()}/mo
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3">Runway</td>
                    {scenarios.filter(s => s.active).map(scenario => {
                      const monthlyBurn = 850000 * (1 + scenario.assumptions.expense_growth / 100) / 12;
                      const runway = Math.round(5000000 / monthlyBurn);
                      return (
                        <td key={scenario.id} className="text-right p-3">
                          {runway} months
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Scenarios</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {scenarios.map(scenario => (
                <div
                  key={scenario.id}
                  className={`p-4 ${selectedScenario.id === scenario.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: scenario.color }}
                        />
                        <h4 className="font-medium">{scenario.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleScenario(scenario.id)}
                        className={`text-sm px-2 py-1 rounded ${
                          scenario.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {scenario.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>

                  {selectedScenario.id === scenario.id && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-sm text-gray-600">Revenue Growth</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={scenario.assumptions.revenue_growth}
                            onChange={(e) => {
                              const updated = scenarios.map(s =>
                                s.id === scenario.id
                                  ? { ...s, assumptions: { ...s.assumptions, revenue_growth: parseInt(e.target.value) }}
                                  : s
                              );
                              setScenarios(updated);
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm w-12 text-right">{scenario.assumptions.revenue_growth}%</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Expense Growth</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={scenario.assumptions.expense_growth}
                            onChange={(e) => {
                              const updated = scenarios.map(s =>
                                s.id === scenario.id
                                  ? { ...s, assumptions: { ...s.assumptions, expense_growth: parseInt(e.target.value) }}
                                  : s
                              );
                              setScenarios(updated);
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm w-12 text-right">{scenario.assumptions.expense_growth}%</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Headcount Growth</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            value={scenario.assumptions.headcount_growth}
                            onChange={(e) => {
                              const updated = scenarios.map(s =>
                                s.id === scenario.id
                                  ? { ...s, assumptions: { ...s.assumptions, headcount_growth: parseInt(e.target.value) }}
                                  : s
                              );
                              setScenarios(updated);
                            }}
                            className="flex-1"
                          />
                          <span className="text-sm w-12 text-right">{scenario.assumptions.headcount_growth}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => duplicateScenario(scenario)}
                          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          <Copy size={14} />
                          Duplicate
                        </button>
                        <button className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}