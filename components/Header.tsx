'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  
  // Handle scroll for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="sticky shadow- ">
        <div className={`bg-white text-gray-900 transition-all duration-500 ${scrolled ? 'py-0' : 'py-0'}`}>
          <div className="container flex items-center justify-between h-16 my-10">
            {/* Mobile Menu Button */}
            <div className="flex-1 flex justify-start lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-0.5 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-180"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* Logo - left-aligned on all screen sizes */}
            <div className="flex-1 flex justify-start">
              <Link href="/" className="transform transition hover:scale-105 duration-300">
                <Image 
                  src="/images/logo.png" 
                  alt="Uniknaturals Logo"
                  width={135}
                  height={100}
                  className="h-auto"
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-5 animate-slideDown absolute left-1/2 transform -translate-x-1/2">
              <Link href="/" className="text-gray-900 hover:text-gray-700 transition-all duration-300 py-0.5 px-1 relative group hover:-translate-y-0.5 transform">
                <span className="font-medium">Home</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </Link>
              <Link href="/skin-care" className="text-gray-900 hover:text-gray-700 transition-all duration-300 py-0.5 px-1 relative group hover:-translate-y-0.5 transform">
                <span className="font-medium">Skin Care</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </Link>
              <Link href="/hair-care" className="text-gray-900 hover:text-gray-700 transition-all duration-300 py-0.5 px-1 relative group hover:-translate-y-0.5 transform">
                <span className="font-medium">Hair Care</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </Link>
              <Link href="/combos" className="text-gray-900 hover:text-gray-700 transition-all duration-300 py-0.5 px-1 relative group hover:-translate-y-0.5 transform">
                <span className="font-medium">Combos</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </Link>
              <div className="relative group">
                {/* <button className="text-gray-900 hover:text-gray-700 transition-all duration-300 py-0.5 px-1 flex items-center relative group hover:-translate-y-0.5 transform"> */}
                  {/* <span className="font-medium">Shop By Concern</span> */}
                  {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span> */}
                {/* </button> */}
                <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100 z-50">
                  <Link href="/concern/damaged-hair" className="block px-4 py-1.5 text-[#6b705c] hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 hover:pl-6">
                    {/* Damaged Hai  */}
                  </Link>
                  <Link href="/concern/dull-frizzy-hair" className="block px-4 py-1.5 text-[#6b705c] hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 hover:pl-6">
                    {/* Dull and Frizzy Hair */}
                  </Link>
                  <Link href="/concern/dullness-aging" className="block px-4 py-1.5 text-[#6b705c] hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 hover:pl-6">
                    {/* Dullness and Aging */}
                  </Link>
                  <Link href="/concern/oily-scalp" className="block px-4 py-1.5 text-[#6b705c] hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 hover:pl-6">
                    {/* Oily Scalp */}
                  </Link>
                  <Link href="/concern/body-acne" className="block px-4 py-1.5 text-[#6b705c] hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 hover:pl-6">
                    {/* Body Acne and Rashes */}
                  </Link>
                </div>
              </div>
            </nav>
            
            {/* Right Navigation */}
            <div className="flex-1 flex items-center justify-end space-x-3 animate-fadeIn">
              <Link 
                href="/search"
                className="p-1 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-12"
                aria-label="Search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>
              
              <Link href="/account" className="p-1 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              
              <Link href="/cart" className="p-1 relative group hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-12 cart-dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className={`absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-125 animate-pulse text-[9px] ${itemCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              </Link>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn">
              <div className="bg-white h-full w-4/5 max-w-md overflow-auto animate-slideRight">
                <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-white text-gray-900">
                  <Link href="/" onClick={() => setIsMenuOpen(false)}>
                    <Image 
                      src="/images/logo.png" 
                      alt="Uniknaturals Logo"
                      width={130}
                      height={44}
                      className="h-auto"
                    />
                  </Link>
                  <div className="flex items-center space-x-3">
                    <Link 
                      href="/search"
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-all duration-300"
                      aria-label="Search"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </Link>
                    
                    <Link 
                      href="/account" 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </Link>
                    
                    <Link 
                      href="/cart" 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 relative group hover:bg-gray-100 rounded-full transition-all duration-300 cart-dropdown"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className={`absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-125 animate-pulse text-[9px] ${itemCount > 0 ? 'opacity-100' : 'opacity-0'}`}>
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    </Link>

                    <button 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <nav className="py-3 px-6">
                  <ul className="space-y-3">
                    <li>
                      <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-gray-800 hover:text-gray-600 font-medium transition-colors duration-300 py-2 px-3 border-b border-gray-100 bg-gray-50 rounded hover:bg-gray-100">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="/skin-care" onClick={() => setIsMenuOpen(false)} className="block text-gray-800 hover:text-gray-600 font-medium transition-colors duration-300 py-2 px-3 border-b border-gray-100 bg-gray-50 rounded hover:bg-gray-100">
                        Skin Care
                      </Link>
                    </li>
                    <li>
                      <Link href="/hair-care" onClick={() => setIsMenuOpen(false)} className="block text-gray-800 hover:text-gray-600 font-medium transition-colors duration-300 py-2 px-3 border-b border-gray-100 bg-gray-50 rounded hover:bg-gray-100">
                        Hair Care
                      </Link>
                    </li>
                    <li>
                      <Link href="/combos" onClick={() => setIsMenuOpen(false)} className="block text-gray-800 hover:text-gray-600 font-medium transition-colors duration-300 py-2 px-3 border-b border-gray-100 bg-gray-50 rounded hover:bg-gray-100">
                        Combos
                      </Link>
                    </li>
                    {/* <li className="pt-1"> */}
                      {/* <div className="block text-gray-800 hover:text-gray-600 font-medium transition-colors duration-300 py-2 px-3 border-b border-gray-100 bg-gray-50 rounded hover:bg-gray-100">Shop By Concern</div> */}
                      {/* <ul className="pl-0 space-y-2 py-1">
                        <li>
                          <Link href="/concern/damaged-hair" onClick={() => setIsMenuOpen(false)} className="block text-sm text-#6b705c hover:text-#6b705c transition-colors duration-300 text-left pl-3 py-1.5 hover:bg-#6b705c rounded">
                            Damaged Hair
                          </Link>
                        </li>
                        <li>
                          <Link href="/concern/dull-frizzy-hair" onClick={() => setIsMenuOpen(false)} className="block text-sm text-#6b705c hover:text-#6b705c transition-colors duration-300 text-left pl-3 py-1.5 hover:bg-#6b705c rounded">
                            Dull and Frizzy Hair
                          </Link>
                        </li>
                        <li>
                          <Link href="/concern/dullness-aging" onClick={() => setIsMenuOpen(false)} className="block text-sm text-#6b705c hover:text-#6b705c transition-colors duration-300 text-left pl-3 py-1.5 hover:bg-#6b705c rounded">
                            Dullness and Aging
                          </Link>
                        </li>
                        <li>
                          <Link href="/concern/oily-scalp" onClick={() => setIsMenuOpen(false)} className="block text-sm text-#6b705c hover:text-#6b705c transition-colors duration-300 text-left pl-3 py-1.5 hover:bg-#6b705c rounded">
                            Oily Scalp
                          </Link>
                        </li>
                        <li>
                          <Link href="/concern/body-acne" onClick={() => setIsMenuOpen(false)} className="block text-sm text-#6b705c hover:text-#6b705c transition-colors duration-300 text-left pl-3 py-1.5 hover:bg-#6b705c rounded">
                            Body Acne and Rashes
                          </Link>
                        </li>
                      </ul> */}
                    {/* </li> */}
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}