'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/user/bookings');
        const data = await res.json();

        if (data.success) {
          setBookings(data.data);
        } else {
            // If unauthorized, redirect might be handled by middleware or client check
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
          setError(data.error || 'Failed to fetch bookings');
        }
      } catch (err) {
        setError('An error occurred while fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header color="bg-black/80" />
      
      <main className="max-w-7xl mx-auto px-4 py-32">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif">My Bookings</h1>
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
             &larr; Back to Home
            </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
            <p className="text-gray-500 text-xl mb-6">You haven't made any bookings yet.</p>
            <Link 
              href="/" 
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition"
            >
              Explore Packages
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                {booking.package?.image && (
                  <div className="w-full md:w-48 h-48 md:h-auto relative shrink-0">
                    <img
                      src={booking.package.image}
                      alt={booking.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap justify-between items-start mb-4">
                     <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.title}</h3>
                        <p className="text-gray-500 text-sm">Booking ID: {booking._id}</p>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                     }`}>
                        {booking.status}
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                        <span className="block text-gray-400 text-xs mb-1">Date</span>
                        {new Date(booking.date).toLocaleDateString()}
                    </div>
                    <div>
                        <span className="block text-gray-400 text-xs mb-1">Guests</span>
                        {booking.guestDetails?.totalGuests || 0} People
                    </div>
                    <div>
                        <span className="block text-gray-400 text-xs mb-1">Total Amount</span>
                        {booking.pricing?.currency} {booking.pricing?.totalPrice}
                    </div>
                    <div>
                        <span className="block text-gray-400 text-xs mb-1">Payment Status</span>
                        <span className={`font-medium ${booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {booking.paymentStatus?.toUpperCase()}
                        </span>
                    </div>
                    </div>

                  {/* Pickup Location */}
                  {booking.contactInfo?.pickupLocation && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                       <span className="block text-gray-400 text-xs mb-1">Pickup Location</span>
                       <p className="text-sm text-gray-800 font-medium">{booking.contactInfo.pickupLocation}</p>
                    </div>
                  )}

                  {/* Extra Services */}
                  {booking.extraServices && booking.extraServices.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <span className="block text-gray-400 text-xs mb-2">Extra Services</span>
                        <div className="space-y-2">
                            {booking.extraServices.map((extra: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg">
                                    <span className="font-medium text-gray-700">
                                        {extra.name} 
                                        <span className="text-gray-500 font-normal ml-1">x{extra.quantity}</span>
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {booking.pricing?.currency} {extra.total}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
