"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';

// Updated combos data with more variety of bundles similar to Abso Essential site
const comboProducts = [
  {
    id: '1',
    name: 'Ultimate Skin Care Bundle',
    description: 'Complete 4-step routine | Morning & night | All skin type',
    price: 1699,
    salePrice: 1299,
    image: 'https://abso-essentials.com/cdn/shop/files/Artboard1_4x_7798e9bd-8ba0-4fe1-92b0-e628e9f29332.png?v=1743841720&width=940',
    slug: 'ultimate-skin-care-bundle',
    reviewCount: 89,
    soldOut: false,
    category: 'Skin Care',
    savings: '24% off',
    includes: ['Hydrating Cleanser', 'Vitamin C Serum', 'Barrier Repair Moisturizer', 'Mineral Sunscreen SPF 50'],
    type: 'Featured',
    bestFor: ['All Skin Types', 'Anti-Aging', 'Hydration']
  },
  {
    id: '2',
    name: 'Complete Hair Care Set',
    description: 'Revitalize your hair | Strengthen & hydrate | Reduce breakage',
    price: 1899,
    salePrice: 1499,
    image: 'https://abso-essentials.com/cdn/shop/files/3_in_1_4x_b26c9835-68d9-4259-b320-ff36c95003e6.png?v=1743842537',
    slug: 'complete-hair-care-set',
    reviewCount: 76,
    soldOut: false,
    category: 'Hair Care',
    savings: '21% off',
    includes: ['Strengthening Shampoo', 'Nourishing Conditioner', 'Hydrating Hair Mask', 'Anti-Frizz Hair Oil'],
    type: 'Featured',
    bestFor: ['Damaged Hair', 'Dry Hair', 'Frizzy Hair']
  },
  {
    id: '3',
    name: 'Self-Care Spa Bundle',
    description: 'Pamper yourself | Relaxing aromas | Head-to-toe treatment',
    price: 1999,
    salePrice: 1599,
    image: 'https://abso-essentials.com/cdn/shop/files/shower_combo_4x_8a72d7c0-6ca0-49cc-ad5e-d5cf191feb46.png?v=1743841891',
    slug: 'self-care-spa-bundle',
    reviewCount: 65,
    soldOut: false,
    category: 'Mixed',
    savings: '20% off',
    includes: ['Hydrating Cleanser', 'Hydrating Bodywash', 'Nourishing Conditioner', 'Green Tea Clay Mask'],
    type: 'Limited Edition',
    bestFor: ['Self-Care', 'Relaxation', 'Gifting']
  },
  {
    id: '4',
    name: 'Anti-Aging Duo',
    description: 'Reduce fine lines | Boost collagen | Firm skin',
    price: 999,
    salePrice: 879,
    image: 'https://abso-essentials.com/cdn/shop/files/skincare_2.jpg?v=1743841726&width=940',
    slug: 'anti-aging-duo',
    reviewCount: 48,
    soldOut: false,
    category: 'Skin Care',
    savings: '12% off',
    includes: ['Vitamin C Serum', 'Night Repair Cream'],
    type: 'Value',
    bestFor: ['Mature Skin', 'Fine Lines', 'Wrinkles']
  },
  {
    id: '5',
    name: 'Scalp Therapy Combo',
    description: 'Balance scalp health | Reduce dandruff | Promote growth',
    price: 1149,
    salePrice: 949,
    image: 'https://abso-essentials.com/cdn/shop/files/haircare_2.jpg?v=1743841891',
    slug: 'scalp-therapy-combo',
    reviewCount: 32,
    soldOut: false,
    category: 'Hair Care',
    savings: '17% off',
    includes: ['Scalp Detox Treatment', 'Hair Growth Serum', 'Scalp Massager'],
    type: 'Value',
    bestFor: ['Dandruff', 'Hair Fall', 'Oily Scalp']
  },
  {
    id: '6',
    name: 'Hydration Heroes',
    description: 'Intense moisture | Dry skin relief | Long-lasting hydration',
    price: 899,
    salePrice: 799,
    image: 'https://abso-essentials.com/cdn/shop/files/shower_combo-21.jpg?v=1743842537&width=940',
    slug: 'hydration-heroes',
    reviewCount: 57,
    soldOut: false,
    category: 'Skin Care',
    savings: '11% off',
    includes: ['Hyaluronic Acid Serum', 'Barrier Repair Moisturizer'],
    type: 'Value',
    bestFor: ['Dry Skin', 'Dehydration', 'Sensitive Skin']
  },
  {
    id: '7',
    name: 'Glow Getter Set',
    description: 'Radiant complexion | Even tone | Smooth texture',
    price: 1299,
    salePrice: 1049,
    image: 'https://abso-essentials.com/cdn/shop/files/travel_kit-06.jpg?v=1743843928&width=940',
    slug: 'glow-getter-set',
    reviewCount: 43,
    soldOut: false,
    category: 'Skin Care',
    savings: '19% off',
    includes: ['Hydrating Cleanser', 'Exfoliating Toner', 'Vitamin C Serum'],
    type: 'Value',
    bestFor: ['Dull Skin', 'Uneven Texture', 'Pigmentation']
  },
  {
    id: '8',
    name: 'Hair Styling Essentials',
    description: 'Heat protection | Style control | Healthy finish',
    price: 1099,
    salePrice: 899,
    image: 'https://abso-essentials.com/cdn/shop/files/3_in_1_4x_b26c9835-68d9-4259-b320-ff36c95003e6.png?v=1743842537',
    slug: 'hair-styling-essentials',
    reviewCount: 29,
    soldOut: false,
    category: 'Hair Care',
    savings: '18% off',
    includes: ['Heat Protectant Spray', 'Anti-Frizz Hair Oil', 'Dry Shampoo'],
    type: 'Value',
    bestFor: ['Heat Styling', 'Frizzy Hair', 'Volume']
  },
  {
    id: '9',
    name: 'Travel Essentials Kit',
    description: 'TSA-friendly sizes | Full regimen | Perfect for travel',
    price: 899,
    salePrice: 799,
    image: 'https://abso-essentials.com/cdn/shop/files/shower_combo_4x_8a72d7c0-6ca0-49cc-ad5e-d5cf191feb46.png?v=1743841891',
    slug: 'travel-essentials-kit',
    reviewCount: 38,
    soldOut: false,
    category: 'Mixed',
    savings: '11% off',
    includes: ['Hydrating Cleanser (Mini)', 'Nourishing Conditioner (Mini)', 'Strengthening Shampoo (Mini)', 'Barrier Repair Moisturizer (Mini)'],
    type: 'Limited Edition',
    bestFor: ['Travel', 'Gifting', 'Trial']
  },
  {
    id: '10',
    name: 'Complete Body Care Bundle',
    description: 'Full body nourishment | Cleanse & hydrate | Smooth skin',
    price: 1399,
    salePrice: 1099,
    image: 'https://abso-essentials.com/cdn/shop/files/haircare_2.jpg?v=1743841891',
    slug: 'complete-body-care-bundle',
    reviewCount: 27,
    soldOut: false,
    category: 'Body Care',
    savings: '21% off',
    includes: ['Hydrating Bodywash', 'Body Scrub', 'Body Lotion', 'Hand Cream'],
    type: 'Featured',
    bestFor: ['All Skin Types', 'Dry Skin', 'Gifting']
  }
];

