'use client';

import React, { useState } from "react";

interface PaginationProps {
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages = 4, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-[#F85E46] hover:text-white hover:border-[#F85E46] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-medium transition-colors ${
            currentPage === page
              ? 'bg-[#F85E46] text-white shadow-md'
              : 'border border-gray-200 text-gray-600 hover:bg-[#F85E46] hover:text-white hover:border-[#F85E46]'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-[#F85E46] hover:text-white hover:border-[#F85E46] transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-200"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
