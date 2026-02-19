import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DataModeState {
  demoMode: boolean;
  setDemoMode: (demo: boolean) => void;
}

export const useDataModeStore = create<DataModeState>()(
  persist(
    (set) => ({
      demoMode: true,
      setDemoMode: (demo) => set({ demoMode: demo }),
    }),
    { name: 'faro-data-mode' }
  )
);
