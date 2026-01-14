import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import B2BInquiry from '@/models/B2BInquiry';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { fullName, companyName, businessEmail, phone, country, message } = body;

    // Basic server-side validation
    if (!fullName || !companyName || !businessEmail || !phone || !country || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const inquiry = await B2BInquiry.create({
      fullName,
      companyName,
      businessEmail,
      phone,
      country,
      message,
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    console.error('Error submitting B2B inquiry:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function GET() {
    try {
        await connectToDatabase();
        const inquiries = await B2BInquiry.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: inquiries });
    } catch (error) {
        console.error('Error fetching B2B inquiries:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
    }
}
