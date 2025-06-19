import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5005/api';

export const fetchMyOrders = async (token: string) => {
  const res = await axios.get(`${API_BASE}/orders/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchAllOrders = async (token: string) => {
  const res = await axios.get(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateOrderStatus = async (orderId: string, status: string, token: string) => {
  const res = await axios.put(`${API_BASE}/orders/${orderId}`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
