
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Added imports
import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { verifyToken } from '@/lib/auth'; // Added import

import { sendBookingConfirmation } from '@/lib/mail'; // Added import

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { items, buyerInfo, paymentIntentId, totalAmount, paymentMethod = 'stripe' } = await request.json();

    // Create a booking for each item in the cart
    const newlyCreatedBookings: any[] = []; // Track created bookings for email

    const bookings = await Promise.all(items.map(async (item: any) => {
      // Calculate total guests
      const totalGuests = (item.adults || 0) + (item.children || 0) + (item.infants || 0);

      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      let userId = null;

      if (token) {
        const decoded: any = verifyToken(token);
        if (decoded) {
          userId = decoded.userId;
        }
      }

      // Determine statuses based on payment method
      const isPayLater = paymentMethod === 'cash' || paymentMethod === 'pay_later';
      const pStatus = isPayLater ? 'pending' : 'paid';
      // User said "booking to kar ly hy" -> confirmed.
      const bStatus = 'confirmed'; 

      const newBooking = await Booking.create({
        user: userId, // Associated with user if logged in
        package: item.packageId, // Corrected to use packageId
        title: item.title, // Added missing title
        date: new Date(item.date),
        time: item.time,
        optionTitle: item.optionTitle,
        guestDetails: {
            adults: item.adults || 0,
            children: item.children || 0,
            infants: item.infants || 0,
            totalGuests: totalGuests
        },
        pricing: {
            totalPrice: item.totalPrice,
            currency: 'AED' 
        },
        contactInfo: {
            firstName: buyerInfo.firstName,
            lastName: buyerInfo.lastName,
            email: buyerInfo.email,
            phone: buyerInfo.phone,
            countryCode: buyerInfo.countryCode,
        },
        paymentStatus: pStatus,
        paymentIntentId: paymentIntentId,
        paymentMethod: paymentMethod, // Store method
        status: bStatus,
      });
      
      newlyCreatedBookings.push(newBooking);
      return newBooking;
    }));

    // Send Confirmation Email
    console.log("Attempting to send confirmation email for bookings:", newlyCreatedBookings.length);
    try {
        await sendBookingConfirmation(newlyCreatedBookings);
        console.log("Confirmation email process completed.");
    } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
    }

    return NextResponse.json({ success: true, count: bookings.length });
  } catch (error: any) {
    console.error('Booking save error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: bookings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
