'use client';

import React from "react";

export type SortOption = 'date' | 'price-low' | 'price-high' | 'name';

interface SortBarProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortBar: React.FC<SortBarProps> = ({ activeSort, onSortChange }) => {
  return (
    <div className="bg-[#F8F8F8]  py-5 px-8 flex flex-wrap justify-center items-center gap-8 lg:gap-16">
      {/* Date */}
      <button
        onClick={() => onSortChange('date')}
        className={`flex items-center gap-2 text-sm transition-colors ${
          activeSort === 'date' ? 'text-[#F85E46]' : 'text-gray-600 hover:text-[#F85E46]'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Date</span>
      </button>

      {/* Price Low To High */}
      <button
        onClick={() => onSortChange('price-low')}
        className={`flex items-center gap-2 text-sm transition-colors ${
          activeSort === 'price-low' ? 'text-[#F85E46]' : 'text-gray-600 hover:text-[#F85E46]'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span>Price Low To High</span>
      </button>

      {/* Price High To Low */}
      <button
        onClick={() => onSortChange('price-high')}
        className={`flex items-center gap-2 text-sm transition-colors ${
          activeSort === 'price-high' ? 'text-[#F85E46]' : 'text-gray-600 hover:text-[#F85E46]'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
        </svg>
        <span>Price High To Low</span>
      </button>

      {/* Name (A-Z) */}
      <button
        onClick={() => onSortChange('name')}
        className={`flex items-center gap-2 text-sm transition-colors ${
          activeSort === 'name' ? 'text-[#F85E46]' : 'text-gray-600 hover:text-[#F85E46]'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span>Name (A-Z)</span>
      </button>
    </div>
  );
};

export default SortBar;
