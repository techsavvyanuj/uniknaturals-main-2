"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import { registerAdmin, loginAdmin } from '@/app/api/authApi';
import { fetchUserProfile, fetchWishlist, addToWishlist, removeFromWishlist } from '@/app/api/userApi';
import { fetchMyOrders } from '@/app/api/orderHistoryApi';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState<any>({});
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : null;
    if (token) {
      setIsLoggedIn(true);
      setProfileLoading(true);
      fetchUserProfile(token)
        .then(data => {
          setUserProfile(data);
          setEditProfile({ email: data.email, phone: data.phone || '', address: data.address || '' });
          setProfileLoading(false);
        })
        .catch((err) => {
          console.error('Profile fetch error:', err);
          setProfileLoading(false);
        });
      setWishlistLoading(true);
      fetchWishlist(token)
        .then(data => {
          setWishlist(data);
          setWishlistLoading(false);
        })
        .catch((err) => {
          console.error('Wishlist fetch error:', err);
          setWishlistLoading(false);
        });
      setOrdersLoading(true);
      fetchMyOrders(token)
        .then(data => {
          setOrders(data);
          setOrdersLoading(false);
        })
        .catch((err) => {
          console.error('Orders fetch error:', err);
          setOrdersLoading(false);
        });
    }
  }, []);

  const handleProfileEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileUpdateLoading(true);
    setProfileUpdateError(null);
    const token = typeof window !== 'undefined' ? localStorage.getItem('userAuth') : null;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE || 'https://uniknaturals-backend.onrender.com/api'}/users/me`,
        { phone: editProfile.phone, address: editProfile.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserProfile({ ...userProfile, phone: editProfile.phone, address: editProfile.address });
      setEditMode(false);
    } catch (err: any) {
      setProfileUpdateError('Failed to update profile.');
    } finally {
      setProfileUpdateLoading(false);
    }
  };
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginAdmin(email, password);
      setSuccessMessage('Login successful!');
      setIsLoggedIn(true);
      localStorage.setItem('userAuth', res.token || '');
      setTimeout(() => router.push('/account/orders'), 1000);
    } catch {
      setSuccessMessage('Login failed. Please check your credentials.');
    }
  };
  
  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerAdmin(firstName + ' ' + lastName, email, password, phone);
      setSuccessMessage('Registration successful! Please log in.');
      setActiveTab('login');
      setTimeout(() => router.push('/account'), 1000);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error === 'Email already exists') {
        setSuccessMessage('An account with this email already exists. Please log in or use a different email.');
      } else if (err.response && err.response.data && err.response.data.error === 'Phone number already exists') {
        setSuccessMessage('An account with this phone number already exists. Please log in or use a different phone number.');
      } else {
        setSuccessMessage('Registration failed. Try again.');
      }
    }
  };
  
  // Handle forgot password form submission
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would make an API call to send reset email
    console.log('Reset password for:', forgotEmail);
    setIsResetSent(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userAuth');
    setIsLoggedIn(false);
    setUserProfile(null);
    setWishlist([]);
    setOrders([]);
    setSuccessMessage('Logged out successfully.');
    setActiveTab('login');
    router.push('/account');
  };

  if (isLoggedIn) {
    return (
      <main>
        <Header />
        <div className="container max-w-6xl mx-auto px-4 py-12 mt-16">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden p-8">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <button className="btn-outline mb-4 float-right" onClick={handleLogout}>
              Logout
            </button>
            {profileLoading ? (
              <div>Loading profile...</div>
            ) : userProfile ? (
              <div className="mb-6 text-left">
                <div className="mb-2"><b>Email:</b> {userProfile.email}</div>
                {editMode ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium">Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        value={editProfile.phone}
                        onChange={handleProfileEditChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Address:</label>
                      <input
                        type="text"
                        name="address"
                        value={editProfile.address}
                        onChange={handleProfileEditChange}
                        className="w-full border rounded px-2 py-1"
                      />
                    </div>
                    {profileUpdateError && <div className="text-red-600 text-sm">{profileUpdateError}</div>}
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="btn" disabled={profileUpdateLoading}>
                        {profileUpdateLoading ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" className="btn-outline" onClick={() => setEditMode(false)} disabled={profileUpdateLoading}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-2"><b>Phone:</b> {userProfile.phone || 'Not set'}</div>
                    <div className="mb-2"><b>Address:</b> {typeof userProfile.address === 'string'
                      ? userProfile.address || 'Not set'
                      : userProfile.address
                        ? Object.values(userProfile.address).filter(Boolean).join(', ')
                        : 'Not set'}</div>
                    <button className="btn-outline mt-2" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="mb-6 text-red-600">Could not load profile.</div>
            )}
            <h3 className="text-xl font-semibold mb-2 mt-8">My Orders</h3>
            {ordersLoading ? (
              <div>Loading orders...</div>
            ) : orders.length === 0 ? (
              <div>No orders found.</div>
            ) : (
              <ul className="mb-6">
                {orders.slice(0, 3).map((order: any) => (
                  <li key={order._id} className="mb-2 border-b pb-2">
                    <div><b>Order ID:</b> {order._id}</div>
                    <div><b>Total:</b> ₹{order.total}</div>
                    <div><b>Status:</b> {order.status || 'Placed'}</div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/account/orders" className="text-sage underline">View All Orders</Link>
            <h3 className="text-xl font-semibold mb-2 mt-8">My Wishlist</h3>
            {wishlistLoading ? (
              <div>Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
              <div>Your wishlist is empty.</div>
            ) : (
              <ul>
                {wishlist.map((item: any) => (
                  <li key={item._id} className="mb-2 flex items-center justify-between border-b pb-2">
                    <span>{item.name}</span>
                    <button onClick={async () => {
                      const token = localStorage.getItem('userAuth') || '';
                      await removeFromWishlist(item._id, token);
                      setWishlist(wishlist.filter((w: any) => w._id !== item._id));
                    }} className="text-red-600 hover:underline text-sm">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main>
      <Header />
      
      <div className="container max-w-6xl mx-auto px-4 py-12 mt-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          {!isResetSent && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'login'
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-4 px-6 text-center font-medium ${
                  activeTab === 'register'
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Create Account
              </button>
            </div>
          )}
          
          <div className="p-8">
            {/* Login Form */}
            {activeTab === 'login' && !isResetSent && (
              <div className="animate-fadeIn">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      className="btn px-8"
                    >
                      Login
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-sm text-accent hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    New to our website? Create an account to get started.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setActiveTab('register')}
                      className="btn-outline"
                    >
                      Create Account
                    </button>
                    <Link
                      href="/admin/login"
                      className="btn-outline bg-sage text-white hover:bg-sage/90"
                    >
                      Admin Panel
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            {/* Register Form */}
            {activeTab === 'register' && (
              <div className="animate-fadeIn">
                {successMessage && (
                  <div className="bg-red-100 text-red-800 px-4 py-2 text-center mb-4 rounded">
                    {successMessage}
                  </div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="registerEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="registerPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="registerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="registerPhone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      minLength={10}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                      required
                    />
                    <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-600">
                      I agree to the <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="btn w-full"
                  >
                    Create Account
                  </button>
                </form>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => setActiveTab('login')}
                      className="text-accent hover:underline"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </div>
            )}
            
            {/* Forgot Password */}
            {activeTab === 'forgot' && !isResetSent && (
              <div className="animate-fadeIn">
                <div className="bg-cream p-4 rounded-md mb-6">
                  <p className="text-sm">
                    Enter your email address below and we'll send you a link to reset your password.
                  </p>
                </div>
                
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="forgotEmail"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="btn"
                    >
                      Reset Password
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-sm text-accent hover:underline"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Reset Email Sent */}
            {isResetSent && (
              <div className="text-center py-8 animate-fadeIn">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-medium mb-4">Check your inbox</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to<br />
                  <span className="font-medium">{forgotEmail}</span>
                </p>
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setIsResetSent(false);
                  }}
                  className="btn"
                >
                  Back to Login
                </button>
              </div>
            )}
            
            {/* Show success message if present */}
            {successMessage && (
              <div className="bg-green-100 text-green-800 px-4 py-2 text-center mb-4 rounded">
                {successMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}