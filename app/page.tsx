"use client";

import Image from "next/image";
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect, useRef, MutableRefObject } from 'react';
import { useRouter } from 'next/navigation';
import VideoCard from '@/components/VideoCard';
import HeroBanner from '@/components/HeroBanner';
import { useCart } from '@/hooks/useCart';
import axios from 'axios';

// Hero slideshow images
const heroImages = [
  {
    src: "/images/products/unik first poster.jpeg",
    alt: "UNIKNATURALS Hero Image 1"
  },
  // {
  //   src: "/images/products/unik second.jpeg",
  //   alt: "UNIKNATURALS Hero Image 2"
  // },
  // {
  //   src: "/images/products/unik third.jpeg",
  //   alt: "UNIKNATURALS Hero Image 3"
  // }
];

// Hero Slideshow Component
function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () => {
    document.getElementById('trending-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageClick = (index: number) => {
    if (index === 0) {
      scrollToProducts();
    } else if (index === 1) {
      // Redirect to combos page using Next.js router
      router.push('/combos');
    }
  };
  
  return (
    <>
      {/* Desktop Hero Banner */}
      <section className="hero-banner hidden md:flex relative w-full bg-beige overflow-hidden animate-fadeIn mt-[145px] z-20 justify-center items-center">
        <div className="relative w-full h-[60vh] max-w-6xl xl:max-w-7xl mx-auto overflow-hidden rounded-2xl shadow-lg">
          {heroImages.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              onClick={() => handleImageClick(index)}
              style={{cursor: index === 0 || index === 1 ? 'pointer' : 'default'}}
            >
              <Image 
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover object-center w-full h-full rounded-2xl"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
              />
            </div>
          ))}
        </div>
        {/* Navigation dots for desktop */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2 animate-slideUp delay-500">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
      {/* Mobile Hero Banner */}
      <section className="hero-banner flex md:hidden relative w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2 bg-beige overflow-hidden animate-fadeIn mt-[100px] z-20 justify-center items-center p-0 m-0" style={{ marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)', width: '100vw' }}>
        <div className="left-0 w-screen max-w-none aspect-video overflow-hidden rounded-none shadow-lg">
          {heroImages.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
              onClick={() => handleImageClick(index)}
              style={{cursor: index === 0 || index === 1 ? 'pointer' : 'default'}}
            >
              <Image 
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover object-center w-full h-full rounded-none"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                  width: '100%',
                  maxWidth: '100vw',
                  left: 0,
                  right: 0
                }}
              />
            </div>
          ))}
        </div>
        {/* Navigation dots for mobile */}
        <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center space-x-2 animate-slideUp delay-500">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default function Home() {
  const { addItem } = useCart();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateHero, setAnimateHero] = useState(true);
  const [animateProducts, setAnimateProducts] = useState(false);
  const [trendingSection, setTrendingSection] = useState<any>(null);
  const [moreProductsSection, setMoreProductsSection] = useState<any>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const [addedToCartIds, setAddedToCartIds] = useState<string[]>([]);

  // Separate state for added to cart feedback for trending and more products
  const [addedToCartTrendingIds, setAddedToCartTrendingIds] = useState<string[]>([]);
  const [addedToCartMoreIds, setAddedToCartMoreIds] = useState<string[]>([]);

  // Trending Products Pagination State
  const [trendingPage, setTrendingPage] = useState(0);
  const trendingPageSize = 4;
  const trendingTotalPages = trendingSection ? Math.ceil(trendingSection.length / trendingPageSize) : 1;
  const trendingProductsToShow = trendingSection ? trendingSection.slice(trendingPage * trendingPageSize, (trendingPage + 1) * trendingPageSize) : [];

  // More Products Pagination State
  const [morePage, setMorePage] = useState(0);
  const morePageSize = 4;
  const moreTotalPages = moreProductsSection ? Math.ceil(moreProductsSection.length / morePageSize) : 1;
  const moreProductsToShow = moreProductsSection ? moreProductsSection.slice(morePage * morePageSize, (morePage + 1) * morePageSize) : [];

  // Fetch trending products from backend
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://uniknaturals-backend.onrender.com/api";
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/trending-products`);
        setTrendingSection(response.data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  // Fetch more products from backend
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://uniknaturals-backend.onrender.com/api";
    const fetchMoreProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/more-products`);
        setMoreProductsSection(response.data);
      } catch (error) {
        console.error('Error fetching more products:', error);
      }
    };

    fetchMoreProducts();
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateHero(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        setAnimateHero(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animate products when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimateProducts(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Helper to check if user is logged in
  const isUserLoggedIn = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('userAuth');
    }
    return false;
  };

  const [playingIndex, setPlayingIndex] = useState(-1);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  return (
    <>
      <main className="pt-0 mt-0">
        {/* Hero Slideshow */}
        <div className={`transition-opacity duration-300 ${animateHero ? 'opacity-100' : 'opacity-0'}`}>
          <HeroSlideshow />
        </div>

        {/* Featured Products */}
        <section className="py-12 md:py-14 animate-slideUp bg-warm-beige" id="trending-products">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8 animate-slideInLeft text-sage">
              TRENDING PRODUCTS
            </h2>
            {/* Fetch trending products from backend */}
            {trendingSection && trendingSection.length > 0 ? (
              <div>
                {/* Mobile horizontal scroll for trending products */}
                <div className="block md:hidden w-full overflow-x-auto pb-6 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 16, minWidth: '100%' }}>
                    {(trendingSection || []).map((product: any, index: number) => (
                      <div
                        key={product._id || product.id}
                        style={{ minWidth: 250, maxWidth: 270, flex: '0 0 auto', display: 'inline-block', boxSizing: 'border-box', overflow: 'hidden', wordBreak: 'break-word', whiteSpace: 'normal' }}
                        className="border border-gray-200 bg-white p-4 text-center hover-lift animate-slideUp"
                      >
                        <Link href={`/products/${product.slug}`}>
                          <div className="img-zoom-container mb-2 bg-white flex items-center justify-center" style={{height: '12rem'}}>
                            <Image 
                              src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-48 object-contain mb-2 img-zoom"
                              style={{background: '#f8f8f8'}}
                            />
                          </div>
                          <h3 className="text-lg font-medium mb-2" style={{maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal'}}>{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3" style={{maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal'}}>{product.description}</p>
                          <div className="flex justify-center items-center mb-4">
                            {product.salePrice ? (
                              <>
                                <span className="font-medium mr-2" style={{ color: '#6b715d' }}>₹ {product.salePrice}</span>
                                <span className="text-sm line-through">₹ {product.price}</span>
                              </>
                            ) : (
                              <span className="font-medium" style={{ color: '#6b715d' }}>₹ {product.price}</span>
                            )}
                          </div>
                        </Link>
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            className={`py-2 rounded transition-colors border ${addedToCartTrendingIds.includes(product._id || product.id) ? 'bg-white text-sage border-sage' : 'bg-sage text-white hover:bg-sage-dark'}`}
                            onClick={() => {
                              addItem({
                                id: product._id || product.id,
                                name: product.name,
                                price: product.salePrice || product.price,
                                image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                              });
                              setAddedToCartTrendingIds((prev) => [...prev, product._id || product.id]);
                              setTimeout(() => {
                                setAddedToCartTrendingIds((prev) => prev.filter(id => id !== (product._id || product.id)));
                              }, 1500);
                            }}
                            disabled={addedToCartTrendingIds.includes(product._id || product.id)}
                          >
                            {addedToCartTrendingIds.includes(product._id || product.id) ? 'Added' : 'Add to cart'}
                          </button>
                          <button
                            className="bg-white text-primary-dark py-2 rounded border border-primary-dark transition-colors transform hover:scale-105 duration-200"
                            onClick={() => {
                              if (isUserLoggedIn()) {
                                addItem({
                                  id: product._id || product.id,
                                  name: product.name,
                                  price: product.salePrice || product.price,
                                  image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                                });
                                router.push('/cart/checkout');
                              } else {
                                router.push('/account');
                              }
                            }}
                          >
                            Buy it now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop grid for trending products with pagination */}
                <div className="hidden md:block">
                  <div className="grid md:grid-cols-4 gap-6 mb-3">
                    {trendingProductsToShow.map((product: any) => (
                      <div key={product._id || product.id} className="border border-gray-200 bg-white p-4 text-center hover-lift animate-slideUp">
                        <Link href={`/products/${product.slug}`}>
                          <div className="img-zoom-container mb-2 bg-white flex items-center justify-center" style={{height: '12rem'}}>
                            <Image 
                              src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-48 object-contain mb-3 img-zoom"
                              style={{background: '#f8f8f8'}}
                            />
                          </div>
                          <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                          <div className="flex justify-center items-center mb-4">
                            {product.salePrice ? (
                              <>
                                <span className="font-medium mr-2" style={{ color: '#6b715d' }}>₹ {product.salePrice}</span>
                                <span className="text-sm line-through">₹ {product.price}</span>
                              </>
                            ) : (
                              <span className="font-medium" style={{ color: '#6b715d' }}>₹ {product.price}</span>
                            )}
                          </div>
                        </Link>
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            className={`py-2 rounded transition-colors border ${addedToCartTrendingIds.includes(product._id || product.id) ? 'bg-white text-sage border-sage' : 'bg-sage text-white hover:bg-sage-dark'}`}
                            onClick={() => {
                              addItem({
                                id: product._id || product.id,
                                name: product.name,
                                price: product.salePrice || product.price,
                                image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                              });
                              setAddedToCartTrendingIds((prev) => [...prev, product._id || product.id]);
                              setTimeout(() => {
                                setAddedToCartTrendingIds((prev) => prev.filter(id => id !== (product._id || product.id)));
                              }, 1500);
                            }}
                            disabled={addedToCartTrendingIds.includes(product._id || product.id)}
                          >
                            {addedToCartTrendingIds.includes(product._id || product.id) ? 'Added' : 'Add to cart'}
                          </button>
                          <button
                            className="bg-white text-primary-dark py-2 rounded border border-primary-dark transition-colors transform hover:scale-105 duration-200"
                            onClick={() => {
                              if (isUserLoggedIn()) {
                                addItem({
                                  id: product._id || product.id,
                                  name: product.name,
                                  price: product.salePrice || product.price,
                                  image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                                });
                                router.push('/cart/checkout');
                              } else {
                                router.push('/account');
                              }
                            }}
                          >
                            Buy it now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Pagination dots */}
                  {trendingTotalPages > 1 && (
                    <div className="flex justify-center gap-2 mb-8">
                      {Array.from({ length: trendingTotalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setTrendingPage(i)}
                          className={`w-3 h-3 rounded-full border-2 border-sage mx-1 transition-all duration-200 ${trendingPage === i ? 'bg-sage' : 'bg-white'}`}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">No trending products found.</div>
            )}
          </div>
        </section>
        
        {/* Brand Promise */}
        <section className="section-beige py-6 md:py-10">
          <div className="container max-w-8xl mx-auto">
            <h2 className="text-4xl md:text-4xl font-bold text-center mb-2 animate-slideInRight text-sage">OUR PROMISE</h2>
            <div className="w-24 h-1 bg-sage mx-auto mb-5"></div>
            <p className="text-lg md:text-xl mb-6 text-center max-w-3xl mx-auto leading-relaxed animate-slideInLeft delay-200">
              Clean, effective products with <span className="font-semibold text-primary-dark">UNIK NATURALS no nasty stuff</span>. We believe in creating products that are good for you and the environment.
            </p>
            
            {/* Mobile horizontal scroll for small screens */}
            <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
              <div className="flex space-x-4 px-4 min-w-max">
                <div className="w-64 bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp">
                  <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="https://abso-essentials.com/cdn/shop/files/2_7dfa3351-5684-40b9-8fce-959342ee2b39.png?v=1725436637&width=360"
                      alt="Natural Ingredients"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Natural Ingredients</h3>
                  <p className="text-primary">We carefully select natural ingredients that are gentle yet effective for your hair and skin.</p>
                </div>
                
                <div className="w-64 bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp delay-200">
                  <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="https://abso-essentials.com/cdn/shop/files/6.png?v=1725436593&width=360"
                      alt="No Harmful Chemicals"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No Harmful Chemicals</h3>
                  <p className="text-primary">Free from parabens, sulfates, and other harsh chemicals that can damage your skin and hair.</p>
                </div>
                
                <div className="w-64 bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp delay-300">
                  <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="https://abso-essentials.com/cdn/shop/files/4.png?v=1725436593&width=360"
                      alt="Ethically Made"
                      fill
                      className="object-contain"
                    />
                  </div>
                <h3 className="text-xl font-medium mb-2">Cruelty Free</h3>
                <p className="text-primary">we never test on animals. Every product is made with love, compassion, and conscious care.</p>
              </div>
                
                <div className="w-64 bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp delay-400">
                  <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="https://abso-essentials.com/cdn/shop/files/3.png?v=1725436593&width=360"
                      alt="Sustainable Packaging"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Paraben Free</h3>
                  <p className="text-primary">our products are completely paraben-free — free from harsh preservatives.</p>
                </div>
              </div>
            </div>
            
            {/* Grid layout for medium screens and above */}
            <div className="hidden md:grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp">
                <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="https://abso-essentials.com/cdn/shop/files/2_7dfa3351-5684-40b9-8fce-959342ee2b39.png?v=1725436637&width=360"
                    alt="Natural Ingredients"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Natural Ingredients</h3>
                <p className="text-primary">We carefully select natural ingredients that are gentle yet effective for your hair and skin.</p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp delay-200">
                <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="https://abso-essentials.com/cdn/shop/files/6.png?v=1725436593&width=360"
                    alt="No Harmful Chemicals"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">No Harmful Chemicals</h3>
                <p className="text-primary">Free from parabens, sulfates, and other harsh chemicals that can damage your skin and hair.</p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp delay-300">
                <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="https://abso-essentials.com/cdn/shop/files/4.png?v=1725436593&width=360"
                    alt="Ethically Made"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Cruelty Free</h3>
                <p className="text-primary">we never test on animals. Every product is made with love, compassion, and conscious care.</p>
              </div>
              
              <div className="bg-white/70 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 text-center animate-slideUp delay-400">
                <div className="relative mx-auto w-48 h-48 mb-6 hover:scale-105 transition-transform duration-300">
                  <Image 
                    src="https://abso-essentials.com/cdn/shop/files/3.png?v=1725436593&width=360"
                    alt="Sustainable Packaging"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Paraben Free</h3>
                <p className="text-primary">our products are completely paraben-free — free from harsh preservatives.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Secondary Products */}
        <section className="section-beige py-6 md:py-10">
          <div className="container">
            <h3 className="text-3xl font-bold text-center mb-6 animate-slideInRight text-sage">MORE PRODUCTS</h3>
            {/* Fetch more products from backend */}
            {moreProductsSection && moreProductsSection.length > 0 ? (
              <div>
                {/* Mobile horizontal scroll for more products */}
                <div className="block md:hidden w-full overflow-x-auto pb-6 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 16, minWidth: '100%' }}>
                    {(moreProductsSection || []).map((product: any, index: number) => (
                      <div
                        key={product._id || product.id}
                        style={{ minWidth: 250, maxWidth: 270, flex: '0 0 auto', display: 'inline-block', boxSizing: 'border-box', overflow: 'hidden', wordBreak: 'break-word', whiteSpace: 'normal' }}
                        className="border border-gray-200 bg-white p-4 text-center hover-lift animate-slideUp"
                      >
                        <Link href={`/products/${product.slug}`}>
                          <div className="img-zoom-container mb-2 bg-white flex items-center justify-center" style={{height: '12rem'}}>
                            <Image 
                              src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-48 object-contain mb-2 img-zoom"
                              style={{background: '#f8f8f8'}}
                            />
                          </div>
                          <h3 className="text-lg font-medium mb-2" style={{maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal'}}>{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3" style={{maxWidth: '100%', overflowWrap: 'break-word', wordBreak: 'break-word', whiteSpace: 'normal'}}>{product.description}</p>
                          <div className="flex justify-center items-center mb-4">
                            {product.salePrice ? (
                              <>
                                <span className="font-medium mr-2" style={{ color: '#6b715d' }}>₹ {product.salePrice}</span>
                                <span className="text-sm line-through">₹ {product.price}</span>
                              </>
                            ) : (
                              <span className="font-medium" style={{ color: '#6b715d' }}>₹ {product.price}</span>
                            )}
                          </div>
                        </Link>
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            className={`py-2 rounded transition-colors border ${addedToCartMoreIds.includes(product._id || product.id) ? 'bg-white text-sage border-sage' : 'bg-sage text-white hover:bg-sage-dark'}`}
                            onClick={() => {
                              addItem({
                                id: product._id || product.id,
                                name: product.name,
                                price: product.salePrice || product.price,
                                image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                              });
                              setAddedToCartMoreIds((prev) => [...prev, product._id || product.id]);
                              setTimeout(() => {
                                setAddedToCartMoreIds((prev) => prev.filter(id => id !== (product._id || product.id)));
                              }, 1500);
                            }}
                            disabled={addedToCartMoreIds.includes(product._id || product.id)}
                          >
                            {addedToCartMoreIds.includes(product._id || product.id) ? 'Added' : 'Add to cart'}
                          </button>
                          <button
                            className="bg-white text-primary-dark py-2 rounded border border-primary-dark transition-colors transform hover:scale-105 duration-200"
                            onClick={() => {
                              if (isUserLoggedIn()) {
                                addItem({
                                  id: product._id || product.id,
                                  name: product.name,
                                  price: product.salePrice || product.price,
                                  image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                                });
                                router.push('/cart/checkout');
                              } else {
                                router.push('/account');
                              }
                            }}
                          >
                            Buy it now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop grid for more products with pagination */}
                <div className="hidden md:block">
                  <div className="grid md:grid-cols-4 gap-6 mb-6">
                    {moreProductsToShow.map((product: any) => (
                      <div key={product._id || product.id} className="border border-gray-200 bg-white p-4 text-center hover-lift animate-slideUp">
                        <Link href={`/products/${product.slug}`}>
                          <div className="img-zoom-container mb-2 bg-white flex items-center justify-center" style={{height: '12rem'}}>
                            <Image 
                              src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'}
                              alt={product.name}
                              width={300}
                              height={300}
                              className="w-full h-48 object-contain mb-2 img-zoom"
                              style={{background: '#f8f8f8'}}
                            />
                          </div>
                          <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                          <div className="flex justify-center items-center mb-4">
                            {product.salePrice ? (
                              <>
                                <span className="font-medium mr-2" style={{ color: '#6b715d' }}>₹ {product.salePrice}</span>
                                <span className="text-sm line-through">₹ {product.price}</span>
                              </>
                            ) : (
                              <span className="font-medium" style={{ color: '#6b715d' }}>₹ {product.price}</span>
                            )}
                          </div>
                        </Link>
                        <div className="flex flex-col gap-2 mt-2">
                          <button
                            className={`py-2 rounded transition-colors border ${addedToCartMoreIds.includes(product._id || product.id) ? 'bg-white text-sage border-sage' : 'bg-sage text-white hover:bg-sage-dark'}`}
                            onClick={() => {
                              addItem({
                                id: product._id || product.id,
                                name: product.name,
                                price: product.salePrice || product.price,
                                image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                              });
                              setAddedToCartMoreIds((prev) => [...prev, product._id || product.id]);
                              setTimeout(() => {
                                setAddedToCartMoreIds((prev) => prev.filter(id => id !== (product._id || product.id)));
                              }, 1500);
                            }}
                            disabled={addedToCartMoreIds.includes(product._id || product.id)}
                          >
                            {addedToCartMoreIds.includes(product._id || product.id) ? 'Added' : 'Add to cart'}
                          </button>
                          <button
                            className="bg-white text-primary-#6b715d py-2 rounded border border-primary-dark transition-colors transform hover:scale-105 duration-200"
                            onClick={() => {
                              if (isUserLoggedIn()) {
                                addItem({
                                  id: product._id || product.id,
                                  name: product.name,
                                  price: product.salePrice || product.price,
                                  image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                                });
                                router.push('/cart/checkout');
                              } else {
                                router.push('/account');
                              }
                            }}
                          >
                            Buy it now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Pagination dots */}
                  {moreTotalPages > 1 && (
                    <div className="flex justify-center gap-2 mb-8">
                      {Array.from({ length: moreTotalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setMorePage(i)}
                          className={`w-3 h-3 rounded-full border-2 border-sage mx-1 transition-all duration-200 ${morePage === i ? 'bg-sage' : 'bg-white'}`}
                          aria-label={`Go to page ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">No more products found.</div>
            )}
          </div>
        </section>
        
        {/* --- SEE IT IN ACTION (isme video link change krke apna lga skte) --- */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-6 animate-slideInRight">SEE IT IN ACTION</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            {/* Mobile horizontal scroll */}
            <div className="block md:hidden w-full overflow-x-auto pb-6 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch', overflowX: 'auto', overflowY: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: 16, minWidth: '100%' }}>
                {[
                  {
                    video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/2a3fecebbc114f389c414a9d6be38f31/2a3fecebbc114f389c414a9d6be38f31.HD-1080p-2.5Mbps-33768145.mp4?v=0',
                    poster: 'https://m.media-amazon.com/images/I/61wN7w-cUvL._SX679_.jpg',
                    thumb: 'https://m.media-amazon.com/images/I/61wN7w-cUvL._SX679_.jpg',
                    name: 'Unik naturals shampoo',
                    desc: 'Tames frizz & strengthens hair',
                    link: '/products/strengthening-shampoo'
                  },
                  {
                    video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/878ccfa816e0483aa05c60a273b566a2/878ccfa816e0483aa05c60a273b566a2.HD-1080p-7.2Mbps-44790003.mp4?v=0',
                    poster: 'https://m.media-amazon.com/images/I/61AuzU0VZFL._AC_UL640_FMwebp_QL65_.jpg',
                    thumb: 'https://m.media-amazon.com/images/I/61AuzU0VZFL._SX679_.jpg',
                    name: 'Hydrating Aloe Vera Gel',
                    desc: 'Ultra hydrating',
                    link: '/products/barrier-repair-moisturizer'
                  },
                  {
                    video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/878ccfa816e0483aa05c60a273b566a2/878ccfa816e0483aa05c60a273b566a2.HD-1080p-7.2Mbps-44790003.mp4?v=0',
                    poster: 'https://m.media-amazon.com/images/I/71Jiu3sbF1L._SX679_.jpg',
                    thumb: 'https://m.media-amazon.com/images/I/71Jiu3sbF1L._SX679_.jpg',
                    name: 'Soothing Rose Soap',
                    desc: 'Reinforces skin barrier',
                    link: '/products/hydrating-bodywash'
                  },
                  {
                    video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/ac950bac49414d7eaec094fdb5008fce/ac950bac49414d7eaec094fdb5008fce.HD-720p-1.6Mbps-33768274.mp4?v=0',
                    poster: 'https://m.media-amazon.com/images/I/51YWJf5NvwL._AC_UL640_FMwebp_QL65_.jpg',
                    thumb: 'https://m.media-amazon.com/images/I/51YWJf5NvwL._AC_UL640_FMwebp_QL65_.jpg',
                    name: 'Hair Gel Mask',
                    desc: 'Complete hair care system',
                    link: '/products/hair-care-combo'
                  }
                ].map((item, idx) => (
                  <div key={idx} style={{ minWidth: 270, maxWidth: 320, flex: '0 0 auto', boxSizing: 'border-box', position: 'relative', background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', height: 320 }}>
                    <div style={{ position: 'relative', width: '100%', height: 320, background: '#eee' }}
                      onMouseEnter={() => {
                        setPlayingIndex(idx);
                        videoRefs.current.forEach((ref, i) => {
                          if (ref && i !== idx) (ref as HTMLVideoElement).pause();
                        });
                        (videoRefs.current[idx] as HTMLVideoElement | null)?.play();
                      }}
                      onMouseLeave={() => {
                        setPlayingIndex(-1);
                        (videoRefs.current[idx] as HTMLVideoElement | null)?.pause();
                      }}
                    >
                      <video
                        ref={el => {
                          videoRefs.current[idx] = el;
                        }}
                        src={item.video}
                        poster={item.poster}
                        muted
                        loop
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                      />
                      <div style={{ position: 'absolute', left: 12, bottom: 12, width: 36, height: 36, borderRadius: 8, border: '2px solid #fff', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img src={item.thumb} alt={item.name} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', display: 'block' }} />
                      </div>
                      <div style={{ position: 'absolute', left: 56, bottom: 18, right: 8, color: '#fff', textShadow: '0 1px 4px #0008', fontSize: 14 }}>
                        <div style={{ fontWeight: 600 }}>{item.name}</div>
                        <div>{item.desc}</div>
                      </div>
                    </div>
                    <a href={item.link} className="block mt-2 text-center text-primary-dark font-semibold underline">Shop Now</a>
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-4 gap-8 md:gap-10">
              {[
                {
                  video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/2a3fecebbc114f389c414a9d6be38f31/2a3fecebbc114f389c414a9d6be38f31.HD-1080p-2.5Mbps-33768145.mp4?v=0',
                  poster: 'https://abso-essentials.com/cdn/shop/files/shampoo_1_4x_f97c984e-c472-4f8c-872d-7e0763f74571.png?v=1732369710',
                  thumb: '/images/products/rosemary shampoo.jpeg',
                  name: 'Strengthening Shampoo',
                  desc: 'Tames frizz & strengthens hair',
                  link: '/products/strengthening-shampoo'
                },
                {
                  video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/878ccfa816e0483aa05c60a273b566a2/878ccfa816e0483aa05c60a273b566a2.HD-1080p-7.2Mbps-44790003.mp4?v=0',
                  poster: 'https://abso-essentials.com/cdn/shop/files/Artboard_1_4x_66b3460b-4ef8-4944-b011-09b93f15b0ed.png?v=1732274383',
                  thumb: '/images/products/rosewater.jpeg',
                  name: 'Barrier Repair Moisturizer',
                  desc: 'Ultra hydrating',
                  link: '/products/barrier-repair-moisturizer'
                },
                {
                  video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/878ccfa816e0483aa05c60a273b566a2/878ccfa816e0483aa05c60a273b566a2.HD-1080p-7.2Mbps-44790003.mp4?v=0',
                  poster: 'https://abso-essentials.com/cdn/shop/files/bodywash_4x_2634efb5-8a92-4bf4-8a54-0e54cfca5b63.png?v=1732365058',
                  thumb: '/images/products/soaps.jpeg',
                  name: 'Hydrating Bodywash',
                  desc: 'Reinforces skin barrier',
                  link: '/products/hydrating-bodywash'
                },
                {
                  video: 'https://abso-essentials.com/cdn/shop/videos/c/vp/ac950bac49414d7eaec094fdb5008fce/ac950bac49414d7eaec094fdb5008fce.HD-720p-1.6Mbps-33768274.mp4?v=0',
                  poster: 'https://abso-essentials.com/cdn/shop/files/shower_combo_4x_8a72d7c0-6ca0-49cc-ad5e-d5cf191feb46.png?v=1743841891',
                  thumb: '/images/products/aloevera gel.jpeg',
                  name: 'Hair Care Combo',
                  desc: 'Complete hair care system',
                  link: '/products/hair-care-combo'
                }
              ].map((item, idx) => (
                <div key={idx} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb', position: 'relative', height: 380 }}>
                  <div style={{ position: 'relative', width: '100%', height: 380, background: '#eee' }}
                    onMouseEnter={() => {
                      setPlayingIndex(idx);
                      videoRefs.current.forEach((ref, i) => {
                        if (ref && i !== idx) (ref as HTMLVideoElement).pause();
                      });
                      (videoRefs.current[idx] as HTMLVideoElement | null)?.play();
                    }}
                    onMouseLeave={() => {
                      setPlayingIndex(-1);
                      (videoRefs.current[idx] as HTMLVideoElement | null)?.pause();
                    }}
                  >
                    <video
                      ref={el => {
                        videoRefs.current[idx] = el;
                      }}
                      src={item.video}
                      poster={item.poster}
                      muted
                      loop
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div style={{ position: 'absolute', left: 16, bottom: 16, width: 48, height: 48, borderRadius: 8, border: '2px solid #fff', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      <img src={item.thumb} alt={item.name} style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ position: 'absolute', left: 72, bottom: 22, right: 12, color: '#fff', textShadow: '0 1px 4px #0008', fontSize: 16 }}>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div>{item.desc}</div>
                    </div>
                  </div>
                  <a href={item.link} className="block mt-3 text-center text-primary-dark font-semibold underline">Shop Now</a>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Blog Section */}
        <section className="section-beige py-8 md:py-12">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-6 animate-slideInRight">FROM OUR BLOG</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slideUp">
                <Image src="/images/products/aloevera gel.jpeg" alt="Blog 1" width={600} height={400} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Benefits of Aloe Vera for Skin</h3>
                  <p className="text-gray-600 mb-4">Discover how aloe vera can hydrate, soothe, and heal your skin naturally.</p>
                  <Link href="/blog/benefits-of-aloe-vera" className="text-sage font-semibold underline">Read More</Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slideUp delay-200">
                <Image src="/images/products/rosewater.jpeg" alt="Blog 2" width={600} height={400} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Rosewater: Nature's Toner</h3>
                  <p className="text-gray-600 mb-4">Learn why rosewater is a must-have in your daily skincare routine.</p>
                  <Link href="/blog/rosewater-toner" className="text-sage font-semibold underline">Read More</Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden animate-slideUp delay-400">
                <Image src="/images/products/soaps.jpeg" alt="Blog 3" width={600} height={400} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Choosing the Right Soap</h3>
                  <p className="text-gray-600 mb-4">Find out how to pick the best natural soap for your skin type.</p>
                  <Link href="/blog/choosing-soap" className="text-sage font-semibold underline">Read More</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Instagram Section */}
        <section className="section bg-beige py-8 md:py-12">
          <div className="container text-center">
            <a href="https://www.instagram.com/uniknaturals/" target="_blank" rel="noopener noreferrer">
              <button className="btn bg-#6b715d text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-200 mb-8">
                Follow on Instagram
              </button>
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
