export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUri: string | null;
}

export interface ProductInput {
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUri: string | null;
}

