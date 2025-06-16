"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';

// Sample hair care products data (in a real app, this would come from an API/backend)
const hairCareProducts = [
	{
		id: '1',
		name: 'Rosemary Shampoo',
		description: 'Sulfate-Free | Strengthens hair | Renews shine | Hair Strengthening',
		price: 649,
		salePrice: 599,
		image: '/images/products/rosemary shampoo.jpeg',
		slug: 'strengthening-shampoo',
		reviewCount: 122,
		soldOut: false,
		category: 'Shampoo',
		concern: ['Hair Fall', 'Damaged Hair'],
		tags: ['Bestseller']
	},
	{
		id: '2',
		name: 'Hair Gel Mask',
		description: 'Repairs split ends | restores shine, | smooths frizz | Reduces hair fall',
		price: 599,
		salePrice: 549,
		image: '/images/products/hair gel mask.jpeg',
		slug: 'Hair Gel Mask',
		reviewCount: 84,
		soldOut: false,
		category: 'Gel Mask',
		concern: ['Dry Hair', 'Frizzy Hair'],
		tags: ['Popular']
	},
	{
		id: '3',
		name: 'Cold-Pressed Herbal Hair Oil',
		description: 'Contains cold-pressed coconut | Boosts hair growth| reduces hair fal | Evens skin tone',
		price: 699,
		salePrice: undefined, // changed from null to undefined
		image: '/images/products/herbel hair oil.jpeg',
		slug: 'Cold-Pressed Herbal Hair Oil',
		reviewCount: 56,
		soldOut: false,
		category: 'Herbal Hair Oil',
		concern: ['Damaged Hair', 'Dry Hair']
	},
	{
		id: '4',
		name: 'Pure Rosemary Essential Oil',
		description: '100% undiluted steam-distilled rosemary oil | Encourages hair growth |  improves focus',
		price: 749,
		salePrice: 699,
		image: 'https://abso-essentials.com/cdn/shop/files/shower_combo_4x_8a72d7c0-6ca0-49cc-ad5e-d5cf191feb46.png?v=1743841891&width=940',
		slug: 'Pure Rosemary Essential Oil',
		reviewCount: 42,
		soldOut: false,
		category: 'Rosemary Essential Oil',
		concern: ['Oily Scalp', 'Dandruff']
	},
	{
		id: '5',
		name: ' Natural Hair Spa Cream',
		description: 'Deep Conditioning Treatment | Blended with rosemary | Repairs damaged strands',
		price: 899,
		salePrice: 849,
		image: 'https://abso-essentials.com/cdn/shop/files/shower_combo-21.jpg?v=1743842537&width=940',
		slug: 'hair-growth-serum',
		reviewCount: 68,
		soldOut: false,
		category: 'Serum',
		concern: ['Hair Fall', 'Thin Hair'],
		tags: ['New']
	},
	{
		id: '6',
		name: 'Natural Lemon Soap',
		description: 'Brightening & Antibacterial Cleanser | Made with real lemon  peel oil  ',
		price: 549,
		salePrice: 522,
		image: 'https://abso-essentials.com/cdn/shop/files/bodywash_4x_2634efb5-8a92-4bf4-8a54-0e54cfca5b63.png?v=1732365058&width=533',
		slug: 'Natural Lemon Soap',
		reviewCount: 65,
		soldOut: false,
		category: 'Body Wash',
		concern: ['Dry Skin', 'Sensitivity']
	},
	{
		id: '7',
		name: 'Anti-Frizz Hair Oil',
		description: 'Controls frizz | Adds shine | Smooths hair',
		price: 649,
		salePrice: 599,
		image: 'https://abso-essentials.com/cdn/shop/files/3_in_1_4x_b26c9835-68d9-4259-b320-ff36c95003e6.png?v=1743842537&width=940',
		slug: 'anti-frizz-hair-oil',
		reviewCount: 34,
		soldOut: false,
		category: 'Hair Oil',
		concern: ['Frizzy Hair', 'Damaged Hair']
	},
	{
		id: '8',
		name: 'Scalp Massager',
		description: 'Improves blood circulation | Cleanses scalp thoroughly',
		price: 299,
		salePrice: 249,
		image: 'https://abso-essentials.com/cdn/shop/files/1_4x_1990d46d-2c96-4d49-a6b2-12459a0acd3c.png?v=1733732673&width=940',
		slug: 'scalp-massager',
		reviewCount: 92,
		soldOut: false,
		category: 'Accessory',
		concern: ['Oily Scalp', 'Dandruff', 'Hair Fall'],
		tags: ['Trending']
	},
	{
		id: '9',
		name: 'Dry Shampoo',
		description: 'Absorbs excess oil | Adds volume | Refreshes hair ',
		price: 399,
		salePrice: 369,
		image: 'https://abso-essentials.com/cdn/shop/files/shampoo_1_4x_f97c984e-c472-4f8c-872d-7e0763f74571.png?v=1732369710',
		slug: 'dry-shampoo',
		reviewCount: 29,
		soldOut: false,
		category: 'Shampoo',
		concern: ['Oily Scalp', 'Limp Hair']
	},
	{
		id: '10',
		name: 'Heat Protectant Spray',
		description: 'Shields hair from heat | Prevents damage | Adds shine | Reduces frizz',
		price: 499,
		salePrice: 469,
		image: 'https://abso-essentials.com/cdn/shop/files/mini_conditioner_02.jpg?v=1742231923&width=940',
		slug: 'heat-protectant-spray',
		reviewCount: 47,
		soldOut: false,
		category: 'Treatment',
		concern: ['Damaged Hair', 'Frizzy Hair', 'Heat Styling']
	}
];

