'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Check, X, Download, Upload, Loader2, FolderOpen } from 'lucide-react';
import { downloadCSV } from '@/lib/utils/csvExport';
import CSVImporter from '@/components/CSVImporter';
import { useDataModeStore } from '@/lib/stores/dataModeStore';
import { useBudgetStore } from '@/lib/stores/budgetStore';

const DEMO_BUDGETS = [
  { id: 1, category: 'Engineering',  subcategory: 'Salaries',     planned: 350000, actual: 325000, period: 'Q1 2024' },
  { id: 2, category: 'Marketing',    subcategory: 'Advertising',  planned: 50000,  actual: 58000,  period: 'Q1 2024' },
  { id: 3, category: 'Sales',        subcategory: 'Commissions',  planned: 75000,  actual: 82000,  period: 'Q1 2024' },
  { id: 4, category: 'Operations',   subcategory: 'Software',     planned: 25000,  actual: 23000,  period: 'Q1 2024' },
];

type BudgetRow = { id: string | number; category: string; subcategory?: string; planned: number; actual: number; period: string };

export default function BudgetManager() {
  const { demoMode } = useDataModeStore();
  const { budgets: liveBudgets, isLoading, fetchBudgets } = useBudgetStore();

  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [importerOpen, setImporterOpen] = useState(false);

  useEffect(() => {
    if (!demoMode) fetchBudgets();
  }, [demoMode]);

  // Flatten live budget items from the Budget documents into a flat row list
  const flatLiveRows: BudgetRow[] = liveBudgets.flatMap((b: any) =>
    (b.items ?? []).map((item: any, i: number) => ({
      id: `${b._id}-${i}`,
      category: item.category,
      subcategory: item.subcategory,
      planned: item.planned,
      actual: item.actual,
      period: item.period || b.name,
    }))
  );

  const budgets: BudgetRow[] = demoMode ? DEMO_BUDGETS : flatLiveRows;

  const totalPlanned = budgets.reduce((sum, b) => sum + b.planned, 0);
  const totalActual  = budgets.reduce((sum, b) => sum + b.actual, 0);
  const totalVariance = totalActual - totalPlanned;

  const handleEdit = (budget: BudgetRow) => {
    if (!demoMode) return; // live editing not wired yet
    setEditingId(budget.id);
    setEditingBudget({ ...budget });
  };

  const handleSave = () => {
    setEditingId(null);
    setEditingBudget(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingBudget(null);
  };

  const getVarianceColor = (actual: number, planned: number) => {
    const v = actual - planned;
    if (v > 0) return 'text-red-600';
    if (v < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  const handleExport = () => {
    downloadCSV('faro-budgets',
      ['category', 'subcategory', 'planned', 'actual', 'variance', 'period'],
      budgets.map(b => [b.category, b.subcategory ?? '', b.planned, b.actual, b.actual - b.planned, b.period])
    );
  };

  const EmptyState = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FolderOpen size={26} className="text-gray-300" />
      </div>
      <h3 className="font-semibold text-gray-700 mb-1">No budgets yet</h3>
      <p className="text-sm text-gray-400 mb-5 max-w-xs mx-auto">
        Import a CSV to populate your budget data, or switch back to demo mode to explore.
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
  );

  return (
    <div className="space-y-6">
      <CSVImporter isOpen={importerOpen} onClose={() => { setImporterOpen(false); if (!demoMode) fetchBudgets(); }} initialType="budgets" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <div className="flex items-center gap-2">
          {budgets.length > 0 && (
            <button
              onClick={handleExport}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
            >
              <Download size={15} />
              Export
            </button>
          )}
          <button
            onClick={() => setImporterOpen(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
          >
            <Upload size={15} />
            Import
          </button>
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 text-sm">
            <Plus size={16} />
            New Budget Item
          </button>
        </div>
      </div>

      {isLoading && !demoMode ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-300" />
        </div>
      ) : !demoMode && budgets.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">Total Planned</h3>
              <p className="text-2xl font-bold">${totalPlanned.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">Total Actual</h3>
              <p className="text-2xl font-bold">${totalActual.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h3 className="text-sm text-gray-600 mb-2">Total Variance</h3>
              <p className={`text-2xl font-bold ${totalVariance > 0 ? 'text-red-600' : totalVariance < 0 ? 'text-green-600' : 'text-gray-600'}`}>
                {totalVariance > 0 ? '+' : totalVariance < 0 ? '-' : ''}${Math.abs(totalVariance).toLocaleString()}
                {totalPlanned > 0 && (
                  <span className="text-sm ml-2">({((totalVariance / totalPlanned) * 100).toFixed(1)}%)</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Budget Items</h3>
              {demoMode && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded-full">Sample data</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 font-medium text-gray-700">Category</th>
                    <th className="text-left p-4 font-medium text-gray-700">Subcategory</th>
                    <th className="text-right p-4 font-medium text-gray-700">Planned</th>
                    <th className="text-right p-4 font-medium text-gray-700">Actual</th>
                    <th className="text-right p-4 font-medium text-gray-700">Variance</th>
                    <th className="text-right p-4 font-medium text-gray-700">% Diff</th>
                    {demoMode && <th className="text-center p-4 font-medium text-gray-700">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget) => {
                    const variance = budget.actual - budget.planned;
                    const varPct = budget.planned > 0 ? (variance / budget.planned * 100).toFixed(1) : '0.0';
                    return (
                      <tr key={budget.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          {editingId === budget.id ? (
                            <input type="text" value={editingBudget.category}
                              onChange={(e) => setEditingBudget({ ...editingBudget, category: e.target.value })}
                              className="px-2 py-1 border rounded text-sm" />
                          ) : budget.category}
                        </td>
                        <td className="p-4">
                          {editingId === budget.id ? (
                            <input type="text" value={editingBudget.subcategory ?? ''}
                              onChange={(e) => setEditingBudget({ ...editingBudget, subcategory: e.target.value })}
                              className="px-2 py-1 border rounded text-sm" />
                          ) : (budget.subcategory ?? '—')}
                        </td>
                        <td className="p-4 text-right">
                          {editingId === budget.id ? (
                            <input type="number" value={editingBudget.planned}
                              onChange={(e) => setEditingBudget({ ...editingBudget, planned: parseFloat(e.target.value) })}
                              className="px-2 py-1 border rounded w-24 text-right text-sm" />
                          ) : `$${budget.planned.toLocaleString()}`}
                        </td>
                        <td className="p-4 text-right">
                          {editingId === budget.id ? (
                            <input type="number" value={editingBudget.actual}
                              onChange={(e) => setEditingBudget({ ...editingBudget, actual: parseFloat(e.target.value) })}
                              className="px-2 py-1 border rounded w-24 text-right text-sm" />
                          ) : `$${budget.actual.toLocaleString()}`}
                        </td>
                        <td className={`p-4 text-right ${getVarianceColor(budget.actual, budget.planned)}`}>
                          {variance >= 0 ? '+' : '-'}${Math.abs(variance).toLocaleString()}
                        </td>
                        <td className={`p-4 text-right ${getVarianceColor(budget.actual, budget.planned)}`}>
                          {variance >= 0 ? '+' : ''}{varPct}%
                        </td>
                        {demoMode && (
                          <td className="p-4">
                            <div className="flex justify-center gap-2">
                              {editingId === budget.id ? (
                                <>
                                  <button onClick={handleSave} className="text-green-600 hover:text-green-800"><Check size={18} /></button>
                                  <button onClick={handleCancel} className="text-red-600 hover:text-red-800"><X size={18} /></button>
                                </>
                              ) : (
                                <button onClick={() => handleEdit(budget)} className="text-gray-400 hover:text-gray-700"><Edit2 size={16} /></button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
