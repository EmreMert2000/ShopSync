import * as SQLite from 'expo-sqlite';
import { Product, ProductInput } from '@/types';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync('shopsync.db');
  
  // Create products table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      category TEXT NOT NULL,
      imageUri TEXT
    );
  `);

  // Check if we need to seed data
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM products'
  );
  
  if (result && result.count === 0) {
    await seedDatabase();
  }

  return db;
};

const seedDatabase = async () => {
  if (!db) return;

  const dummyProducts: ProductInput[] = [
    {
      name: 'Nike Air Max',
      price: 129.99,
      stock: 25,
      category: 'Clothing',
      imageUri: null,
    },
    {
      name: 'iPhone 15 Pro',
      price: 999.99,
      stock: 12,
      category: 'Electronics',
      imageUri: null,
    },
    {
      name: 'Modern Sofa',
      price: 599.99,
      stock: 8,
      category: 'Home',
      imageUri: null,
    },
    {
      name: 'Levi\'s Jeans',
      price: 79.99,
      stock: 30,
      category: 'Clothing',
      imageUri: null,
    },
    {
      name: 'MacBook Pro',
      price: 1999.99,
      stock: 5,
      category: 'Electronics',
      imageUri: null,
    },
    {
      name: 'Coffee Table',
      price: 249.99,
      stock: 15,
      category: 'Home',
      imageUri: null,
    },
  ];

  for (const product of dummyProducts) {
    await db.runAsync(
      'INSERT INTO products (name, price, stock, category, imageUri) VALUES (?, ?, ?, ?, ?)',
      [product.name, product.price, product.stock, product.category, product.imageUri]
    );
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

