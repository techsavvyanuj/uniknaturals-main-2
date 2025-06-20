'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { fetchProductBySlug, Product } from '@/app/api/productsApi';

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(slug)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Product Not Found');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (error || !product) {
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
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image
      });
    }
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

  const handleBuyNow = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : null;
    if (!token) {
      alert('Please login to buy this product.');
      return;
    }
    // Redirect to checkout with product and quantity
    window.location.href = `/cart/checkout?productId=${product.id}&qty=${quantity}`;
  };

  return (
    <div className="container py-12 md:py-20" style={{marginTop: '80px'}}>
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
              src={product.images && product.images.length > 0 ? product.images[activeImage] : product.image}
              alt={product.name}
              fill
              className="object-contain bg-white cursor-pointer"
              onClick={() => {
                setLightboxImage(product.images && product.images.length > 0 ? product.images[activeImage] : product.image);
                setLightboxOpen(true);
              }}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveImage(index + 1);
                    setLightboxImage(image);
                    setLightboxOpen(true);
                  }}
                  className={`aspect-square relative border ${activeImage === index + 1 ? 'border-black' : 'border-gray-200'}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    fill
                    className="object-contain bg-white"
                  />
                </button>
              ))}
            </div>
          )}
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
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-gray-500">{product.reviewCount} reviews</span>
          </div>
          <div className="mb-6">
            {product.salePrice && product.salePrice > 0 ? (
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
            <button
              className="w-full btn-outline py-3"
              onClick={handleBuyNow}
            >
              Buy it now
            </button>
          </div>
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <p className="text-gray-700 mb-6">{product.longDescription}</p>
            {product.features && product.features.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2">Key Features</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Lightbox Modal */}
      {lightboxOpen && lightboxImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 pt-16" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1 z-10"
              onClick={e => { e.stopPropagation(); setLightboxOpen(false); }}
              aria-label="Close image preview"
            >
              &times;
            </button>
            <div className="w-full aspect-square flex items-center justify-center">
              <Image
                src={lightboxImage}
                alt="Zoomed product image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}