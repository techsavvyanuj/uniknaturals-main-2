"use client";

import { useEffect, useState } from 'react';
import { fetchMyOrders } from '@/app/api/orderHistoryApi';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use userAuth for user orders, not adminAuth
    const token = localStorage.getItem('userAuth');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    fetchMyOrders(token)
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container py-16 text-center">Loading orders...</div>;
  if (error) return <div className="container py-16 text-center text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order._id}>
                <td className="py-3 px-4">{order._id}</td>
                <td className="py-3 px-4">₹{order.total}</td>
                <td className="py-3 px-4">{order.status || 'Placed'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
