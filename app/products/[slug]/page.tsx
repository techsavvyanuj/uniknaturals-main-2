'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

// Sample product data (in a real app, this would come from an API/backend)
type Product = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice: number;
  image: string;
  slug: string;
  reviewCount: number;
  soldOut: boolean;
  images: string[];
  features: string[];
};

const products: Record<string, Product> = {
  'Hair Gel Mask': {
    id: '1',
    name: 'Hair Gel Mask',
    description: 'Repairs split ends | restores shine, | smooths frizz | Reduces hair fall',
    longDescription: 'Non-sticky gel texture that nourishes from root to tip  Ideal for dry, brittle, or chemically treated hair.',
    price: 1099,
    salePrice: 1049,
    image: '/images/products/hair gel mask.jpeg',
    slug: 'hair-care-combo',
    reviewCount: 22,
    soldOut: false,
    images: [
      '/images/products/hair gel mask.jpeg',
      '/images/products/hair gel mask.jpeg',
      '/images/products/hair gel mask.jpeg'
    ],
    features: [
      'Rich in aloe vera',
      'rosemary',
      'Reduces frizz',
      'curry leaves,',
      'almond oil',
      'moringa,kalonji'
    ]
  },
  'Rosemary Shampoo': {
    id: '2',
    name: 'Rosemary Shampoo',
    description: 'Sulfate-Free | Strengthens hair | Renews shine | Hair Strengthening',
    longDescription: ' Stimulates hair follicles and improves volume over time adds natural shine.',
    price: 649,
    salePrice: 599,
    image: '/images/products/rosemary shampoo.jpeg',
    slug: 'strengthening-shampoo',
    reviewCount: 122,
    soldOut: false,
    images: [
      '/images/products/rosemary shampoo.jpeg',
      '/images/products/rosemary shampoo.jpeg',
      '/images/products/rosemary shampoo.jpeg'
    ],
    features: [
      ' Free from sulfates',
      'Strengthens hair from root to tip',
      'silicones',
      'artificial fragrance',
      'Gentle enough for daily use',
      'Suitable for all hair types'
    ]
  },
  'Sunscreen Body Lotion': {
    id: '3',
    name: 'Sunscreen Body Lotion',
    description: 'Non-toxic | mineral-based SPF  | zinc oxide and aloevera ',
    longDescription: `Our Sunscreen Body Lotion with No white cast, greasy feel, or synthetic filters.`,
    price: 459,
    salePrice: 436,
    image: '/images/products/body lotion.jpeg',
    slug: 'barrier-repair-moisturizer',
    reviewCount: 68,
    soldOut: false,
    images: [
      '/images/products/body lotion.jpeg',
      '/images/products/body lotion.jpeg',
      '/images/products/body lotion.jpeg'
    ],
    features: [
      'Protects against UVA/UVB rays',
      'Provides deep hydration',
      'Safe for children and all skin types',
      'Protects against environmental damage',
      'can useeven under makeup',
      'Suitable for sensitive skin'
    ]
  },
  'Natural Rose Soap': {
    id: '4',
    name: 'Natural Rose Soap',
    description: 'Gentle Hydration & Skin Soothing | Cleanses skin without stripping natural oil',
    longDescription: `Our Natural Rose Soap gently cleanses while maintaining your skin's natural moisture balance. Formulated with nourishing botanicals and mild cleansing agents, it leaves your skin feeling soft, smooth, and refreshed without that tight, dry feeling that conventional soaps can cause. The light, natural fragrance provides a refreshing sensory experience.`,
    price: 549,
    salePrice: 522,
    image: '/images/products/soaps.jpeg',
    slug: 'hydrating-bodywash',
    reviewCount: 65,
    soldOut: false,
    images: [
      '/images/products/soaps.jpeg',
      '/images/products/soaps.jpeg',
      '/images/products/soaps.jpeg'
    ],
    features: [
      `Hydrates dry skin`,
      'soothes inflammation',
      'Naturally rich in antioxidants to fight free radical damage',
      'Suitable for daily use',
      'Refreshing natural fragrance',
      'Perfect for sensitive or dry skin'
    ]
  }
} as const;

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  // const product = products[slug as keyof typeof products];
  const product = Object.values(products).find(p => p.slug === slug);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  
  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, the product you are looking for does not exist.</p>
        <Link href="/" className="btn">
          Return to Home
        </Link>
      </div>
    );
  }
  
  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (product.soldOut) return;
    
    // Add the product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image
      });
    }
    
    // Optional: Show some feedback
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
      const originalText = addToCartBtn.innerText;
      addToCartBtn.innerText = 'Added! ✓';
      addToCartBtn.classList.add('bg-green-600');
      
      setTimeout(() => {
        addToCartBtn.innerText = originalText;
        addToCartBtn.classList.remove('bg-green-600');
      }, 1500);
    }
  };
  
  return (
    <div className="container py-12">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <div className="flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/products`} className="text-gray-500 hover:text-black">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square relative overflow-hidden border border-gray-200">
            <Image
              src={product.images[activeImage] || product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`aspect-square relative border ${activeImage === index ? 'border-black' : 'border-gray-200'}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex items-center mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-500">{product.reviewCount} reviews</span>
          </div>
          
          <div className="mb-6">
            {product.salePrice ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold">₹ {product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-lg text-gray-500 line-through">₹ {product.price.toFixed(2)}</span>
                <span className="ml-2 bg-black text-white text-xs font-medium px-2 py-1 rounded">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% off
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">₹ {product.price.toFixed(2)}</span>
            )}
          </div>
          
          <div className="mb-8">
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="mb-8 space-y-4">
            <button
              id="add-to-cart-btn"
              className={`w-full py-3 bg-sage text-white rounded transition-all duration-300 ${product.soldOut ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sage/80 hover:shadow-md'}`}
              disabled={product.soldOut}
              onClick={handleAddToCart}
            >
              {product.soldOut ? 'Sold out' : 'Add to cart'}
            </button>
            
            <button className="w-full btn-outline py-3">
              Buy it now
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <p className="text-gray-700 mb-6">{product.longDescription}</p>
            
            <h3 className="text-lg font-medium mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}