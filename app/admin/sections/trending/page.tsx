"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/app/api/productsApi";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://uniknaturals-backend.onrender.com/api";

export default function TrendingSectionAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE}/sections/trending`, { withCredentials: true })
      .catch(() => console.error("Failed to load section"));
    fetchProducts().then(setProducts);
  }, []);

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Trending Section</h1>
      <div className="mb-4">
        <label className="block font-medium mb-1">Search Products</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border p-2 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Products List</label>
        <div className="max-h-64 overflow-y-auto border rounded p-2 bg-white">
          {products.filter(p =>
            !search.trim() ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p._id?.toLowerCase().includes(search.toLowerCase())
          ).map(p => (
            <div key={p._id} className="flex justify-between items-center py-2 border-b">
              <span>{p.name} <span className="text-xs text-gray-400">({p._id})</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
