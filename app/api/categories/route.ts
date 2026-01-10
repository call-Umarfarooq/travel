import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import path from 'path';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const category = await Category.findById(id);
        if (!category) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: category });
    }

    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
       return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (formData.has('name')) updateData.name = formData.get('name');
    if (formData.has('description')) updateData.description = formData.get('description');
    
    // Image handling - simpler here, if provided update it
    const file = formData.get('image') as File;
    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const compressedBuffer = await sharp(buffer)
        .resize(800, null, { withoutEnlargement: true }) 
        .jpeg({ quality: 80 })
        .toBuffer();

        const filename = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        // Ensure dir exists (it should)
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, compressedBuffer);
        updateData.image = `/uploads/${filename}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updatedCategory });

  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
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

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing category ID' }, { status: 400 });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
