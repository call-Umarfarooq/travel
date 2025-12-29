import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import path from 'path';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const file = formData.get('image') as File;

    if (!name || !description || !file) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compress and resize image using sharp
    const compressedBuffer = await sharp(buffer)
      .resize(800, null, { // Resize width to 800px, maintain aspect ratio
        withoutEnlargement: true
      }) 
      .jpeg({ quality: 80 })
      .toBuffer();

    const filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
    // Ensure the uploads directory exists - though we create it in setup, good to be safe or rely on it existing
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, compressedBuffer);

    const imageUrl = `/uploads/${filename}`;

    const category = await Category.create({
      name,
      description,
      image: imageUrl,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}
