import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://uniknaturals-backend.onrender.com';

export interface AdminProduct {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  category?: string;
  stock?: number;
  image: string;
  description: string;
  featured?: boolean;
  longDescription?: string;
  slug: string;
  reviewCount?: number;
  soldOut?: boolean;
  images?: string[];
  features?: string[];
}

export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
};

export const createProduct = async (product: Partial<AdminProduct>) => {
  const res = await axios.post(`${API_BASE}/products`, product);
  return res.data;
};

export const updateProduct = async (id: string, product: Partial<AdminProduct>) => {
  const res = await axios.put(`${API_BASE}/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/products/${id}`);
  return res.data;
};

export const fetchProductById = async (id: string): Promise<AdminProduct> => {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
};
