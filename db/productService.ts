import { getDatabase } from './database';
import { Product, ProductInput } from '@/types';

export const getAllProducts = async (): Promise<Product[]> => {
  const db = getDatabase();
  const products = await db.getAllAsync<Product>(
    'SELECT * FROM products ORDER BY id DESC'
  );
  return products;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const db = getDatabase();
  const products = await db.getAllAsync<Product>(
    'SELECT * FROM products WHERE category = ? ORDER BY id DESC',
    [category]
  );
  return products;
};

export const getProductById = async (id: number): Promise<Product | null> => {
  const db = getDatabase();
  const product = await db.getFirstAsync<Product>(
    'SELECT * FROM products WHERE id = ?',
    [id]
  );
  return product || null;
};

export const createProduct = async (product: ProductInput): Promise<number> => {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO products (name, price, stock, category, imageUri) VALUES (?, ?, ?, ?, ?)',
    [product.name, product.price, product.stock, product.category, product.imageUri]
  );
  return result.lastInsertRowId;
};

export const updateProductStock = async (id: number, stock: number): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE products SET stock = ? WHERE id = ?',
    [stock, id]
  );
};

export const updateProduct = async (id: number, product: ProductInput): Promise<void> => {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE products SET name = ?, price = ?, stock = ?, category = ?, imageUri = ? WHERE id = ?',
    [product.name, product.price, product.stock, product.category, product.imageUri, id]
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  const db = getDatabase();
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
};

export const getAllCategories = async (): Promise<string[]> => {
  const db = getDatabase();
  const categories = await db.getAllAsync<{ category: string }>(
    'SELECT DISTINCT category FROM products ORDER BY category'
  );
  return categories.map((c: { category: string }) => c.category);
};

