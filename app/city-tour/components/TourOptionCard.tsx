'use client';

import React, { useState } from 'react';

interface TourOptionCardProps {
  title: string;
  duration: string;
  features: { icon: string; label: string }[];
  penalty: string;
  time: string;
  pricePerPerson: number;
  currency?: string;
  isExpanded?: boolean;
}

const TourOptionCard: React.FC<TourOptionCardProps> = ({
  title,
  duration,
  features,
  penalty,
  time,
  pricePerPerson,
  currency = 'AED',
  isExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [persons, setPersons] = useState(1);

  const totalPrice = (pricePerPerson * persons).toFixed(2);

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all mb-4 ${expanded ? 'border-[#F85E46]' : 'border-gray-200'}`}>
      {/* Card Content */}
      <div className="p-6 relative">
        {/* Collapse Arrow */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg 
            className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Title & Duration */}
        <h3 className="text-[24px] font-bold text-[#181E4B] mb-1">{title}</h3>
        <p className="text-[20px] text-[#000000] mb-4">Min. Duration: {duration}</p>

        {/* Features Row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2 text-[20px] text-[#000000]">
                {feature.icon === 'car' && (
                  <svg className="w-[35px] h-[24px] text-[#F85E46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 17h8M8 17v-4m8 4v-4m-8 0h8m-8 0l-2-4h12l-2 4M6 9l2-4h8l2 4" />
                  </svg>
                )}
                {feature.icon === 'bus' && (
                  <svg className="w-[35px] h-[24px] text-[#F85E46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8m-8 4h8M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {feature.icon === 'guide' && (
                  <svg className="w-[35px] h-[24px] text-transparent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                <span>{feature.label}</span>
              </div>
              {index < features.length - 1 && (
                <div className="h-4 w-px bg-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Penalty Notice */}
        <div className="flex items-center gap-2 text-[20px] text-[#000000] mb-6">
          <svg className="w-[24px] h-[24px] text-[#F85E46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{penalty}</span>
        </div>

        {expanded && (
          <>
            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Time */}
            <button className="px-6 py-2 bg-[#F85E46] text-white text-sm font-medium rounded-full mb-4">
              {time}
            </button>

            {/* Number Of Participants */}
            <div className="flex items-center gap-2 text-[20px] text-[#000000] mb-4">
              <svg className="w-[24px] h-[24px] text-[#F85E46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Number Of Participants:</span>
            </div>

            {/* Person Selector Row */}
            <div className="bg-[#E8E8E8] rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-[24px] text-[#181E4B]">Person</span>
                <span className="text-[20px] text-[#000000] ml-2">(Age: 5-99)</span>
                <p className="text-[20px] text-[#000000] mt-1">From {pricePerPerson.toFixed(2)} {currency}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setPersons(Math.max(1, persons - 1))}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <span className="text-xl">−</span>
                </button>
                <span className="text-xl font-medium w-8 text-center">{persons}</span>
                <button 
                  onClick={() => setPersons(persons + 1)}
                  className="w-10 h-10 bg-[#F85E46] rounded-full flex items-center justify-center text-white hover:bg-[#e54d36] transition-colors"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer - Only when expanded */}
      {expanded && (
        <div className="bg-[#E8E8E8] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[24px] text-[#000000]">Total Price</p>
            <p className="text-[#181E4B] font-bold text-[24px]">{totalPrice} {currency}</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white border border-gray-300 text-[#000000] text-[24px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Add To Cart
            </button>
            <button className="px-8 py-3 bg-[#F85E46] text-white text-[24px] font-medium rounded-lg hover:bg-[#e54d36] transition-colors">
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourOptionCard;
