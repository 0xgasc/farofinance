import { create } from 'zustand';

interface Integration {
  _id: string;
  name: string;
  type: string;
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  organization: string;
  entityId?: string;
  config: Record<string, any>;
  fieldMappings: any[];
  dataSync: {
    lastSyncAt?: string;
    nextSyncAt?: string;
    syncFrequency: string;
    syncStatus: string;
    recordsProcessed: number;
    recordsFailed: number;
    errorMessage?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IntegrationState {
  integrations: Integration[];
  isLoading: boolean;
  isSyncing: string | null; // integration id being synced
  error: string | null;
  fetchIntegrations: (filters?: { type?: string; status?: string }) => Promise<void>;
  createIntegration: (integration: Partial<Integration>) => Promise<Integration | null>;
  syncIntegration: (id: string) => Promise<void>;
}

export const useIntegrationStore = create<IntegrationState>((set) => ({
  integrations: [],
  isLoading: false,
  isSyncing: null,
  error: null,

  fetchIntegrations: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters?.type) params.set('type', filters.type);
      if (filters?.status) params.set('status', filters.status);
      const url = `/api/integrations${params.toString() ? `?${params}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch integrations');
      const integrations = await res.json();
      set({ integrations, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createIntegration: async (integration) => {
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(integration),
      });
      if (!res.ok) throw new Error('Failed to create integration');
      const newInt = await res.json();
      set((state) => ({ integrations: [newInt, ...state.integrations] }));
      return newInt;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  syncIntegration: async (id) => {
    set({ isSyncing: id });
    try {
      const res = await fetch('/api/integrations/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId: id }),
      });
      if (!res.ok) throw new Error('Sync failed');
      set({ isSyncing: null });
    } catch (error: any) {
      set({ error: error.message, isSyncing: null });
    }
  },
}));
