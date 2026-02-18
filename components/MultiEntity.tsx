'use client';

import { useState } from 'react';
import { Building2, Plus, ChevronRight, Globe, DollarSign, Percent, Edit2, Trash2 } from 'lucide-react';

export default function MultiEntity() {
  const [entities, setEntities] = useState([
    {
      id: 1,
      name: 'Faro Finance Inc.',
      code: 'FS-US',
      type: 'subsidiary',
      country: 'United States',
      currency: 'USD',
      parent: null,
      ownership: 100,
      consolidationMethod: 'full',
      revenue: 5200000,
      expenses: 3800000,
      headcount: 45,
      integrations: ['QuickBooks', 'Gusto']
    },
    {
      id: 2,
      name: 'Faro Finance Europe GmbH',
      code: 'FS-EU',
      type: 'subsidiary',
      country: 'Germany',
      currency: 'EUR',
      parent: 'FS-US',
      ownership: 100,
      consolidationMethod: 'full',
      revenue: 2100000,
      expenses: 1600000,
      headcount: 18,
      integrations: ['Xero']
    },
    {
      id: 3,
      name: 'Faro Finance APAC Pte Ltd',
      code: 'FS-SG',
      type: 'subsidiary',
      country: 'Singapore',
      currency: 'SGD',
      parent: 'FS-US',
      ownership: 80,
      consolidationMethod: 'proportional',
      revenue: 1500000,
      expenses: 1100000,
      headcount: 12,
      integrations: []
    },
    {
      id: 4,
      name: 'Engineering Cost Center',
      code: 'CC-ENG',
      type: 'costCenter',
      country: 'United States',
      currency: 'USD',
      parent: 'FS-US',
      ownership: 100,
      consolidationMethod: 'full',
      revenue: 0,
      expenses: 850000,
      headcount: 15,
      integrations: []
    }
  ]);

  const [selectedEntity, setSelectedEntity] = useState(entities[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConsolidation, setShowConsolidation] = useState(false);

  const totalRevenue = entities.reduce((sum, e) => sum + e.revenue, 0);
  const totalExpenses = entities.reduce((sum, e) => sum + e.expenses, 0);
  const totalHeadcount = entities.reduce((sum, e) => sum + e.headcount, 0);

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'subsidiary':
        return <Building2 className="text-blue-500" size={16} />;
      case 'division':
        return <Globe className="text-green-500" size={16} />;
      case 'costCenter':
        return <DollarSign className="text-orange-500" size={16} />;
      default:
        return <Building2 className="text-gray-500" size={16} />;
    }
  };

  const renderEntityTree = (parentId: string | null = null, level: number = 0) => {
    return entities
      .filter(e => e.parent === parentId)
      .map(entity => (
        <div key={entity.id}>
          <div
            className={`flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer ${
              selectedEntity.id === entity.id ? 'bg-blue-50' : ''
            }`}
            style={{ paddingLeft: `${level * 24 + 12}px` }}
            onClick={() => setSelectedEntity(entity)}
          >
            {getEntityIcon(entity.type)}
            <span className="font-medium">{entity.name}</span>
            <span className="text-sm text-gray-500">({entity.code})</span>
            {entity.ownership < 100 && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {entity.ownership}%
              </span>
            )}
          </div>
          {renderEntityTree(entity.code, level + 1)}
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Entity Management</h2>
          <p className="text-gray-600 mt-1">Manage subsidiaries, divisions, and cost centers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConsolidation(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Percent size={18} />
            Consolidation Rules
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            <Plus size={20} />
            Add Entity
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Entities</p>
          <p className="text-2xl font-bold mt-1">{entities.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Consolidated Revenue</p>
          <p className="text-2xl font-bold mt-1">${(totalRevenue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Consolidated Expenses</p>
          <p className="text-2xl font-bold mt-1">${(totalExpenses / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Headcount</p>
          <p className="text-2xl font-bold mt-1">{totalHeadcount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entity Tree */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Entity Structure</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {renderEntityTree()}
            </div>
          </div>
        </div>

        {/* Entity Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedEntity.name}</h3>
                <p className="text-gray-600 mt-1">{selectedEntity.code}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-red-600">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Entity Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="capitalize">{selectedEntity.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span>{selectedEntity.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span>{selectedEntity.currency}</span>
                  </div>
                  {selectedEntity.parent && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parent:</span>
                      <span>{selectedEntity.parent}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Consolidation Settings</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ownership:</span>
                    <span>{selectedEntity.ownership}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="capitalize">{selectedEntity.consolidationMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Intercompany:</span>
                    <span>Eliminated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Financial Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-lg font-semibold">${(selectedEntity.revenue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Expenses</p>
                  <p className="text-lg font-semibold">${(selectedEntity.expenses / 1000000).toFixed(1)}M</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Headcount</p>
                  <p className="text-lg font-semibold">{selectedEntity.headcount}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Connected Integrations</h4>
              {selectedEntity.integrations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedEntity.integrations.map(integration => (
                    <span key={integration} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {integration}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No integrations connected</p>
              )}
              <button className="mt-3 text-sm text-primary hover:underline">
                + Connect Integration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Consolidation Rules Modal */}
      {showConsolidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Consolidation Rules</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Intercompany Eliminations</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Eliminate intercompany revenue/expenses</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Eliminate intercompany receivables/payables</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Eliminate unrealized profit on inventory</span>
                  </label>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Currency Conversion</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Base Currency</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Exchange Rate Source</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                      <option>Average Rate (P&L)</option>
                      <option>Closing Rate (Balance Sheet)</option>
                      <option>Historical Rate</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Minority Interest</h4>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Calculate and display minority interest for partial ownership</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConsolidation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Save Rules
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}