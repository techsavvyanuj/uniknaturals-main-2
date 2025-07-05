"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/app/api/ordersApi';
import { fetchAdminProducts } from '@/app/api/adminProductsApi';
import { fetchUserProfile } from '@/app/api/userApi';
import Header from '@/components/Header';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState({
    pincode: '',
    city: '',
    state: '',
    name: '',
    email: '', // <-- Add email field
    address: '',
    address2: '',
    addressType: 'home',
    phone: '',
  });
  const [step, setStep] = useState<'form' | 'review' | 'payment' | 'success'>('form');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const router = useRouter();

  // --- Coupon and Shipping Logic (copied from cart) ---
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  // Shipping is free over ₹349
  const shippingCost = subtotal >= 349 ? 0 : 49;
  // Calculate total
  const total = subtotal - discount + shippingCost;

  // Auto-fetch city/state from pincode
  useEffect(() => {
    const fetchCityState = async () => {
      if (shipping.pincode.length === 6) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${shipping.pincode}`);
          const data = await res.json();
          if (data[0].Status === 'Success') {
            setShipping(prev => ({
              ...prev,
              city: data[0].PostOffice[0].District,
              state: data[0].PostOffice[0].State,
            }));
          }
        } catch {
          // ignore errors
        }
      }
    };
    fetchCityState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipping.pincode]);

  // Add user profile state
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : null;
    if (token) {
      fetchUserProfile(token)
        .then(data => {
          setUserProfile(data);
          let fullName = '';
          if (data.name) {
            fullName = data.name;
          } else if (data.firstName || data.lastName) {
            fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          }
          setShipping(prev => ({
            ...prev,
            email: data.email || '',
            phone: data.phone || '',
            name: fullName,
          }));
        })
        .catch(() => {});
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    setStep('payment');
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject('Razorpay SDK failed to load');
      document.body.appendChild(script);
    });
  };

  const handleRazorpay = async () => {
    setError(null);
    setLoadingPayment(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : '';
    if (!token) {
      setLoadingPayment(false);
      router.push('/account');
      return;
    }
    try {
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
      if (!key) {
        setError('Payment gateway key is missing. Please contact support.');
        setLoadingPayment(false);
        return;
      }
      await loadRazorpayScript();
      const options = {
        key,
        amount: total * 100, // in paise
        currency: 'INR',
        name: 'UnikNaturals',
        description: 'Order Payment',
        handler: async function (response: any) {
          setOrderId(response.razorpay_payment_id);
          let shiprocketData = null;
          try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : '';
            // Fetch all products with MongoDB _id
            const allProducts = await fetchAdminProducts();
            const productsForOrder = items.map(item => {
              // Try to match by _id, slug, or name (do not use p.id, only _id is guaranteed)
              const match = allProducts.find(p => p._id === item.id || p.slug === item.id || p.name === item.name);
              if (!match) {
                console.warn('Cart item could not be mapped to a MongoDB _id:', item);
              }
              return match ? {
                product: match._id,
                quantity: item.quantity,
                price: item.price
              } : null;
            });
            const filteredProductsForOrder = productsForOrder.filter(Boolean); // Remove nulls

            // Shiprocket integration
            try {
              const shiprocketPayload = {
                order_id: response.razorpay_payment_id, // or your own order ID
                order_date: new Date().toISOString().slice(0, 10),
                pickup_location: "Primary", // ensure this matches your Shiprocket dashboard
                channel_id: "",
                billing_customer_name: shipping.name,
                billing_last_name: "",
                billing_address: shipping.address + (shipping.address2 ? `, ${shipping.address2}` : ""),
                billing_city: shipping.city,
                billing_pincode: shipping.pincode,
                billing_state: shipping.state,
                billing_country: "India",
                billing_email: shipping.email, // Add if available
                billing_phone: shipping.phone,
                order_items: items.map(item => ({
                  name: item.name,
                  sku: item.id, // or item.sku if available
                  units: item.quantity,
                  selling_price: item.price
                })),
                payment_method: "Prepaid",
                shipping_charges: 0,
                giftwrap_charges: 0,
                transaction_charges: 0,
                total_discount: 0,
                sub_total: subtotal,
                length: 10,
                breadth: 10,
                height: 10,
                weight: 0.5,
                shipping_is_billing: true, // <-- add this line
              };

              const shiprocketRes = await fetch('/api/shiprocket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(shiprocketPayload)
              });
              shiprocketData = await shiprocketRes.json();

              if (shiprocketRes.ok) {
                console.log('Shiprocket order created:', shiprocketData);
                alert('Shipping order created successfully!');
              } else {
                console.error('Shiprocket error:', shiprocketData);
                alert('Order placed, but shipping creation failed. Please contact support.');
              }
            } catch (err) {
              console.error('Shiprocket API error:', err);
              alert('Order placed, but shipping creation failed. Please contact support.');
            }

            await createOrder({
              products: filteredProductsForOrder,
              total,
              address: {
                pincode: shipping.pincode,
                city: shipping.city,
                state: shipping.state,
                name: shipping.name,
                address: shipping.address,
                address2: shipping.address2,
                addressType: shipping.addressType,
                phone: shipping.phone,
              },
              paymentId: response.razorpay_payment_id,
              shiprocketShipmentID: shiprocketData?.shipment_id ? String(shiprocketData.shipment_id) : '', // Always send as string
            }, token || undefined);
            setStep('success');
            clearCart();
          } catch (err) {
            setError('Order could not be saved. Please contact support.');
          }
          setLoadingPayment(false);
        },
        prefill: {
          name: shipping.name,
          email: '',
          contact: shipping.phone,
        },
        notes: {
          address: shipping.address,
        },
        theme: {
          color: '#7CB342',
        },
      };
      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoadingPayment(false);
    } catch (err: any) {
      setError('Unable to load payment gateway. ' + (typeof err === 'string' ? err : 'Please try again.'));
      setLoadingPayment(false);
      if (typeof window !== 'undefined') {
        // Log error for debugging
        // eslint-disable-next-line no-console
        console.error('Razorpay load error:', err);
      }
    }
  };

  // Add new state for payment method
  const [selectedPayment, setSelectedPayment] = useState<'razorpay' | 'cod' | null>(null);

  // COD handler
  const handleCOD = async () => {
    setError(null);
    setLoadingPayment(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : '';
    if (!token) {
      setLoadingPayment(false);
      router.push('/account');
      return;
    }
    try {
      // Fetch all products with MongoDB _id
      const allProducts = await fetchAdminProducts();
      const productsForOrder = items.map(item => {
        const match = allProducts.find(p => p._id === item.id || p.slug === item.id || p.name === item.name);
        return match ? {
          product: match._id,
          quantity: item.quantity,
          price: item.price
        } : null;
      });
      const filteredProductsForOrder = productsForOrder.filter(Boolean);
      // Shiprocket integration for COD
      let shiprocketData = null;
      try {
        const shiprocketPayload = {
          order_id: `COD-${Date.now()}`,
          order_date: new Date().toISOString().slice(0, 10),
          pickup_location: "Primary",
          channel_id: "",
          billing_customer_name: shipping.name,
          billing_last_name: "",
          billing_address: shipping.address + (shipping.address2 ? `, ${shipping.address2}` : ""),
          billing_city: shipping.city,
          billing_pincode: shipping.pincode,
          billing_state: shipping.state,
          billing_country: "India",
          billing_email: shipping.email,
          billing_phone: shipping.phone,
          order_items: items.map(item => ({
            name: item.name,
            sku: item.id,
            units: item.quantity,
            selling_price: item.price
          })),
          payment_method: "COD",
          shipping_charges: 0,
          giftwrap_charges: 0,
          transaction_charges: 0,
          total_discount: 0,
          sub_total: subtotal,
          length: 10,
          breadth: 10,
          height: 10,
          weight: 0.5,
          shipping_is_billing: true,
        };
        const shiprocketRes = await fetch('/api/shiprocket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shiprocketPayload)
        });
        shiprocketData = await shiprocketRes.json();
      } catch (err) {
        // ignore for now, show order success anyway
      }
      await createOrder({
        products: filteredProductsForOrder,
        total,
        address: {
          pincode: shipping.pincode,
          city: shipping.city,
          state: shipping.state,
          name: shipping.name,
          address: shipping.address,
          address2: shipping.address2,
          addressType: shipping.addressType,
          phone: shipping.phone,
        },
        paymentId: `COD-${Date.now()}`,
        shiprocketShipmentID: shiprocketData?.shipment_id ? String(shiprocketData.shipment_id) : '',
        paymentMethod: 'COD',
      }, token || undefined);
      setOrderId(`COD-${Date.now()}`);
      setStep('success');
      clearCart();
    } catch (err) {
      setError('Order could not be saved. Please contact support.');
    }
    setLoadingPayment(false);
  };

  // Apply coupon code
  const applyCoupon = () => {
    const code = couponCode.toUpperCase();
    let discountAmount = 0;
    if (code === 'NIKUNJ10OFF') {
      discountAmount = Math.round(subtotal * 0.10);
    } else if (code === 'NIKUNJ20OFF') {
      discountAmount = Math.round(subtotal * 0.20);
    } else if (code === 'NIKUN30OFF') {
      discountAmount = Math.round(subtotal * 0.30);
    }
    if (discountAmount > 0) {
      setDiscount(discountAmount);
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };
  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
    setCouponApplied(false);
  };

  return (
    <main>
      <Header />
      <div className="container max-w-xl mx-auto py-12 mt-24">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
        {/* Coupon Code UI (same as cart) */}
        <div className="mb-6">
          <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
          <div className="flex">
            <input
              type="text"
              id="coupon"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Enter code"
              className="flex-grow border border-gray-300 rounded-l-md px-6 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm md:text-base max-w-[230px] md:min-w-[240px]"
              disabled={couponApplied}
            />
            {!couponApplied ? (
              <button
                onClick={applyCoupon}
                className="bg-sage text-white px-2 py-1 rounded-r-md hover:bg-sage/80 transition-all text-sm md:text-base min-w-[50px] md:min-w-[20px]"
              >
                Apply
              </button>
            ) : (
              <button
                onClick={removeCoupon}
                className="bg-red-500 text-white px-2 py-1 rounded-r-md hover:bg-red-600 transition-all text-sm md:text-base min-w-[50px] md:min-w-[20px]"
              >
                Remove
              </button>
            )}
          </div>
          {couponApplied && (
            <p className="text-xs text-green-600 mt-1">
              {couponCode.toUpperCase() === 'NIKUNJ10OFF' && '10% discount applied'}
              {couponCode.toUpperCase() === 'NIKUNJ20OFF' && '20% discount applied'}
              {couponCode.toUpperCase() === 'NIKUN30OFF' && '30% discount applied'}
            </p>
          )}
        </div>
        {/* Order Summary UI (show subtotal, discount, shipping, total) */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-accent mb-2">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <input name="pincode" value={shipping.pincode} onChange={handleChange} required placeholder="PIN Code" className="w-full p-2 border rounded" maxLength={6} minLength={6} pattern="[0-9]{6}" />
            <input name="city" value={shipping.city} onChange={handleChange} required placeholder="City" className="w-full p-2 border rounded" readOnly />
            <input name="state" value={shipping.state} onChange={handleChange} required placeholder="State" className="w-full p-2 border rounded" readOnly />
            <input name="name" value={shipping.name} onChange={handleChange} required placeholder="Full Name" className="w-full p-2 border rounded" />
            <input name="email" value={shipping.email} readOnly required placeholder="Email Address" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" type="email" />
            <input name="phone" value={shipping.phone} readOnly required placeholder="Mobile Number" className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed" maxLength={10} minLength={10} pattern="[0-9]{10}" />
            <input name="address" value={shipping.address} onChange={handleChange} required placeholder="Complete Address" className="w-full p-2 border rounded" />
            <input name="address2" value={shipping.address2} onChange={handleChange} required placeholder="House, Floor, Landmark" className="w-full p-2 border rounded" />
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="addressType" value="home" checked={shipping.addressType === 'home'} onChange={handleChange} /> Home
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="addressType" value="work" checked={shipping.addressType === 'work'} onChange={handleChange} /> Work
              </label>
            </div>
            <button type="submit" className="w-full bg-sage text-white py-2 rounded mt-4">Continue to Review</button>
          </form>
        )}
        {step === 'review' && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Review Order</h2>
            <ul className="mb-4">
              {items.map(item => (
                <li key={item.id} className="flex justify-between py-1">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="mb-2">Shipping to: {shipping.name}, {shipping.address}, {shipping.address2}, {shipping.city}, {shipping.state}, {shipping.pincode}</div>
            <div className="mb-2">Phone: {shipping.phone}</div>
            <div className="mb-2">Address Type: {shipping.addressType}</div>
            <div className="font-bold mb-4">Total: ₹{total}</div>
            <button onClick={() => setStep('payment')} className="w-full bg-sage text-white py-2 rounded">Continue to Payment</button>
          </div>
        )}
        {step === 'payment' && (
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-bold mb-4">Choose Payment Method</h2>
            <div className="flex flex-col gap-4 mb-4">
              <button
                onClick={() => { setSelectedPayment('razorpay'); handleRazorpay(); }}
                className="bg-black text-white px-6 py-2 rounded text-lg font-semibold hover:bg-gray-900 transition"
                disabled={loadingPayment}
              >
                {loadingPayment && selectedPayment === 'razorpay' ? 'Loading Payment...' : `Pay Online (Razorpay)`}
              </button>
              <button
                onClick={() => { setSelectedPayment('cod'); handleCOD(); }}
                className="bg-sage text-white px-6 py-2 rounded text-lg font-semibold hover:bg-sage/80 transition"
                disabled={loadingPayment}
              >
                {loadingPayment && selectedPayment === 'cod' ? 'Placing Order...' : 'Cash on Delivery'}
              </button>
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        )}
        {step === 'success' && (
          <div className="bg-gradient-to-br from-sage to-cream p-8 rounded-xl shadow-lg text-center animate-fade-in">
            <div className="flex flex-col items-center justify-center">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e6ffe6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
              </svg>
              <h2 className="text-2xl font-bold mb-2 text-green-700">Order Placed Successfully!</h2>
              <p className="text-lg text-gray-700 mb-4">Thank you for shopping with UnikNaturals.</p>
              <div className="bg-white rounded-lg shadow p-4 mb-4 inline-block">
                <div className="text-gray-700 font-medium">Order ID:</div>
                <div className="text-lg font-bold text-sage">{orderId}</div>
              </div>
              <p className="text-gray-600 mb-2">You will receive an order confirmation email and SMS shortly.</p>
              <p className="text-gray-600 mb-6">Track your order status in <span className="font-semibold">My Orders</span>.</p>
              <button onClick={() => router.push('/account/orders')} className="bg-sage text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-sage/80 transition">View My Orders</button>
              <button onClick={() => router.push('/')} className="mt-4 text-sage underline text-base">Continue Shopping</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
