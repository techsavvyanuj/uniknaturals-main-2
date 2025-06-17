'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductForm, { ProductFormData } from '../../components/ProductForm';
import { fetchProductById, updateProduct } from '@/app/api/adminProductsApi';

// Define proper type for App Router page with Promise
type PageParams = Promise<{ id: string }>;

export default function EditProduct(props: { params: { id: string } }) {
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = props.params;

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchProductById(id)
      .then(data => {
        // Map backend product to ProductFormData
        setProduct({
          id: data._id,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock || 0,
          category: data.category || '',
          image: data.image,
          featured: !!data.featured,
          slug: data.slug || '',
        });
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load product');
        setIsLoading(false);
      });
  }, [id]);

  const handleSubmit = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await updateProduct(id, formData); // formData now includes slug
      router.push('/admin/products');
      router.refresh();
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