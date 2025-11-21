import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

const AUTH_STORAGE_KEY = '@shopsync_auth';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: async (email: string, password: string) => {
    // Mock login - in real app, validate credentials
    const user = { email };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  register: async (email: string, password: string) => {
    // Mock register - in real app, create user account
    const user = { email };
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },
  
  logout: async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    set({ isAuthenticated: false, user: null });
  },
  
  initializeAuth: async () => {
    try {
      const saved = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const user = JSON.parse(saved);
        set({ isAuthenticated: true, user });
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    }
  },
}));