export default function HairCarePage() {
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
					imageAlt="Hair Care Collection"
					title=""
					subtitle=""
					height="lg"
				/>

				{/* Products Section */}
				<section className="section-beige py-12">
					<div className="container">
						<div className="mb-8">
							<h2 className="text-2xl font-semibold">
								Products <span className="text-lg font-normal text-gray-600">({hairCareProducts.length} items)</span>
							</h2>
						</div>

						{/* Mobile horizontal scroll for small screens */}
						<div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
							<div className="flex space-x-4 px-4 min-w-max">
								{hairCareProducts.slice(0, visibleProducts).map((product, index) => (
									<div key={product.id} className="w-64">
										<ProductCard {...product} animationDelay={index % 3} />
									</div>
								))}
							</div>
						</div>

						{/* Grid layout for medium screens and above */}
						<div className="hidden md:grid md:grid-cols-3 gap-6">
							{hairCareProducts.slice(0, visibleProducts).map((product, index) => (
								<ProductCard key={product.id} {...product} animationDelay={index % 3} />
							))}
						</div>

						{/* Load More Button */}
						{visibleProducts < hairCareProducts.length && (
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

				{/* Hair Care Guide Section */}
				<section className="py-16 bg-white">
					<div className="container">
						<div className="max-w-4xl mx-auto">
							<h2 className="text-3xl font-bold text-center mb-12">Your Hair Care Guide</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
								<div className="bg-beige p-8 rounded-lg">
									<h3 className="text-2xl font-semibold mb-4">How to Use Our Products</h3>

									<div className="space-y-4">
										<div>
											<h4 className="font-medium text-lg">Step 1: Cleanse</h4>
											<p className="text-gray-700">Start with our Strengthening Shampoo to remove impurities while nourishing your scalp and hair.</p>
										</div>

										<div>
											<h4 className="font-medium text-lg">Step 2: Condition</h4>
											<p className="text-gray-700">Follow with our Nourishing Conditioner to hydrate, detangle, and add shine to your hair.</p>
										</div>

										<div>
											<h4 className="font-medium text-lg">Step 3: Treat</h4>
											<p className="text-gray-700">Apply our Hair Growth Serum to targeted areas or use our Hydrating Hair Mask once a week for deep treatment.</p>
										</div>

										<div>
											<h4 className="font-medium text-lg">Step 4: Style</h4>
											<p className="text-gray-700">Finish with our Anti-Frizz Hair Oil to control frizz and add a healthy shine to your hair.</p>
										</div>
									</div>
								</div>

								<div className="flex flex-col gap-6">
									<div className="bg-beige p-6 rounded-lg">
										<h3 className="text-xl font-semibold mb-3">Common Hair Concerns</h3>
										<ul className="list-disc pl-5 space-y-2 text-gray-700">
											<li><span className="font-medium">Hair Fall:</span> Try our Strengthening Shampoo and Hair Growth Serum</li>
											<li><span className="font-medium">Dryness:</span> Our Hydrating Hair Mask and Nourishing Conditioner provide deep moisture</li>
											<li><span className="font-medium">Frizz:</span> Control with our Anti-Frizz Hair Oil and Heat Protectant Spray</li>
											<li><span className="font-medium">Dandruff:</span> Our Scalp Detox Treatment helps balance the scalp</li>
										</ul>
									</div>

									<div className="bg-beige p-6 rounded-lg">
										<h3 className="text-xl font-semibold mb-3">Did You Know?</h3>
										<p className="text-gray-700">
											All our hair care products are made with clean, naturally-derived ingredients that are gentle on your hair and the environment. 
											We never use sulfates, parabens, silicones, or artificial colors in our formulations.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}