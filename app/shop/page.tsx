"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product } from '../api/productsApi';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'Hair Care', name: 'Hair Care' },
  { id: 'Skin Care', name: 'Skin Care' },
  { id: 'Combos', name: 'Combos' },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);
    
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') {
      const aPrice = a.salePrice || a.price;
      const bPrice = b.salePrice || b.price;
      return aPrice - bPrice;
    } else if (sortBy === 'price-desc') {
      const aPrice = a.salePrice || a.price;
      const bPrice = b.salePrice || b.price;
      return bPrice - aPrice;
    } else if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    // Default: featured/newest
    return 0;
  });
  
  return (
    <>
      <Header />
      
      <div className="container py-12 pt-32 md:pt-36">
        <h1 className="text-3xl font-bold mb-8 text-center">Shop All Products</h1>
        
        {/* Filters */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <p className="text-sm font-medium mb-2">Filter by:</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      activeCategory === category.id
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Sort Filter */}
            <div className="md:text-right">
              <p className="text-sm font-medium mb-2">Sort by:</p>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id || product.slug} {...product} />
            ))}
          </div>
        )}
        
        {sortedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </>
  );
}