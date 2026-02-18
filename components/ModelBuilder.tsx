'use client';

import { useState } from 'react';
import { Plus, Save, Play, Edit2, Trash2 } from 'lucide-react';

export default function ModelBuilder() {
  const [models, setModels] = useState([
    { id: 1, name: 'Revenue Forecast 2024', status: 'active', lastModified: '2024-01-15' },
    { id: 2, name: 'Expansion Model - Series B', status: 'draft', lastModified: '2024-01-10' },
  ]);

  const [selectedModel, setSelectedModel] = useState<any>(null);
  const [drivers, setDrivers] = useState([
    { name: 'Monthly Recurring Revenue', value: 100000, unit: '$', category: 'revenue' },
    { name: 'Customer Growth Rate', value: 15, unit: '%', category: 'revenue' },
    { name: 'Churn Rate', value: 5, unit: '%', category: 'revenue' },
    { name: 'Average Contract Value', value: 25000, unit: '$', category: 'revenue' },
  ]);

  const [showNewDriverForm, setShowNewDriverForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    value: 0,
    unit: '$',
    category: 'revenue'
  });

  const handleAddDriver = () => {
    setDrivers([...drivers, { ...newDriver }]);
    setNewDriver({ name: '', value: 0, unit: '$', category: 'revenue' });
    setShowNewDriverForm(false);
  };

  const handleDeleteDriver = (index: number) => {
    setDrivers(drivers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Models</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
          <Plus size={20} />
          New Model
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold">Your Models</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {models.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedModel?.id === model.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Modified: {model.lastModified}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        model.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {model.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {selectedModel ? (
            <>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">{selectedModel.name}</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Save size={18} />
                    </button>
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                      <Play size={18} />
                      Run Model
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Model Drivers</h4>
                      <button
                        onClick={() => setShowNewDriverForm(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Add Driver
                      </button>
                    </div>

                    {showNewDriverForm && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Driver name"
                            value={newDriver.name}
                            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <input
                            type="number"
                            placeholder="Value"
                            value={newDriver.value}
                            onChange={(e) => setNewDriver({ ...newDriver, value: parseFloat(e.target.value) })}
                            className="px-3 py-2 border rounded-lg"
                          />
                          <select
                            value={newDriver.category}
                            onChange={(e) => setNewDriver({ ...newDriver, category: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                          >
                            <option value="revenue">Revenue</option>
                            <option value="expense">Expense</option>
                            <option value="headcount">Headcount</option>
                            <option value="custom">Custom</option>
                          </select>
                          <select
                            value={newDriver.unit}
                            onChange={(e) => setNewDriver({ ...newDriver, unit: e.target.value })}
                            className="px-3 py-2 border rounded-lg"
                          >
                            <option value="$">$</option>
                            <option value="%">%</option>
                            <option value="#">#</option>
                          </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            onClick={() => setShowNewDriverForm(false)}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddDriver}
                            className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {drivers.map((driver, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium">{driver.name}</span>
                            <span className="ml-2 text-sm text-gray-500">({driver.category})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={driver.value}
                              onChange={(e) => {
                                const newDrivers = [...drivers];
                                newDrivers[index].value = parseFloat(e.target.value);
                                setDrivers(newDrivers);
                              }}
                              className="w-24 px-2 py-1 border rounded text-right"
                            />
                            <span className="text-gray-600 w-8">{driver.unit}</span>
                            <button
                              onClick={() => handleDeleteDriver(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Model Output Preview</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Projected Annual Revenue</p>
                          <p className="text-2xl font-bold">${(drivers[0].value * 12).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Net New Customers</p>
                          <p className="text-2xl font-bold">
                            {Math.round((drivers[0].value / drivers[3].value) * (1 + drivers[1].value / 100))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-500">Select a model to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}