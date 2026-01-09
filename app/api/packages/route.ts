import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Package from '@/models/Package';
import Category from '@/models/Category'; // Import to ensure model registration
import path from 'path';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const slug = searchParams.get('slug');

    let query = {};
    if (categoryId) query = { ...query, category: categoryId };
    if (slug) query = { ...query, slug: slug };

    const packages = await Package.find(query)
      .populate('category', 'name') // Populate category name
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch packages' }, { status: 500 });
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

    // Helper to upload image
    const uploadImage = async (file: File) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `pkg-${Date.now()}-${file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '-')}.jpg`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filepath = path.join(uploadDir, filename);

      const compressedBuffer = await sharp(buffer)
        .resize(800, null, { withoutEnlargement: true }) 
        .jpeg({ quality: 80 })
        .toBuffer();

      await writeFile(filepath, compressedBuffer);
      return `/uploads/${filename}`;
    };

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
            console.log('DEBUG: Parsed Tour Options:', JSON.stringify(tourOptions, null, 2));
            tourOptions.forEach((opt: any, idx: number) => {
                console.log(`DEBUG: Option ${idx} Extra Services:`, opt.extraServices);
            });
        }
    } catch (e) {
        console.error("Failed to parse tourOptions", e);
    }

    // Extract extra fields
    const durationDays = Number(formData.get('durationDays'));
    const durationHours = Number(formData.get('durationHours'));
    const minAge = formData.get('minAge') ? Number(formData.get('minAge')) : undefined;
    const maxAge = formData.get('maxAge') ? Number(formData.get('maxAge')) : undefined;

    // Parse Itinerary
    const itineraryJson = formData.get('itinerary') as string;
    let itinerary = [];
    try {
        if (itineraryJson) {
            itinerary = JSON.parse(itineraryJson);
        }
    } catch (e) {
        console.error("Failed to parse itinerary", e);
    }

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
