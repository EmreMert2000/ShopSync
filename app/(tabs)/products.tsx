import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { ProductCard, FabButton, CategoryTabs } from '@/components';
import { Product } from '@/types';
import {
  getAllProducts,
  getProductsByCategory,
  getAllCategories,
} from '@/db/productService';
import { useThemeStore } from '@/store/themeStore';
import { lightColors, darkColors } from '@/theme/colors';

const ALL_CATEGORY = 'All';

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([ALL_CATEGORY]);
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  const loadProducts = async () => {
    try {
      let fetchedProducts: Product[];
      if (selectedCategory === ALL_CATEGORY) {
        fetchedProducts = await getAllProducts();
      } else {
        fetchedProducts = await getProductsByCategory(selectedCategory);
      }
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadCategories = async () => {
    try {
      const dbCategories = await getAllCategories();
      setCategories([ALL_CATEGORY, ...dbCategories]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setLoading(true);
    loadProducts();
  }, [selectedCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
    loadCategories();
  };

  const handleProductPress = (product: Product) => {
    router.push({
      pathname: '/product-detail',
      params: { id: product.id.toString() },
    });
  };

  const handleAddProduct = () => {
    router.push('/add-product');
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {products.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No products found
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => handleProductPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <FabButton onPress={handleAddProduct} />
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
  listContent: {
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 16,
  },
});

