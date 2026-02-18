import { create } from 'zustand';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  organizationId: string;
  role: 'admin' | 'editor' | 'viewer' | 'investor';
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