export default function CombosPage() {
  const [visibleProducts, setVisibleProducts] = useState(9);

  // Handle loading more products
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
                Value Bundles <span className="text-lg font-normal text-gray-600">({comboProducts.length} items)</span>
              </h2>
            </div>

            {/* Mobile horizontal scroll for small screens */}
            <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
              <div className="flex space-x-4 px-4 min-w-max">
                {comboProducts.slice(0, visibleProducts).map((product, index) => (
                  <div key={product.id} className="w-64">
                    <div className="relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg hover-lift animate-floatIn" style={{ animationDelay: `${index * 0.05}s` }}>
                      <Link href={`/products/${product.slug}`}>
                        <div className="relative overflow-hidden img-zoom-container">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="w-full h-64 object-cover img-zoom"
                          />
                          <div className="absolute top-2 left-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded">
                            Bundle
                          </div>
                          <div className="absolute top-2 right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded animate-pulse">
                            {product.savings}
                          </div>
                          {product.type === 'Limited Edition' && (
                            <div className="absolute bottom-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                              Limited Edition
                            </div>
                          )}
                        </div>
                      </Link>
                      
                      <div className="p-4 flex-grow">
                        <Link href={`/products/${product.slug}`} className="block text-lg font-medium text-gray-900 hover:text-accent transition-colors duration-300">
                          {product.name}
                        </Link>
                        
                        <p className="mt-1 text-sm text-gray-500">
                          {product.description}
                        </p>
                        
                        <div className="mt-2 flex items-center">
                          <span className="text-lg font-medium text-accent">₹ {product.salePrice.toFixed(2)}</span>
                          <span className="ml-2 text-sm text-gray-500 line-through">₹ {product.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-xs text-gray-600 italic">Includes: {product.includes.join(', ')}</p>
                        </div>
                      </div>
                      
                      <div className="p-4 pt-0">
                        <button className="w-full px-4 py-2 bg-sage text-white rounded transition-all duration-300 hover:bg-sage/80 hover:shadow-md transform hover:-translate-y-1">
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Grid layout for medium screens and above */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {comboProducts.slice(0, visibleProducts).map((product, index) => (
                <div key={product.id} className="relative flex flex-col overflow-hidden bg-white border border-gray-200 rounded-lg hover-lift animate-floatIn" style={{ animationDelay: `${index * 0.05}s` }}>
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative overflow-hidden img-zoom-container">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={500}
                        className="w-full h-64 object-cover img-zoom"
                      />
                      <div className="absolute top-2 left-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded">
                        Bundle
                      </div>
                      <div className="absolute top-2 right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded animate-pulse">
                        {product.savings}
                      </div>
                      {product.type === 'Limited Edition' && (
                        <div className="absolute bottom-2 left-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                          Limited Edition
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4 flex-grow">
                    <Link href={`/products/${product.slug}`} className="block text-lg font-medium text-gray-900 hover:text-accent transition-colors duration-300">
                      {product.name}
                    </Link>
                    
                    <p className="mt-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                    
                    <div className="mt-2 flex items-center">
                      <span className="text-lg font-medium text-accent">₹ {product.salePrice.toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-500 line-through">₹ {product.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 italic">Includes: {product.includes.join(', ')}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 pt-0">
                    <button className="w-full px-4 py-2 bg-sage text-white rounded transition-all duration-300 hover:bg-sage/80 hover:shadow-md transform hover:-translate-y-1">
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More Button */}
            {visibleProducts < comboProducts.length && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/80 transition-all duration-300"
                >
                  Load More Bundles
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Our Bundles Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Value Bundles?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Save Up to 24%</h3>
                  <p className="text-gray-600">Enjoy significant savings compared to purchasing products individually.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Expert Curation</h3>
                  <p className="text-gray-600">Products carefully selected to work together for optimal results.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-beige rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Perfect Gifting</h3>
                  <p className="text-gray-600">Beautifully packaged sets that make ideal gifts for loved ones.</p>
                </div>
              </div>

              <div className="mt-16 bg-beige p-8 rounded-lg text-center">
                <h3 className="text-2xl font-semibold mb-4">Need Help Choosing?</h3>
                <p className="text-lg text-gray-700 mb-6">
                  Not sure which bundle is right for you? Our team of experts is here to help you find the perfect 
                  combination for your specific needs.
                </p>
                <Link href="/contact" className="inline-block px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/80 transition-all duration-300">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}