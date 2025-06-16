'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useRouter } from 'next/navigation';

// Default images to use if none are stored
const defaultImages = [
  {
    id: '1',
    name: 'product-image-1.jpg',
    url: '/images/products/face-wash.jpg',
    size: '120 KB',
    uploadedAt: '2024-05-29',
  },
  {
    id: '2',
    name: 'product-image-2.jpg',
    url: '/images/products/hair-serum.jpg',
    size: '145 KB',
    uploadedAt: '2024-05-28',
  },
  {
    id: '3',
    name: 'banner-1.jpg',
    url: '/images/banner/banner-1.jpg',
    size: '320 KB',
    uploadedAt: '2024-05-27',
  },
];

export default function ImagesManagement() {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [images, setImages] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load images from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedImages = localStorage.getItem('uniknaturals-images');
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      } else {
        // Initialize with default images if none exist
        setImages(defaultImages);
        localStorage.setItem('uniknaturals-images', JSON.stringify(defaultImages));
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const filteredImages = images.filter(image => 
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, this would upload to a server/storage
      // For now, we'll convert to base64 for demo purposes
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Create a new image object
        const newImage = {
          id: Date.now().toString(),
          name: selectedFile.name,
          url: reader.result as string, // Base64 data URL
          size: `${Math.round(selectedFile.size / 1024)} KB`,
          uploadedAt: new Date().toISOString().split('T')[0],
        };
        
        // Update state and localStorage
        const updatedImages = [newImage, ...images];
        setImages(updatedImages);
        localStorage.setItem('uniknaturals-images', JSON.stringify(updatedImages));
        
        // Reset file selection
        setSelectedFile(null);
        
        // Show success message
        setSuccessMessage('Image uploaded successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        
        setIsUploading(false);
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Remove image from state
      const updatedImages = images.filter(image => image.id !== id);
      setImages(updatedImages);
      
      // Update localStorage
      localStorage.setItem('uniknaturals-images', JSON.stringify(updatedImages));
      
      // Show success message
      setSuccessMessage('Image deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopyMessage('URL copied!');
        setTimeout(() => setCopyMessage(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL: ', err);
        setCopyMessage('Failed to copy');
        setTimeout(() => setCopyMessage(null), 2000);
      });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Image Management</h1>
      
      {/* Upload Section */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-lg font-semibold">Upload New Image</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded flex-grow"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-sage text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      
      {/* Success Notification */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
      
      {/* Copy Notification */}
      {copyMessage && (
        <div className="fixed top-4 right-4 bg-sage text-white px-4 py-2 rounded shadow-lg z-50">
          {copyMessage}
        </div>
      )}
      
      {/* Full-size Image Viewer */}
      {viewingImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* For regular images */}
            <img 
              src={viewingImage} 
              alt="Full size view" 
              className="object-contain max-h-[90vh] max-w-full"
            />
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                setViewingImage(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Images List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Uploaded Images ({filteredImages.length})</h2>
        
        {filteredImages.length === 0 ? (
          <p className="text-gray-500">No images found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map(image => (
              <div key={image.id} className="border rounded overflow-hidden">
                <div 
                  className="aspect-square relative cursor-pointer"
                  onClick={() => setViewingImage(image.url)}
                >
                  {/* Use img instead of Image for better handling of base64 */}
                  <img
                    src={image.url}
                    alt={image.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm truncate">{image.name}</p>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{image.size}</span>
                    <span>{image.uploadedAt}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => copyToClipboard(image.url)}
                      className="flex-1 bg-sage/10 text-sage py-1 rounded text-sm"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="flex-1 bg-red-100 text-red-800 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 