'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm, { ProductFormData } from '../components/ProductForm';

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the new product
      const newId = Date.now().toString();
      const newProduct = { ...formData, id: newId };
      
      // Get existing products from localStorage
      const savedProducts = localStorage.getItem('adminProducts');
      let products = [];
      
      if (savedProducts) {
        products = JSON.parse(savedProducts);
      }
      
      // Add the new product
      products.push(newProduct);
      
      // Save back to localStorage
      localStorage.setItem('adminProducts', JSON.stringify(products));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to products page after success
      router.push('/admin/products');
      router.refresh(); // Refresh the page to show the new product
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}