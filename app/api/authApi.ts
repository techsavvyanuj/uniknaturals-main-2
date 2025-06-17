import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://uniknaturals-backend.onrender.com/api';

export const loginAdmin = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
};

export const registerAdmin = async (name: string, email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password });
  return res.data;
};
