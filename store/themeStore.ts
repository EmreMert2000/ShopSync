import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorScheme } from '@/theme/colors';

interface ThemeState {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  initializeTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = '@shopsync_theme';

export const useThemeStore = create<ThemeState>((set) => ({
  colorScheme: 'light',
  
  setColorScheme: async (scheme: ColorScheme) => {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    set({ colorScheme: scheme });
  },
  
  toggleTheme: async () => {
    const current = useThemeStore.getState().colorScheme;
    const newScheme: ColorScheme = current === 'light' ? 'dark' : 'light';
    await useThemeStore.getState().setColorScheme(newScheme);
  },
  
  initializeTheme: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        set({ colorScheme: saved });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  },
}));

