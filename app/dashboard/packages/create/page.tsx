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
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    duration: '', // Legacy string display (auto-generated now)
    minAge: '',
    maxAge: '',
    description: '',
    category: '',
  });

  // Duration State
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('Days');

  const [missingFields, setMissingFields] = useState<string[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Rich Text Content
  const [highlights, setHighlights] = useState('');
  const [includes, setIncludes] = useState('');

  // Features State
  const [features, setFeatures] = useState([
    { icon: '🎭', title: 'Experience Duration:', description: '1 to 4 hours' },
    { icon: '🚗', title: 'Transportation:', description: 'With Pickup and Drop-off' },
    { icon: '💬', title: 'Available Languages:', description: 'English, Spanish, French, German, Chinese, Arabic' },
    { icon: '💰', title: 'Price Range:', description: 'Moderate Pricing, Premium Experiences' },
    { icon: '🎉', title: 'Great For:', description: 'Birthdays, Anniversaries, Family Outings, Corporate Events, Retirement' },
    { icon: '⏰', title: 'Best Time to Visit:', description: 'Morning, Afternoon, Evening and night' },
    { icon: '👫', title: 'Perfect For:', description: 'Couples, Families, Friends, Seniors, Employee Teams, Him, Her' },
  ]);

  // Itinerary State
  const [itinerary, setItinerary] = useState([
    { day: 1, title: 'Arrival', description: '' }
  ]);

  // Extra Services State
  const [extraServices, setExtraServices] = useState([
    { name: '', price: '', type: 'person' } // type: person, group, fixed
  ]);

  // Tour Options State (Pricing)
  const [tourOptions, setTourOptions] = useState([
    {
      title: 'Standard Tour',
      duration: '4 Hours',
      time: '14:00',
      pricingType: 'person', // person or group
      minPax: 1,
      maxPax: 100,
      adultPrice: '',
      childPrice: '',
      infantPrice: '0',
      groupPrice: '',
      penalty: '24 Hours Before: 100% Penalty',
      features: [
        { icon: 'car', label: 'Pickup Included' },
        { icon: 'guide', label: 'Live Guide' }
      ],
      inclusions: ['Water']
    }
  ]);

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

  // --- Handlers for Complex Lists ---

  // Itinerary
  const handleItineraryChange = (index: number, field: string, value: string) => {
    const newItinerary = [...itinerary];
    (newItinerary[index] as any)[field] = value;
    setItinerary(newItinerary);
  };
  const addItineraryDay = () => {
    setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }]);
  };
  const removeItineraryDay = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  // Extra Services
  const handleExtraServiceChange = (index: number, field: string, value: string) => {
    const newServices = [...extraServices];
    (newServices[index] as any)[field] = value;
    setExtraServices(newServices);
  };
  const addExtraService = () => {
    setExtraServices([...extraServices, { name: '', price: '', type: 'person' }]);
  };
  const removeExtraService = (index: number) => {
    setExtraServices(extraServices.filter((_, i) => i !== index));
  };

  // Features
  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFeatures(newFeatures);
  };

  // Tour Options
  const handleTourOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...tourOptions];
    if (field === 'features' || field === 'inclusions') {
       // Skipped complex array edit for MVP
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
      pricingType: 'person',
      minPax: 1,
      maxPax: 50,
      adultPrice: '',
      childPrice: '',
      infantPrice: '0',
      groupPrice: '',
      penalty: 'Free Cancellation',
      features: [{ icon: 'car', label: 'Transfer' }],
      inclusions: []
    }]);
  };
  const removeTourOption = (index: number) => {
    setTourOptions(tourOptions.filter((_, i) => i !== index));
  };

  // Image Handlers
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

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!image) { alert('Please select a main image'); setIsLoading(false); return; }
    if (!formData.category) { alert('Please select a category'); setIsLoading(false); return; }

    // Validation
    const required = ['title', 'price', 'location', 'description', 'category'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (!image) missing.push('image');
    if (!durationValue) missing.push('duration');

    if (missing.length > 0) {
        setMissingFields(missing);
        setMessage('Please fill in all required fields.');
        setIsLoading(false);
        window.scrollTo(0, 0);
        return;
    }

    try {
      const data = new FormData();
      // Basic Fields
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('location', formData.location);
      // duration is calculated below
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('image', image);
      
      // Calculate Duration
      const dVal = Number(durationValue) || 0;
      if (durationUnit === 'Days') {
          data.append('durationDays', dVal.toString());
          data.append('durationHours', '0');
          data.append('duration', `${dVal} Days`);
      } else {
          data.append('durationDays', '0');
          data.append('durationHours', dVal.toString());
          data.append('duration', `${dVal} Hours`);
      }
      
      data.append('minAge', formData.minAge);
      data.append('maxAge', formData.maxAge);

      // Rich Text
      data.append('highlights', highlights);
      data.append('includes', includes);

      // Arrays
      data.append('features', JSON.stringify(features));
      
      // Clean Options
      const cleanedOptions = tourOptions.map(opt => ({
          ...opt,
          adultPrice: Number(opt.adultPrice) || 0,
          childPrice: Number(opt.childPrice) || 0,
          infantPrice: Number(opt.infantPrice) || 0,
          groupPrice: Number(opt.groupPrice) || 0,
          minPax: Number(opt.minPax) || 1,
          maxPax: Number(opt.maxPax) || 999
      }));
      data.append('tourOptions', JSON.stringify(cleanedOptions));

      // Itinerary & Services
      data.append('itinerary', JSON.stringify(itinerary));
      const cleanedServices = extraServices.filter(s => s.name).map(s => ({
          ...s,
          price: Number(s.price) || 0
      }));
      data.append('extraServices', JSON.stringify(cleanedServices));

      galleryFiles.forEach(file => data.append('gallery', file));

      const res = await fetch('/api/packages', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setMessage('Package created successfully!');
        window.scrollTo(0, 0);
        // Optional: Reset form here
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
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Package</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
          
          {/* Section 1: Basic Info */}
          <section className="space-y-6">
             <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${missingFields.includes('title') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${missingFields.includes('category') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (Display Only)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${missingFields.includes('price') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${missingFields.includes('location') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                  />
                </div>
             </div>

             {/* Duration & Age */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Duration Group */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <div className="flex gap-0">
                        <input 
                            type="number" 
                            value={durationValue} 
                            onChange={(e) => setDurationValue(e.target.value)} 
                            className={`w-24 px-4 py-2 border border-r-0 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-transparent ${missingFields.includes('duration') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                            placeholder="1" 
                        />
                        <select 
                            value={durationUnit} 
                            onChange={(e) => setDurationUnit(e.target.value)}
                            className="px-4 py-2 border rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent min-w-[100px]"
                        >
                            <option value="Days">Days</option>
                            <option value="Hours">Hours</option>
                        </select>
                    </div>
                </div>
                
                {/* Age placeholders */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                        <input type="number" name="minAge" value={formData.minAge} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                        <input type="number" name="maxAge" value={formData.maxAge} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="99" />
                    </div>
                </div>
             </div>
          </section>

          {/* Section 2: Media */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Media</h2>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className={`w-full border rounded-lg p-2 ${missingFields.includes('image') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                />
                {imagePreview && (
                    <div className="mt-2 w-32 h-32 relative rounded-lg overflow-hidden border">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
                <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="w-full border rounded-lg p-2" />
                {galleryPreviews.length > 0 && (
                    <div className="mt-2 grid grid-cols-4 md:grid-cols-6 gap-2">
                        {galleryPreviews.map((preview, idx) => (
                            <div key={idx} className="w-24 h-24 relative rounded-lg overflow-hidden border">
                                <Image src={preview} alt="Gallery" fill className="object-cover" />
                                <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs">X</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </section>

          {/* Section 3: Details */}
          <section className="space-y-6">
             <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Package Details</h2>
             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <textarea 
                    name="description" 
                    rows={4} 
                    value={formData.description} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${missingFields.includes('description') ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                 />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                    <div className="h-48 mb-8"><ReactQuill theme="snow" value={highlights} onChange={setHighlights} className="h-full" /></div>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Includes</label>
                    <div className="h-48 mb-8"><ReactQuill theme="snow" value={includes} onChange={setIncludes} className="h-full" /></div>
                 </div>
             </div>
          </section>

          {/* Section 4: Itinerary */}
          <section className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">Itinerary</h2>
                  <button type="button" onClick={addItineraryDay} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">+ Add Day</button>
              </div>
              <div className="space-y-4">
                  {itinerary.map((day, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-gray-50 relative">
                          <button type="button" onClick={() => removeItineraryDay(idx)} className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-700">Remove</button>
                          <div className="flex gap-4 items-center mb-2">
                              <span className="font-bold text-gray-600 w-16">Day {idx + 1}</span>
                              <input type="text" placeholder="Title (e.g. Arrival in Dubai)" value={day.title} onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg" />
                          </div>
                          <textarea placeholder="Description of the day's activities..." value={day.description} onChange={(e) => handleItineraryChange(idx, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                  ))}
              </div>
          </section>

          {/* Section 5: Tour Options (Pricing) */}
          <section className="space-y-6">
               <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">Tour Options & Pricing</h2>
                  <button type="button" onClick={addTourOption} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">+ Add Option</button>
               </div>
               <div className="space-y-6">
                  {tourOptions.map((option, idx) => (
                      <div key={idx} className="border-2 border-dashed border-gray-200 rounded-xl p-6 relative">
                           <button type="button" onClick={() => removeTourOption(idx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">Remove Option</button>
                           <h4 className="font-bold text-gray-700 mb-4">Option {idx + 1}</h4>
                           
                           {/* Main Details */}
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                               <div className="md:col-span-2">
                                   <label className="block text-xs text-gray-500 mb-1">Option Name</label>
                                   <input type="text" value={option.title} onChange={(e) => handleTourOptionChange(idx, 'title', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                               </div>
                               <div>
                                   <label className="block text-xs text-gray-500 mb-1">Time</label>
                                   <input type="time" value={option.time} onChange={(e) => handleTourOptionChange(idx, 'time', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                               </div>
                               <div>
                                   <label className="block text-xs text-gray-500 mb-1">Pricing Type</label>
                                   <select value={option.pricingType} onChange={(e) => handleTourOptionChange(idx, 'pricingType', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                                       <option value="person">Per Person</option>
                                       <option value="group">Per Group</option>
                                   </select>
                               </div>
                           </div>

                           {/* Conditional Pricing Inputs */}
                           <div className="bg-gray-50 p-4 rounded-lg">
                               <h5 className="text-sm font-semibold mb-3 text-gray-700">Prices</h5>
                               {option.pricingType === 'person' ? (
                                   <div className="grid grid-cols-3 gap-4">
                                       <div>
                                           <label className="block text-xs text-gray-500 mb-1">Adult Price</label>
                                           <input type="number" placeholder="0.00" value={option.adultPrice} onChange={(e) => handleTourOptionChange(idx, 'adultPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                       </div>
                                       <div>
                                           <label className="block text-xs text-gray-500 mb-1">Child Price</label>
                                           <input type="number" placeholder="0.00" value={option.childPrice} onChange={(e) => handleTourOptionChange(idx, 'childPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                       </div>
                                       <div>
                                           <label className="block text-xs text-gray-500 mb-1">Infant Price</label>
                                           <input type="number" placeholder="0.00" value={option.infantPrice} onChange={(e) => handleTourOptionChange(idx, 'infantPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                       </div>
                                   </div>
                               ) : (
                                   <div className="grid grid-cols-3 gap-4">
                                        <div>
                                           <label className="block text-xs text-gray-500 mb-1">Group Price</label>
                                           <input type="number" placeholder="0.00" value={option.groupPrice} onChange={(e) => handleTourOptionChange(idx, 'groupPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                       </div>
                                       <div>
                                           <label className="block text-xs text-gray-500 mb-1">Capacity (Guests per Unit)</label>
                                           <input type="number" placeholder="e.g. 4" value={option.maxPax} onChange={(e) => handleTourOptionChange(idx, 'maxPax', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                       </div>
                                   </div>
                               )}
                           </div>
                      </div>
                  ))}
               </div>
          </section>

          {/* Section 6: Extra Services */}
          <section className="space-y-6">
              <div className="flex justify-between items-center border-b pb-2">
                  <h2 className="text-xl font-semibold text-gray-800">Extra Services</h2>
                  <button type="button" onClick={addExtraService} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">+ Add Service</button>
              </div>
              <div className="space-y-4">
                  {extraServices.map((service, idx) => (
                      <div key={idx} className="flex gap-4 items-end">
                          <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">Service Name</label>
                              <input type="text" value={service.name} onChange={(e) => handleExtraServiceChange(idx, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Photography" />
                          </div>
                          <div className="w-32">
                              <label className="block text-xs text-gray-500 mb-1">Price</label>
                              <input type="number" value={service.price} onChange={(e) => handleExtraServiceChange(idx, 'price', e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
                          </div>
                          <div className="w-40">
                              <label className="block text-xs text-gray-500 mb-1">Per</label>
                              <select value={service.type} onChange={(e) => handleExtraServiceChange(idx, 'type', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                                  <option value="person">Per Person</option>
                                  <option value="group">Per Group</option>
                                  <option value="fixed">Fixed Price</option>
                              </select>
                          </div>
                          <button type="button" onClick={() => removeExtraService(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">X</button>
                      </div>
                  ))}
              </div>
          </section>

          {/* Features Grid (Existing, simplified) */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Tour Features (Icons)</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {features.map((feature, index) => (
                 <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                    <input type="text" value={feature.icon} onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)} className="w-12 text-center border rounded p-1" />
                    <div className="flex-1">
                        <input type="text" value={feature.title} onChange={(e) => handleFeatureChange(index, 'title', e.target.value)} className="w-full font-semibold border-none focus:ring-0 p-0 text-sm" />
                        <input type="text" value={feature.description} onChange={(e) => handleFeatureChange(index, 'description', e.target.value)} className="w-full text-xs text-gray-500 border-none focus:ring-0 p-0" />
                    </div>
                 </div>
               ))}
             </div>
          </section>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${
                isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-[#F85E46] to-[#ff8f7d]'
              }`}
            >
              {isLoading ? 'Creating Package...' : 'Publish Package'}
            </button>
          </div>

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
