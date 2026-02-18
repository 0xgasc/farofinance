import { create } from 'zustand';

interface BudgetItem {
  category: string;
  subcategory?: string;
  planned: number;
  actual: number;
  variance: number;
  period: string;
}

interface Budget {
  _id: string;
  name: string;
  organization: string;
  fiscal_year: number;
  items: BudgetItem[];
  total_planned: number;
  total_actual: number;
  total_variance: number;
  status: 'draft' | 'approved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface BudgetState {
  budgets: Budget[];
  selectedBudget: Budget | null;
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  createBudget: (budget: Partial<Budget>) => Promise<Budget | null>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  selectBudget: (budget: Budget | null) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: [],
  selectedBudget: null,
  isLoading: false,
  error: null,

  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/budgets');
      if (!res.ok) throw new Error('Failed to fetch budgets');
      const budgets = await res.json();
      set({ budgets, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createBudget: async (budget) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      });
      if (!res.ok) throw new Error('Failed to create budget');
      const newBudget = await res.json();
      set((state) => ({ budgets: [newBudget, ...state.budgets] }));
      return newBudget;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  updateBudget: async (id, data) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update budget');
      const updated = await res.json();
      set((state) => ({
        budgets: state.budgets.map((b) => (b._id === id ? updated : b)),
        selectedBudget: state.selectedBudget?._id === id ? updated : state.selectedBudget,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteBudget: async (id) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete budget');
      set((state) => ({
        budgets: state.budgets.filter((b) => b._id !== id),
        selectedBudget: state.selectedBudget?._id === id ? null : state.selectedBudget,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  selectBudget: (budget) => set({ selectedBudget: budget }),
}));
