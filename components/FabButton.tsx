import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '@/store/themeStore';
import { lightColors, darkColors } from '@/theme/colors';

interface FabButtonProps {
  onPress: () => void;
}

export const FabButton: React.FC<FabButtonProps> = ({ onPress }) => {
  const { colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        {
          backgroundColor: colors.primary,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="add" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 24,
    right: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

