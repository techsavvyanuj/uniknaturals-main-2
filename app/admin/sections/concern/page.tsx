"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "@/app/api/productsApi";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://uniknaturals-backend.onrender.com/api";

export default function ConcernSectionAdmin() {
  const [section, setSection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${API_BASE}/sections/concern`, { withCredentials: true })
      .then(res => {
        setSection(res.data);
        setTitle(res.data.title || "");
        setBannerImage(res.data.bannerImage || "");
        setSelected(res.data.products || []);
      })
      .catch(() => setError("Failed to load section"));
    fetchProducts().then(setProducts);
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("adminAuth") : null;
      await axios.put(`${API_BASE}/sections/concern`, {
        title,
        bannerImage,
        products: selected,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Section updated!");
    } catch {
      setError("Failed to update section");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Shop by Concern Section</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}
      <div className="mb-4">
        <label className="block font-medium mb-1">Section Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Banner Image URL</label>
        <input value={bannerImage} onChange={e => setBannerImage(e.target.value)} className="w-full border p-2 rounded" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Products</label>
        <div className="max-h-64 overflow-y-auto border rounded p-2 bg-white">
          {products.map(p => (
            <label key={p._id} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={selected.includes(p._id)}
                onChange={e => {
                  setSelected(sel => e.target.checked ? [...sel, p._id] : sel.filter(id => id !== p._id));
                }}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={handleSave} className="bg-sage text-white px-6 py-2 rounded" disabled={saving}>
        {saving ? "Saving..." : "Save Section"}
      </button>
    </div>
  );
}
