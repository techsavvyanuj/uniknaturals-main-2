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
					imageSrc="/images/products/unik first poster.jpeg"
					imageAlt="Hair Care Collection"
					title=""
					subtitle=""
					height="lg"
					boxed={true}
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
							<h2 className="text-3xl font-bold text-center mb-12">🌿 Unik Naturals Hair Care Guide</h2>
							<p className="text-lg text-center mb-10">Your Natural Ritual for Healthy, Nourished Hair</p>

							<div className="space-y-10">
								{/* Step 1 */}
								<div className="bg-beige p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-2">Step 1: Scalp Oil Therapy – Nourish from the Roots</h3>
									<p className="mb-1"><span className="font-medium">Product:</span> Herbal Hair Oil</p>
									<p className="mb-2">💧 Enriched with Ayurvedic herbs and wood-pressed oils</p>
									<p className="font-medium">How to Use:</p>
									<ul className="list-disc pl-6 mb-2 text-gray-700">
										<li>Apply generously on the scalp and massage in circular motions for 5-10 minutes.</li>
										<li>Leave overnight or at least for 2 hours.</li>
									</ul>
									<p className="font-medium">Benefits:</p>
									<ul className="list-disc pl-6 text-gray-700">
										<li>Strengthens roots</li>
										<li>Reduces hair fall</li>
										<li>Deeply nourishes the scalp</li>
									</ul>
								</div>

								{/* Step 2 */}
								<div className="bg-beige p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-2">Step 2: Gentle Cleansing – Cleanse Without Stripping Moisture</h3>
									<p className="mb-1"><span className="font-medium">Product:</span> Herbal Shampoo</p>
									<p className="mb-2">🌿 Infused with natural extracts, free from sulfates and parabens</p>
									<p className="font-medium">How to Use:</p>
									<ul className="list-disc pl-6 mb-2 text-gray-700">
										<li>Wet your hair and apply shampoo on scalp and lengths.</li>
										<li>Gently massage and rinse thoroughly.</li>
										<li>Repeat if needed.</li>
									</ul>
									<p className="font-medium">Benefits:</p>
									<ul className="list-disc pl-6 text-gray-700">
										<li>Cleanses gently</li>
										<li>Maintains scalp balance</li>
										<li>Leaves hair soft and fresh</li>
									</ul>
								</div>

								{/* Step 3 */}
								<div className="bg-beige p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-2">Step 3: Deep Conditioning – Revive and Repair</h3>
									<p className="mb-1"><span className="font-medium">Product:</span> Hair Spa Cream</p>
									<p className="mb-2">💆‍♀️ With natural oils and herbal extracts for deep nourishment</p>
									<p className="font-medium">How to Use:</p>
									<ul className="list-disc pl-6 mb-2 text-gray-700">
										<li>After shampoo, apply on damp hair from mid-length to ends.</li>
										<li>Leave on for 15-20 minutes.</li>
										<li>Wrap in a warm towel for deeper penetration, then rinse.</li>
									</ul>
									<p className="font-medium">Benefits:</p>
									<ul className="list-disc pl-6 text-gray-700">
										<li>Repairs damaged strands</li>
										<li>Adds shine and softness</li>
										<li>Controls frizz</li>
									</ul>
								</div>

								{/* Step 4 */}
								<div className="bg-beige p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-2">Step 4: Herbal Rinse & Scalp Tonic – Boost Growth & Soothe</h3>
									<p className="mb-1"><span className="font-medium">Product:</span> Rosemary Water Spray</p>
									<p className="mb-2">🌱 Steam-distilled rosemary for daily scalp care</p>
									<p className="font-medium">How to Use:</p>
									<ul className="list-disc pl-6 mb-2 text-gray-700">
										<li>Spray directly on the scalp daily, even on non-wash days.</li>
										<li>Gently massage to boost circulation.</li>
									</ul>
									<p className="font-medium">Benefits:</p>
									<ul className="list-disc pl-6 text-gray-700">
										<li>Promotes hair growth</li>
										<li>Reduces dandruff and itchiness</li>
										<li>Refreshes scalp</li>
									</ul>
								</div>

								{/* Step 5 */}
								<div className="bg-beige p-6 rounded-lg">
									<h3 className="text-xl font-semibold mb-2">Step 5: Intensive Treatment – Strengthen & Stimulate</h3>
									<p className="mb-1"><span className="font-medium">Product:</span> Rosemary Essential Oil</p>
									<p className="mb-2">🌿 100% Pure and potent</p>
									<p className="font-medium">How to Use:</p>
									<ul className="list-disc pl-6 mb-2 text-gray-700">
										<li>Mix a few drops with your hair oil or carrier oil.</li>
										<li>Apply to the scalp and massage.</li>
										<li>Use 2-3 times a week.</li>
									</ul>
									<p className="font-medium">Benefits:</p>
									<ul className="list-disc pl-6 text-gray-700">
										<li>Boosts hair growth</li>
										<li>Strengthens follicles</li>
										<li>Fights thinning and scalp issues</li>
									</ul>
								</div>

								{/* Tips */}
								<div className="bg-sage/10 p-6 rounded-lg mt-8">
									<h3 className="text-lg font-semibold mb-2">✨ Tips for Best Results:</h3>
									<ul className="list-disc pl-6 text-gray-700">
										<li>Avoid harsh chemical treatments or excessive heat styling.</li>
										<li>Maintain a healthy diet rich in protein, iron, and vitamins.</li>
										<li>Stay consistent with your hair care ritual.</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}