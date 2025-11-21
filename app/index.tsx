import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { initDatabase } from '@/db/database';
import { lightColors, darkColors } from '@/theme/colors';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const { initializeTheme, colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  useEffect(() => {
    const initialize = async () => {
      await initDatabase();
      await initializeTheme();
      await initializeAuth();

      // Get fresh auth state after initialization
      const authState = useAuthStore.getState();
      
      // Navigate based on auth state
      if (authState.isAuthenticated) {
        router.replace('/(tabs)/products');
      } else {
        router.replace('/(auth)/login');
      }
    };

    initialize();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

