import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://uniknaturals-backend.onrender.com/api';

export const createOrder = async (order: any, token?: string) => {
  const res = await axios.post(`${API_BASE}/orders`, order, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
};
