"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/app/api/ordersApi';
import { fetchAdminProducts } from '@/app/api/adminProductsApi';
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

  const total = subtotal;

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

  return (
    <main>
      <Header />
      <div className="container max-w-xl mx-auto py-12">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <input name="pincode" value={shipping.pincode} onChange={handleChange} required placeholder="PIN Code" className="w-full p-2 border rounded" maxLength={6} minLength={6} pattern="[0-9]{6}" />
            <input name="city" value={shipping.city} onChange={handleChange} required placeholder="City" className="w-full p-2 border rounded" readOnly />
            <input name="state" value={shipping.state} onChange={handleChange} required placeholder="State" className="w-full p-2 border rounded" readOnly />
            <input name="name" value={shipping.name} onChange={handleChange} required placeholder="Full Name" className="w-full p-2 border rounded" />
            <input name="email" value={shipping.email} onChange={handleChange} required placeholder="Email Address" className="w-full p-2 border rounded" type="email" />
            <input name="address" value={shipping.address} onChange={handleChange} required placeholder="Complete Address" className="w-full p-2 border rounded" />
            <input name="address2" value={shipping.address2} onChange={handleChange} required placeholder="House, Floor, Landmark" className="w-full p-2 border rounded" />
            <input name="phone" value={shipping.phone} onChange={handleChange} required placeholder="Mobile Number" className="w-full p-2 border rounded" maxLength={10} minLength={10} pattern="[0-9]{10}" />
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
            <button onClick={handlePlaceOrder} className="w-full bg-sage text-white py-2 rounded">Proceed to Payment</button>
          </div>
        )}
        {step === 'payment' && (
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-bold mb-4">Pay with Razorpay</h2>
            <button onClick={handleRazorpay} className="bg-black text-white px-6 py-2 rounded" disabled={loadingPayment}>
              {loadingPayment ? 'Loading Payment...' : `Pay ₹${total}`}
            </button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        )}
        {step === 'success' && (
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-bold mb-4">Payment Successful!</h2>
            <p>Your order has been placed.</p>
            <p>Payment ID: {orderId}</p>
            <button onClick={() => router.push('/account/orders')} className="mt-4 bg-sage text-white px-4 py-2 rounded">View My Orders</button>
          </div>
        )}
      </div>
    </main>
  );
}
