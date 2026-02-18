'use client';

import { useState } from 'react';
import { Plus, Settings, RefreshCw, Check, X, AlertCircle, Database, Users, CreditCard, BarChart3, Package } from 'lucide-react';

export default function Integrations() {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'QuickBooks Online',
      type: 'accounting',
      provider: 'quickbooks',
      status: 'connected',
      lastSync: '2024-01-20 10:30 AM',
      nextSync: '2024-01-21 10:30 AM',
      recordsSynced: 1250,
      entity: 'Main Company',
      icon: '📊'
    },
    {
      id: 2,
      name: 'Salesforce CRM',
      type: 'crm',
      provider: 'salesforce',
      status: 'connected',
      lastSync: '2024-01-20 09:15 AM',
      nextSync: '2024-01-20 10:15 AM',
      recordsSynced: 3420,
      entity: 'Main Company',
      icon: '☁️'
    },
    {
      id: 3,
      name: 'Stripe Payments',
      type: 'payment',
      provider: 'stripe',
      status: 'syncing',
      lastSync: '2024-01-20 11:00 AM',
      nextSync: 'In Progress',
      recordsSynced: 890,
      entity: 'US Subsidiary',
      icon: '💳'
    },
    {
      id: 4,
      name: 'Gusto Payroll',
      type: 'hris',
      provider: 'gusto',
      status: 'error',
      lastSync: '2024-01-19 08:00 PM',
      nextSync: 'Failed',
      recordsSynced: 0,
      entity: 'Main Company',
      error: 'Authentication failed',
      icon: '👥'
    },
    {
      id: 5,
      name: 'Xero Accounting',
      type: 'accounting',
      provider: 'xero',
      status: 'disconnected',
      lastSync: 'Never',
      nextSync: '-',
      recordsSynced: 0,
      entity: 'EU Subsidiary',
      icon: '📘'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMappingModal, setShowMappingModal] = useState(false);

  const integrationTypes = [
    { type: 'accounting', label: 'Accounting', icon: BarChart3, providers: ['QuickBooks', 'Xero', 'Sage', 'NetSuite'] },
    { type: 'crm', label: 'CRM', icon: Users, providers: ['Salesforce', 'HubSpot', 'Pipedrive'] },
    { type: 'hris', label: 'HRIS', icon: Users, providers: ['Gusto', 'BambooHR', 'Workday', 'ADP'] },
    { type: 'payment', label: 'Payments', icon: CreditCard, providers: ['Stripe', 'Square', 'PayPal'] },
    { type: 'dataWarehouse', label: 'Data Warehouse', icon: Database, providers: ['Snowflake', 'BigQuery', 'Redshift'] }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check className="text-green-500" size={16} />;
      case 'syncing':
        return <RefreshCw className="text-blue-500 animate-spin" size={16} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={16} />;
      case 'disconnected':
        return <X className="text-gray-400" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSync = (id: number) => {
    setIntegrations(integrations.map(i =>
      i.id === id ? { ...i, status: 'syncing' } : i
    ));

    // Simulate sync completion
    setTimeout(() => {
      setIntegrations(prev => prev.map(i =>
        i.id === id
          ? {
              ...i,
              status: 'connected',
              lastSync: new Date().toLocaleString(),
              recordsSynced: i.recordsSynced + Math.floor(Math.random() * 100)
            }
          : i
      ));
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Integrations</h2>
          <p className="text-gray-600 mt-1">Connect and sync data from your business tools</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <Plus size={20} />
          Add Integration
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Active Integrations</p>
          <p className="text-2xl font-bold mt-1">
            {integrations.filter(i => i.status === 'connected' || i.status === 'syncing').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Total Records Synced</p>
          <p className="text-2xl font-bold mt-1">
            {integrations.reduce((sum, i) => sum + i.recordsSynced, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Failed Syncs</p>
          <p className="text-2xl font-bold mt-1 text-red-600">
            {integrations.filter(i => i.status === 'error').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Entities Connected</p>
          <p className="text-2xl font-bold mt-1">
            {new Set(integrations.map(i => i.entity)).size}
          </p>
        </div>
      </div>

      {/* Integration List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Connected Integrations</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {integrations.map(integration => (
            <div key={integration.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{integration.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(integration.status)}`}>
                        {integration.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Entity: {integration.entity}</span>
                      <span>•</span>
                      <span>Last sync: {integration.lastSync}</span>
                      <span>•</span>
                      <span>Records: {integration.recordsSynced.toLocaleString()}</span>
                    </div>
                    {integration.error && (
                      <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {integration.error}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSync(integration.id)}
                    disabled={integration.status === 'syncing' || integration.status === 'disconnected'}
                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Sync Now"
                  >
                    <RefreshCw size={18} className={integration.status === 'syncing' ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={() => setShowMappingModal(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Field Mapping"
                  >
                    <Package size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedIntegration(integration)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Settings"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Mapping Modal */}
      {showMappingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Field Mapping</h3>
            <p className="text-gray-600 mb-4">Map fields from QuickBooks to your financial model</p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded">
                <div>
                  <label className="text-sm text-gray-600">Source Field (QuickBooks)</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option>Invoice.TotalAmount</option>
                    <option>Invoice.CustomerRef.name</option>
                    <option>Invoice.TxnDate</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Target Field (Faro Finance)</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option>revenue.amount</option>
                    <option>revenue.customer</option>
                    <option>revenue.date</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center p-3 bg-gray-50 rounded">
                <div>
                  <label className="text-sm text-gray-600">Source Field (QuickBooks)</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option>Bill.TotalAmt</option>
                    <option>Bill.VendorRef.name</option>
                    <option>Bill.TxnDate</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Target Field (Faro Finance)</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option>expense.amount</option>
                    <option>expense.vendor</option>
                    <option>expense.date</option>
                  </select>
                </div>
              </div>

              <button className="text-sm text-primary hover:underline">+ Add Field Mapping</button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMappingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                Save Mappings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Add New Integration</h3>

            <div className="space-y-6">
              {integrationTypes.map(type => {
                const Icon = type.icon;
                return (
                  <div key={type.type} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={20} />
                      <h4 className="font-semibold">{type.label}</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {type.providers.map(provider => (
                        <button
                          key={provider}
                          className="p-3 border rounded-lg hover:border-primary hover:bg-blue-50 text-left"
                        >
                          <p className="font-medium">{provider}</p>
                          <p className="text-xs text-gray-500 mt-1">Click to connect</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}