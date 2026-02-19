'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Play, Copy, Filter } from 'lucide-react';
import { useDataModeStore } from '@/lib/stores/dataModeStore';

export default function AccountingRules() {
  const { demoMode } = useDataModeStore();
  const [rules, setRules] = useState([
    {
      id: 1,
      name: 'AWS Infrastructure Categorization',
      type: 'expenseClassification',
      priority: 10,
      conditions: [
        { field: 'vendor', operator: 'contains', value: 'Amazon Web Services' }
      ],
      actions: [
        { type: 'categorize', targetField: 'category', targetValue: 'Infrastructure' },
        { type: 'tag', targetValue: 'cloud-costs' }
      ],
      appliedCount: 245,
      lastApplied: '2024-01-20 10:30 AM',
      isActive: true
    },
    {
      id: 2,
      name: 'SaaS Subscription Recognition',
      type: 'revenueRecognition',
      priority: 9,
      conditions: [
        { field: 'description', operator: 'contains', value: 'subscription' },
        { field: 'amount', operator: 'greaterThan', value: 1000 }
      ],
      actions: [
        { type: 'categorize', targetField: 'revenueType', targetValue: 'MRR' },
        { type: 'allocate', method: 'monthly', periods: 12 }
      ],
      appliedCount: 120,
      lastApplied: '2024-01-20 09:15 AM',
      isActive: true
    },
    {
      id: 3,
      name: 'Intercompany Transaction Elimination',
      type: 'intercompanyElimination',
      priority: 15,
      conditions: [
        { field: 'isIntercompany', operator: 'equals', value: true }
      ],
      actions: [
        { type: 'eliminate', targetField: 'consolidationStatus', targetValue: 'eliminated' }
      ],
      appliedCount: 58,
      lastApplied: '2024-01-19 06:00 PM',
      isActive: true
    },
    {
      id: 4,
      name: 'Employee Expense Allocation',
      type: 'expenseClassification',
      priority: 5,
      conditions: [
        { field: 'category', operator: 'equals', value: 'Employee Expenses' }
      ],
      actions: [
        {
          type: 'allocate',
          method: 'percentage',
          allocations: [
            { department: 'Engineering', value: 60 },
            { department: 'Sales', value: 25 },
            { department: 'Operations', value: 15 }
          ]
        }
      ],
      appliedCount: 89,
      lastApplied: '2024-01-20 11:00 AM',
      isActive: false
    }
  ]);

  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);

  const ruleTypes = [
    { value: 'journalEntry', label: 'Journal Entry' },
    { value: 'expenseClassification', label: 'Expense Classification' },
    { value: 'revenueRecognition', label: 'Revenue Recognition' },
    { value: 'intercompanyElimination', label: 'Intercompany Elimination' },
    { value: 'consolidation', label: 'Consolidation' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'startsWith', label: 'Starts With' },
    { value: 'endsWith', label: 'Ends With' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' }
  ];

  const actionTypes = [
    { value: 'categorize', label: 'Categorize' },
    { value: 'tag', label: 'Add Tag' },
    { value: 'allocate', label: 'Allocate' },
    { value: 'transform', label: 'Transform' },
    { value: 'eliminate', label: 'Eliminate' },
    { value: 'reject', label: 'Reject' }
  ];

  const testRule = (rule: any) => {
    // Simulate testing the rule
    setTestResults({
      ruleId: rule.id,
      matches: 15,
      samples: [
        { transaction: 'AWS Invoice #12345', result: 'Matched - Categorized as Infrastructure' },
        { transaction: 'Google Cloud Bill', result: 'Not Matched' },
        { transaction: 'AWS Support Charges', result: 'Matched - Tagged as cloud-costs' }
      ]
    });
  };


  if (!demoMode) return (
    <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Filter size={26} className="text-gray-300" />
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
        <div>
          <h2 className="text-2xl font-bold">Accounting Rules Engine</h2>
          <p className="text-gray-600 mt-1">Automate transaction categorization and processing</p>
        </div>
        <button
          onClick={() => setShowRuleBuilder(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus size={20} />
          Create Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active Rules</p>
          <p className="text-2xl font-bold mt-1">{rules.filter(r => r.isActive).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-2xl font-bold mt-1">
            {rules.reduce((sum, r) => sum + r.appliedCount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Rule Types</p>
          <p className="text-2xl font-bold mt-1">{new Set(rules.map(r => r.type)).size}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Last Execution</p>
          <p className="text-sm font-medium mt-1">2 minutes ago</p>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Configured Rules</h3>
            <div className="flex gap-2">
              <select className="px-3 py-1 border rounded-lg text-sm">
                <option>All Types</option>
                {ruleTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <select className="px-3 py-1 border rounded-lg text-sm">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {rules.map(rule => (
            <div key={rule.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{rule.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Priority: {rule.priority}
                    </span>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {ruleTypes.find(t => t.value === rule.type)?.label}
                    </div>

                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Conditions:</span>
                      {rule.conditions.map((condition, idx) => (
                        <span key={idx} className="ml-2 text-gray-700">
                          {condition.field} {condition.operator} "{condition.value}"
                          {idx < rule.conditions.length - 1 && ' AND '}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm">
                      <span className="font-medium text-gray-600">Actions:</span>
                      {rule.actions.map((action: any, idx) => (
                        <span key={idx} className="ml-2 text-gray-700">
                          {action.type === 'categorize' && `Set ${action.targetField} to "${action.targetValue}"`}
                          {action.type === 'tag' && `Add tag "${action.targetValue}"`}
                          {action.type === 'allocate' && `Allocate by ${action.method}`}
                          {action.type === 'eliminate' && 'Mark for elimination'}
                          {idx < rule.actions.length - 1 && ', '}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>Applied: {rule.appliedCount} times</span>
                      <span>•</span>
                      <span>Last: {rule.lastApplied}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => testRule(rule)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Test Rule"
                  >
                    <Play size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Duplicate">
                    <Copy size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Test Results</h3>
          <p className="text-sm text-gray-600 mb-4">
            Rule matched {testResults.matches} transactions in the test sample
          </p>
          <div className="space-y-2">
            {testResults.samples.map((sample: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm">{sample.transaction}</span>
                <span className={`text-sm ${
                  sample.result.includes('Matched') ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {sample.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rule Builder Modal */}
      {showRuleBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Create Accounting Rule</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Marketing Expense Classification"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    {ruleTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority (Higher runs first)</label>
                <input
                  type="number"
                  defaultValue={10}
                  min={0}
                  max={100}
                  className="w-32 px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <h4 className="font-medium mb-3">Conditions (When to apply)</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <select className="px-3 py-2 border rounded-lg">
                      <option>vendor</option>
                      <option>customer</option>
                      <option>amount</option>
                      <option>description</option>
                      <option>category</option>
                    </select>
                    <select className="px-3 py-2 border rounded-lg">
                      {operators.map(op => (
                        <option key={op.value} value={op.value}>{op.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Value"
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <button className="text-sm text-primary hover:underline">+ Add Condition</button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Actions (What to do)</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <select className="px-3 py-2 border rounded-lg">
                      {actionTypes.map(action => (
                        <option key={action.value} value={action.value}>{action.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Target Field"
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Target Value"
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <button className="text-sm text-primary hover:underline">+ Add Action</button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRuleBuilder(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Create Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}