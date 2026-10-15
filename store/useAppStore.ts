import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface AppState {
  theme: 'dark' | 'light' | 'system';
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  user: null,
  profile: null,
  isLoading: true,
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('vocalis_theme', theme);
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  },
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, profile: null }),
}));
