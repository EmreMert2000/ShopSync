import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '@/store/themeStore';
import { lightColors, darkColors } from '@/theme/colors';

export default function RootLayout() {
  const { colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-product"
          options={{
            presentation: 'modal',
            headerShown: true,
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            title: 'Add Product',
          }}
        />
        <Stack.Screen
          name="product-detail"
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}

