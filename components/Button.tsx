import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { lightColors, darkColors } from '@/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  const getButtonStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: colors.surface,
      };
    }
    return {
      backgroundColor: colors.primary,
    };
  };

  const getTextStyle = (): TextStyle => {
    if (variant === 'outline') {
      return { color: colors.primary };
    }
    if (variant === 'secondary') {
      return { color: colors.text };
    }
    return { color: '#FFFFFF' };
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : colors.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

