'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

function CreateCategoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditing = !!editId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data if editing
  useEffect(() => {
    if (isEditing && editId) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`/api/categories?id=${editId}`);
          const json = await res.json();
          if (json.success && json.data) {
            setFormData({
              name: json.data.name,
              description: json.data.description
            });
            if (json.data.image) setImagePreview(json.data.image);
          }
        } catch (error) {
           console.error('Failed to fetch category', error);
        }
      };
      fetchCategory();
    }
  }, [isEditing, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!formData.name || !formData.description) {
      setMessage('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    if (!image && !isEditing) {
        setMessage('Please upload an image');
        setIsLoading(false);
        return;
    }

    try {
      const data = new FormData();
      if (isEditing && editId) data.append('id', editId);
      data.append('name', formData.name);
      data.append('description', formData.description);
      if (image) data.append('image', image);

      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/categories', {
        method: method,
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setMessage(isEditing ? 'Category updated successfully!' : 'Category created successfully!');
        setTimeout(() => router.push('/dashboard/manage'), 1500);
      } else {
        setMessage(json.error || 'Failed to save category');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Category' : 'Create New Category'}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Desert Safari"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-32"
                placeholder="Describe this category..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border rounded-lg p-2"
              />
              {imagePreview && (
                <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition-transform hover:-translate-y-1 ${
                isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-[#F85E46] to-[#ff8f7d]'
              }`}
            >
              {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Category' : 'Create Category')}
            </button>

            {message && (
              <div className={`p-4 rounded-lg text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CreateCategoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateCategoryContent />
    </Suspense>
  );
}
