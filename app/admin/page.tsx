'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Mock stats with data from localStorage for products
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 5,
    totalOrders: 128,
    pendingOrders: 12,
    totalImages: 0,
  });

  // Get real counts from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get products count
      const products = localStorage.getItem('uniknaturals-products');
      const productCount = products ? JSON.parse(products).length : 0;
      
      // Get images count
      const images = localStorage.getItem('uniknaturals-images');
      const imageCount = images ? JSON.parse(images).length : 0;
      
      setStats(prev => ({
        ...prev,
        totalProducts: productCount,
        totalImages: imageCount
      }));
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-3xl font-bold text-sage">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Categories</h2>
          <p className="text-3xl font-bold text-sage">{stats.totalCategories}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Images</h2>
          <p className="text-3xl font-bold text-sage">{stats.totalImages}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Pending Orders</h2>
          <p className="text-3xl font-bold text-sage">{stats.pendingOrders}</p>
        </div>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="w-full flex justify-center">
        <div className="flex flex-row gap-8 overflow-x-auto px-2 py-4 bg-white rounded-lg shadow max-w-4xl w-full">
          <Link href="/admin/products/add" className="bg-sage text-white p-4 rounded text-center hover:bg-opacity-90 transition min-w-[200px]">
            Add New Product
          </Link>
          <Link href="/admin/products" className="bg-sage text-white p-4 rounded text-center hover:bg-opacity-90 transition min-w-[200px]">
            Manage Products
          </Link>
          <Link href="/admin/trending-products" className="bg-sage text-white p-4 rounded text-center hover:bg-opacity-90 transition min-w-[200px]">
            Manage Trending Products
          </Link>
          <Link href="/admin/more-products" className="bg-sage text-white p-4 rounded text-center hover:bg-opacity-90 transition min-w-[200px]">
            Manage More Products
          </Link>
        </div>
      </div>
    </div>
  );
}