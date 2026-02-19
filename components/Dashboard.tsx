'use client';

import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Users, Target, FlaskConical, Upload, Plug, LayoutDashboard } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDataModeStore } from '@/lib/stores/dataModeStore';
import { useNavigationStore } from '@/lib/stores/navigationStore';

const DEMO_METRICS = {
  revenue: 1250000,      revenueChange: 12.5,
  expenses: 850000,      expensesChange: -5.2,
  profit: 400000,        profitChange: 18.3,
  headcount: 45,         headcountChange: 8.5,
  grossMargin: 32,       burnRate: 850000,     runway: 18,
};

const DEMO_REVENUE_DATA = [
  { month: 'Jan', revenue: 950000,  expenses: 720000 },
  { month: 'Feb', revenue: 1020000, expenses: 750000 },
  { month: 'Mar', revenue: 1100000, expenses: 780000 },
  { month: 'Apr', revenue: 1150000, expenses: 800000 },
  { month: 'May', revenue: 1200000, expenses: 820000 },
  { month: 'Jun', revenue: 1250000, expenses: 850000 },
];

const DEMO_DEPT_BUDGET = [
  { name: 'Engineering', value: 350000, color: '#3b82f6' },
  { name: 'Sales',       value: 250000, color: '#10b981' },
  { name: 'Marketing',   value: 150000, color: '#f59e0b' },
  { name: 'Operations',  value: 100000, color: '#8b5cf6' },
];

function MetricCard({ title, value, change, icon: Icon, format = 'currency' }: any) {
  const isPositive = change >= 0;
  const formatValue = (val: number) => {
    if (format === 'currency') {
      if (val === 0) return '—';
      return val >= 1000000 ? `$${(val / 1000000).toFixed(2)}M` : `$${(val / 1000).toFixed(0)}K`;
    }
    if (format === 'number') return val === 0 ? '—' : val.toString();
    return val;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <Icon className="text-gray-400" size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        {change !== 0 && (
          <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        )}
        {change === 0 && <p className="text-xs text-gray-400 mt-2">No data yet</p>}
      </div>
    </div>
  );
}

function LiveEmptyState({ onOpenImporter }: { onOpenImporter?: () => void }) {
  const setActiveView = useNavigationStore((s) => s.setActiveView);
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <LayoutDashboard size={26} className="text-gray-300" />
      </div>
      <h3 className="font-semibold text-gray-700 mb-1">Your dashboard is empty</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
        Import CSV files or connect an integration and your KPIs will appear here automatically.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setActiveView('integrations')}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
        >
          <Plug size={15} />
          Connect integrations
        </button>
        <button
          onClick={() => useDataModeStore.getState().setDemoMode(true)}
          className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
        >
          View demo data
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { demoMode } = useDataModeStore();

  const metrics   = demoMode ? DEMO_METRICS       : { revenue: 0, revenueChange: 0, expenses: 0, expensesChange: 0, profit: 0, profitChange: 0, headcount: 0, headcountChange: 0, grossMargin: 0, burnRate: 0, runway: 0 };
  const revData   = demoMode ? DEMO_REVENUE_DATA  : [];
  const deptData  = demoMode ? DEMO_DEPT_BUDGET   : [];

  return (
    <div className="space-y-6">
      {demoMode ? (
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 w-fit">
          <FlaskConical size={13} />
          Sample data — click <strong className="mx-0.5">"Use my data →"</strong> in the banner above to switch to your real numbers
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2 w-fit">
          Live mode — connect integrations or import CSVs to populate this dashboard
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Revenue"    value={metrics.revenue}   change={metrics.revenueChange}   icon={DollarSign} />
        <MetricCard title="Expenses"   value={metrics.expenses}  change={metrics.expensesChange}  icon={TrendingUp} />
        <MetricCard title="Net Profit" value={metrics.profit}    change={metrics.profitChange}    icon={Target} />
        <MetricCard title="Headcount"  value={metrics.headcount} change={metrics.headcountChange} icon={Users} format="number" />
      </div>

      {!demoMode && metrics.revenue === 0 ? (
        <LiveEmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
              {revData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No data</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(v: any) => `$${(v / 1000).toFixed(0)}K`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue"  stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Department Budget Allocation</h3>
              {deptData.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No budget data</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={deptData} cx="50%" cy="50%" labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80} dataKey="value">
                      {deptData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => `$${(v / 1000).toFixed(0)}K`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm text-gray-600 mb-2">Gross Margin</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metrics.grossMargin > 0 ? `${metrics.grossMargin}%` : '—'}</span>
                  {demoMode && <span className="text-sm text-green-600">+2.3%</span>}
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${metrics.grossMargin}%` }} />
                </div>
              </div>
              <div>
                <h4 className="text-sm text-gray-600 mb-2">Burn Rate</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metrics.burnRate > 0 ? `$${(metrics.burnRate / 1000).toFixed(0)}K` : '—'}</span>
                  {demoMode && <span className="text-sm text-red-600">+5.2%</span>}
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: metrics.burnRate > 0 ? '68%' : '0%' }} />
                </div>
              </div>
              <div>
                <h4 className="text-sm text-gray-600 mb-2">Runway</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metrics.runway > 0 ? `${metrics.runway} months` : '—'}</span>
                  {demoMode && <span className="text-sm text-green-600">+3 months</span>}
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: metrics.runway > 0 ? '75%' : '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
