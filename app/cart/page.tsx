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
	const [couponCode, setCouponCode] = useState('');
	const [couponApplied, setCouponApplied] = useState(false);
	const [discount, setDiscount] = useState(0);
	const [orderStatus, setOrderStatus] = useState<string | null>(null);
	const router = useRouter();

	// Shipping is free over ₹349
	const shippingCost = subtotal >= 349 ? 0 : 49;

	// Calculate total
	const total = subtotal - discount + shippingCost;

	// Apply coupon code
	const applyCoupon = () => {
		// Simple coupon logic - in a real app this would verify against a backend
		if (couponCode.toUpperCase() === 'NEW10') {
			const discountAmount = Math.round(subtotal * 0.1); // 10% discount
			setDiscount(discountAmount);
			setCouponApplied(true);
		} else {
			alert('Invalid coupon code');
		}
	};

	// Remove coupon
	const removeCoupon = () => {
		setCouponCode('');
		setDiscount(0);
		setCouponApplied(false);
	};

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
														src={item.image}
														alt={item.name}
														width={80}
														height={80}
														className="object-contain"
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

									{discount > 0 && (
										<div className="flex justify-between text-accent">
											<span>Discount</span>
											<span>- ₹{discount}</span>
										</div>
									)}

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

								{/* Coupon Code */}
								{!couponApplied ? (
									<div className="mb-6">
										<label
											htmlFor="coupon"
											className="block text-sm font-medium text-gray-700 mb-1"
										>
											Coupon Code
										</label>
										<div className="flex">
											<input
												type="text"
												id="coupon"
												value={couponCode}
												onChange={e => setCouponCode(e.target.value)}
												placeholder="Enter code"
												className="flex-grow border border-gray-300 rounded-l-md px-6 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm md:text-base max-w-[230px] md:min-w-[240px]"
											/>
											<button
												onClick={applyCoupon}
												className="bg-sage text-white px-2 py-1 rounded-r-md hover:bg-sage/80 transition-all text-sm md:text-base min-w-[80px] md:min-w-[50px]"
											>
												Apply
											</button>
										</div>
										<p className="text-xs mt-1 text-gray-500">Try "NEW10" for 10% off</p>
									</div>
								) : (
									<div className="mb-6 p-3 bg-cream rounded-md flex justify-between items-center">
										<div>
											<span className="text-sm font-medium">{couponCode.toUpperCase()}</span>
											<p className="text-xs text-gray-500">10% discount applied</p>
										</div>
										<button
											onClick={removeCoupon}
											className="text-sm text-accent hover:underline"
										>
											Remove
										</button>
									</div>
								)}

								<button
									className="btn w-full py-3 bg-sage text-white rounded hover:bg-sage/80 transition-all"
									onClick={() => router.push('/cart/checkout')}
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