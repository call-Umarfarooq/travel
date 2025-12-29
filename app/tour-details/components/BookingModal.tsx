'use client';

import React, { useState } from 'react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    title: string;
    date: Date;
    time: string;
    guests: {
      adults: number;
      children: number;
      infants: number;
    };
    totalPrice: string;
    currency: string;
  };
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, bookingDetails }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupLocation: '',
    specialRequirements: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Connect to your actual booking API here
    console.log('Booking Submitted:', { ...bookingDetails, ...formData });
    alert('Booking Request Sent! (This is a demo)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#181E4B] p-6 text-white flex justify-between items-start">
          <div>
             <h2 className="text-2xl font-bold">Files Booking Request</h2>
             <p className="opacity-80 text-sm mt-1">{bookingDetails.title}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          
          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-700 space-y-2">
             <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-semibold text-[#181E4B]">
                    {bookingDetails.date.toLocaleDateString()}
                </span>
             </div>
             <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-semibold text-[#181E4B]">{bookingDetails.time}</span>
             </div>
             <div className="flex justify-between">
                <span>Guests:</span>
                <span className="font-semibold text-[#181E4B]">
                    {bookingDetails.guests.adults} Adults, {bookingDetails.guests.children} Children
                </span>
             </div>
             <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base font-bold text-[#F85E46]">
                <span>Total:</span>
                <span>{bookingDetails.totalPrice} {bookingDetails.currency}</span>
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E46] focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E46] focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                    required
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E46] focus:border-transparent outline-none transition-all"
                    placeholder="+1 234 567 890"
                />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
              <input 
                required
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E46] focus:border-transparent outline-none transition-all"
                placeholder="Hotel Name or Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements (Optional)</label>
              <textarea 
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F85E46] focus:border-transparent outline-none transition-all resize-none"
                placeholder="Dietary restrictions, wheelchair access, etc."
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-8 py-3 bg-[#F85E46] text-white font-bold rounded-xl shadow-lg hover:bg-[#e54d36] hover:shadow-xl transition-all"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
