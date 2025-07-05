'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription here
    console.log('Subscribing email:', email);
    setEmail('');
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="flex flex-col">
            <div className="mb-0">
              <Image 
                src="/images/logo.png" 
                alt="Uniknaturals Logo"
                width={180}
                height={100}
                className="h-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Sanchar Nagar, Main Near Shree Ram Market, Kanadiya Road, Indore, Madhya Pradesh-452016.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Email: theunikstyle3@gmail.com
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Phone: 6264949997
            </p>
            <div className="flex space-x-4 mt-auto">
              <a href="https://www.facebook.com/profile.php?id=61577357681320" className="text-sage hover:text-sage/80 transition-colors" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://www.instagram.com/uniknaturals/" className="text-sage hover:text-sage/80 transition-colors" target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://youtube.com" className="text-sage hover:text-sage/80 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-sage uppercase mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/hair-care" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Hair Care
                </Link>
              </li>
              <li>
                <Link href="/skin-care" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Skin Care
                </Link>
              </li>
              <li>
                <Link href="/combos" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Combos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <a href="https://www.amazon.in/storefront?me=AIAVXLESF6FAS&ref_=ssf_share" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Buy from Amazon
                </a>
              </li>
            </ul>
          </div>
          
          {/* Customer Services */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-sage uppercase mb-6">Customer Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Return and Refunds
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/review-guidelines" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Customer Review Guidelines
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-sage transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-sage uppercase mb-6">Newsletter</h3>
            <p className="text-sm text-gray-600 mb-4">
              Be the first to get the latest news about trend, promotions and more.
              Don't worry! we do not spam
            </p>
            <form onSubmit={handleSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
                required
                className="flex-grow border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sage"
              />
              <button
                type="submit"
                className="bg-sage text-white px-4 py-2 text-sm hover:bg-sage/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 mb-12 md:mb-0">
              © {new Date().getFullYear()}, Uniknaturals. All rights reserved.
            </p>
            {/* <div className="flex space-x-4">
              <div className="h-8 w-12 bg-gray-100 flex items-center justify-center rounded border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">VISA</span>
              </div>
              <div className="h-8 w-12 bg-gray-100 flex items-center justify-center rounded border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">MC</span>
              </div>
              <div className="h-8 w-12 bg-gray-100 flex items-center justify-center rounded border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">AMEX</span>
              </div>
              <div className="h-8 w-12 bg-gray-100 flex items-center justify-center rounded border border-gray-200">
                <span className="text-xs text-gray-600 font-medium">PAYPAL</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      
      {/* Mobile Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 lg:hidden z-40">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-sage">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link href="/shop" className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-sage">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-sage">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Account</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-sage">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs mt-1">Cart</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}