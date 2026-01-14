'use client';

import React, { useState } from "react";
import Image from "next/image";

interface TripSidebarProps {
  onSearch: (query: string) => void;
}

const TripSidebar: React.FC<TripSidebarProps> = ({ onSearch }) => {
  const [priceRange, setPriceRange] = useState(3600);
  const minPrice = 12;
  const maxPrice = 3600;

  // Calculate the percentage for the slider fill
  const percentage = ((priceRange - minPrice) / (maxPrice - minPrice)) * 100;

  return (
    <div className="space-y-6">
     
      <div className="bg-[#F5F5F5] rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-[#1E3A5F] font-serif italic mb-4">Plan Your Desert Experience</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Discover unforgettable desert adventures, city tours, and premium experiences in Dubai. Choose your tour, select your date, and book instantly with trusted local experts.
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
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border-0 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F85E46]/20 transition-all"
            />
          </div> 
        </div>
        <button 
          onClick={() => {}} // You might want this to trigger a specific action or just rely on the input
          className="mt-6 px-12 py-3 bg-[#F85E46] text-white text-sm font-semibold rounded-full hover:bg-[#e54d36] transition-colors"
        >
          Search Tour
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
