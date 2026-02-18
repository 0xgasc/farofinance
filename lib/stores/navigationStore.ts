import { create } from 'zustand';

type View = 'dashboard' | 'models' | 'budgets' | 'scenarios' | 'metrics' |
  'integrations' | 'entities' | 'rules' | 'runway' | 'cashflow' |
  'saas-metrics' | 'hiring' | 'fundraising' | 'reports' | 'statements' |
  'investor-dashboard' | 'settings';

interface NavigationState {
  activeView: View;
  sidebarOpen: boolean;
  setActiveView: (view: View) => void;
  toggleSidebar: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeView: 'dashboard',
  sidebarOpen: true,
  setActiveView: (activeView) => set({ activeView }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
