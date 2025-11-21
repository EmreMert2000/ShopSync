import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Product } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { lightColors, darkColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: colors.shadow,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {product.imageUri ? (
        <Image
          source={{ uri: product.imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            { backgroundColor: colors.surface },
          ]}
        >
          <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={[styles.category, { color: colors.textSecondary }]}>
          {product.category}
        </Text>
        <Text style={[styles.stock, { color: colors.primary }]}>
          {product.stock} stock
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={24}
        color={colors.textSecondary}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    marginBottom: 4,
  },
  stock: {
    fontSize: 14,
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
});

