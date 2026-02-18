import { create } from 'zustand';

interface Entity {
  _id: string;
  name: string;
  code: string;
  type: 'subsidiary' | 'division' | 'department' | 'costCenter' | 'profitCenter';
  parentEntityId?: string;
  organization: string;
  currency: string;
  country: string;
  taxId?: string;
  consolidationRules: {
    eliminateIntercompany: boolean;
    consolidationMethod: 'full' | 'proportional' | 'equity';
    ownershipPercentage?: number;
  };
  accountingSettings: {
    fiscalYearEnd: string;
    accountingStandard: 'GAAP' | 'IFRS' | 'LocalGAAP';
    chartOfAccountsPrefix?: string;
  };
  integrations: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EntityState {
  entities: Entity[];
  selectedEntity: Entity | null;
  isLoading: boolean;
  error: string | null;
  fetchEntities: () => Promise<void>;
  createEntity: (entity: Partial<Entity>) => Promise<Entity | null>;
  selectEntity: (entity: Entity | null) => void;
}

export const useEntityStore = create<EntityState>((set) => ({
  entities: [],
  selectedEntity: null,
  isLoading: false,
  error: null,

  fetchEntities: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/entities');
      if (!res.ok) throw new Error('Failed to fetch entities');
      const entities = await res.json();
      set({ entities, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createEntity: async (entity) => {
    try {
      const res = await fetch('/api/entities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entity),
      });
      if (!res.ok) throw new Error('Failed to create entity');
      const newEntity = await res.json();
      set((state) => ({ entities: [...state.entities, newEntity] }));
      return newEntity;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  selectEntity: (entity) => set({ selectedEntity: entity }),
}));
