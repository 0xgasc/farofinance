import { create } from 'zustand';

interface Driver {
  name: string;
  value: number;
  unit: string;
  category: 'revenue' | 'expense' | 'headcount' | 'custom';
  formula?: string;
  dependencies?: string[];
}

interface Scenario {
  name: string;
  description: string;
  drivers: Driver[];
  assumptions: Record<string, any>;
}

interface FinancialModel {
  _id: string;
  name: string;
  description: string;
  organization: string;
  drivers: Driver[];
  scenarios: Scenario[];
  dimensions: { name: string; values: string[] }[];
  timeRange: {
    start: string;
    end: string;
    granularity: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  };
  createdAt: string;
  updatedAt: string;
}

interface ModelState {
  models: FinancialModel[];
  selectedModel: FinancialModel | null;
  isLoading: boolean;
  error: string | null;
  fetchModels: () => Promise<void>;
  createModel: (model: Partial<FinancialModel>) => Promise<FinancialModel | null>;
  updateModel: (id: string, data: Partial<FinancialModel>) => Promise<void>;
  deleteModel: (id: string) => Promise<void>;
  selectModel: (model: FinancialModel | null) => void;
}

export const useModelStore = create<ModelState>((set, get) => ({
  models: [],
  selectedModel: null,
  isLoading: false,
  error: null,

  fetchModels: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/models');
      if (!res.ok) throw new Error('Failed to fetch models');
      const models = await res.json();
      set({ models, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createModel: async (model) => {
    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(model),
      });
      if (!res.ok) throw new Error('Failed to create model');
      const newModel = await res.json();
      set((state) => ({ models: [newModel, ...state.models] }));
      return newModel;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateModel: async (id, data) => {
    try {
      const res = await fetch(`/api/models/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update model');
      const updated = await res.json();
      set((state) => ({
        models: state.models.map((m) => (m._id === id ? updated : m)),
        selectedModel: state.selectedModel?._id === id ? updated : state.selectedModel,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteModel: async (id) => {
    try {
      const res = await fetch(`/api/models/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete model');
      set((state) => ({
        models: state.models.filter((m) => m._id !== id),
        selectedModel: state.selectedModel?._id === id ? null : state.selectedModel,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  selectModel: (model) => set({ selectedModel: model }),
}));
