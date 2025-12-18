'use client';

import React, { useState } from 'react';

interface CalendarWidgetProps {
  pricePerPerson?: number;
  currency?: string;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  pricePerPerson = 253.50,
  currency = 'AED',
}) => {
  const [currentDate] = useState(new Date(2022, 9, 1)); // October 2022
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const weekDays = ['Mon', 'Tus', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  
  // Add previous month's days
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push(prevMonthDays - i);
  }
  
  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
  // Add next month's days to fill the grid
  const remainingDays = 35 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push(i);
  }

  const selectedDay = 13;

  return (
    <div className="bg-[#E8E8E8] rounded-2xl p-6 mt-28">
      {/* Price */}
      <div className="mb-6">
        <span className="text-gray-600">From </span>
        <span className="text-2xl font-bold text-[#181E4B]">{pricePerPerson.toFixed(2)} {currency}</span>
        <span className="text-gray-500"> / Per Person</span>
      </div>

      {/* Select Date Label */}
      <p className="text-[#181E4B] font-semibold mb-4">Select Date</p>
      
      {/* Calendar Card */}
      <div className="bg-[#FFF0EE] rounded-xl p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#F85E46] hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#181E4B]">{monthName}</span>
          <button className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#F85E46] hover:bg-gray-50 transition-colors shadow-sm">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-[#181E4B] py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = index >= adjustedFirstDay && index < adjustedFirstDay + daysInMonth;
            const actualDay = isCurrentMonth ? day : null;
            
            return (
              <div
                key={index}
                className={`text-center text-sm py-2 rounded-full cursor-pointer transition-colors
                  ${!isCurrentMonth ? 'text-gray-400' : 'text-[#181E4B] hover:bg-white/50'}
                  ${actualDay === selectedDay ? 'bg-[#C5D86D] text-[#181E4B] font-medium' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Check Availability Button */}
      <button className="w-full mt-6 py-4 bg-[#F85E46] text-white text-lg font-semibold rounded-xl hover:bg-[#e54d36] transition-colors">
        Check Availability
      </button>
    </div>
  );
};

export default CalendarWidget;
