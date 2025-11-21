import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components';
import { getProductById, updateProductStock } from '@/db/productService';
import { Product } from '@/types';
import { useThemeStore } from '@/store/themeStore';
import { lightColors, darkColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  // Force dark theme for this screen
  const screenColors = darkColors;

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;

    try {
      const productData = await getProductById(parseInt(id, 10));
      if (productData) {
        setProduct(productData);
        setStock(productData.stock);
      } else {
        Alert.alert('Error', 'Product not found', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      Alert.alert('Error', 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const adjustStock = (delta: number) => {
    const newStock = Math.max(0, stock + delta);
    setStock(newStock);
  };

  const handleUpdate = async () => {
    if (!product) return;

    setSaving(true);

    try {
      await updateProductStock(product.id, stock);
      Alert.alert('Success', 'Stock updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating stock:', error);
      Alert.alert('Error', 'Failed to update stock');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (product) {
      setStock(product.stock);
    }
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={screenColors.primary} />
        </View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: screenColors.background }]}>
        <View style={styles.center}>
          <Text style={[styles.errorText, { color: screenColors.text }]}>
            Product not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={28} color={screenColors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {product.imageUri ? (
          <Image source={{ uri: product.imageUri }} style={styles.image} />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: screenColors.surface },
            ]}
          >
            <Ionicons
              name="image-outline"
              size={60}
              color={screenColors.textSecondary}
            />
          </View>
        )}

        <Text style={[styles.productName, { color: screenColors.text }]}>
          {product.name}
        </Text>
        <Text style={[styles.category, { color: screenColors.textSecondary }]}>
          {product.category}
        </Text>
        <Text style={[styles.price, { color: screenColors.primary }]}>
          ${product.price.toFixed(2)}
        </Text>

        <View style={styles.stockSection}>
          <Text style={[styles.stockLabel, { color: screenColors.text }]}>
            Current stock:
          </Text>
          <Text style={[styles.stockValue, { color: screenColors.text }]}>
            {stock}
          </Text>
        </View>

        <View style={styles.stockAdjuster}>
          <TouchableOpacity
            style={[
              styles.adjustButton,
              { backgroundColor: screenColors.surface },
            ]}
            onPress={() => adjustStock(-25)}
            activeOpacity={0.7}
          >
            <Text style={[styles.adjustButtonText, { color: screenColors.text }]}>
              – 25
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.adjustButton,
              { backgroundColor: screenColors.surface },
            ]}
            onPress={() => adjustStock(-1)}
            activeOpacity={0.7}
          >
            <Text style={[styles.adjustButtonText, { color: screenColors.text }]}>
              – 1
            </Text>
          </TouchableOpacity>

          <View style={[styles.stockDisplay, { backgroundColor: screenColors.surface }]}>
            <Text style={[styles.stockDisplayText, { color: screenColors.text }]}>
              {stock}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.adjustButton,
              { backgroundColor: screenColors.surface },
            ]}
            onPress={() => adjustStock(1)}
            activeOpacity={0.7}
          >
            <Text style={[styles.adjustButtonText, { color: screenColors.text }]}>
              + 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.adjustButton,
              { backgroundColor: screenColors.surface },
            ]}
            onPress={() => adjustStock(25)}
            activeOpacity={0.7}
          >
            <Text style={[styles.adjustButtonText, { color: screenColors.text }]}>
              + 25
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="CANCEL"
          onPress={handleCancel}
          variant="outline"
          style={[styles.footerButton, { borderColor: screenColors.border }]}
          textStyle={{ color: screenColors.text }}
        />
        <Button
          title="UPDATE"
          onPress={handleUpdate}
          loading={saving}
          style={styles.footerButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 24,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  category: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  stockSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stockLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  stockValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  stockAdjuster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  adjustButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  stockDisplay: {
    width: 80,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockDisplayText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  footerButton: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
  },
});

