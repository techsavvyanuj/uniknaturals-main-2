"use client";

import { use, useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '@/app/api/orderHistoryApi';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminAuth');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    fetchAllOrders(token)
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminAuth') || '';
      await updateOrderStatus(orderId, newStatus, token);
      setOrders(orders => orders.map(order => order._id === orderId ? { ...order, status: newStatus } : order));
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="container py-16 text-center">Loading orders...</div>;
  if (error) return <div className="container py-16 text-center text-red-600">{error}</div>;

  return (
    <div className="container py-12">
      <h1 className="text-2xl font-bold mb-6">All Orders (Admin)</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order._id}>
                <td className="py-3 px-4">{order._id}</td>
                <td className="py-3 px-4">{order.user?.email || 'Guest'}</td>
                <td className="py-3 px-4">₹{order.total}</td>
                <td className="py-3 px-4">
                  <select
                    value={order.status || 'Placed'}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="mb-2"><b>Order ID:</b> {selectedOrder._id}</div>
            <div className="mb-2"><b>User:</b> {selectedOrder.user?.email || 'Guest'}</div>
            <div className="mb-2"><b>Total:</b> ₹{selectedOrder.total}</div>
            <div className="mb-2"><b>Status:</b> {selectedOrder.status || 'Placed'}</div>
            <div className="mb-2"><b>Products:</b>
              <ul className="list-disc pl-5">
                {selectedOrder.products?.map((p: any, idx: number) => (
                  <li key={idx}>{p.product?.name || p.product} x {p.quantity}</li>
                ))}
              </ul>
            </div>
            <div className="mb-2"><b>Address:</b> {selectedOrder.address || 'N/A'}</div>
            <div className="mb-2"><b>Payment ID:</b> {selectedOrder.paymentId || 'N/A'}</div>
          </div>
        </div>
      )}
    </div>
  );
}
