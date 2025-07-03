"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, Product } from '../api/productsApi';

// Sample product data for search results
// Popular searches for the empty state
const popularSearches = [
	"Shampoo", 
	"Hair Care",
	"Combo",
	"Skin Care"
];

// Separate component to use the useSearchParams hook
function SearchContent() {
	const searchParams = useSearchParams();
	const query = searchParams.get('q') || '';
	const [searchTerm, setSearchTerm] = useState(query);
	const [searchResults, setSearchResults] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [allProducts, setAllProducts] = useState<Product[]>([]);

	// Fetch all products from all categories on mount
	useEffect(() => {
		async function fetchAll() {
			setLoading(true);
			try {
				const [skin, hair, combos] = await Promise.all([
					fetchProducts('Skin Care'),
					fetchProducts('Hair Care'),
					fetchProducts('Combos'),
				]);
				const all = [...skin, ...hair, ...combos].map((p: any) => ({ ...p, id: p._id || p.id }));
				setAllProducts(all);
			} catch (e) {
				setAllProducts([]);
			}
			setLoading(false);
		}
		fetchAll();
	}, []);

	// Search function
	const performSearch = (term: string) => {
		if (!term) {
			setSearchResults([]);
			return;
		}
		
		setLoading(true);
		const lowerTerm = term.toLowerCase();
		const results = allProducts.filter(product =>
			product.name.toLowerCase().includes(lowerTerm) ||
			(product.description && product.description.toLowerCase().includes(lowerTerm)) ||
			(product.category && product.category.toLowerCase().includes(lowerTerm))
		);
		
		setSearchResults(results);
		setLoading(false);
	};

	// Search when the query parameter changes
	useEffect(() => {
		setSearchTerm(query);
		performSearch(query);
	}, [query, allProducts]);

	return (
		<div className="container max-w-6xl mx-auto px-7 py-12">
			<div className="max-w-3xl mx-auto mb-8">
				<div className="flex items-center border-b-2 border-accent pb-2">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500 mr-3">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input 
						type="text" 
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								performSearch(searchTerm);
								// Update URL for shareable search results
								const url = new URL(window.location.href);
								url.searchParams.set('q', searchTerm);
								window.history.pushState({}, '', url);
							}
						}}
						placeholder="Search products..."
						className="w-full outline-none text-lg"
						autoFocus
					/>
					{searchTerm && (
						<button 
							onClick={() => {
								setSearchTerm('');
								setSearchResults([]);
								// Update URL
								const url = new URL(window.location.href);
								url.searchParams.delete('q');
								window.history.pushState({}, '', url);
							}}
							className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-300"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-gray-500">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>
			</div>
			
			{loading ? (
				<div className="flex items-center justify-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
				</div>
			) : searchTerm ? (
				<>
					{searchResults.length > 0 ? (
						<>
							<div className="mb-8">
								<h2 className="text-lg font-medium mb-2">
									{searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{query}"
								</h2>
							</div>
							
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{searchResults.map((product) => (
									<ProductCard key={product.id} {...product} />
								))}
							</div>
						</>
					) : (
						<div className="text-center py-12">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12 text-gray-400 mx-auto mb-4">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<h2 className="text-2xl font-medium mb-2">No results found</h2>
							<p className="text-gray-600 mb-6">
								We couldn&apos;t find any products matching "{query}"
							</p>
							<div>
								<Link href="/" className="btn">
									Browse All Products
								</Link>
							</div>
						</div>
					)}
				</>
			) : (
				<div>
					<h2 className="text-lg font-medium mb-6">Popular searches</h2>
					<div className="flex flex-wrap gap-2">
						{popularSearches.map((term, index) => (
							<button
								key={index}
								onClick={() => {
									setSearchTerm(term);
									performSearch(term);
									// Update URL for shareable search results
									const url = new URL(window.location.href);
									url.searchParams.set('q', term);
									window.history.pushState({}, '', url);
								}}
								className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm transition-colors"
							>
								{term}
							</button>
						))}
					</div>
					
					<h2 className="text-lg font-medium mt-10 mb-6">Popular Categories</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						<Link href="/skin-care" className="group">
							<div className="bg-cream rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-square relative">
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
									<h3 className="text-2xl text-white font-bold">Skin Care</h3>
								</div>
							</div>
						</Link>
						
						<Link href="/hair-care" className="group">
							<div className="bg-cream rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-square relative">
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
									<h3 className="text-2xl text-white font-bold">Hair Care</h3>
								</div>
							</div>
						</Link>
						
						<Link href="/combos" className="group">
							<div className="bg-cream rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-square relative">
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300">
									<h3 className="text-2xl text-white font-bold">Combos</h3>
								</div>
							</div>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

// Loading fallback for Suspense
function SearchFallback() {
	return (
		<div className="container max-w-6xl mx-auto px-7 py-12">
			<div className="max-w-3xl mx-auto mb-8">
				<div className="animate-pulse flex items-center border-b-2 border-gray-200 pb-2">
					<div className="w-6 h-6 bg-gray-300 rounded-full mr-3"></div>
					<div className="h-8 bg-gray-300 rounded w-full"></div>
				</div>
			</div>
			<div className="animate-pulse flex flex-col space-y-4">
				<div className="h-4 bg-gray-300 rounded w-1/4"></div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{[...Array(8)].map((_, i) => (
						<div key={i} className="bg-gray-300 rounded-lg h-64"></div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function SearchPage() {
	return (
		<main>
			<Header />
			<div className="pt-24 md:pt-32"> {/* Added padding top to create space for the fixed navbar */}
				<Suspense fallback={<SearchFallback />}>
					<SearchContent />
				</Suspense>
			</div>
		</main>
	);
}