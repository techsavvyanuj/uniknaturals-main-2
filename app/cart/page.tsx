"use client";

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '../api/ordersApi';
import { useRouter } from 'next/navigation';

export default function CartPage() {
	const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
	const [orderStatus, setOrderStatus] = useState<string | null>(null);
	const router = useRouter();

	// Shipping is free over ₹349
	const shippingCost = subtotal >= 349 ? 0 : 49;

	// Calculate total
	const total = subtotal + shippingCost;

	// Handle checkout
	const handleCheckout = async () => {
		const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : '';
		if (!token) {
			alert('Please log in to place an order.');
			router.push('/account');
			return;
		}
		try {
			setOrderStatus(null);
			await createOrder({
				products: items.map(item => ({ product: item.id, quantity: item.quantity })),
				total,
				address: 'N/A', // You can add address form later
				paymentId: 'demo', // Integrate payment gateway for real paymentId
			}, token);
			setOrderStatus('Order placed successfully!');
			// Optionally clear cart here
			// clearCart();
		} catch (err) {
			setOrderStatus('Failed to place order.');
		}
	};

	// Helper to get full image URL
	const backendBase = process.env.NEXT_PUBLIC_API_BASE?.replace('/api', '') || 'https://uniknaturals-backend.onrender.com';
	const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${backendBase}${url}`;

	return (
		<main className="cart-page">
			<Header />

			<div className="container max-w-6xl mx-auto px-4 py-12 mt-0 md:mt-8">
				<h1 className="text-3xl font-bold mb-8">Your Cart</h1>

				{items.length === 0 ? (
					<div className="text-center py-12">
						<h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
						<p className="text-gray-600 mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
						<Link href="/" className="btn bg-sage hover:bg-sage/80 text-white px-6 py-2 rounded">
							Continue Shopping
						</Link>
					</div>
				) : (
					<div className="flex flex-col lg:flex-row gap-8">
						{/* Cart Items */}
						<div className="lg:w-2/3">
							<div className="bg-white rounded-lg shadow-sm overflow-hidden">
								<div className="hidden md:grid md:grid-cols-5 bg-gray-100 p-4 text-sm font-medium text-gray-600">
									<div className="col-span-2">Product</div>
									<div>Price</div>
									<div>Quantity</div>
									<div>Total</div>
								</div>

								{items.map(item => (
									<div key={item.id} className="border-t border-gray-200 first:border-t-0">
										<div className="md:grid md:grid-cols-5 p-4 items-center">
											{/* Product */}
											<div className="flex md:col-span-2 mb-4 md:mb-0">
												<div className="w-20 h-20 relative flex-shrink-0">
													<Image
														src={getImageUrl(item.image)}
														alt={item.name}
														width={80}
														height={80}
														className="object-contain"
														unoptimized
													/>
												</div>
												<div className="ml-4">
													<h3 className="text-sm md:text-base font-medium">{item.name}</h3>
													<button
														onClick={() => removeItem(item.id)}
														className="text-sm text-accent hover:underline mt-2"
													>
														Remove
													</button>
												</div>
											</div>

											{/* Price */}
											<div className="flex md:block items-center mb-2 md:mb-0">
												<span className="md:hidden text-sm font-medium text-gray-600 mr-2">Price:</span>
												<span className="text-sm md:text-base">₹{item.price}</span>
											</div>

											{/* Quantity */}
											<div className="flex items-center mb-2 md:mb-0">
												<span className="md:hidden text-sm font-medium text-gray-600 mr-2 w-16">
													Quantity:
												</span>
												<div className="flex items-center border border-gray-300 rounded-md">
													<button
														onClick={() => updateQuantity(item.id, item.quantity - 1)}
														className="px-3 py-1 hover:bg-gray-100"
														aria-label="Decrease quantity"
													>
														-
													</button>
													<span className="px-3 py-1">{item.quantity}</span>
													<button
														onClick={() => updateQuantity(item.id, item.quantity + 1)}
														className="px-3 py-1 hover:bg-gray-100"
														aria-label="Increase quantity"
													>
														+
													</button>
												</div>
											</div>

											{/* Total */}
											<div className="flex md:block items-center">
												<span className="md:hidden text-sm font-medium text-gray-600 mr-2">Total:</span>
												<span className="text-sm md:text-base font-medium">
													₹{item.price * item.quantity}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Order Summary */}
						<div className="lg:w-1/3">
							<div className="bg-white rounded-lg shadow-sm p-6">
								<h2 className="text-lg font-medium mb-4">Order Summary</h2>

								<div className="space-y-3 mb-6">
									<div className="flex justify-between">
										<span className="text-gray-600">Subtotal</span>
										<span>₹{subtotal}</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-600">Shipping</span>
										<span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
									</div>

									{shippingCost > 0 && (
										<div className="text-xs text-gray-500">
											Add ₹{349 - subtotal} more for free shipping
										</div>
									)}

									<div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
										<span>Total</span>
										<span>₹{total}</span>
									</div>
								</div>

								<button
									className="btn w-full py-3 bg-sage text-white rounded hover:bg-sage/80 transition-all"
									onClick={() => {
										const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : '';
										if (!token) {
											alert('Please log in or create an account to proceed to checkout.');
											router.push('/account');
											return;
										}
										router.push('/cart/checkout');
									}}
								>
									Proceed to Checkout
								</button>
								{orderStatus && (
									<div className="mt-4 text-center text-sm text-green-600">{orderStatus}</div>
								)}

								<div className="mt-4">
									<Link
										href="/"
										className="text-sm text-accent hover:underline flex items-center justify-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											className="w-4 h-4 mr-1"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M10 19l-7-7m0 0l7-7m-7 7h18"
											/>
										</svg>
										Continue Shopping
									</Link>
								</div>
							</div>

							{/* Payment Methods */}
							<div className="mt-6 bg-white rounded-lg shadow-sm p-6">
								<h3 className="text-sm font-medium text-gray-600 mb-4">
									ACCEPTED PAYMENT METHODS
								</h3>
								<div className="flex items-center space-x-3">
									<div className="h-6 w-10 bg-gray-200 rounded"></div>
									<div className="h-6 w-10 bg-gray-200 rounded"></div>
									<div className="h-6 w-10 bg-gray-200 rounded"></div>
									<div className="h-6 w-10 bg-gray-200 rounded"></div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}