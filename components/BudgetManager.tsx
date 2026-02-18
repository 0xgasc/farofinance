'use client';

import { useState } from 'react';
import { Plus, Edit2, Check, X } from 'lucide-react';

export default function BudgetManager() {
  const [budgets, setBudgets] = useState([
    {
      id: 1,
      category: 'Engineering',
      subcategory: 'Salaries',
      planned: 350000,
      actual: 325000,
      variance: -25000,
      period: 'Q1 2024'
    },
    {
      id: 2,
      category: 'Marketing',
      subcategory: 'Advertising',
      planned: 50000,
      actual: 58000,
      variance: 8000,
      period: 'Q1 2024'
    },
    {
      id: 3,
      category: 'Sales',
      subcategory: 'Commissions',
      planned: 75000,
      actual: 82000,
      variance: 7000,
      period: 'Q1 2024'
    },
    {
      id: 4,
      category: 'Operations',
      subcategory: 'Software',
      planned: 25000,
      actual: 23000,
      variance: -2000,
      period: 'Q1 2024'
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const totalPlanned = budgets.reduce((sum, b) => sum + b.planned, 0);
  const totalActual = budgets.reduce((sum, b) => sum + b.actual, 0);
  const totalVariance = totalActual - totalPlanned;

  const handleEdit = (budget: any) => {
    setEditingId(budget.id);
    setEditingBudget({ ...budget });
  };

  const handleSave = () => {
    setBudgets(budgets.map(b => b.id === editingId ? editingBudget : b));
    setEditingId(null);
    setEditingBudget(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingBudget(null);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-600';
    if (variance < 0) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
          <Plus size={20} />
          New Budget Item
        </button>
      </div>

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
          <p className={`text-2xl font-bold ${getVarianceColor(totalVariance)}`}>
            {totalVariance > 0 ? '+' : ''}{totalVariance < 0 ? '-' : ''}${Math.abs(totalVariance).toLocaleString()}
            <span className="text-sm ml-2">
              ({((totalVariance / totalPlanned) * 100).toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Budget Items - Q1 2024</h3>
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
                <th className="text-center p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4">
                    {editingId === budget.id ? (
                      <input
                        type="text"
                        value={editingBudget.category}
                        onChange={(e) => setEditingBudget({ ...editingBudget, category: e.target.value })}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      budget.category
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === budget.id ? (
                      <input
                        type="text"
                        value={editingBudget.subcategory}
                        onChange={(e) => setEditingBudget({ ...editingBudget, subcategory: e.target.value })}
                        className="px-2 py-1 border rounded"
                      />
                    ) : (
                      budget.subcategory
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {editingId === budget.id ? (
                      <input
                        type="number"
                        value={editingBudget.planned}
                        onChange={(e) => setEditingBudget({ ...editingBudget, planned: parseFloat(e.target.value) })}
                        className="px-2 py-1 border rounded w-24 text-right"
                      />
                    ) : (
                      `$${budget.planned.toLocaleString()}`
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {editingId === budget.id ? (
                      <input
                        type="number"
                        value={editingBudget.actual}
                        onChange={(e) => setEditingBudget({ ...editingBudget, actual: parseFloat(e.target.value) })}
                        className="px-2 py-1 border rounded w-24 text-right"
                      />
                    ) : (
                      `$${budget.actual.toLocaleString()}`
                    )}
                  </td>
                  <td className={`p-4 text-right ${getVarianceColor(budget.variance)}`}>
                    {budget.variance > 0 ? '+' : ''}{budget.variance < 0 ? '-' : ''}
                    ${Math.abs(budget.actual - budget.planned).toLocaleString()}
                  </td>
                  <td className={`p-4 text-right ${getVarianceColor(budget.variance)}`}>
                    {((budget.actual - budget.planned) / budget.planned * 100).toFixed(1)}%
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {editingId === budget.id ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(budget)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}