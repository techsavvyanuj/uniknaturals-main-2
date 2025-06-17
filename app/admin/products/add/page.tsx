'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm, { ProductFormData } from '../components/ProductForm';
import { createProduct } from '@/app/api/adminProductsApi';

export default function AddProduct() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await createProduct(formData); // formData now includes slug
      router.push('/admin/products');
      router.refresh();
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