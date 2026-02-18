'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Filter, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MetricsView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const metrics = [
    {
      id: 1,
      name: 'Monthly Recurring Revenue',
      category: 'revenue',
      value: 1250000,
      change: 12.5,
      target: 1300000,
      unit: '$',
      data: [
        { month: 'Jan', value: 950000 },
        { month: 'Feb', value: 1020000 },
        { month: 'Mar', value: 1100000 },
        { month: 'Apr', value: 1150000 },
        { month: 'May', value: 1200000 },
        { month: 'Jun', value: 1250000 },
      ]
    },
    {
      id: 2,
      name: 'Customer Acquisition Cost',
      category: 'efficiency',
      value: 2500,
      change: -8.3,
      target: 2000,
      unit: '$',
      data: [
        { month: 'Jan', value: 3200 },
        { month: 'Feb', value: 3000 },
        { month: 'Mar', value: 2800 },
        { month: 'Apr', value: 2700 },
        { month: 'May', value: 2600 },
        { month: 'Jun', value: 2500 },
      ]
    },
    {
      id: 3,
      name: 'Net Promoter Score',
      category: 'customer',
      value: 72,
      change: 5.9,
      target: 75,
      unit: '',
      data: [
        { month: 'Jan', value: 65 },
        { month: 'Feb', value: 67 },
        { month: 'Mar', value: 68 },
        { month: 'Apr', value: 70 },
        { month: 'May', value: 71 },
        { month: 'Jun', value: 72 },
      ]
    },
    {
      id: 4,
      name: 'Employee Productivity',
      category: 'operational',
      value: 125000,
      change: 15.2,
      target: 130000,
      unit: '$/employee',
      data: [
        { month: 'Jan', value: 95000 },
        { month: 'Feb', value: 102000 },
        { month: 'Mar', value: 110000 },
        { month: 'Apr', value: 115000 },
        { month: 'May', value: 120000 },
        { month: 'Jun', value: 125000 },
      ]
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'efficiency', label: 'Efficiency' },
    { value: 'customer', label: 'Customer' },
    { value: 'operational', label: 'Operational' }
  ];

  const filteredMetrics = selectedCategory === 'all'
    ? metrics
    : metrics.filter(m => m.category === selectedCategory);

  const MetricCard = ({ metric }: { metric: any }) => {
    const progress = (metric.value / metric.target) * 100;
    const isPositive = metric.change > 0;

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">{metric.name}</h3>
            <p className="text-sm text-gray-500 mt-1 capitalize">{metric.category}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(metric.change)}%</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold">
            {metric.unit === '$' && '$'}
            {metric.value.toLocaleString()}
            {metric.unit && metric.unit !== '$' && ` ${metric.unit}`}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Target: {metric.unit === '$' && '$'}{metric.target.toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-900 font-medium">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                progress >= 100 ? 'bg-green-500' :
                progress >= 75 ? 'bg-blue-500' :
                progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metric.data}>
              <defs>
                <linearGradient id={`gradient-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fill={`url(#gradient-${metric.id})`}
                strokeWidth={2}
              />
              <Tooltip
                formatter={(value: any) => [
                  `${metric.unit === '$' ? '$' : ''}${value.toLocaleString()}${metric.unit && metric.unit !== '$' ? ` ${metric.unit}` : ''}`,
                  'Value'
                ]}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Key Metrics</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMetrics.map(metric => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Metrics on Target</p>
            <p className="text-3xl font-bold text-green-600">
              {metrics.filter(m => m.value >= m.target).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              of {metrics.length} total
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Average Progress</p>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(metrics.reduce((sum, m) => sum + (m.value / m.target * 100), 0) / metrics.length)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              toward targets
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Improving</p>
            <p className="text-3xl font-bold text-green-600">
              {metrics.filter(m => m.change > 0).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              metrics trending up
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Need Attention</p>
            <p className="text-3xl font-bold text-orange-600">
              {metrics.filter(m => m.value < m.target * 0.75).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              below 75% of target
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}