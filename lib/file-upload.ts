import path from 'path';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';

export const uploadImage = async (file: File): Promise<string> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create a unique filename
  const filename = `pkg-${Date.now()}-${file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, '-')}.jpg`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filepath = path.join(uploadDir, filename);

  // Resize and compress
  const compressedBuffer = await sharp(buffer)
    .resize(800, null, { withoutEnlargement: true }) 
    .jpeg({ quality: 80 })
    .toBuffer();

  await writeFile(filepath, compressedBuffer);
  return `/api/uploads/${filename}`;
};
