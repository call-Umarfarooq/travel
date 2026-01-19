import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { verifyToken } from '@/lib/auth';
import Package from '@/models/Package'; // Import Package model to ensure schema is registered

export async function GET() {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded: any = verifyToken(token);
    if (!decoded || !decoded.userId) {
       return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const bookings = await Booking.find({
      $or: [
        { user: decoded.userId },
        { 'contactInfo.email': decoded.email }
      ]
    })
      .sort({ createdAt: -1 })
      .populate('package', 'price image duration location'); // Populate useful package details

    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    console.error('Fetch user bookings error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
