"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

// Sample product data (in a real app, this would come from an API/backend)
const products = [
  {
    id: '1',
    name: 'Hair Gel Mask',
    description: 'Repairs split ends | restores shine, | smooths frizz | Reduces hair fall',
    price: 1099,
    salePrice: 1049,
    image: '/images/products/hair gel mask.jpeg',
    slug: 'hair-care-combo',
    reviewCount: 22,
    soldOut: false,
    category: 'combo'
  },
  {
    id: '2',
    name: 'Rosemary Shampoo',
    description: 'Sulfate-Free | Strengthens hair | Renews shine | Hair Strengthening',
    price: 649,
    salePrice: 599,
    image: '/images/products/rosemary shampoo.jpeg',
    slug: 'Rosemary Shampoo',
    reviewCount: 122,
    soldOut: false,
    category: 'hair'
  },
  {
    id: '3',
    name: 'Sunscreen Body Lotion',
    description: 'Non-toxic | mineral-based SPF  | zinc oxide and aloevera ',
    price: 459,
    salePrice: 436,
    image: '/images/products/body lotion.jpeg',
    slug: 'barrier-repair-moisturizer',
    reviewCount: 68,
    soldOut: false,
    category: 'skin'
  },
  {
    id: '4',
    name: 'Natural Rose Soap',
    description: 'Gentle Hydration & Skin Soothing | Cleanses skin without stripping natural oil',
    price: 549,
    salePrice: 522,
    image: '/images/products/soaps.jpeg',
    slug: 'hydrating-bodywash',
    reviewCount: 65,
    soldOut: false,
    category: 'body'
  },
  {
    id: '5',
    name: 'Rosemary Spray',
    description: 'Tames frizz | Reduces fragility | Smoothens texture',
    price: 549,
    salePrice: 522,
    image: '/images/products/rose mary spray.jpeg',
    slug: 'nourishing-conditioner',
    reviewCount: 82,
    soldOut: false,
    category: 'hair'
  },
  {
    id: '6',
    name: 'Rosemary Water Hair Spray',
    description: 'Infused with pure rosemary leaves | Lightweight formula | non-sticky and ideal for daily use',
    price: 299,
    salePrice: 249,
    image: '/images/products/rosewater.jpeg',
    slug: 'scalp-massager',
    reviewCount: 1,
    soldOut: false,
    category: 'accessories'
  },
  {
    id: '7',
    name: 'Cold-Pressed Herbal Hair Oil',
    description: 'Contains cold-pressed coconut | Boosts hair growth| reduces hair fal | Evens skin tone',
    price: 1499,
    salePrice: 1424,
    image: '/images/products/herbel hair oil.jpeg',
    slug: 'shower-routine-combo',
    reviewCount: 2,
    soldOut: false,
    category: 'combo'
  },
  {
    id: '8',
    name: 'Anti Acne Facewash',
    description: 'Reinforces skin barrier | Ultra hydrating | Anti - ageing',
    price: 999,
    salePrice: 949,
    image: '/images/products/fashwash.jpeg',
    slug: 'skin-care-combo',
    reviewCount: 1,
    soldOut: false,
    category: 'combo'
  }
];

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'hair', name: 'Hair Care' },
  { id: 'skin', name: 'Skin Care' },
  { id: 'body', name: 'Body Care' },
  { id: 'combo', name: 'Combos' },
  { id: 'accessories', name: 'Accessories' }
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  
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
      
      <div className="container py-12">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </>
  );
} 