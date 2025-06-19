"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';
import { fetchProducts, Product } from '@/app/api/productsApi';

export default function HairCarePage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [visibleProducts, setVisibleProducts] = useState(9);

	useEffect(() => {
		fetchProducts('Hair Care')
			.then(data => {
				// Map _id to id for compatibility with ProductCard
				const mapped = data.map((p: any) => ({ ...p, id: p._id || p.id }));
				setProducts(mapped);
				setLoading(false);
			})
			.catch(() => {
				setError('Failed to load products');
				setLoading(false);
			});
	}, []);

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
								Products <span className="text-lg font-normal text-gray-600">({products.length} items)</span>
							</h2>
						</div>

						{loading ? (
							<div className="text-center py-10">Loading products...</div>
						) : error ? (
							<div className="text-center text-red-600 py-10">{error}</div>
						) : products.length === 0 ? (
							<div className="text-center py-10">No products found.</div>
						) : (
							<>
								{/* Mobile horizontal scroll for small screens */}
								<div className="md:hidden w-full overflow-x-auto pb-6 hide-scrollbar">
									<div className="flex space-x-4 px-4 min-w-max">
										{products.slice(0, visibleProducts).map((product, index) => (
											<div key={product.id || product.slug} className="w-64">
												<ProductCard {...product} animationDelay={index % 3} />
											</div>
										))}
									</div>
								</div>

								{/* Grid layout for medium screens and above */}
								<div className="hidden md:grid md:grid-cols-3 gap-6">
									{products.slice(0, visibleProducts).map((product, index) => (
										<ProductCard key={product.id || product.slug} {...product} animationDelay={index % 3} />
									))}
								</div>

								{/* Load More Button */}
								{visibleProducts < products.length && (
									<div className="mt-10 text-center">
										<button
											onClick={handleLoadMore}
											className="px-6 py-3 bg-sage text-white rounded-md hover:bg-sage/80 transition-all duration-300"
										>
											Load More Products
										</button>
									</div>
								)}
							</>
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