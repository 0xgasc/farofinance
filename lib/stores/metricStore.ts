import { create } from 'zustand';

interface MetricData {
  date: string;
  value: number;
}

interface Metric {
  _id: string;
  name: string;
  category: string;
  organization: string;
  description?: string;
  unit: string;
  data: MetricData[];
  target?: number;
  comparison_period?: 'mom' | 'qoq' | 'yoy';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface MetricState {
  metrics: Metric[];
  isLoading: boolean;
  error: string | null;
  fetchMetrics: (category?: string) => Promise<void>;
  createMetric: (metric: Partial<Metric>) => Promise<Metric | null>;
  updateMetric: (id: string, data: Partial<Metric>) => Promise<void>;
  deleteMetric: (id: string) => Promise<void>;
}

export const useMetricStore = create<MetricState>((set) => ({
  metrics: [],
  isLoading: false,
  error: null,

  fetchMetrics: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const url = category ? `/api/metrics?category=${category}` : '/api/metrics';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      const metrics = await res.json();
      set({ metrics, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createMetric: async (metric) => {
    try {
      const res = await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      });
      if (!res.ok) throw new Error('Failed to create metric');
      const newMetric = await res.json();
      set((state) => ({ metrics: [newMetric, ...state.metrics] }));
      return newMetric;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateMetric: async (id, data) => {
    try {
      const res = await fetch(`/api/metrics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update metric');
      const updated = await res.json();
      set((state) => ({
        metrics: state.metrics.map((m) => (m._id === id ? updated : m)),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteMetric: async (id) => {
    try {
      const res = await fetch(`/api/metrics/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete metric');
      set((state) => ({
        metrics: state.metrics.filter((m) => m._id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
