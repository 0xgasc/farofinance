'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Download, Upload, Loader2, BarChart2 } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { downloadCSV } from '@/lib/utils/csvExport';
import { useDataModeStore } from '@/lib/stores/dataModeStore';
import { useMetricStore } from '@/lib/stores/metricStore';
import CSVImporter from '@/components/CSVImporter';

const DEMO_METRICS = [
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

export default function MetricsView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [importerOpen, setImporterOpen] = useState(false);

  const { demoMode } = useDataModeStore();
  const { metrics: liveMetrics, isLoading, fetchMetrics } = useMetricStore();

  useEffect(() => {
    if (!demoMode) fetchMetrics();
  }, [demoMode]);

  // Normalise live metrics to the same shape MetricCard expects
  const normalisedLive = liveMetrics.map((m: any, i: number) => ({
    id: m._id || i,
    name: m.name,
    category: m.category,
    value: m.data?.[m.data.length - 1]?.value ?? 0,
    change: 0,
    target: m.target ?? 0,
    unit: m.unit ?? '',
    data: (m.data ?? []).map((d: any) => ({ month: d.date, value: d.value })),
  }));

  const metrics = demoMode ? DEMO_METRICS : normalisedLive;

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
      <CSVImporter isOpen={importerOpen} onClose={() => { setImporterOpen(false); if (!demoMode) fetchMetrics(); }} initialType="metrics" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Key Metrics</h2>
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <button
            onClick={() => setImporterOpen(true)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
          >
            <Upload size={15} />
            Import
          </button>
          {filteredMetrics.length > 0 && (
            <button
              onClick={() => downloadCSV('faro-metrics', ['name', 'category', 'value', 'target', 'unit'],
                filteredMetrics.map(m => [m.name, m.category, m.value, m.target, m.unit]))}
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download size={15} />
              Export
            </button>
          )}
        </div>
      </div>

      {isLoading && !demoMode ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-300" />
        </div>
      ) : !demoMode && metrics.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart2 size={26} className="text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">No metrics yet</h3>
          <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
            Import a CSV with your KPIs to track progress toward targets.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setImporterOpen(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
            >
              <Upload size={15} />
              Import CSV
            </button>
            <button
              onClick={() => useDataModeStore.getState().setDemoMode(true)}
              className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
            >
              View demo data
            </button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}