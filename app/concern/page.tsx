"use client";

import Link from 'next/link';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import Image from 'next/image';

// Sample concerns data (in a real app, this would come from an API/backend)
const concerns = [
  {
    id: '1',
    name: 'Damaged Hair',
    description: 'Solutions for split ends, breakage, and chemical damage',
    image: 'https://abso-essentials.com/cdn/shop/files/hair_serum_4x_14ea2c27-0747-40b7-9b47-f9906b017a03.png?v=1732366858',
    slug: 'damaged-hair',
    category: 'Hair'
  },
  {
    id: '2',
    name: 'Dull and Frizzy Hair',
    description: 'Treatments for smooth, shiny, and manageable hair',
    image: 'https://abso-essentials.com/cdn/shop/files/conditioner_4x_efdc997a-2e92-498d-a1e0-6c8d40bc4039.png?v=1732363878',
    slug: 'dull-frizzy-hair',
    category: 'Hair'
  },
  {
    id: '3',
    name: 'Dullness and Aging',
    description: 'Formulas to rejuvenate and brighten dull, aging skin',
    image: 'https://abso-essentials.com/cdn/shop/files/serum_4x_68f44ab1-8fd2-4ef1-a81a-3f89ff023ba4.png?v=1732367146',
    slug: 'dullness-aging',
    category: 'Skin'
  },
  {
    id: '4',
    name: 'Oily Scalp',
    description: 'Balancing solutions for excess oil and scalp health',
    image: 'https://abso-essentials.com/cdn/shop/files/scalp_serum_4x_747ae13a-9e27-43f6-b58a-1c8ffb8c2c9e.png?v=1732368929',
    slug: 'oily-scalp',
    category: 'Hair'
  },
  {
    id: '5',
    name: 'Body Acne and Rashes',
    description: 'Gentle treatments for sensitive and blemish-prone skin',
    image: 'https://abso-essentials.com/cdn/shop/files/bodywash_4x_2634efb5-8a92-4bf4-8a54-0e54cfca5b63.png?v=1732365058',
    slug: 'body-acne',
    category: 'Body'
  }
];

export default function ShopByConcernPage() {
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Banner */}
        <HeroBanner 
          imageSrc="/images/products/unik second.jpeg"
          imageAlt="Shop By Concern"
          title="Shop By Concern"
          subtitle="Solutions targeted to your specific needs"
          height="md"
          maxContentWidth="max-w-2xl"
        />

        {/* Concerns Section */}
        <section className="section-beige py-16">
          <div className="container">
            <div className="mb-12 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Personalized Solutions</h2>
              <p className="text-lg text-primary-dark">Find products specially formulated to address your specific concerns for hair, skin and body.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {concerns.map((concern, index) => (
                <Link 
                  key={concern.id}
                  href={`/concern/${concern.slug}`}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover-lift animate-slideUp"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="relative h-64">
                    <div className="img-zoom-container h-full">
                      <Image 
                        src={concern.image}
                        alt={concern.name}
                        fill
                        className="object-contain img-zoom"
                      />
                    </div>
                    <div className="absolute top-4 left-4 bg-accent text-white py-1 px-3 rounded-full text-xs">
                      {concern.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{concern.name}</h3>
                    <p className="text-gray-600 mb-4">{concern.description}</p>
                    <div className="flex items-center text-accent font-medium">
                      <span>Explore Solutions</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Consultation Banner */}
        <section className="section pb-0">
          <div className="container">
            <div className="bg-primary text-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
                <p className="text-white/80 text-lg max-w-2xl">Our experts can help you find the perfect products for your specific concerns.</p>
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