"use client";

import Image from "next/image";
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import VideoCard from '@/components/VideoCard';
import HeroBanner from '@/components/HeroBanner';
import { useCart } from '@/hooks/useCart';
import axios from 'axios';

// Hero slideshow images
const heroImages = [
  {
    src: "https://abso-essentials.com/cdn/shop/files/Laptop_Banner.jpg?v=1739607920&width=3000",
    alt: "UNIKNATURALS Hero Image 1"
  },
  {
    src: "https://abso-essentials.com/cdn/shop/files/Laptop_size.png?v=1746350497&width=3000",
    alt: "UNIKNATURALS Hero Image 2"
  },
  {
    src: "https://abso-essentials.com/cdn/shop/files/Desktop_Banner.jpg?v=1739519041&width=3000",
    alt: "UNIKNATURALS Hero Image 3"
  }
];

// Testimonials data
const testimonials = [
  {
    id: '1',
    name: 'Devansh Chauhan',
    date: '02/23/2025',
    rating: 5,
    product: 'Hair Care Combo',
    review: 'The hair remains frizz free and shiny all day'
  },
  {
    id: '2',
    name: 'Heena',
    date: '02/14/2025',
    rating: 5,
    product: 'Nourishing Conditioner',
    review: 'This conditoner is amazing it makes your hair frizz free and makes your hair look shiny.'
  },
  {
    id: '3',
    name: 'Pratik adhikari',
    date: '02/13/2025',
    rating: 5,
    product: 'Nourishing Conditioner',
    review: 'This is best conditioner and it\'s hydrate the scalp and hair'
  },
  {
    id: '4',
    name: 'roshni agarwal',
    date: '02/11/2025',
    rating: 5,
    product: 'Nourishing Conditioner',
    review: 'I ordered both conditioner and shampoo and trust me its very good. My hairs got much better. splitens got less and hair got smooth. Would recommend it to evryone.'
  }
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
    <section className="hero-banner relative h-[30vh] md:h-[50vh] bg-beige w-full max-w-full overflow-hidden animate-fadeIn mt-[145px] z-20">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {heroImages.map((image, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            onClick={() => handleImageClick(index)}
            style={{cursor: index === 0 || index === 1 ? 'pointer' : 'default'}}
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image 
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 100vw"
                priority={index === 0}
                className="object-cover object-center max-w-full w-full h-full mobile-hero-image"
                style={{
                  maxWidth: '100%',
                  objectPosition: 'center 30%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
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
  );
}

export default function Home() {
  const { addItem } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateHero, setAnimateHero] = useState(true);
  const [animateProducts, setAnimateProducts] = useState(false);
  const [trendingSection, setTrendingSection] = useState<any>(null);
  const [moreProductsSection, setMoreProductsSection] = useState<any>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  // Fetch trending products from backend
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5005/api";
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
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5005/api";
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trendingSection.map((product: any, index: number) => (
                  <Link href={`/products/${product.slug}`} key={product._id || product.id} className="border border-gray-200 bg-white p-4 text-center hover-lift animate-slideUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="img-zoom-container mb-2">
                      <Image 
                        src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover mb-2 img-zoom"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex justify-center items-center mb-4">
                      {product.salePrice ? (
                        <>
                          <span className="font-medium mr-2">₹ {product.salePrice}</span>
                          <span className="text-sm text-gray-500 line-through">₹ {product.price}</span>
                        </>
                      ) : (
                        <span className="font-medium">₹ {product.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={e => {
                        e.preventDefault();
                        addItem({
                          id: product._id || product.id,
                          name: product.name,
                          price: product.salePrice || product.price,
                          image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                        });
                        const button = e.currentTarget as HTMLButtonElement;
                        const originalText = button.innerText;
                        button.innerText = 'Added! ✓';
                        button.classList.add('bg-sage', 'text-white');
                        setTimeout(() => {
                          button.innerText = originalText;
                          button.classList.remove('bg-sage', 'text-white');
                        }, 1500);
                      }}
                      className="w-full btn-outline bg-sage text-white hover:bg-sage/90"
                    >
                      Add to cart
                    </button>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">No trending products found.</div>
            )}
          </div>
        </section>
        
        {/* Brand Promise */}
        <section className="section-beige py-6 md:py-10">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 animate-slideInRight text-sage">OUR PROMISE</h2>
            <div className="w-24 h-1 bg-sage mx-auto mb-5"></div>
            <p className="text-lg md:text-xl mb-6 text-center max-w-3xl mx-auto leading-relaxed animate-slideInLeft delay-200">
              Clean, effective products with <span className="font-semibold text-primary-dark">UNIK-ly no nasty stuff</span>. We believe in creating products that are good for you and the environment.
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
                      src="https://abso-essentials.com/cdn/shop/files/5.png?v=1725436593&width=360"
                      alt="Ethically Made"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Ethically Made</h3>
                  <p className="text-primary">Cruelty-free products that are never tested on animals and responsibly sourced.</p>
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
                  <h3 className="text-xl font-medium mb-2">Sustainable Packaging</h3>
                  <p className="text-primary">Eco-friendly packaging that minimizes waste and environmental impact.</p>
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
                    src="https://abso-essentials.com/cdn/shop/files/5.png?v=1725436593&width=360"
                    alt="Ethically Made"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-medium mb-2">Ethically Made</h3>
                <p className="text-primary">Cruelty-free products that are never tested on animals and responsibly sourced.</p>
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
                <h3 className="text-xl font-medium mb-2">Sustainable Packaging</h3>
                <p className="text-primary">Eco-friendly packaging that minimizes waste and environmental impact.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Secondary Products */}
        <section className="section-beige py-6 md:py-10">
          <div className="container">
            <h3 className="text-2xl font-bold text-center mb-6 animate-slideInRight text-sage">MORE PRODUCTS</h3>
            {/* Fetch more products from backend */}
            {moreProductsSection && moreProductsSection.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {moreProductsSection.map((product: any, index: number) => (
                  <Link href={`/products/${product.slug}`} key={product._id || product.id} className="border border-gray-200 bg-white p-4 text-center hover-lift animate-slideUp" style={{animationDelay: `${index * 0.1 + 0.2}s`}}>
                    <div className="img-zoom-container mb-2">
                      <Image 
                        src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover mb-2 img-zoom"
                      />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                    <div className="flex justify-center items-center mb-4">
                      {product.salePrice ? (
                        <>
                          <span className="font-medium mr-2">₹ {product.salePrice}</span>
                          <span className="text-sm text-gray-500 line-through">₹ {product.price}</span>
                        </>
                      ) : (
                        <span className="font-medium">₹ {product.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={e => {
                        e.preventDefault();
                        addItem({
                          id: product._id || product.id,
                          name: product.name,
                          price: product.salePrice || product.price,
                          image: (product.images && product.images.length > 0 ? product.images[0] : product.image) || '/images/products/default.png'
                        });
                        const button = e.currentTarget as HTMLButtonElement;
                        const originalText = button.innerText;
                        button.innerText = 'Added! ✓';
                        button.classList.add('bg-sage', 'text-white');
                        setTimeout(() => {
                          button.innerText = originalText;
                          button.classList.remove('bg-sage', 'text-white');
                        }, 1500);
                      }}
                      className="w-full btn-outline bg-sage text-white hover:bg-sage/90"
                    >
                      Add to cart
                    </button>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">No more products found.</div>
            )}
          </div>
        </section>
        
        {/* Video Showcase Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-6 animate-slideInRight">SEE IT IN ACTION</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            
            {/* Mobile horizontal scroll for small screens */}
            <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
              <div className="flex space-x-6 px-4 min-w-max">
                <VideoCard 
                  videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/2a3fecebbc114f389c414a9d6be38f31/2a3fecebbc114f389c414a9d6be38f31.HD-1080p-2.5Mbps-33768145.mp4?v=0"
                  posterSrc="https://abso-essentials.com/cdn/shop/files/shampoo_1_4x_f97c984e-c472-4f8c-872d-7e0763f74571.png?v=1732369710"
                  title="Strengthening Shampoo"
                  subtitle="Tames frizz & strengthens hair"
                  badgeText="Best Seller"
                  badgeColor="purple"
                  link="/products/strengthening-shampoo"
                />
                
                <VideoCard 
                  videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/878ccfa816e0483aa05c60a273b566a2/878ccfa816e0483aa05c60a273b566a2.HD-1080p-7.2Mbps-44790003.mp4?v=0"
                  posterSrc="https://abso-essentials.com/cdn/shop/files/Artboard_1_4x_66b3460b-4ef8-4944-b011-09b93f15b0ed.png?v=1732274383"
                  title="Barrier Repair Moisturizer"
                  subtitle="Ultra hydrating"
                  badgeText="Anti-ageing"
                  badgeColor="blue"
                  link="/products/barrier-repair-moisturizer"
                />
                
                <VideoCard 
                  videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/bf7c9dc86dde4a7bbaabd0b8cfc87c9f/bf7c9dc86dde4a7bbaabd0b8cfc87c9f.HD-1080p-2.5Mbps-33768130.mp4?v=0"
                  posterSrc="https://abso-essentials.com/cdn/shop/files/bodywash_4x_2634efb5-8a92-4bf4-8a54-0e54cfca5b63.png?v=1732365058"
                  title="Hydrating Bodywash"
                  subtitle="Reinforces skin barrier"
                  badgeText="New"
                  badgeColor="green"
                  link="/products/hydrating-bodywash"
                />
                
                <VideoCard 
                  videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/ac950bac49414d7eaec094fdb5008fce/ac950bac49414d7eaec094fdb5008fce.HD-720p-1.6Mbps-33768274.mp4?v=0"
                  posterSrc="https://abso-essentials.com/cdn/shop/files/shower_combo_4x_8a72d7c0-6ca0-49cc-ad5e-d5cf191feb46.png?v=1743841891"
                  title="Hair Care Combo"
                  subtitle="Complete hair care system"
                  badgeText="Value Pack"
                  badgeColor="purple"
                  link="/products/hair-care-combo"
                />
              </div>
            </div>
            
            {/* Grid layout for medium screens and above */}
            <div className="hidden md:grid md:grid-cols-4 gap-8 md:gap-10">
              <VideoCard 
                videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/2a3fecebbc114f389c414a9d6be38f31/2a3fecebbc114f389c414a9d6be38f31.HD-1080p-2.5Mbps-33768145.mp4?v=0"
                posterSrc="https://abso-essentials.com/cdn/shop/files/shampoo_1_4x_f97c984e-c472-4f8c-872d-7e0763f74571.png?v=1732369710"
                title="Strengthening Shampoo"
                subtitle="Tames frizz & strengthens hair"
                badgeText="Best Seller"
                badgeColor="purple"
                link="/products/strengthening-shampoo"
              />
              
              <VideoCard 
                videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/878ccfa816e0483aa05c60a273b566a2/878ccfa816e0483aa05c60a273b566a2.HD-1080p-7.2Mbps-44790003.mp4?v=0"
                posterSrc="https://abso-essentials.com/cdn/shop/files/Artboard_1_4x_66b3460b-4ef8-4944-b011-09b93f15b0ed.png?v=1732274383"
                title="Barrier Repair Moisturizer"
                subtitle="Ultra hydrating"
                badgeText="Anti-ageing"
                badgeColor="blue"
                link="/products/barrier-repair-moisturizer"
              />
              
              <VideoCard 
                videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/bf7c9dc86dde4a7bbaabd0b8cfc87c9f/bf7c9dc86dde4a7bbaabd0b8cfc87c9f.HD-1080p-2.5Mbps-33768130.mp4?v=0"
                posterSrc="https://abso-essentials.com/cdn/shop/files/bodywash_4x_2634efb5-8a92-4bf4-8a54-0e54cfca5b63.png?v=1732365058"
                title="Hydrating Bodywash"
                subtitle="Reinforces skin barrier"
                badgeText="New"
                badgeColor="green"
                link="/products/hydrating-bodywash"
              />
              
              <VideoCard 
                videoSrc="https://abso-essentials.com/cdn/shop/videos/c/vp/ac950bac49414d7eaec094fdb5008fce/ac950bac49414d7eaec094fdb5008fce.HD-720p-1.6Mbps-33768274.mp4?v=0"
                posterSrc="https://abso-essentials.com/cdn/shop/files/shower_combo_4x_8a72d7c0-6ca0-49cc-ad5e-d5cf191feb46.png?v=1743841891"
                title="Hair Care Combo"
                subtitle="Complete hair care system"
                badgeText="Value Pack"
                badgeColor="purple"
                link="/products/hair-care-combo"
              />
            </div>
          </div>
        </section>
        
        {/* Nature Power Section */}
        <section className="section-beige py-8 md:py-12">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 animate-scaleUp text-sage">NATURE'S POWER</h2>
            <div className="w-24 h-1 bg-sage mx-auto mb-6"></div>
            <p className="text-lg md:text-2xl mb-8 text-center max-w-3xl mx-auto leading-relaxed animate-slideInLeft">
              Harness the natural ingredients for healthier skin and hair.
            </p>
            
            {/* Mobile horizontal scroll for small screens */}
            <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar mt-6">
              <div className="flex space-x-4 px-4 min-w-max">
                <div className="w-80 bg-white/70 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp group">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src="https://abso-essentials.com/cdn/shop/files/Vegan-keratin_2.webp?v=1725610274&width=360"
                      alt="Vegan Keratin"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-medium mb-3 text-sage">Vegan Keratin</h3>
                    <p className="text-primary leading-relaxed">A plant-based protein that strengthens and repairs hair from within, without any animal-derived ingredients.</p>
                  </div>
                </div>
                
                <div className="w-80 bg-white/70 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp delay-200 group">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src="https://abso-essentials.com/cdn/shop/files/Turmeric_2.webp?v=1725610298&width=360"
                      alt="Turmeric Extract"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-medium mb-3 text-sage">Turmeric Extract</h3>
                    <p className="text-primary leading-relaxed">Rich in antioxidants and anti-inflammatory properties that help soothe skin and promote a healthy, glowing complexion.</p>
                  </div>
                </div>
                
                <div className="w-80 bg-white/70 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp delay-300 group">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src="https://abso-essentials.com/cdn/shop/files/Rosemary_2.webp?v=1725610343&width=360"
                      alt="Rosemary Extract"
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-medium mb-3 text-sage">Rosemary Extract</h3>
                    <p className="text-primary leading-relaxed">Stimulates hair follicles and improves circulation to the scalp, promoting healthy hair growth and preventing premature hair loss.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grid layout for medium screens and above */}
            <div className="hidden md:grid md:grid-cols-3 gap-10 mt-8">
              <div className="bg-white/70 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp group">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src="https://abso-essentials.com/cdn/shop/files/Vegan-keratin_2.webp?v=1725610274&width=360"
                    alt="Vegan Keratin"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-medium mb-3 text-sage">Vegan Keratin</h3>
                  <p className="text-primary leading-relaxed">A plant-based protein that strengthens and repairs hair from within, without any animal-derived ingredients.</p>
                </div>
              </div>
              
              <div className="bg-white/70 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp delay-200 group">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src="https://abso-essentials.com/cdn/shop/files/Turmeric_2.webp?v=1725610298&width=360"
                    alt="Turmeric Extract"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-medium mb-3 text-sage">Turmeric Extract</h3>
                  <p className="text-primary leading-relaxed">Rich in antioxidants and anti-inflammatory properties that help soothe skin and promote a healthy, glowing complexion.</p>
                </div>
              </div>
              
              <div className="bg-white/70 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 animate-slideUp delay-300 group">
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src="https://abso-essentials.com/cdn/shop/files/Rosemary_2.webp?v=1725610343&width=360"
                    alt="Rosemary Extract"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-medium mb-3 text-sage">Rosemary Extract</h3>
                  <p className="text-primary leading-relaxed">Stimulates hair follicles and improves circulation to the scalp, promoting healthy hair growth and preventing premature hair loss.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="section py-8 md:py-12">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-3 animate-slideInLeft text-sage">Let customers speak for us</h2>
            <p className="text-center text-gray-600 mb-8 animate-slideInRight">from 363 reviews</p>
            
            {/* Mobile horizontal scroll for small screens */}
            <div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
              <div className="flex space-x-4 px-4 min-w-max">
                {testimonials.map((testimonial, index) => (
                  <div key={`testimonial-mobile-${testimonial.id}`} className="w-80 border border-gray-200 p-6 bg-white hover-lift animate-scaleUp" style={{animationDelay: `${index * 0.1}s`}}>
                    <h3 className="font-medium mb-2">{testimonial.review}</h3>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                    <p className="text-sm text-gray-700 mt-2">{testimonial.product}</p>
                  </div>
                ))}
              </div>
        </div>
            
            {/* Grid layout for medium screens and above */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="border border-gray-200 p-6 bg-white hover-lift animate-scaleUp" style={{animationDelay: `${index * 0.1}s`}}>
                  <h3 className="font-medium mb-2">{testimonial.review}</h3>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.date}</p>
                  <p className="text-sm text-gray-700 mt-2">{testimonial.product}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Instagram Section */}
        <section className="section bg-beige py-8 md:py-12">
          <div className="container text-center">
            <h2 className="text-2xl font-bold mb-6 animate-slideInLeft text-sage">Follow On Instagram</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="img-zoom-container animate-scaleUp" style={{animationDelay: "0s"}}>
                <Image 
                  src="https://images.unsplash.com/photo-1633021708009-a671181167c4?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhdXR5JTIwd2VsbG5lc3N8ZW58MHx8MHx8fDA%3D"
                  alt="Instagram post 1"
                  width={200}
                  height={200}
                  className="w-full aspect-square object-cover img-zoom"
                />
              </div>
              <div className="img-zoom-container animate-scaleUp" style={{animationDelay: "0.1s"}}>
                <Image 
                  src="https://images.unsplash.com/photo-1552511556-9f16dcb6561f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVhdXR5JTIwd2VsbG5lc3N8ZW58MHx8MHx8fDA%3D"
                  alt="Instagram post 2"
                  width={200}
                  height={200}
                  className="w-full aspect-square object-cover img-zoom"
                />
              </div>
              <div className="img-zoom-container animate-scaleUp" style={{animationDelay: "0.2s"}}>
                <Image 
                  src="https://images.unsplash.com/photo-1618843645958-4a9561267b18?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVhdXR5JTIwd2VsbG5lc3N8ZW58MHx8MHx8fDA%3D"
                  alt="Instagram post 3"
                  width={200}
                  height={200}
                  className="w-full aspect-square object-cover img-zoom"
                />
              </div>
              <div className="img-zoom-container animate-scaleUp" style={{animationDelay: "0.3s"}}>
                <Image 
                  src="https://images.unsplash.com/photo-1669355106052-b7456721510c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmVhdXR5JTIwd2VsbG5lc3N8ZW58MHx8MHx8fDA%3D"
                  alt="Instagram post 4"
                  width={200}
                  height={200}
                  className="w-full aspect-square object-cover img-zoom"
                />
              </div>
              <div className="img-zoom-container animate-scaleUp" style={{animationDelay: "0.4s"}}>
                <Image 
                  src="https://images.unsplash.com/photo-1725799908052-52e7d899c7cd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGJlYXV0eSUyMHdlbGxuZXNzfGVufDB8fDB8fHww"
                  alt="Instagram post 5"
                  width={200}
                  height={200}
                  className="w-full aspect-square object-cover img-zoom"
                />
              </div>
              <div className="img-zoom-container animate-scaleUp" style={{animationDelay: "0.5s"}}>
                <Image 
                  src="https://images.unsplash.com/photo-1564594303425-2be2aa4f34f9?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGJlYXV0eSUyMHdlbGxuZXNzfGVufDB8fDB8fHww"
                  alt="Instagram post 6"
                  width={200}
                  height={200}
                  className="w-full aspect-square object-cover img-zoom"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Blog Section */}
        <section className="section py-8 md:py-12">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8 animate-slideInRight text-sage">BLOGS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-gray-200 bg-white hover-lift animate-slideUp" style={{animationDelay: "0s"}}>
                <div className="img-zoom-container">
          <Image
                    src="https://abso-essentials.com/cdn/shop/articles/Which_Shampoo_should_i_use_1_57441b8a-8325-4d91-8b96-10e3e7d1de4e.png?v=1742896499"
                    alt="Blog post image"
                    width={800}
                    height={400}
                    className="w-full h-48 object-cover img-zoom"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2 hover:text-accent transition-colors duration-300">Which Shampoo Is Best for Your Hair? The Ultimate Guide</h3>
                  <p className="text-sm text-gray-600 mb-3">25 Mar 2025</p>
                  <p className="text-gray-700">Your hair deserves the best care, and choosing the right shampoo is the first step toward healthy, beautiful locks...</p>
                </div>
              </div>
              <div className="border border-gray-200 bg-white hover-lift animate-slideUp" style={{animationDelay: "0.2s"}}>
                <div className="img-zoom-container">
          <Image
                    src="https://abso-essentials.com/cdn/shop/articles/hair_conditioner_blog_post_image.webp?v=1727425508"
                    alt="Blog post image"
                    width={800}
                    height={400}
                    className="w-full h-48 object-cover img-zoom"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2 hover:text-accent transition-colors duration-300">Nourish Your Locks: The Importance of Hair Conditioner</h3>
                  <p className="text-sm text-gray-600 mb-3">24 Aug 2024</p>
                  <p className="text-gray-700">Hair care isn't just about shampooing; it's a holistic regimen that includes conditioning...</p>
                </div>
              </div>
              <div className="border border-gray-200 bg-white hover-lift animate-slideUp" style={{animationDelay: "0.4s"}}>
                <div className="img-zoom-container">
          <Image
                    src="https://abso-essentials.com/cdn/shop/articles/Niacinamide-Blog-1200-x-600-px-1_1_b8cdd78b-a731-42e0-87ca-04712dc2cd88.jpg?v=1724486195"
                    alt="Blog post image"
                    width={800}
                    height={400}
                    className="w-full h-48 object-cover img-zoom"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2 hover:text-accent transition-colors duration-300">Best Sulphate-Free Shampoos for Healthy and Shiny Locks</h3>
                  <p className="text-sm text-gray-600 mb-3">24 Aug 2024</p>
                  <p className="text-gray-700">Maintaining healthy and shiny hair is a goal shared by many, but achieving it often involves...</p>
                </div>
              </div>
            </div>
    </div>
        </section>
      </main>
    </>
  );
}
