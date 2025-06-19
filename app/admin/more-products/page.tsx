"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/app/api/productsApi";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5005/api";

export default function MoreProductsAdmin() {
  const [more, setMore] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMore = async () => {
      try {
        const res = await axios.get(`${API_BASE}/more-products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminAuth")}` },
          withCredentials: true,
        });
        setMore(res.data);
      } catch {
        setError("Failed to load more products");
      }
    };
    fetchProducts().then(setProducts);
    fetchMore();
    setLoading(false);
  }, []);

  const handleAdd = async () => {
    setError(null);
    setSuccess(null);
    if (!selected) return setError("Select a product to add");
    try {
      await axios.post(
        `${API_BASE}/more-products`,
        { productId: selected },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminAuth")}` },
          withCredentials: true,
        }
      );
      setSuccess("Product added to more products!");
      setSelected("");
      const res = await axios.get(`${API_BASE}/more-products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminAuth")}` },
        withCredentials: true,
      });
      setMore(res.data);
    } catch {
      setError("Failed to add product");
    }
  };

  const handleDelete = async (productId: string) => {
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`${API_BASE}/more-products/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminAuth")}` },
        withCredentials: true,
      });
      setSuccess("Product removed from more products!");
      setMore(more.filter((p) => p._id !== productId));
    } catch {
      setError("Failed to remove product");
    }
  };

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Manage More Products</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <div className="mb-4">
        <label className="block font-medium mb-1">Add Product to More Products</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border p-2 rounded mb-2"
        />
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        >
          <option value="">Select a product</option>
          {products.filter(p =>
            !search.trim() ||
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p._id?.toLowerCase().includes(search.toLowerCase())
          ).map(p => (
            <option key={p._id} value={p._id}>{p.name} ({p._id})</option>
          ))}
        </select>
        <button
          type="button"
          className="bg-sage text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >Add to More Products</button>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">More Products</label>
        <div className="max-h-64 overflow-y-auto border rounded p-2 bg-white">
          {more.length === 0 && <div>No more products.</div>}
          {more.map((p: any) => (
            <div key={p._id} className="flex items-center gap-2 mb-2">
              <span>{p.name}</span>
              <button
                type="button"
                className="text-red-600 ml-auto"
                onClick={() => handleDelete(p._id)}
              >Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
