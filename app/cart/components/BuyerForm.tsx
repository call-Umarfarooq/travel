'use client';

import React, { useState } from 'react';

const BuyerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '',
    phoneNumber: '',
    pickupAddress: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="border-2 border-[#F85E46] rounded-2xl p-8 bg-[#EDEDED]">
      <h2 className="text-2xl font-bold text-[#000000] mb-2">Buyer Information</h2>
      <p className="text-[#000000] text-sm mb-6">
        We&apos;ll Use This Information To Send You Confirmation And Updates About Your Booking
      </p>

      {/* Login/Signup Link */}
      <div className="mb-8 p-4 bg-white rounded-xl text-center">
        <span className="text-[#000000]">
          <span className="font-bold cursor-pointer hover:underline">Login</span>
          {' '}Or{' '}
          <span className="font-bold cursor-pointer hover:underline">Sign Up</span>
          {' '}For A Faster Checkout.
        </span>
      </div>

      {/* Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm text-[#000000] mb-2">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20"
          />
        </div>
        <div>
          <label className="block text-sm text-[#000000] mb-2">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20"
          />
        </div>
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm text-[#000000] mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20"
        />
      </div>

      {/* Phone Number */}
      <div className="mb-8">
        <label className="block text-sm text-[#000000] mb-2">Phone Number</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            placeholder="Choose Your Contry Code"
            className="px-4 py-3 bg-white border-0 rounded-xl text-[#000000] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20"
          />
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="px-4 py-3 bg-white border-0 rounded-xl text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20"
          />
        </div>
      </div>

      {/* Pick-Up Point */}
      <div>
        <h3 className="text-lg font-bold text-[#000000] mb-2">Pick-Up Point</h3>
        <p className="text-[#000000] text-sm mb-4">
          Make A Note Of The Address Where You Will Pick-Up And Drop-Off.
        </p>
        <textarea
          name="pickupAddress"
          value={formData.pickupAddress}
          onChange={handleChange}
          placeholder="Write Your Pick-Up And Drop-Off Address"
          rows={3}
          className="w-full px-4 py-3 bg-white border-0 rounded-xl text-[#000000] placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20"
        />
      </div>
    </div>
  );
};

export default BuyerForm;
