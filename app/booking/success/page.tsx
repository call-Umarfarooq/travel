'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header color="bg-black/20" />
      
      <main className="max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 md:p-16">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">Booking Confirmed!</h1>
            <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
                Thank you for your booking. We have sent a confirmation email with all the details to your provided email address.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link 
                    href="/my-bookings" 
                    className="px-8 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg"
                >
                    View My Bookings
                </Link>
                <Link 
                    href="/" 
                    className="px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
