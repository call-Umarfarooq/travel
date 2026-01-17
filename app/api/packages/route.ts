import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Package from '@/models/Package';
import Category from '@/models/Category'; // Import to ensure model registration
import path from 'path';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';
import { uploadImage } from '@/lib/file-upload';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    let query: any = {};
    if (categoryId) {
        // Check if categoryId is a valid ObjectId, otherwise treat as slug
        if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
            query.category = categoryId;
        } else {
             // It's a slug, find category first
             const categoryDoc = await Category.findOne({ slug: categoryId });
             if (categoryDoc) {
                 query.category = categoryDoc._id;
             } else {
                 // Slug not found, maybe return empty or ignore? 
                 // If provided slug is invalid, we should probably return nothing
                 query.category = null; // forcing empty result
             }
        }
    }
    if (slug) query = { ...query, slug: slug };
    if (id) query = { ...query, _id: id };

    const packages = await Package.find(query)
      .populate('category', 'name') // Populate category name
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const id = formData.get('id') as string;

    if (!id) {
       return NextResponse.json({ success: false, error: 'Package ID required' }, { status: 400 });
    }

    // Extract fields to update
    const updateData: any = {};
    
    // Text Fields
    const title = formData.get('title') as string;
    if (title) updateData.title = title;
    
    if (formData.has('price')) updateData.price = Number(formData.get('price'));
    if (formData.get('location')) updateData.location = formData.get('location');
    if (formData.get('duration')) updateData.duration = formData.get('duration');
    if (formData.get('description')) updateData.description = formData.get('description');
    if (formData.get('category')) updateData.category = formData.get('category');
    if (formData.get('includes')) updateData.includes = formData.get('includes');
    if (formData.get('highlights')) updateData.highlights = formData.get('highlights');
    if (formData.get('itinerary')) updateData.itinerary = formData.get('itinerary');
    if (formData.get('minAge')) updateData.minAge = Number(formData.get('minAge'));
    if (formData.get('maxAge')) updateData.maxAge = Number(formData.get('maxAge'));
    if (formData.has('durationDays')) updateData.durationDays = Number(formData.get('durationDays'));
    if (formData.has('durationHours')) updateData.durationHours = Number(formData.get('durationHours'));


    // Complex JSON fields
    if (formData.get('tags')) {
        try {
            updateData.tags = JSON.parse(formData.get('tags') as string);
        } catch (e) { console.error("Error parsing tags", e); }
    }
    if (formData.get('features')) {
        try {
            updateData.features = JSON.parse(formData.get('features') as string);
        } catch (e) { console.error("Error parsing features", e); }
    }
    if (formData.get('tourOptions')) {
        try {
            updateData.tourOptions = JSON.parse(formData.get('tourOptions') as string);
        } catch (e) { console.error("Error parsing tourOptions", e); }
    }
    
    // Handle Image Update
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
        updateData.image = await uploadImage(imageFile);
    }

    // Handle Gallery Update
    // We expect 'existingGallery' (JSON array of URLs) and/or 'gallery' (File[])
    const existingGalleryJson = formData.get('existingGallery') as string;
    let finalGallery: string[] = [];

    if (existingGalleryJson) {
        try {
            finalGallery = JSON.parse(existingGalleryJson);
        } catch (e) {
            console.error("Error parsing existingGallery", e);
        }
    } else {
         // If not sent, maybe we shouldn't wipe it? 
         // But usually if the frontend supports it, it sends the current state.
         // If we strictly follow the form, if 'existingGallery' is missing, it means none?
         // For safety, if the field is missing entirely, we might want to fetch existing?
         // But let's assume frontend sends what it wants to keep.
         // To be safe, let's fetch current if we are unsure, OR assume frontend sends `existingGallery`.
         // We will update frontend to send `existingGallery`.
    }

    const galleryFiles = formData.getAll('gallery') as File[];
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (file.size > 0) {
             const url = await uploadImage(file);
             finalGallery.push(url);
        }
      }
    }
    
    // Only update gallery if we have changes (or if field was explicitly sent as empty list)
    if (formData.has('existingGallery') || (galleryFiles && galleryFiles.length > 0)) {
         updateData.gallery = finalGallery;
    }

    const updatedPackage = await Package.findByIdAndUpdate(id, updateData, { new: true });
    
    return NextResponse.json({ success: true, data: updatedPackage });

  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ success: false, error: 'Failed to update package' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    
    // Extract fields
    const title = formData.get('title') as string;
    const price = Number(formData.get('price'));
    const location = formData.get('location') as string;
    const duration = formData.get('duration') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('category') as string;
    const includes = formData.get('includes') as string;
    const highlights = formData.get('highlights') as string;
    const imageFile = formData.get('image') as File;
    const galleryFiles = formData.getAll('gallery') as File[];

    // Validate fields
    const missing: string[] = [];
    if (!title) missing.push('title');
    if (price === undefined || price === null || isNaN(price)) missing.push('price');
    if (!location) missing.push('location');
    if (!duration) missing.push('duration');
    if (!description) missing.push('description');
    if (!categoryId) missing.push('categoryId');
    if (!imageFile) missing.push('image');

    if (missing.length > 0) {
      return NextResponse.json({ success: false, error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }

    // Upload Main Image
    const imageUrl = await uploadImage(imageFile);

    // Upload Gallery Images
    const galleryUrls: string[] = [];
    if (galleryFiles && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (file.size > 0) {
             const url = await uploadImage(file);
             galleryUrls.push(url);
        }
      }
    }

    // Create Slug
    // Parse Features
    const featuresJson = formData.get('features') as string;
    let features = [];
    try {
        if (featuresJson) {
            features = JSON.parse(featuresJson);
        }
    } catch (e) {
        console.error("Failed to parse features", e);
    }
    
    // Default fallback for features
    if (!features || features.length === 0) {
        features = [
            { icon: '🎭', title: 'Experience Duration:', description: duration },
            { icon: '🚗', title: 'Transportation:', description: 'With Pickup and Drop-off' },
            { icon: '💬', title: 'Available Languages:', description: 'English, Arabic' },
            { icon: '⏰', title: 'Best Time to Visit:', description: 'Morning, Evening' }
        ];
    }

    // Parse Tour Options
    const tourOptionsJson = formData.get('tourOptions') as string;
    let tourOptions = [];
    try {
        if (tourOptionsJson) {
            tourOptions = JSON.parse(tourOptionsJson);
        }
    } catch (e) {
        console.error("Failed to parse tourOptions", e);
    }

    // Extract extra fields
    const durationDays = Number(formData.get('durationDays'));
    const durationHours = Number(formData.get('durationHours'));
    const minAge = formData.get('minAge') ? Number(formData.get('minAge')) : undefined;
    const maxAge = formData.get('maxAge') ? Number(formData.get('maxAge')) : undefined;

    // Itinerary (Rich Text String)
    const itinerary = formData.get('itinerary') as string;

    // Parse Extra Services (Legacy/Global)
    const extraServicesJson = formData.get('extraServices') as string;
    let extraServices = [];
    try {
        if (extraServicesJson) {
            extraServices = JSON.parse(extraServicesJson);
        }
    } catch (e) {
        console.error("Failed to parse extraServices", e);
    }
    
    // Parse Tags
    const tagsJson = formData.get('tags') as string;
    let tags: string[] = [];
    try {
        if (tagsJson) {
            tags = JSON.parse(tagsJson);
        }
    } catch (e) {
        console.error("Failed to parse tags", e);
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPackage = await Package.create({
      title,
      slug,
      category: categoryId,
      image: imageUrl,
      price,
      location,
      duration, // String display
      durationDays,
      durationHours,
      minAge,
      maxAge,
      description,
      peopleGoing: Math.floor(Math.random() * 100) + 10,
      rating: 5,
      includes: includes || '',
      highlights: highlights || '',
      tourOptions: tourOptions,
      features: features, 
      itinerary: itinerary,
      extraServices: extraServices,
      tags: tags,
      gallery: galleryUrls,
    });

    return NextResponse.json({ success: true, data: newPackage }, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ success: false, error: 'Failed to create package' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing package ID' }, { status: 400 });
    }

    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return NextResponse.json({ success: false, error: 'Package not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete package' }, { status: 500 });
  }
}
