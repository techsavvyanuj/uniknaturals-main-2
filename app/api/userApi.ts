import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5005/api';

export const fetchUserProfile = async (token: string) => {
  const res = await axios.get(`${API_BASE}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchWishlist = async (token: string) => {
  const res = await axios.get(`${API_BASE}/users/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const addToWishlist = async (productId: string, token: string) => {
  const res = await axios.post(`${API_BASE}/users/wishlist`, { productId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const removeFromWishlist = async (productId: string, token: string) => {
  const res = await axios.delete(`${API_BASE}/users/wishlist/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
