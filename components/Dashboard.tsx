'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    revenue: 1250000,
    revenueChange: 12.5,
    expenses: 850000,
    expensesChange: -5.2,
    profit: 400000,
    profitChange: 18.3,
    headcount: 45,
    headcountChange: 8.5
  });

  const revenueData = [
    { month: 'Jan', revenue: 950000, expenses: 720000 },
    { month: 'Feb', revenue: 1020000, expenses: 750000 },
    { month: 'Mar', revenue: 1100000, expenses: 780000 },
    { month: 'Apr', revenue: 1150000, expenses: 800000 },
    { month: 'May', revenue: 1200000, expenses: 820000 },
    { month: 'Jun', revenue: 1250000, expenses: 850000 },
  ];

  const departmentBudget = [
    { name: 'Engineering', value: 350000, color: '#3b82f6' },
    { name: 'Sales', value: 250000, color: '#10b981' },
    { name: 'Marketing', value: 150000, color: '#f59e0b' },
    { name: 'Operations', value: 100000, color: '#8b5cf6' },
  ];

  const MetricCard = ({ title, value, change, icon: Icon, format = 'currency' }: any) => {
    const isPositive = change > 0;
    const formatValue = (val: number) => {
      if (format === 'currency') return `$${(val / 1000000).toFixed(2)}M`;
      if (format === 'number') return val.toString();
      return val;
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
          <Icon className="text-gray-400" size={20} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span>{Math.abs(change)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue"
          value={metrics.revenue}
          change={metrics.revenueChange}
          icon={DollarSign}
        />
        <MetricCard
          title="Expenses"
          value={metrics.expenses}
          change={metrics.expensesChange}
          icon={TrendingUp}
        />
        <MetricCard
          title="Net Profit"
          value={metrics.profit}
          change={metrics.profitChange}
          icon={Target}
        />
        <MetricCard
          title="Headcount"
          value={metrics.headcount}
          change={metrics.headcountChange}
          icon={Users}
          format="number"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Department Budget Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentBudget}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentBudget.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `$${(value / 1000).toFixed(0)}K`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm text-gray-600 mb-2">Gross Margin</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">32%</span>
              <span className="text-sm text-green-600">+2.3%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[32%] bg-blue-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-600 mb-2">Burn Rate</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">$850K</span>
              <span className="text-sm text-red-600">+5.2%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[68%] bg-orange-500 rounded-full"></div>
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-600 mb-2">Runway</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">18 months</span>
              <span className="text-sm text-green-600">+3 months</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[75%] bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}