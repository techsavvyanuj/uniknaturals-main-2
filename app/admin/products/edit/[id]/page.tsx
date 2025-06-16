'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm, { ProductFormData } from '../../components/ProductForm';

// Define proper type for App Router page with Promise
type PageParams = Promise<{ id: string }>;

export default async function EditProduct(props: { params: PageParams }) {
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = await props.params;

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get products from localStorage
        const savedProducts = localStorage.getItem('adminProducts');
        if (!savedProducts) {
          setError('No products found in storage');
          return;
        }
        
        const products = JSON.parse(savedProducts);
        const foundProduct = products.find((p: any) => p.id === id);
        
        if (!foundProduct) {
          setError('Product not found');
        } else {
          setProduct(foundProduct);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add a small delay to simulate API call
    setTimeout(() => {
      fetchProduct();
    }, 300);
  }, [id]);

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      // Get current products from localStorage
      const savedProducts = localStorage.getItem('adminProducts');
      if (!savedProducts) {
        throw new Error('No products found in storage');
      }
      
      const products = JSON.parse(savedProducts);
      
      // Update the product
      const updatedProducts = products.map((p: any) => 
        p.id === id ? { ...formData, id } : p
      );
      
      // Save back to localStorage
      localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
      
      // Add a small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to products page after success
      router.push('/admin/products');
      router.refresh(); // Refresh the page to show the updated product
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded text-red-800">
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p>{error}</p>
        <button
          onClick={() => router.push('/admin/products')}
          className="mt-4 px-4 py-2 bg-sage text-white rounded hover:bg-opacity-90"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      {product && (
        <ProductForm initialData={product} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}