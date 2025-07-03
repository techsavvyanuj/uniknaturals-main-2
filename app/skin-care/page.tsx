"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import { fetchProducts, Product } from '@/app/api/productsApi';

export default function SkinCarePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(9);

  useEffect(() => {
    fetchProducts('Skin Care')
      .then(data => {
        // Map _id to id for compatibility with ProductCard
        const mapped = data.map((p: any) => ({ ...p, id: p._id || p.id }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  // Handle load more products
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 6);
  };

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner 
          imageSrc="/images/products/unik first poster.jpeg"
          imageAlt="Skin Care Collection"
          title=""
          subtitle=""
          height="lg"
          boxed={true}
        />

        {/* Products Section */}
        <section className="section-beige py-12">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                Products <span className="text-lg font-normal text-gray-600">({products.length} items)</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-10">Loading products...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-10">No products found.</div>
            ) : (
              <>
                {/* Mobile horizontal scroll for small screens */}
                <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
                  <div className="flex space-x-4 px-4 min-w-max">
                    {products.slice(0, visibleProducts).map((product, index) => (
                      <div key={product.id || product.slug} className="w-64">
                        <ProductCard {...product} animationDelay={index % 3} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid layout for medium screens and above */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                  {products.slice(0, visibleProducts).map((product, index) => (
                    <ProductCard key={product.id || product.slug} {...product} animationDelay={index % 3} />
                  ))}
                </div>
                
                {/* Load More Button */}
                {visibleProducts < products.length && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/80 transition-all duration-300"
                    >
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-12 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Our Clean Beauty Promise</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Clean Ingredients</h3>
                  <p className="text-gray-600">Free from harmful chemicals, sulfates, parabens, and artificial fragrances.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Handmade with Care</h3>
                  <p className="text-gray-600">Each product is crafted with love, not mass-produced.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Cruelty-Free</h3>
                  <p className="text-gray-600">Never tested on animals and certified vegan-friendly formulations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}