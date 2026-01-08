'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface TourOption {
  title: string;
  time: string;
  pricingType: 'person' | 'group';
  adultPrice?: number;
  childPrice?: number;
  infantPrice?: number;
  groupPrice?: number;
  maxPax?: number; // Capacity per vehicle/group
}

interface BookingWidgetProps {
  price: number; // Base price (fallback)
  tourOptions: TourOption[];
}

export default function BookingWidget({ price, tourOptions }: BookingWidgetProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Person Mode State
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Group Mode State
  const [guests, setGuests] = useState(1);
  const [items, setItems] = useState(1); // Number of vehicles/groups

  const option = tourOptions[selectedOptionIndex] || {};
  const isGroup = option.pricingType === 'group';

  // --- Logic for Group Mode ---
  useEffect(() => {
    if (isGroup) {
      const capacity = option.maxPax || 1;
      const minItems = Math.ceil(guests / capacity);
      if (items < minItems) {
        setItems(minItems);
      }
    }
  }, [guests, isGroup, option.maxPax, items]);

  const handleGuestChange = (delta: number) => {
    const newGuests = Math.max(1, guests + delta);
    setGuests(newGuests);
    
    // Auto-adjust items if needed
    const capacity = option.maxPax || 1;
    const minItems = Math.ceil(newGuests / capacity);
    if (items < minItems) {
      setItems(minItems);
    }
  };

  const handleItemChange = (delta: number) => {
    const newItems = Math.max(1, items + delta);
    
    // Constraint: Can't drop items below required capacity
    const capacity = option.maxPax || 1;
    const minItems = Math.ceil(guests / capacity);
    
    if (newItems >= minItems) {
        setItems(newItems);
    }
  };

  // --- Logic for Person Mode ---
  const handlePaxChange = (type: 'adult' | 'child' | 'infant', delta: number) => {
    if (type === 'adult') setAdults(Math.max(1, adults + delta));
    if (type === 'child') setChildren(Math.max(0, children + delta));
    if (type === 'infant') setInfants(Math.max(0, infants + delta));
  };

  // --- Total Calculation ---
  const calculateTotal = () => {
    if (isGroup) {
      return items * (option.groupPrice || 0);
    } else {
      return (
        (adults * (option.adultPrice || 0)) +
        (children * (option.childPrice || 0)) +
        (infants * (option.infantPrice || 0))
      );
    }
  };

  return (
    <div className="bg-orange-50/50 rounded-xl shadow-sm border border-orange-100 p-6 sticky top-24">
      
      {/* Date & Time Section */}
      <div className="mb-6 space-y-4">
        { /* Date Picker */ }
        <div className="relative">
            <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center text-left hover:border-orange-300 transition-colors"
            >
                <div>
                    <span className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Select Date</span>
                    <span className="font-bold text-gray-900">{selectedDate ? format(selectedDate, 'EEE, MMM d, yyyy') : 'Choose a date'}</span>
                </div>
                <span className="text-orange-500 text-xl">📅</span>
            </button>
            
            {showCalendar && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-xl border rounded-lg p-2 mt-2 flex justify-center">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => { setSelectedDate(d); setShowCalendar(false); }}
                        modifiersClassNames={{
                            selected: 'bg-orange-500 text-white hover:bg-orange-600' // Custom orange style for selected date
                        }}
                    />
                </div>
            )}
        </div>

        { /* Time Slots */ }
        {tourOptions.length > 0 && (
            <div>
                 <span className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Start Time</span>
                 <div className="flex flex-wrap gap-2">
                    {tourOptions.map((opt, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedOptionIndex(idx)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        selectedOptionIndex === idx
                            ? 'bg-orange-500 text-white shadow-md transform scale-105'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
                        }`}
                    >
                        {opt.time}
                    </button>
                    ))}
                 </div>
            </div>
        )}
      </div>

      <div className="h-px bg-gray-200 my-6" />

      {/* Participants Section */}
      <div className="space-y-4 mb-8">
        <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <span className="text-orange-500">👥</span> Number of participants
        </p>
        
        {isGroup ? (
          <div className="space-y-3">
            {/* Guests Input */}
            <div className="flex items-center justify-between bg-gray-200/50 p-4 rounded-xl">
                <span className="font-bold text-gray-800">Guests</span>
                <div className="flex items-center gap-4 bg-white rounded-full px-2 py-1 shadow-sm">
                    <button onClick={() => handleGuestChange(-1)} className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold hover:bg-orange-200 transition">-</button>
                    <span className="w-6 text-center font-bold text-gray-800">{guests}</span>
                    <button onClick={() => handleGuestChange(1)} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 transition shadow-sm">+</button>
                </div>
            </div>

            {/* Vehicle/Unit Input */}
            <div className="flex items-center justify-between bg-gray-200/50 p-4 rounded-xl">
                <div>
                     <span className="font-bold text-gray-800 block text-sm sm:text-base">{option.title || 'Vehicle'}</span>
                     <span className="text-xs text-gray-500 font-medium">Capacity: {option.maxPax} Persons</span>
                </div>
                <div className="flex items-center gap-4 bg-white rounded-full px-2 py-1 shadow-sm">
                    <button onClick={() => handleItemChange(-1)} className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold hover:bg-orange-200 transition">-</button>
                    <span className="w-6 text-center font-bold text-gray-800">{items}</span>
                    <button onClick={() => handleItemChange(1)} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 transition shadow-sm">+</button>
                </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Adult */}
            <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div>
                    <span className="font-bold text-gray-800 block text-lg">Adults <span className="text-sm font-normal text-gray-500">(Age 12+)</span></span>
                    <span className="text-xs font-semibold text-orange-600">AED {option.adultPrice}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => handlePaxChange('adult', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold hover:border-orange-500 hover:text-orange-500 transition">-</button>
                    <span className="w-6 text-center font-bold text-gray-800">{adults}</span>
                    <button onClick={() => handlePaxChange('adult', 1)} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 shadow-md transition">+</button>
                </div>
            </div>

            {/* Child */}
            <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div>
                    <span className="font-bold text-gray-800 block text-lg">Children <span className="text-sm font-normal text-gray-500">(Age 2-11)</span></span>
                    <span className="text-xs font-semibold text-orange-600">AED {option.childPrice}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => handlePaxChange('child', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold hover:border-orange-500 hover:text-orange-500 transition">-</button>
                    <span className="w-6 text-center font-bold text-gray-800">{children}</span>
                    <button onClick={() => handlePaxChange('child', 1)} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 shadow-md transition">+</button>
                </div>
            </div>

            {/* Infant */}
            <div className="flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div>
                    <span className="font-bold text-gray-800 block text-lg">Infants <span className="text-sm font-normal text-gray-500">(Age 0-1)</span></span>
                    <span className="text-xs font-semibold text-green-600">{!option.infantPrice ? 'Free' : `AED ${option.infantPrice}`}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => handlePaxChange('infant', -1)} className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold hover:border-orange-500 hover:text-orange-500 transition">-</button>
                    <span className="w-6 text-center font-bold text-gray-800">{infants}</span>
                    <button onClick={() => handlePaxChange('infant', 1)} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 shadow-md transition">+</button>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Total */}
      <div className="bg-gray-900 rounded-xl p-4 text-white">
          <div className="flex justify-between items-end mb-4">
              <span className="text-gray-400 text-sm">Total Price</span>
              <span className="text-2xl font-bold">AED {calculateTotal()}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 px-4 rounded-lg border border-gray-600 text-gray-300 font-bold hover:bg-gray-800 hover:border-gray-500 transition">
                Add to Cart
            </button>
            <button className="py-3 px-4 rounded-lg bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg transition">
                Book Now
            </button>
          </div>
      </div>
    </div>
  );
}
