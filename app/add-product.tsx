import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { InputField, Button } from '@/components';
import { createProduct, getAllCategories } from '@/db/productService';
import { useThemeStore } from '@/store/themeStore';
import { lightColors, darkColors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { colorScheme } = useThemeStore();
  const colors = colorScheme === 'light' ? lightColors : darkColors;

  useEffect(() => {
    loadCategories();
    requestImagePermission();
  }, []);

  const requestImagePermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions');
      }
    }
  };

  const loadCategories = async () => {
    try {
      const dbCategories = await getAllCategories();
      setCategories(dbCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    if (!name || !price || !stock || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      Alert.alert('Error', 'Please enter a valid stock number');
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        name,
        price: priceNum,
        stock: stockNum,
        category,
        imageUri,
      });

      Alert.alert('Success', 'Product added successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Add Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <TouchableOpacity
        style={[
          styles.imageContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={pickImage}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera-outline" size={40} color={colors.textSecondary} />
            <Text style={[styles.imagePlaceholderText, { color: colors.textSecondary }]}>
              Tap to add image
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <InputField
        label="Product Name"
        placeholder="Enter product name"
        value={name}
        onChangeText={setName}
      />

      <InputField
        label="Price"
        placeholder="Enter price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <InputField
        label="Stock"
        placeholder="Enter stock quantity"
        value={stock}
        onChangeText={setStock}
        keyboardType="number-pad"
      />

      <View style={styles.categoryContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Category</Text>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              { color: category ? colors.text : colors.textSecondary },
            ]}
          >
            {category || 'Select category'}
          </Text>
          <Ionicons
            name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {showCategoryDropdown && (
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={styles.dropdownItem}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Button
        title="SAVE"
        onPress={handleSave}
        loading={loading}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  categoryButton: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryButtonText: {
    fontSize: 16,
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});

