'use client';

import React, { useState } from 'react';

interface CalendarWidgetProps {
  pricePerPerson?: number;
  currency?: string;
  onDateSelect?: (date: Date) => void;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  pricePerPerson = 253.50,
  currency = 'AED',
  onDateSelect,
}) => {
  const [viewDate, setViewDate] = useState(new Date()); // Current month dikhane ke liye
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const monthName = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const clickedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      setSelectedDate(clickedDate);
      if (onDateSelect) {
        onDateSelect(clickedDate);
      }
    }
  };
  
  // Current date (normalized to midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calendar logic (previous/current/next days)
  const calendarDays: { day: number; month: number; year: number; currentMonth: boolean }[] = [];
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const prevMonthDate = new Date(year, month - 1, 1);
  const nextMonthDate = new Date(year, month + 1, 1);

  // Add previous month's days
  const prevMonthDaysCount = new Date(year, month, 0).getDate();
  for (let i = adjustedFirstDay - 1; i >= 0; i--) {
    calendarDays.push({ 
        day: prevMonthDaysCount - i, 
        month: prevMonthDate.getMonth(),
        year: prevMonthDate.getFullYear(),
        currentMonth: false 
    });
  }
  
  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ 
        day: i, 
        month: month,
        year: year,
        currentMonth: true 
    });
  }
  
  // Add next month's days to fill the grid
  while (calendarDays.length < 35) {
    const nextDay = calendarDays.length - (daysInMonth + adjustedFirstDay) + 1;
    calendarDays.push({ 
      day: nextDay, 
      month: nextMonthDate.getMonth(),
      year: nextMonthDate.getFullYear(),
      currentMonth: false 
    });
  }


  return (
    <div className="bg-[#E8E8E8] rounded-2xl p-6 md:mt-28">
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
          <button 
            onClick={() => changeMonth(-1)}
            disabled={viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear()} // Optional: Disable prev month if current month is today's month (prevent going back too far? User asked for disabling DATES, but maybe month nav too?) 
            // Stick to just styling dates for now as per specific request.
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#F85E46] hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#181E4B]">{monthName}</span>
          <button 
            onClick={() => changeMonth(1)}
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#F85E46] hover:bg-gray-50 transition-colors shadow-sm"
          >
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
          {calendarDays.map((item, index) => {
            const itemDate = new Date(item.year, item.month, item.day);
            const isPast = itemDate < today;
            
            const isSelected = selectedDate && 
              itemDate.getDate() === selectedDate.getDate() &&
              itemDate.getMonth() === selectedDate.getMonth() &&
              itemDate.getFullYear() === selectedDate.getFullYear();
            
            return (
              <div
                key={index}
                onClick={() => {
                    if (!isPast) handleDateClick(item.day, item.currentMonth);
                }}
                className={`text-center text-sm py-2 rounded-full transition-colors
                  ${isPast 
                      ? 'text-gray-300 cursor-not-allowed bg-transparent' // Disabled Style
                      : !item.currentMonth 
                          ? 'text-gray-400 cursor-pointer' 
                          : 'text-[#181E4B] cursor-pointer hover:bg-white/50'
                   }
                  ${isSelected && !isPast ? 'bg-[#C5D86D] text-[#181E4B] font-medium' : ''}
                `}
              >
                {item.day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Check Availability Button */}
      <button 
        disabled={!selectedDate}
        className={`w-full mt-6 py-4 rounded-xl font-semibold text-lg transition-colors ${
          selectedDate 
            ? 'bg-[#F85E46] text-white hover:bg-[#e54d36]' 
            : 'bg-gray-400 text-white cursor-not-allowed'
        }`}
      >
        {selectedDate ? 'Check Availability' : 'Select a Date'}
      </button>
    </div>
  );
};

export default CalendarWidget;

