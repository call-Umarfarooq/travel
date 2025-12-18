'use client';

import React, { useState } from "react";
import Image from "next/image";

const TripSidebar: React.FC = () => {
  const [priceRange, setPriceRange] = useState(3600);
  const minPrice = 12;
  const maxPrice = 3600;

  // Calculate the percentage for the slider fill
  const percentage = ((priceRange - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className="space-y-6">
      {/* Plan Your Trip Card */}
      <div className="bg-[#F5F5F5] rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-[#1E3A5F] font-serif italic mb-4">Plan Your Trip</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Ex optio sequi et quos praesentium in nostrum labore nam rerum iusto aut magni nesciunt? Quo quidem neque iste expedita est dolo.
        </p>
        
        <div className="space-y-4">
          {/* Search Tour Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Tour"
              className="w-full pl-11 pr-4 py-3.5 bg-white border-0 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20 transition-all"
            />
          </div>

          {/* Where To Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Where To?"
              className="w-full pl-11 pr-4 py-3.5 bg-white border-0 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20 transition-all"
            />
          </div>

          {/* Date Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Date"
              className="w-full pl-11 pr-4 py-3.5 bg-white border-0 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20 transition-all"
            />
          </div>
        </div>

        {/* Filter By Price */}
        <div className="mt-8 text-left">
          <h4 className="font-bold text-gray-800 text-sm mb-4">Filter By Price</h4>
          
          {/* Range Slider */}
          <div className="relative mb-3">
            {/* Track background */}
            <div className="h-1 bg-gray-200 rounded-full">
              {/* Filled track */}
              <div 
                className="h-full bg-[#F85E46] rounded-full relative"
                style={{ width: `${percentage}%` }}
              >
                {/* Left indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F85E46] rounded-sm"></div>
                {/* Right indicator */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-[#F85E46] rounded-sm"></div>
              </div>
            </div>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Price: ${minPrice} - ${priceRange}
          </p>
        </div>

        {/* Book Now Button */}
        <button className="mt-6 px-12 py-3 bg-[#F85E46] text-white text-sm font-semibold rounded-full hover:bg-[#e54d36] transition-colors">
          Book Now
        </button>
      </div>

      {/* Travel Decoration Image */}
      <div className="relative h-52">
        <Image
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"
          alt="Travel decoration"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default TripSidebar;
