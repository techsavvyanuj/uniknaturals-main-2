"use client";

import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import { useEffect, useState } from 'react';
import { fetchProducts, Product } from '@/app/api/productsApi';

// Removed the hardcoded damaged hair products

export default function DamagedHairPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleProducts, setVisibleProducts] = useState(9);

  useEffect(() => {
    fetchProducts('Hair Care')
      .then(data => {
        const mapped = data.map((p: any) => ({ ...p, id: p._id || p.id }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + 6);
  };

  return (
    <>
      <Header />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner 
          imageSrc="https://abso-essentials.com/cdn/shop/articles/Which_Shampoo_should_i_use_1_57441b8a-8325-4d91-8b96-10e3e7d1de4e.png?v=1742896499"
          imageAlt="Damaged Hair Solutions"
          title=""
          subtitle=""
          height="lg"
          maxContentWidth="max-w-2xl"
        />

        {/* Info Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Understanding Damaged Hair</h2>
              <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Hair damage occurs due to various factors including heat styling, chemical treatments, environmental stressors, and improper hair care. Signs of damage include split ends, breakage, dullness, and rough texture.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our specialized formulations work to repair damaged hair from the inside out, strengthening the hair shaft and protecting against future damage while restoring shine and manageability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-secondary rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Strengthens</h3>
                <p className="text-gray-600">Reinforces hair fibers to prevent further damage</p>
              </div>
              
              <div className="bg-secondary rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Moisturizes</h3>
                <p className="text-gray-600">Deep hydration to restore elasticity and bounce</p>
              </div>
              
              <div className="bg-secondary rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Protects</h3>
                <p className="text-gray-600">Creates a protective barrier against heat and environmental damage</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="section-beige py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Recommended Products for Damaged Hair</h2>
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

        {/* Tips Section */}
        <section className="py-16 bg-white">
          <div className="container max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Hair Care Tips for Damaged Hair</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  Minimize Heat Styling
                </h3>
                <p className="text-gray-700">Give your hair a break from heat tools. When you do use them, always apply a heat protectant first and use the lowest effective temperature setting.</p>
              </div>
              
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  Deep Condition Regularly
                </h3>
                <p className="text-gray-700">Use a deep conditioning treatment or hair mask once a week to restore moisture and repair damage from the inside out.</p>
              </div>
              
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  Gentle Detangling
                </h3>
                <p className="text-gray-700">Always use a wide-tooth comb or detangling brush, and start from the ends working your way up to prevent breakage.</p>
              </div>
              
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
                  Regular Trims
                </h3>
                <p className="text-gray-700">Schedule regular trims every 6-8 weeks to remove split ends before they travel up the hair shaft causing more damage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Banner */}
        <section className="section bg-beige">
          <div className="container">
            <div className="bg-primary text-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Personalized Advice?</h2>
                <p className="text-white/80 text-lg max-w-2xl">Our hair experts can create a tailored regimen based on your specific hair damage concerns.</p>
              </div>
              <Link
                href="/contact"
                className="whitespace-nowrap px-8 py-3 bg-white text-primary rounded-md hover:bg-opacity-90 transition-all duration-300 font-medium"
              >
                Get a Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}