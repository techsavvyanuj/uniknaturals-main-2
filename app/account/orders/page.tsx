"use client";

import { useEffect, useState } from 'react';
import { fetchMyOrders } from '@/app/api/orderHistoryApi';
import Image from 'next/image';

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
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <div className="font-semibold text-lg mb-1">Order ID: {order._id}</div>
                  {order.shiprocketOrderId && (
                    <div className="text-sage text-sm mb-1 font-semibold">Shiprocket Order ID: {order.shiprocketOrderId}</div>
                  )}
                  <div className="text-gray-600 text-sm mb-1">Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
                  <div className="text-gray-600 text-sm mb-1">Status: {order.status || 'Placed'}</div>
                  <div className="text-gray-600 text-sm mb-1">Payment ID: {order.paymentId || 'N/A'}</div>
                  <div className="text-gray-600 text-sm mb-1">Total Paid: <span className="font-bold">₹{order.total}</span></div>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="text-gray-700 font-medium mb-1">Shipping Address:</div>
                  <div className="text-gray-600 text-sm whitespace-pre-line">
                    {order.address && typeof order.address === 'object' ? (
                      <>
                        {order.address.name}<br/>
                        {order.address.address}<br/>
                        {order.address.address2}<br/>
                        {order.address.city}, {order.address.state} - {order.address.pincode}<br/>
                        {order.address.phone}<br/>
                        {order.address.addressType && (<span className="capitalize">({order.address.addressType})</span>)}
                      </>
                    ) : (
                      order.address
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">Products:</div>
                <div className="divide-y divide-gray-100">
                  {order.products && order.products.length > 0 ? order.products.map((item: any, idx: number) => (
                    <div key={`${item.product?._id || 'noid'}-${idx}`} className="flex items-center gap-4 py-3">
                      {item.product?.image && (
                        <Image src={item.product.image} alt={item.product.name} width={64} height={64} className="rounded object-cover border" />
                      )}
                      <div className="flex-1">
                        {item.product?.slug ? (
                          <a href={`/products/${item.product.slug}`} className="font-semibold text-sage hover:underline" target="_blank" rel="noopener noreferrer">
                            {item.product?.name || 'Product'}
                          </a>
                        ) : (
                          <div className="font-semibold">{item.product?.name || 'Product'}</div>
                        )}
                        <div className="text-gray-600 text-sm">Qty: {item.quantity}</div>
                        <div className="text-gray-600 text-sm">Price: ₹{item.price}</div>
                        <div className="text-gray-600 text-sm">Subtotal: ₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  )) : <div className="text-gray-500">No products found.</div>}
                </div>
              </div>
              {order.shiprocketShipmentId && (
                <a
                  href={`https://www.shiprocket.in/shipment-tracking/${order.shiprocketShipmentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-sage text-white rounded hover:bg-sage-dark transition"
                >
                  Track Order
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
