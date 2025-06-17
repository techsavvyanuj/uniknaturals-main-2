import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://uniknaturals-backend-1.onrender.com/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  salePrice?: number;
  image: string;
  slug: string;
  reviewCount?: number;
  soldOut?: boolean;
  category?: string;
  images?: string[];
  features?: string[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const res = await axios.get(`${API_BASE}/products/${slug}`);
  return res.data;
};

// Add more API functions as needed (create, update, delete, etc.)
