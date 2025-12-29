'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
  () => {
    return import('react-quill-new');
  },
  { ssr: false }
) as any;
import 'react-quill-new/dist/quill.snow.css';

interface Category {
  _id: string;
  name: string;
}

export default function CreatePackagePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    duration: '',
    description: '',
    category: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Rich Text Content
  const [highlights, setHighlights] = useState('');
  const [includes, setIncludes] = useState('');

  // Features State with Defaults
  const [features, setFeatures] = useState([
    { icon: '🎭', title: 'Experience Duration:', description: '1 to 4 hours' },
    { icon: '🚗', title: 'Transportation:', description: 'With Pickup and Drop-off' },
    { icon: '💬', title: 'Available Languages:', description: 'English, Spanish, French, German, Chinese, Arabic' },
    { icon: '💰', title: 'Price Range:', description: 'Moderate Pricing, Premium Experiences' },
    { icon: '🎉', title: 'Great For:', description: 'Birthdays, Anniversaries, Family Outings, Corporate Events, Retirement' },
    { icon: '⏰', title: 'Best Time to Visit:', description: 'Morning, Afternoon, Evening and night' },
    { icon: '👫', title: 'Perfect For:', description: 'Couples, Families, Friends, Seniors, Employee Teams, Him, Her' },
  ]);

  // Tour Options State
  const [tourOptions, setTourOptions] = useState([
    {
      title: 'Standard Tour',
      duration: '4 Hours',
      time: '14:00',
      adultPrice: '',
      childPrice: '',
      infantPrice: '0',
      penalty: '24 Hours Before: 100% Penalty',
      features: [
        { icon: 'car', label: 'Pickup Included' },
        { icon: 'guide', label: 'Live Guide' }
      ],
      inclusions: ['Water']
    }
  ]);

  const handleTourOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...tourOptions];
    if (field === 'features' || field === 'inclusions') {
       // Handle array updates if needed, simple replacement for now
       // For this demo we'll skip complex nested array editing in the MVP unless requested
    } else {
        (newOptions[index] as any)[field] = value;
    }
    setTourOptions(newOptions);
  };

  const addTourOption = () => {
    setTourOptions([...tourOptions, {
      title: 'New Option',
      duration: '4 Hours',
      time: '10:00',
      adultPrice: '',
      childPrice: '',
      infantPrice: '0',
      penalty: 'Free Cancellation',
      features: [{ icon: 'car', label: 'Transfer' }],
      inclusions: []
    }]);
  };

  const removeTourOption = (index: number) => {
    setTourOptions(tourOptions.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  useEffect(() => {
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!image) {
      setMessage('Please select a main image');
      setIsLoading(false);
      return;
    }
    if (!formData.category) {
        setMessage('Please select a category');
        setIsLoading(false);
        return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('duration', formData.duration);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('image', image);
      
      data.append('highlights', highlights);
      data.append('includes', includes);
      data.append('highlights', highlights);
      data.append('includes', includes);
      data.append('features', JSON.stringify(features));
      
      // Clean and Validate Tour Options
      const cleanedTourOptions = tourOptions.map(opt => ({
          ...opt,
          adultPrice: Number(opt.adultPrice) || 0,
          childPrice: Number(opt.childPrice) || 0,
          infantPrice: Number(opt.infantPrice) || 0,
      }));
      data.append('tourOptions', JSON.stringify(cleanedTourOptions));

      galleryFiles.forEach(file => {
        data.append('gallery', file);
      });

      const res = await fetch('/api/packages', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setMessage('Package created successfully!');
        // Reset form
        setFormData({
            title: '',
            price: '',
            location: '',
            duration: '',
            description: '',
            category: '',
        });
        setImage(null);
        setImagePreview(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setHighlights('');
        setIncludes('');
      } else {
        setMessage(json.error || 'Failed to create package');
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Package</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                placeholder="e.g. 4 Hours"
                required
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Dubai, UAE"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
             />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {imagePreview && (
                <div className="mt-2 w-32 h-32 relative rounded-lg overflow-hidden border">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                </div>
            )}
          </div>

          {/* Gallery Images */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images (Select Multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {galleryPreviews.length > 0 && (
                <div className="mt-2 grid grid-cols-4 md:grid-cols-6 gap-2">
                    {galleryPreviews.map((preview, idx) => (
                         <div key={idx} className="w-24 h-24 relative rounded-lg overflow-hidden border group">
                            <Image src={preview} alt="Gallery Preview" fill className="object-cover" />
                            <button 
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          {/* Highlights Rich Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
            <div className="h-48 mb-12">
                <ReactQuill theme="snow" value={highlights} onChange={setHighlights} className="h-full" />
            </div>
          </div>

          {/* Includes Rich Text */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Includes</label>
             <div className="h-48 mb-12">
                <ReactQuill theme="snow" value={includes} onChange={setIncludes} className="h-full" />
            </div>
          </div>

          {/* Features Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Package Features</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                  <div className="flex gap-3">
                    <div className="w-1/4">
                       <label className="block text-xs text-gray-500 mb-1">Icon</label>
                       <input
                         type="text"
                         value={feature.icon}
                         onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                         className="w-full px-2 py-1 border rounded text-center"
                       />
                    </div>
                    <div className="w-3/4">
                       <label className="block text-xs text-gray-500 mb-1">Title</label>
                       <input
                         type="text"
                         value={feature.title}
                         onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                         className="w-full px-2 py-1 border rounded font-medium"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                    <input
                      type="text"
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      placeholder={`Enter ${feature.title}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Options Editor */}
          <div>
            <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Tour Options (Pricing & Variants)</label>
                <button 
                    type="button" 
                    onClick={addTourOption}
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100"
                >
                    + Add Option
                </button>
            </div>
            
            <div className="space-y-6">
              {tourOptions.map((option, index) => (
                <div key={index} className="p-6 border rounded-xl bg-gray-50 relative">
                  <button 
                    type="button"
                    onClick={() => removeTourOption(index)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                  
                  <h4 className="font-semibold text-gray-700 mb-4">Option {index + 1}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Option Title</label>
                        <input
                            type="text"
                            value={option.title}
                            onChange={(e) => handleTourOptionChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Time</label>
                        <input
                            type="time"
                            value={option.time}
                            onChange={(e) => handleTourOptionChange(index, 'time', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                     <div>
                        <label className="block text-xs text-gray-500 mb-1">Adult Price</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={option.adultPrice}
                            onChange={(e) => handleTourOptionChange(index, 'adultPrice', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Child Price</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={option.childPrice}
                            onChange={(e) => handleTourOptionChange(index, 'childPrice', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">Infant Price</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={option.infantPrice}
                            onChange={(e) => handleTourOptionChange(index, 'infantPrice', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                  </div>
                  
                   <div>
                        <label className="block text-xs text-gray-500 mb-1">Penalty / Cancellation Policy</label>
                        <input
                            type="text"
                            value={option.penalty}
                            onChange={(e) => handleTourOptionChange(index, 'penalty', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-bold transition-colors ${
              isLoading ? 'bg-gray-400' : 'bg-[#F85E46] hover:bg-[#e54d36]'
            }`}
          >
            {isLoading ? 'Creating...' : 'Create Package'}
          </button>

          {message && (
            <div className={`p-4 rounded-lg text-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}
