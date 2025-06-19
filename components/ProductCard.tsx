'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  images?: string[];
  slug: string;
  reviewCount?: number;
  soldOut?: boolean;
  animationDelay?: number;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  salePrice,
  image,
  images,
  slug,
  reviewCount = 0,
  soldOut = false,
  animationDelay = 0
}: ProductProps & { images?: string[] }) {
  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const { addItem } = useCart();
  const [isVisible, setIsVisible] = useState(true); // Start visible by default
  const router = useRouter();

  useEffect(() => {
    // No delay needed for initial visibility
    // Just apply animation after a minimal delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay * 100); // Reduced delay
    
    return () => clearTimeout(timer);
  }, [animationDelay]);

  // Helper to check if user is logged in
  const isUserLoggedIn = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('userAuth');
    }
    return false;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soldOut) return;
    if (!isUserLoggedIn()) {
      router.push('/account');
      return;
    }
    addItem({
      id,
      name,
      price: salePrice || price,
      image
    });
    
    // Show a brief success message or animation
    const button = e.currentTarget as HTMLButtonElement;
    const originalText = button.innerText;
    button.innerText = 'Added! ✓';
    button.classList.add('bg-green-600');
    
    setTimeout(() => {
      button.innerText = originalText;
      button.classList.remove('bg-green-600');
    }, 1500);
  };

  const handleBuyItNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (soldOut) return;
    if (!isUserLoggedIn()) {
      router.push('/account');
      return;
    }
    addItem({
      id,
      name,
      price: salePrice || price,
      image
    });
    router.push('/cart/checkout');
  };

  // Apply different animations randomly to create variety
  const animationClass = () => {
    const animations = ['animate-floatIn', 'animate-zoomIn', 'animate-rotateIn', 'animate-scaleUp'];
    // Defensive: if id is undefined or not a string, fallback to 0
    const safeId = typeof id === 'string' && id.length > 0 ? id : (slug || '0');
    const randomIndex = Math.floor((safeId.charCodeAt(0) % animations.length));
    return animations[randomIndex];
  };

  // Fallback image logic: prefer images[0], then image, then default
  const validImage = (images && images.length > 0 && images[0]) || (image && typeof image === 'string' && image.trim() !== '' ? image : '/images/products/default.png');

  return (
    <div 
      className={`flex flex-col overflow-hidden bg-white border border-gray-200 hover-lift ${isVisible ? animationClass() : ''}`}
      style={{ transitionDelay: `${animationDelay * 0.05}s` }}
    >
      <Link href={`/products/${slug}`}>
        <div className="relative overflow-hidden img-zoom-container">
          <Image
            src={validImage}
            alt={name}
            width={500}
            height={500}
            className="w-full h-64 object-contain img-zoom"
          />
          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-accent text-white text-xs font-medium px-2 py-1 rounded animate-pulse">
              {discount}% off
            </div>
          )}
          {soldOut && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-900">Sold Out</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${slug}`} className="block text-lg font-medium text-gray-900 hover:text-accent transition-colors duration-300">
          {name}
        </Link>
        
        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
        
        {reviewCount > 0 && (
          <div className="flex items-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(4) ? 'text-accent' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">{reviewCount} reviews</span>
          </div>
        )}
        
        <div className="mt-2 flex items-center">
          {salePrice && salePrice > 0 ? (
            <>
              <span className="text-lg font-medium text-accent">₹ {salePrice.toFixed(2)}</span>
              <span className="ml-2 text-sm text-gray-500 line-through">₹ {price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-lg font-medium text-accent">₹ {price.toFixed(2)}</span>
          )}
        </div>
        
        <div className="mt-4 flex flex-col gap-2">
          <button
            className={`w-full px-4 py-2 bg-sage text-white rounded transition-all duration-300 ${soldOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sage/80 hover:shadow-md transform hover:-translate-y-1'}`}
            disabled={soldOut}
            onClick={handleAddToCart}
          >
            {soldOut ? 'Sold out' : 'Add to cart'}
          </button>
          <button
            className={`w-full px-4 py-2 border border-sage text-sage rounded transition-all duration-300 ${soldOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sage/10 hover:shadow-md transform hover:-translate-y-1'}`}
            disabled={soldOut}
            onClick={handleBuyItNow}
          >
            Buy it now
          </button>
        </div>
      </div>
    </div>
  );
}