'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

function CreatePackageContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEditing = !!editId;

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
    tags: [] as string[]
  });

  // Duration State
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('Days');

  const [missingFields, setMissingFields] = useState<string[]>([]);

  // Tags handlers
  const [tagInput, setTagInput] = useState('');
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

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
  const [itinerary, setItinerary] = useState('');



  // Tour Options State (Pricing)
  const [tourOptions, setTourOptions] = useState([
    {
      title: 'Standard Tour',
      duration: '4 Hours',
      time: '14:00',
      tourDurationType: 'hours', // New
      timeSlots: [] as string[], 
      description: '',
      pricingType: 'person', // person or group
      minPax: 1,
      maxPax: 100,
      adultPrice: '',
      adultAgeRange: '12-99',
      childPrice: '',
      childAgeRange: '2-11',
      infantPrice: '0',
      infantAgeRange: '0-1',
      groupPrice: '',
      penalty: '24 Hours Before: 100% Penalty',
      features: [
        { icon: '🚗', label: 'Pickup Included' },
        { icon: '🗣️', label: 'Live Guide' }
      ],
      inclusions: [],
      extraServices: [] as { name: string; price: string }[],
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

  // Fetch Package Data for Editing
  useEffect(() => {
    if (!editId) return;

    const fetchPackage = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/packages?id=${editId}`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
           const pkg = json.data[0]; // Since API returns array
           
           // Populate Basic Fields
           setFormData({
             title: pkg.title || '',
             price: pkg.price?.toString() || '',
             location: pkg.location || '',
             duration: pkg.duration || '',
             minAge: pkg.minAge?.toString() || '',
             maxAge: pkg.maxAge?.toString() || '',
             description: pkg.description || '',
             category: pkg.category?._id || pkg.category || '', // Handle populated vs raw ID
             tags: pkg.tags || []
           });

           // Duration Parsing (Reverse engineering string or use stored fields)
           if (pkg.durationDays > 0) {
               setDurationValue(pkg.durationDays.toString());
               setDurationUnit('Days');
           } else if (pkg.durationHours > 0) {
               setDurationValue(pkg.durationHours.toString());
               setDurationUnit('Hours');
           }

           // Content
           setHighlights(pkg.highlights || '');
           setIncludes(pkg.includes || '');
           setItinerary(pkg.itinerary || '');
           
           // Features
           if (pkg.features && pkg.features.length > 0) setFeatures(pkg.features);

           // Tour Options
           if (pkg.tourOptions && pkg.tourOptions.length > 0) setTourOptions(pkg.tourOptions);
           
           // Images
           if (pkg.image) setImagePreview(pkg.image);
           if (pkg.gallery && pkg.gallery.length > 0) {
               setGalleryPreviews(pkg.gallery);
               // Note: We cannot convert URLs back to File objects easily, 
               // so we need to handle existing images vs new files in submit.
               // For now, we'll just show previews. 
               // Submit logic needs to know about existing images.
           }
        }
      } catch (err) {
        console.error('Failed to fetch package', err);
        setMessage('Failed to load package data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackage();
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Handlers for Complex Lists ---



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
       // Handled by dedicated feature handlers below
    } else {
        (newOptions[index] as any)[field] = value;
    }
    setTourOptions(newOptions);
  };

  // Tour Option Features
  const handleTourOptionFeatureChange = (optionIdx: number, featureIdx: number, field: string, value: string) => {
    const newOptions = [...tourOptions];
    const newFeatures = [...newOptions[optionIdx].features];
    newFeatures[featureIdx] = { ...newFeatures[featureIdx], [field]: value };
    newOptions[optionIdx].features = newFeatures;
    setTourOptions(newOptions);
  };

  const addTourOptionFeature = (optionIdx: number) => {
    const newOptions = [...tourOptions];
    newOptions[optionIdx].features.push({ icon: '✨', label: 'New Feature' });
    setTourOptions(newOptions);
  };

  const removeTourOptionFeature = (optionIdx: number, featureIdx: number) => {
    const newOptions = [...tourOptions];
    newOptions[optionIdx].features = newOptions[optionIdx].features.filter((_, i) => i !== featureIdx);
    setTourOptions(newOptions);
  };
  const addTourOption = () => {
    setTourOptions([...tourOptions, {
      title: 'New Option',
      duration: '4 Hours',
      time: '10:00',
      tourDurationType: 'hours', // New
      timeSlots: [] as string[],
      description: '',
      pricingType: 'person',
      minPax: 1,
      maxPax: 50,
      adultPrice: '',
      adultAgeRange: '12-99',
      childPrice: '',
      childAgeRange: '2-11',
      infantPrice: '0',
      infantAgeRange: '0-1',
      groupPrice: '',
      penalty: 'Free Cancellation',
      features: [
        { icon: '🚗', label: 'Pickup Included' },
        { icon: '🗣️', label: 'Live Guide' }
      ],
      inclusions: [],
      extraServices: [] as { name: string; price: string }[],
    }]);
  };
  const removeTourOption = (index: number) => {
    setTourOptions(tourOptions.filter((_, i) => i !== index));
  };

  // Extra Service Handlers for Tour Options
  const addExtraServiceToOption = (optionIndex: number) => {
    const newOptions = [...tourOptions];
    newOptions[optionIndex].extraServices.push({ name: '', price: '' });
    setTourOptions(newOptions);
  };
  
  const removeExtraServiceFromOption = (optionIndex: number, serviceIndex: number) => {
    const newOptions = [...tourOptions];
    newOptions[optionIndex].extraServices.splice(serviceIndex, 1);
    setTourOptions(newOptions);
  };
  
  const handleExtraServiceChange = (optionIndex: number, serviceIndex: number, field: string, value: string) => {
    const newOptions = [...tourOptions];
    (newOptions[optionIndex].extraServices[serviceIndex] as any)[field] = value;
    setTourOptions(newOptions);
  };

  // Time Slot Handlers
  const addTimeSlot = (optionIndex: number) => {
    const newOptions = [...tourOptions];
    if (!newOptions[optionIndex].timeSlots) newOptions[optionIndex].timeSlots = [];
    newOptions[optionIndex].timeSlots.push('09:00'); // Default time
    setTourOptions(newOptions);
  };

  const removeTimeSlot = (optionIndex: number, slotIndex: number) => {
    const newOptions = [...tourOptions];
    if (newOptions[optionIndex].timeSlots) {
       newOptions[optionIndex].timeSlots = newOptions[optionIndex].timeSlots.filter((_, i) => i !== slotIndex);
       setTourOptions(newOptions);
    }
  };

  const handleTimeSlotChange = (optionIndex: number, slotIndex: number, value: string) => {
    const newOptions = [...tourOptions];
     if (newOptions[optionIndex].timeSlots) {
        newOptions[optionIndex].timeSlots[slotIndex] = value;
        setTourOptions(newOptions);
     }
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

    // Validation
    const missing = [];
    
    if (!formData.title) missing.push('title');
    if (!formData.location) missing.push('location');
    if (!formData.category) missing.push('category');
    if (!formData.description) missing.push('description');
    // Allow missing image if editing and we have a preview (existing image)
    if (!image && !isEditing) missing.push('image'); 
    
    // Gallery validation: If editing, we might have previews but no new files
    if (galleryFiles.length === 0 && galleryPreviews.length === 0) missing.push('gallery');

    if (missing.length > 0) {
      setMissingFields(missing);
      setMessage(`Please fill in all required fields: ${missing.join(', ')}`);
      setIsLoading(false);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const data = new FormData();
      if (isEditing && editId) data.append('id', editId);

      // Basic Fields
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (image) data.append('image', image);
      
      // Tags
      data.append('tags', JSON.stringify(formData.tags));
      
      // Calculate Duration (backward compatibility)
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
          timeSlots: opt.timeSlots || [],
          adultPrice: Number(opt.adultPrice) || 0,
          childPrice: Number(opt.childPrice) || 0,
          infantPrice: Number(opt.infantPrice) || 0,
          groupPrice: Number(opt.groupPrice) || 0,
          minPax: Number(opt.minPax) || 1,
          maxPax: Number(opt.maxPax) || 999
      }));
      data.append('tourOptions', JSON.stringify(cleanedOptions));

      // Itinerary & Services
      data.append('itinerary', itinerary);

      galleryFiles.forEach(file => data.append('gallery', file));

      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/packages', {
        method: method,
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setMessage(isEditing ? 'Package updated successfully!' : 'Package created successfully!');
        window.scrollTo(0, 0);
        if (!isEditing) {
           // Reset form logic if needed, or redirect
           router.push('/dashboard/manage');
        } else {
           // Optionally redirect back to manage
           setTimeout(() => router.push('/dashboard/manage'), 1500);
        }
      } else {
        setMessage(json.error || 'Failed to save package');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{isEditing ? 'Edit Package' : 'Create New Package'}</h1>
        
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

             {/* Tags */}
             <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-4 py-2 border rounded-lg" 
                        placeholder="Add a tag and press Enter"
                    />
                    <button 
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Tag
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                            {tag}
                            <button 
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-blue-700 hover:text-blue-900"
                            >
                                ×
                            </button>
                        </span>
                    ))}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Includes/Excludes</label>
                    <div className="h-48 mb-8"><ReactQuill theme="snow" value={includes} onChange={setIncludes} className="h-full" /></div>
                 </div>
             </div>
          </section>

          {/* Section 4: Itinerary */}
          <section className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Itinerary</h2>
              <div className="h-48 mb-8">
                  <ReactQuill 
                    theme="snow" 
                    value={itinerary} 
                    onChange={setItinerary} 
                    className="h-full" 
                    placeholder="Describe the itinerary here..."
                  />
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
                               
                               <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 mb-2 bg-gray-50 p-3 rounded-lg">
                                  <div>
                                      <label className="block text-xs text-gray-500 mb-2 font-bold">Duration Type</label>
                                      <div className="flex gap-4">
                                          <label className="flex items-center gap-2 cursor-pointer">
                                              <input 
                                                type="radio" 
                                                name={`durationType-${idx}`}
                                                value="hours"
                                                checked={option.tourDurationType !== 'days'} // Default to hours
                                                onChange={() => handleTourOptionChange(idx, 'tourDurationType', 'hours')}
                                                className="text-blue-600"
                                              />
                                              <span className="text-sm">Hours (Time Slots)</span>
                                          </label>
                                          <label className="flex items-center gap-2 cursor-pointer">
                                              <input 
                                                type="radio" 
                                                name={`durationType-${idx}`}
                                                value="days"
                                                checked={option.tourDurationType === 'days'}
                                                onChange={() => handleTourOptionChange(idx, 'tourDurationType', 'days')}
                                                className="text-blue-600"
                                              />
                                              <span className="text-sm">Days (No Time Selection)</span>
                                          </label>
                                      </div>
                                  </div>

                                  {/* Conditional Time Logic */}
                                  <div>
                                      {option.tourDurationType === 'days' ? (
                                           <div className="flex items-center h-full">
                                              <p className="text-sm text-gray-500 italic">No start time required for day tours.</p>
                                           </div>
                                      ) : (
                                          <div>
                                              <label className="block text-xs text-gray-500 mb-1">Default Time (Hidden if using slots)</label>
                                              <input type="time" value={option.time} onChange={(e) => handleTourOptionChange(idx, 'time', e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
                                              
                                              <label className="block text-xs text-gray-500 mb-1 font-bold">Start Time Slots (User Selects One)</label>
                                              <div className="space-y-2 border p-2 rounded bg-white">
                                                  {option.timeSlots && option.timeSlots.map((slot, sIdx) => (
                                                      <div key={sIdx} className="flex gap-1">
                                                          <input 
                                                              type="time" 
                                                              value={slot} 
                                                              onChange={(e) => handleTimeSlotChange(idx, sIdx, e.target.value)}
                                                              className="w-full px-2 py-1 border rounded text-sm"
                                                          />
                                                          <button 
                                                              type="button" 
                                                              onClick={() => removeTimeSlot(idx, sIdx)}
                                                              className="text-red-500 hover:text-red-700 px-1"
                                                          >
                                                              ✕
                                                          </button>
                                                      </div>
                                                  ))}
                                                  <button 
                                                      type="button" 
                                                      onClick={() => addTimeSlot(idx)}
                                                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                  >
                                                      + Add Time Slot
                                                  </button>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                               </div>

                               <div>
                                   <label className="block text-xs text-gray-500 mb-1">Pricing Type</label>
                                   <select value={option.pricingType} onChange={(e) => handleTourOptionChange(idx, 'pricingType', e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                                       <option value="person">Per Person</option>
                                       <option value="group">Per Group</option>
                                   </select>
                               </div>
                           </div>

                           {/* Description */}
                           <div className="mb-4">
                               <label className="block text-xs text-gray-500 mb-1">Description (Optional)</label>
                               <textarea 
                                   value={option.description} 
                                   onChange={(e) => handleTourOptionChange(idx, 'description', e.target.value)} 
                                   className="w-full px-3 py-2 border rounded-lg" 
                                   rows={2}
                                   placeholder="Add a description for this tour option..."
                               />
                           </div>


                            {/* Conditional Pricing Inputs */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="text-sm font-semibold mb-3 text-gray-700">Prices</h5>
                                {option.pricingType === 'person' ? (
                                    <div className="grid grid-cols-3 gap-4">
                                        {/* Adult Pricing */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Adult Min And Max Age</label>
                                            <input type="text" placeholder="12-99" value={option.adultAgeRange} onChange={(e) => handleTourOptionChange(idx, 'adultAgeRange', e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
                                            <label className="block text-xs text-gray-500 mb-1">Adult Price</label>
                                            <input type="number" placeholder="0.00" value={option.adultPrice} onChange={(e) => handleTourOptionChange(idx, 'adultPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        {/* Child Pricing */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Child Min And Max Age</label>
                                            <input type="text" placeholder="2-11" value={option.childAgeRange} onChange={(e) => handleTourOptionChange(idx, 'childAgeRange', e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
                                            <label className="block text-xs text-gray-500 mb-1">Child Price</label>
                                            <input type="number" placeholder="0.00" value={option.childPrice} onChange={(e) => handleTourOptionChange(idx, 'childPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                        {/* Infant Pricing */}
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Infant Min And Max Age</label>
                                            <input type="text" placeholder="0-1" value={option.infantAgeRange} onChange={(e) => handleTourOptionChange(idx, 'infantAgeRange', e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-2" />
                                            <label className="block text-xs text-gray-500 mb-1">Infant Price</label>
                                            <input type="number" placeholder="0.00" value={option.infantPrice} onChange={(e) => handleTourOptionChange(idx, 'infantPrice', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
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


                            {/* Duration & Penalty */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Duration (e.g. "4 Hours")</label>
                                    <input type="text" placeholder="e.g. 4 Hours" value={option.duration} onChange={(e) => handleTourOptionChange(idx, 'duration', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Cancellation Penalty</label>
                                    <input type="text" placeholder="e.g. 24 Hours Before: 100% Penalty" value={option.penalty} onChange={(e) => handleTourOptionChange(idx, 'penalty', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                                </div>
                            </div>

                            {/* Features Section */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h5 className="text-sm font-semibold text-gray-700">Features (Shown on Card)</h5>
                                    <button type="button" onClick={() => addTourOptionFeature(idx)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700">+ Add Feature</button>
                                </div>
                                <div className="space-y-2">
                                    {option.features.map((feature, fIdx) => (
                                        <div key={fIdx} className="flex gap-2 items-center bg-white p-2 rounded-lg">
                                            <div className="w-20">
                                                <label className="block text-xs text-gray-400 mb-1">Icon</label>
                                                <input 
                                                    type="text" 
                                                    value={feature.icon} 
                                                    onChange={(e) => handleTourOptionFeatureChange(idx, fIdx, 'icon', e.target.value)} 
                                                    className="w-full px-2 py-1 border rounded text-center text-xl" 
                                                    placeholder="🚗"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-gray-400 mb-1">Label</label>
                                                <input 
                                                    type="text" 
                                                    value={feature.label} 
                                                    onChange={(e) => handleTourOptionFeatureChange(idx, fIdx, 'label', e.target.value)} 
                                                    className="w-full px-2 py-1 border rounded" 
                                                    placeholder="Feature description"
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeTourOptionFeature(idx, fIdx)} 
                                                className="text-red-500 hover:text-red-700 mt-5 px-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {option.features.length === 0 && (
                                        <p className="text-xs text-gray-500 italic">No features added yet. Click "+ Add Feature" to add one.</p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">💡 Tip: Use emojis like 🚗 (car), 🗣️ (guide), 🚌 (bus), or any custom icon</p>
                            </div>

                            {/* Extra Services */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h5 className="text-sm font-semibold text-gray-700">Extra Services</h5>
                                    <button 
                                        type="button" 
                                        onClick={() => addExtraServiceToOption(idx)} 
                                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700"
                                    >
                                        + Add Service
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {option.extraServices.map((service, sIdx) => (
                                        <div key={sIdx} className="flex gap-2 items-end bg-white p-2 rounded-lg">
                                            <div className="flex-1">
                                                <label className="block text-xs text-gray-400 mb-1">Service Name</label>
                                                <input 
                                                    type="text" 
                                                    value={service.name} 
                                                    onChange={(e) => handleExtraServiceChange(idx, sIdx, 'name', e.target.value)} 
                                                    className="w-full px-2 py-1 border rounded" 
                                                    placeholder="e.g. Photography"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <label className="block text-xs text-gray-400 mb-1">Price</label>
                                                <input 
                                                    type="text" 
                                                    value={service.price} 
                                                    onChange={(e) => handleExtraServiceChange(idx, sIdx, 'price', e.target.value)} 
                                                    className="w-full px-2 py-1 border rounded" 
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeExtraServiceFromOption(idx, sIdx)} 
                                                className="text-red-500 hover:text-red-700 px-2 pb-1"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    {option.extraServices.length === 0 && (
                                        <p className="text-xs text-gray-500 italic">No extra services added yet.</p>
                                    )}
                                </div>
                            </div>

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
              {isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Package' : 'Publish Package')}
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

export default function CreatePackagePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreatePackageContent />
    </Suspense>
  );
}
