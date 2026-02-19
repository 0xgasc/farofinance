'use client';

import { useState } from 'react';
import { FileSpreadsheet, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useDataModeStore } from '@/lib/stores/dataModeStore';

const plData = [
  { category: 'Revenue', q4_2025: 215000, q1_2026: 243000, change: 13.0 },
  { category: 'Cost of Revenue', q4_2025: -62000, q1_2026: -68000, change: 9.7 },
  { category: 'Gross Profit', q4_2025: 153000, q1_2026: 175000, change: 14.4, isBold: true },
  { category: 'Sales & Marketing', q4_2025: -95000, q1_2026: -102000, change: 7.4 },
  { category: 'R&D', q4_2025: -180000, q1_2026: -185000, change: 2.8 },
  { category: 'G&A', q4_2025: -58000, q1_2026: -62000, change: 6.9 },
  { category: 'Operating Expenses', q4_2025: -333000, q1_2026: -349000, change: 4.8, isBold: true },
  { category: 'Operating Income', q4_2025: -180000, q1_2026: -174000, change: -3.3, isBold: true },
  { category: 'Net Income', q4_2025: -180000, q1_2026: -174000, change: -3.3, isBold: true, isTotal: true },
];

const balanceSheet = [
  { category: 'Cash & Equivalents', amount: 2850000, isBold: true },
  { category: 'Accounts Receivable', amount: 42000 },
  { category: 'Other Current Assets', amount: 15000 },
  { category: 'Total Current Assets', amount: 2907000, isSubtotal: true },
  { category: 'PP&E', amount: 28000 },
  { category: 'Other Assets', amount: 12000 },
  { category: 'Total Assets', amount: 2947000, isTotal: true },
  { category: '', amount: 0 },
  { category: 'Accounts Payable', amount: 38000 },
  { category: 'Accrued Expenses', amount: 52000 },
  { category: 'Deferred Revenue', amount: 85000 },
  { category: 'Total Liabilities', amount: 175000, isSubtotal: true },
  { category: 'Common Stock', amount: 1000 },
  { category: 'Retained Earnings', amount: 2771000 },
  { category: 'Total Equity', amount: 2772000, isSubtotal: true },
  { category: 'Total Liabilities & Equity', amount: 2947000, isTotal: true },
];

const cashFlow = [
  { category: 'Net Income', amount: -174000 },
  { category: 'Depreciation', amount: 3000 },
  { category: 'Changes in Working Capital', amount: -12000 },
  { category: 'Cash from Operations', amount: -183000, isBold: true },
  { category: '', amount: 0 },
  { category: 'CapEx', amount: -8000 },
  { category: 'Cash from Investing', amount: -8000, isBold: true },
  { category: '', amount: 0 },
  { category: 'Equity Financing', amount: 0 },
  { category: 'Debt Proceeds', amount: 0 },
  { category: 'Cash from Financing', amount: 0, isBold: true },
  { category: '', amount: 0 },
  { category: 'Net Change in Cash', amount: -191000, isTotal: true },
];

export default function FinancialStatements() {
  const { demoMode } = useDataModeStore();
  const [activeTab, setActiveTab] = useState<'pl' | 'bs' | 'cf'>('pl');

  const fmt = (n: number) => {
    if (n === 0) return '-';
    const abs = Math.abs(n);
    const formatted = abs >= 1000000 ? `$${(abs / 1000000).toFixed(1)}M` : `$${(abs / 1000).toFixed(0)}K`;
    return n < 0 ? `(${formatted})` : formatted;
  };

  const tabs = [
    { id: 'pl', label: 'P&L', icon: TrendingDown },
    { id: 'bs', label: 'Balance Sheet', icon: FileSpreadsheet },
    { id: 'cf', label: 'Cash Flow', icon: TrendingUp },
  ];


  if (!demoMode) return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FileSpreadsheet size={26} className="text-gray-300" />
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Statements</h2>
          <p className="text-sm text-gray-500 mt-1">Q1 2026 (Jan - Mar 2026)</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm hover:opacity-90">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'pl' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold">Income Statement (P&L)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">Q4 2025</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">Q1 2026</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">Change %</th>
                </tr>
              </thead>
              <tbody>
                {plData.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 ${row.isTotal ? 'bg-gray-50 border-t-2 border-gray-300' : ''} ${row.isBold ? 'bg-gray-50/50' : ''}`}>
                    <td className={`px-6 py-3 ${row.isBold || row.isTotal ? 'font-semibold' : ''}`}>{row.category}</td>
                    <td className={`text-right px-6 py-3 ${row.isBold || row.isTotal ? 'font-semibold' : ''}`}>{fmt(row.q4_2025)}</td>
                    <td className={`text-right px-6 py-3 ${row.isBold || row.isTotal ? 'font-semibold' : ''}`}>{fmt(row.q1_2026)}</td>
                    <td className={`text-right px-6 py-3 ${row.change > 0 ? 'text-green-600' : row.change < 0 ? 'text-red-500' : ''}`}>
                      {row.change > 0 ? '+' : ''}{row.change.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bs' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold">Balance Sheet</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Account</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {balanceSheet.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 ${row.isTotal ? 'bg-gray-50 border-t-2 border-gray-300' : ''} ${row.isSubtotal ? 'bg-gray-50/50 border-t border-gray-200' : ''} ${row.amount === 0 ? 'h-4' : ''}`}>
                    <td className={`px-6 py-3 ${row.isBold || row.isSubtotal || row.isTotal ? 'font-semibold' : ''}`}>{row.category}</td>
                    <td className={`text-right px-6 py-3 ${row.isBold || row.isSubtotal || row.isTotal ? 'font-semibold' : ''}`}>{fmt(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'cf' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold">Statement of Cash Flows</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-medium text-gray-600">Category</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {cashFlow.map((row, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 ${row.isTotal ? 'bg-gray-50 border-t-2 border-gray-300' : ''} ${row.isBold ? 'bg-gray-50/50 border-t border-gray-200' : ''} ${row.amount === 0 ? 'h-4' : ''}`}>
                    <td className={`px-6 py-3 ${row.isBold || row.isTotal ? 'font-semibold' : ''}`}>{row.category}</td>
                    <td className={`text-right px-6 py-3 ${row.isBold || row.isTotal ? 'font-semibold' : ''} ${row.amount < 0 ? 'text-red-500' : row.amount > 0 ? 'text-green-600' : ''}`}>{fmt(row.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
