'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  _id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ReviewsSection({ packageId }: { packageId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?packageId=${packageId}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (packageId) fetchReviews();
  }, [packageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, rating, comment }),
      });
      
      const json = await res.json();
      if (res.status === 401) {
          setError('Please login to leave a review');
          return;
      }

      if (json.success) {
        setSuccess('Review submitted successfully!');
        setComment('');
        fetchReviews(); // Refresh list
      } else {
        setError(json.error || 'Failed to submit review');
      }
    } catch (e) {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 bg-gray-50 p-6 rounded-xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h3>

      {/* List Reviews */}
      <div className="space-y-6 mb-10">
        {loading ? (
            <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
        ) : (
            reviews.map((review) => (
                <div key={review._id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-800">{review.user?.name || 'Anonymous'}</span>
                        <div className="flex text-yellow-400">
                           {Array.from({ length: 5 }).map((_, i) => (
                               <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                           ))}
                        </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
            ))
        )}
      </div>

      {/* Submit Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
         <h4 className="text-lg font-bold mb-4">Leave a Review</h4>
         
         {error && (
             <div className="mb-4 text-red-600 bg-red-50 p-3 rounded">
                 {error} {error.includes('login') && <Link href="/login" className="underline font-bold">Login here</Link>}
             </div>
         )}
         {success && <div className="mb-4 text-green-600 bg-green-50 p-3 rounded">{success}</div>}

         <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea 
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    required
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-primary"
                    rows={3}
                />
            </div>

            <button
               type="submit"
               disabled={submitting}
               className="bg-[#F85E46] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#e54d36] transition-colors disabled:opacity-50"
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
         </form>
      </div>
    </section>
  );
}
