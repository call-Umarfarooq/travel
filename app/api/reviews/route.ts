import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Review from '@/models/Review';
import Package from '@/models/Package';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    // Auth Check
    const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0];
    // Or simpler if client sends Authorization header, but here we used cookie in Login API.
    // Ideally use a proper cookie parser.
    
    // Fallback: Check 'Authorization' header if logic changes
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.split(' ')[1];
    
    const finalToken = token || headerToken;

    if (!finalToken) {
       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(finalToken);
    if (!decoded) {
       return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { packageId, rating, comment } = await request.json();

    if (!packageId || !rating || !comment) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    // Create Review
    const newReview = await Review.create({
      user: (decoded as any).userId,
      package: packageId,
      rating,
      comment
    });

    // Recalculate Package Average
    // Aggregate ratings for this package
    const stats = await Review.aggregate([
      { $match: { package: newReview.package } },
      {
        $group: {
          _id: '$package',
          avgRating: { $avg: '$rating' },
          nRating: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Package.findByIdAndUpdate(packageId, {
        rating: Math.round(stats[0].avgRating * 10) / 10, // Round to 1 decimal
        // You might want to store count too if needed
      });
    } else {
        await Package.findByIdAndUpdate(packageId, { rating: rating });
    }

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });

  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');

    if (!packageId) {
       return NextResponse.json({ success: false, error: 'Package ID required' }, { status: 400 });
    }

    const reviews = await Review.find({ package: packageId })
       .populate('user', 'name')
       .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
     console.error("Fetch reviews error", error);
     return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
