'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAdminProducts, deleteProduct } from '../../api/adminProductsApi';

// Define product interface
interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  category?: string;
  stock?: number;
  image: string;
  description: string;
  featured?: boolean;
  longDescription?: string;
  slug: string;
  reviewCount?: number;
  soldOut?: boolean;
  images?: string[];
  features?: string[];
}

// Initial mock product data
const initialMockProducts: Product[] = [
  {
    _id: '1',
    name: 'Hydrating Face Wash',
    price: 499,
    salePrice: 399,
    category: 'Skin Care',
    stock: 25,
    image: '/images/products/face-wash.jpg',
    description: 'A gentle face wash that cleanses and hydrates your skin without stripping away natural oils.',
    featured: true,
    slug: 'hydrating-face-wash',
  },
  {
    _id: '2',
    name: 'Nourishing Hair Serum',
    price: 599,
    category: 'Hair Care',
    stock: 18,
    image: '/images/products/hair-serum.jpg',
    description: 'Infused with natural oils to provide deep nourishment and shine to your hair.',
    featured: false,
    slug: 'nourishing-hair-serum',
  },
  {
    _id: '3',
    name: 'Revitalizing Face Toner',
    price: 449,
    category: 'Skin Care',
    stock: 30,
    image: '/images/products/toner.jpg',
    description: 'Alcohol-free toner that balances skin pH and prepares it for better absorption of other products.',
    featured: true,
    slug: 'revitalizing-face-toner',
  },
  {
    _id: '4',
    name: 'Skin Brightening Cream',
    price: 699,
    salePrice: 599,
    category: 'Skin Care',
    stock: 12,
    image: '/images/products/cream.jpg',
    description: 'Helps reduce dark spots and evens skin tone for a brighter complexion.',
    featured: false,
    slug: 'skin-brightening-cream',
  },
];

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // Load products from API
  useEffect(() => {
    setIsLoading(true);
    fetchAdminProducts()
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setIsLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      setProducts(products.filter(product => product._id !== id));
      setStatusMessage('Product deleted successfully');
      setTimeout(() => {
        setStatusMessage('');
      }, 3000);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Management</h1>
      </div>

      <div className="mb-8 flex gap-4">
        <Link 
          href="/admin/orders" 
          className="bg-sage text-white px-4 py-2 rounded hover:bg-opacity-90 transition whitespace-nowrap min-w-[150px] inline-block text-center"
        >
          View Orders
        </Link>
        <Link 
          href="/admin/products/add" 
          className="bg-sage text-white px-4 py-2 rounded hover:bg-opacity-90 transition whitespace-nowrap min-w-[150px] inline-block text-center"
        >
          Add New Product
        </Link>
      </div>

      {statusMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
          {statusMessage}
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded">
          <p>No products found. Try changing your search criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Discounted Price</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Featured</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="w-16 h-16 relative">
                      <Image 
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded"
                        unoptimized={true}
                        onError={(e) => {
                          // Prevent flickering by setting a data attribute to track error state
                          if (!(e.target as HTMLImageElement).dataset.errored) {
                            (e.target as HTMLImageElement).dataset.errored = "true";
                            (e.target as HTMLImageElement).src = '/images/logo.png';
                          }
                        }}
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">{product.category}</td>
                  <td className="py-3 px-4">₹{product.price}</td>
                  <td className="py-3 px-4">{product.salePrice ? `₹${product.salePrice}` : '-'}</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4">
                    {product.featured ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Featured</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/products/edit/${product._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Note: In this demo, product data is stored in your browser's localStorage.</p>
        <p>Changes will persist in your current browser, but are not saved to any server.</p>
      </div>
    </div>
  );
}