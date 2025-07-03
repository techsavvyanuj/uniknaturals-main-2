'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  category: string;
  image: string;
  images?: string[];
  features?: string[];
  featured: boolean;
  slug: string; // Add slug to form data
}

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting: boolean;
}

const defaultProduct: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  salePrice: 0,
  stock: 0,
  category: '',
  image: '',
  images: [],
  features: [],
  featured: false,
  slug: '',
};

export default function ProductForm({ initialData, onSubmit, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData || defaultProduct);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [featureInputs, setFeatureInputs] = useState<string[]>(formData.features && formData.features.length > 0 ? formData.features : Array(6).fill(''));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialData?.image) {
      setImagePreview(initialData.image);
    }
    setFeatureInputs(initialData?.features || ['']);
  }, [initialData]);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value,
      };
      // If name changes, update slug
      if (name === 'name') {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFeatureInputChange = (idx: number, value: string) => {
    setFeatureInputs(inputs => {
      const updated = [...inputs];
      updated[idx] = value;
      return updated;
    });
  };
  const addFeatureInput = () => setFeatureInputs(inputs => inputs.length < 10 ? [...inputs, ''] : inputs); // allow up to 10 if needed
  const removeFeatureInput = (idx: number) => setFeatureInputs(inputs => inputs.filter((_, i) => i !== idx));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.salePrice && formData.salePrice < 0) newErrors.salePrice = 'Discounted price cannot be negative';
    if (formData.salePrice && formData.salePrice >= formData.price) newErrors.salePrice = 'Discounted price must be less than price';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add image to images array
  const handleAddImage = () => {
    if (formData.image && !images.includes(formData.image)) {
      setImages(prev => [...prev, formData.image]);
      setFormData(prev => ({ ...prev, image: '' }));
      setImagePreview(null);
    }
  };
  // Remove image from images array
  const handleRemoveImage = (img: string) => {
    setImages(prev => prev.filter(i => i !== img));
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      // Always use backend API for uploads
      const backendBase = process.env.NEXT_PUBLIC_API_BASE || 'https://uniknaturals-backend.onrender.com/api';
      const uploadUrl = backendBase.replace(/\/+$/, '') + '/upload';
      const res = await axios.post(
        uploadUrl,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const apiRoot = backendBase.replace(/\/api$/, '');
      const relativeUrl = res.data?.url || res.data?.imageUrl || res.data?.path || res.data;
      const imageUrl = relativeUrl.startsWith('http') ? relativeUrl : `${apiRoot}${relativeUrl}`;

      setImages(prev => {
        const arr = [...prev];
        arr[idx] = imageUrl;
        return arr;
      });
      if (idx === 0) setImagePreview(imageUrl);
    } catch (err: any) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, images: images.filter(Boolean), features: featureInputs.filter(f => f.trim() !== '') });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const categories = ['Skin Care', 'Hair Care', 'Body Care', 'Combos', 'Others'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-sage focus:border-sage ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-sage focus:border-sage ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-sage focus:border-sage ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-sage focus:border-sage ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Discounted Price (optional)
            </label>
            <input
              type="number"
              id="salePrice"
              name="salePrice"
              min="0"
              step="0.01"
              value={formData.salePrice || ''}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-sage focus:border-sage ${errors.salePrice ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter discounted price"
            />
            {errors.salePrice && <p className="mt-1 text-sm text-red-600">{errors.salePrice}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full p-2 border rounded focus:ring-sage focus:border-sage ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>

          {/* --- Image Upload Feature --- */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (Main + up to 3 gallery images)</label>
            <div className="flex flex-col gap-2">
              {[0,1,2,3].map(idx => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={images[idx] || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setImages(prev => {
                        const arr = [...prev];
                        arr[idx] = val;
                        return arr;
                      });
                      if (idx === 0) setImagePreview(val);
                    }}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder={idx === 0 ? 'Main image URL (required)' : `Gallery image ${idx}`}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileUpload(e, idx)}
                    className="block"
                  />
                  {images[idx] && (
                    <button type="button" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} className="text-red-500">Remove</button>
                  )}
                </div>
              ))}
            </div>
            {uploading && <div className="text-sage text-sm mt-2">Uploading...</div>}
            {uploadError && <div className="text-red-500 text-sm mt-2">{uploadError}</div>}
            {imagePreview && (
              <div className="mt-2 relative w-32 h-32">
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  sizes="128px"
                  className="object-contain rounded"
                  unoptimized
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-sage focus:ring-sage border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
        <div className="flex flex-col gap-2">
          {featureInputs.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={feature}
                onChange={e => handleFeatureInputChange(idx, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={`Feature ${idx + 1}`}
              />
              {featureInputs.length > 1 && (
                <button type="button" onClick={() => removeFeatureInput(idx)} className="text-red-500">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addFeatureInput} className="mt-2 px-3 py-1 bg-sage text-white rounded w-fit">Add Feature</button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-sage text-white rounded hover:bg-opacity-90 disabled:bg-opacity-70"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}