"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import { fetchProducts, Product } from '@/app/api/productsApi';

export default function CombosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(9);

  useEffect(() => {
    fetchProducts('Combos')
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
          imageSrc="/images/products/unik second.jpeg"
          imageAlt="Value Combos and Bundles"
          title=""
          subtitle=""
          height="lg"
        />
        {/* Products Section */}
        <section className="section-beige py-12">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                Value Bundles <span className="text-lg font-normal text-gray-600">({products.length} items)</span>
              </h2>
            </div>
            {loading ? (
              <div className="text-center py-10">Loading products...</div>
            ) : error ? (
              <div className="text-center text-red-600 py-10">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-10">No combos found.</div>
            ) : (
              <>
                {/* Mobile horizontal scroll for small screens */}
                <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
                  <div className="flex space-x-4 px-4 min-w-max">
                    {products.slice(0, visibleProducts).map((product, index) => (
                      <div key={product.id} className="w-64">
                        <ProductCard {...product} id={product.id} animationDelay={index} />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Grid layout for medium screens and above */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                  {products.slice(0, visibleProducts).map((product, index) => (
                    <ProductCard key={product.id} {...product} id={product.id} animationDelay={index} />
                  ))}
                </div>
                {products.length > visibleProducts && (
                  <div className="flex justify-center mt-8">
                    <button onClick={handleLoadMore} className="px-6 py-2 bg-sage text-white rounded hover:bg-sage/80 transition-all duration-300">
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}