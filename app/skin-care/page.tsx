"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';

// Updated skin care products data (matching Abso Essential product lineup)
const skinCareProducts = [
  {
    id: '1',
    name: 'Sunscreen Body Lotion',
    description: 'Non-toxic | mineral-based SPF  | zinc oxide and aloevera ',
    price: 459,
    salePrice: 436,
    image: '/images/products/body lotion.jpeg',
    slug: 'Sunscreen Body Lotion',
    reviewCount: 68,
    soldOut: false,
    category: 'moisturizer',
    concern: ['Dryness', 'Anti-Aging', 'Damaged Barrier'],
    tags: ['Bestseller']
  },
  {
    id: '2',
    name: 'Rose water',
    description: 'Made from steam-distilled Damask rose petals | Gently tightens pores | balances skin pH',
    price: 259,
    salePrice: 235,
    image: '/images/products/rosewater.jpeg',
    slug: 'Rose water',
    reviewCount: 42,
    soldOut: false,
    category: 'cleanser',
    concern: ['Dryness', 'Sensitivity']
  },
  {
    id: '3',
    name: 'Rosemary Water Hair Spray',
    description: 'Infused with pure rosemary leaves | Lightweight formula | non-sticky and ideal for daily use',
    price: 559,
    salePrice: 529,
    image: '/images/products/rose mary spray.jpeg',
    slug: 'Rosemary Water Hair Spray',
    reviewCount: 89,
    soldOut: false,
    category: 'serum',
    concern: ['Dullness', 'Pigmentation', 'Anti-Aging'],
    tags: ['Trending']
  },
  {
    id: '4',
    name: ' Natural Rose Soap',
    description: 'Contains pure rose water extract and oil | Hydrates dry skin | soothes inflammation',
    price: 329,
    salePrice: 299,
    image: '/images/products/soaps.jpeg',
    slug: ' Natural Rose Soap',
    reviewCount: 56,
    soldOut: false,
    category: 'toner',
    concern: ['Texture', 'Dullness', 'Acne']
  },
  {
    id: '5',
    name: ' Pure Aloe Vera Gel',
    description: 'Skin & Hair Multi-Purpose Healer | Made from cold-extracted aloe vera pulp | Calms sunburn',
    price: 359,
    salePrice: 339,
    image: '/images/products/aloevera gel.jpeg',
    slug: ' Pure Aloe Vera Gel',
    reviewCount: 37,
    soldOut: false,
    category: 'sunscreen',
    concern: ['UV Protection', 'Anti-Aging']
  },
  {
    id: '6',
    name: 'Cold-Pressed Herbal Hair Oil',
    description: 'Contains cold-pressed coconut | Boosts hair growth| reduces hair fal | Evens skin tone',
    price: 399,
    salePrice: 379,
    image: 'https://abso-essentials.com/cdn/shop/files/moisturiser_20ml-02.jpg?v=1742231618&width=940',
    slug: 'Cold-Pressed Herbal Hair Oil',
    reviewCount: 45,
    soldOut: false,
    category: 'serum',
    concern: ['Oiliness', 'Acne', 'Pores']
  },
  {
    id: '7',
    name: 'Anti Acne Facewash',
    description: 'Deep hydration | Plumps skin | Reduces fine lines | All skin types',
    price: 429,
    salePrice: 399,
    image: 'https://abso-essentials.com/cdn/shop/files/Artboard1_4x_7798e9bd-8ba0-4fe1-92b0-e628e9f29332.png?v=1743841720&width=940',
    slug: 'hyaluronic-acid-serum',
    reviewCount: 72,
    soldOut: false,
    category: 'serum',
    concern: ['Dryness', 'Fine Lines'],
    tags: ['Bestseller']
  },
  {
    id: '8',
    name: 'Night Repair Cream',
    description: 'Overnight repair | Restores elasticity | Fights free radicals | Rejuvenates',
    price: 499,
    salePrice: 459,
    image: 'https://abso-essentials.com/cdn/shop/files/travel_kit-06.jpg?v=1743843928&width=940',
    slug: 'night-repair-cream',
    reviewCount: 32,
    soldOut: false,
    category: 'moisturizer',
    concern: ['Anti-Aging', 'Repair', 'Dryness'],
    tags: ['New']
  },
  {
    id: '9',
    name: 'Green Tea Clay Mask',
    description: 'Detoxifies | Reduces inflammation | Controls excess oil | Refines pores',
    price: 299,
    salePrice: 279,
    image: 'https://abso-essentials.com/cdn/shop/files/shower_combo-21.jpg?v=1743842537&width=940',
    slug: 'green-tea-clay-mask',
    reviewCount: 24,
    soldOut: false,
    category: 'mask',
    concern: ['Oiliness', 'Acne', 'Pores']
  },
  {
    id: '10',
    name: 'Eye Cream',
    description: 'Reduces dark circles | Minimizes puffiness | Firms eye area | Hydrates',
    price: 389,
    salePrice: 359,
    image: 'https://abso-essentials.com/cdn/shop/files/Artboard_1_4x_66b3460b-4ef8-4944-b011-09b93f15b0ed.png?v=1732274383',
    slug: 'eye-cream',
    reviewCount: 29,
    soldOut: false,
    category: 'eye-care',
    concern: ['Dark Circles', 'Puffiness', 'Fine Lines']
  }
];

export default function SkinCarePage() {
  const [visibleProducts, setVisibleProducts] = useState(9);

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
          imageSrc="https://abso-essentials.com/cdn/shop/files/Laptop_size.png?v=1746350497&width=3000"
          imageAlt="Skin Care Collection"
          title=""
          subtitle=""
          height="lg"
        />

        {/* Products Section */}
        <section className="section-beige py-12">
          <div className="container">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">
                Products <span className="text-lg font-normal text-gray-600">({skinCareProducts.length} items)</span>
              </h2>
            </div>

            {/* Mobile horizontal scroll for small screens */}
            <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
              <div className="flex space-x-4 px-4 min-w-max">
                {skinCareProducts.slice(0, visibleProducts).map((product, index) => (
                  <div key={product.id} className="w-64">
                    <ProductCard {...product} animationDelay={index % 3} />
                  </div>
                ))}
              </div>
            </div>

            {/* Grid layout for medium screens and above */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {skinCareProducts.slice(0, visibleProducts).map((product, index) => (
                <ProductCard key={product.id} {...product} animationDelay={index % 3} />
              ))}
            </div>
            
            {/* Load More Button */}
            {visibleProducts < skinCareProducts.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/80 transition-all duration-300"
                >
                  Load More Products
                </button>
              </div>
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
                  <h3 className="text-xl font-semibold mb-2">Sustainably Packaged</h3>
                  <p className="text-gray-600">Eco-friendly packaging that's recyclable and minimizes environmental impact.</p>
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