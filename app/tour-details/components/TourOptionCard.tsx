'use client';

import React, { useState } from 'react';

interface TourOptionCardProps {
  title: string;
  duration: string;
  description?: string;
  features: { icon: string; label: string }[];
  penalty: string;
  timeSlots?: string[];
  tourDurationType?: 'hours' | 'days'; // New
  isPickupIncluded?: boolean; // New
  
  // Pricing & Configuration
  pricingType?: 'person' | 'group';
  adultPrice?: number;
  childPrice?: number;
  infantPrice?: number;
  groupPrice?: number;
  maxPax?: number; // Capacity per vehicle/group
  pricePerPerson?: number; // Backward compatibility
  
  currency?: string;
  isExpanded?: boolean;
  selectedDate?: Date;
  inclusions?: string[];
  extraServices?: { name: string; price: string }[];
  onBookNow?: (details: {
    adults?: number;
    children?: number;
    infants?: number;
    guests?: number;
    items?: number;
    timeSlot?: string; // New
    pickupLocation?: string;
    transferType?: string; // New
    totalPrice: string;
  }) => void;
}

const TourOptionCard: React.FC<TourOptionCardProps> = ({
  title,
  duration,
  description,
  features,
  penalty,
  timeSlots = [],
  tourDurationType = 'hours', // New prop with default
  pricingType = 'person',
  adultPrice,
  childPrice,
  infantPrice,
  groupPrice,
  maxPax,
  pricePerPerson,
  currency = 'AED',
  isExpanded = false,
  isPickupIncluded = false, // Default false
  selectedDate,
  inclusions,
  extraServices = [],
  onBookNow,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null); // New
  
  // Person Mode State
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Group Mode State
  const [guests, setGuests] = useState(1);
  const [items, setItems] = useState(1);

  // Extra Services State
  // Extra Services State
  // Map of index -> quantity
  const [extrasQuantities, setExtrasQuantities] = useState<{[key: number]: number}>({});
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupIncludedChecked, setPickupIncludedChecked] = useState(false); // Local toggle for the free option

  // Backward compatibility
  const finalAdultPrice = adultPrice ?? pricePerPerson ?? 253.50;
  const finalChildPrice = childPrice ?? (pricePerPerson ? pricePerPerson * 0.7 : 177.45);
  const finalInfantPrice = infantPrice ?? 0;
  const finalGroupPrice = groupPrice ?? 0;

  // --- Logic for Group Mode ---
  const handleGuestChange = (delta: number) => {
    const newGuests = Math.max(1, guests + delta);
    setGuests(newGuests);
    
    // Auto-adjust items based on capacity
    const capacity = maxPax || 1;
    const minItems = Math.ceil(newGuests / capacity);
    if (items < minItems) {
      setItems(minItems);
    }
  };

  const handleItemChange = (delta: number) => {
    const newItems = Math.max(1, items + delta);
    
    // Helper: Constraint check
    const capacity = maxPax || 1;
    const minItems = Math.ceil(guests / capacity);
    
    if (newItems >= minItems) {
        setItems(newItems);
    }
  };

  const handleExtraChange = (index: number, delta: number) => {
    setExtrasQuantities(prev => {
        const current = prev[index] || 0;
        const newCount = Math.max(0, current + delta);
        
        const newState = { ...prev, [index]: newCount };
        if (newCount === 0) {
            delete newState[index];
        }
        return newState;
    });
  };

  // Calculate Total
  const calculateTotal = () => {
    let baseTotal = 0;
    
    if (pricingType === 'group') {
      baseTotal = (items * finalGroupPrice);
    } else {
      baseTotal = (finalAdultPrice * adults) + (finalChildPrice * children) + (finalInfantPrice * infants);
    }

    // Add selected extras
    // Add selected extras
    const extrasTotal = Object.entries(extrasQuantities).reduce((sum, [idx, qty]) => {
      // Handle price as string or number
      const priceStr = extraServices[parseInt(idx)]?.price || '0';
      const price = parseFloat(priceStr.toString());
      return sum + ((isNaN(price) ? 0 : price) * qty);
    }, 0);

    return (baseTotal + extrasTotal).toFixed(2);
  };

  // Helper to Validate
  const isValid = () => {
      if (!selectedDate) return { valid: false, msg: 'Please select a date first' };
      
      // If duration type is HOURS, we enforce time slots if they exist
      if (tourDurationType === 'hours') {
           if (timeSlots && timeSlots.length > 0 && !selectedTimeSlot) {
               return { valid: false, msg: 'Please select a time slot.' };
           }
      }

      // Check for Private Transfer requirement
      const privateTransferIndex = extraServices.findIndex(s => s.name === 'Private Transfer');
      const isPrivateTransfer = privateTransferIndex !== -1 && (extrasQuantities[privateTransferIndex] || 0) > 0;
      
      const isPickupRequired = isPrivateTransfer || (isPickupIncluded && pickupIncludedChecked);

      if (isPickupRequired && !pickupLocation.trim()) {
          return { valid: false, msg: 'Please enter a Pick Up Location.' };
      }
      
      return { valid: true };
  };

  const handleBooking = (action: 'add_to_cart' | 'book_now') => {
      const validation = isValid();
      if (!validation.valid) {
          alert(validation.msg);
          return;
      }

      const details = { 
        adults: pricingType === 'person' ? adults : 0, 
        children: pricingType === 'person' ? children : 0, 
        infants: pricingType === 'person' ? infants : 0,
        guests: pricingType === 'group' ? guests : 0,
        items: pricingType === 'group' ? items : 0,
        // For 'days', we might fallback to generic time or just empty/null effectively
        timeSlot: (tourDurationType === 'hours' && timeSlots.length > 0) ? selectedTimeSlot! : undefined,
        pickupLocation: (
            (extraServices.findIndex(s => s.name === 'Private Transfer') !== -1 && (extrasQuantities[extraServices.findIndex(s => s.name === 'Private Transfer')] || 0) > 0) ||
            (isPickupIncluded && pickupIncludedChecked)
        ) ? pickupLocation : undefined,
        totalPrice: calculateTotal(),
        extraServices: Object.entries(extrasQuantities)
            .filter(([_, qty]) => qty > 0)
            .map(([idx, qty]) => {
                const service = extraServices[parseInt(idx)];
                const price = parseFloat(service.price) || 0;
                return {
                    name: service.name,
                    price: price,
                    quantity: qty,
                    total: price * qty
                };
            }),
        transferType: (() => {
            const privateTransferIdx = extraServices.findIndex(s => s.name === 'Private Transfer');
            if (privateTransferIdx !== -1 && (extrasQuantities[privateTransferIdx] || 0) > 0) {
                return 'Private Transfer';
            }
            if (isPickupIncluded && pickupIncludedChecked) {
                return 'Free Transfer';
            }
            return '-';
        })()
      };
      if(onBookNow) onBookNow({...details, action: action} as any);
  };
  
  return (
    <div className={`rounded-2xl overflow-hidden transition-all mb-4 border-2 ${expanded ? 'border-[#F85E46] bg-[#FFF8F6]' : 'border-gray-200 bg-white'}`}>
      {/* Card Content */}
      <div className="p-4 md:p-6 relative">
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
        <h3 className="text-lg md:text-[24px] font-bold text-[#181E4B] mb-1">{title}</h3>
        <p className="text-base md:text-[20px] text-[#000000] mb-4">Min. Duration: {duration}</p>

        {/* Features Row */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2 text-sm md:text-[20px] text-[#000000]">
                {/* Render icon - support predefined icons or use direct emoji/text */}
                {feature.icon === 'car' && <span className="text-[#F85E46]">🚗</span>}
                {feature.icon === 'bus' && <span className="text-[#F85E46]">🚌</span>}
                {feature.icon === 'guide' && <span className="text-[#F85E46]">🗣️</span>}
                {/* Fallback: if not a predefined icon, display the icon value directly (for custom emojis) */}
                {feature.icon !== 'car' && feature.icon !== 'bus' && feature.icon !== 'guide' && (
                  <span className="text-[#F85E46]">{feature.icon}</span>
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
        <div className="flex items-center gap-2 text-sm md:text-[20px] text-[#000000] mb-6">
          <svg className="w-[24px] h-[24px] text-[#F85E46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{penalty}</span>
        </div>

        {expanded && (
          <>
            <div className="border-t border-gray-200 my-4"></div>
            
            {/* Description */}
            {description && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            )}

            {/* Selected Date */}
            {selectedDate && (
              <div className="mb-4 px-4 py-2 bg-[#C5D86D]/20 rounded-lg inline-block">
                <span className="text-sm md:text-[18px] text-[#181E4B] font-medium">
                  Selected Date: {selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

             {/* Conditional Time Slot Render */}
             {/* Only show time slots section if timeSlots has items */}
             {tourDurationType === 'hours' && timeSlots && timeSlots.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-[#F85E46]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-base md:text-[20px] text-[#000000]">:</span>
                  </div>
                  
                  {/* Time Slots Grid */}
                  <p className="text-sm md:text-[16px] text-[#F85E46] font-medium mb-3">
                    Please select a time frame to continue
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-4 mb-4">
                    {timeSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`px-4 py-2 rounded-lg text-sm md:text-[18px] font-medium transition-colors border
                          ${selectedTimeSlot === slot 
                            ? 'bg-[#F85E46] text-white border-[#F85E46]' 
                            : 'bg-[#E8E8E8] text-[#000000] border-transparent hover:bg-gray-300'
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
             )}

    

            {/* --- PRICING LOGIC UI --- */}
            
            {pricingType === 'group' ? (
              /* GROUP MODE UI */
              <div className="space-y-4 mb-6">
                 <div className="flex items-center gap-2 text-[18px] text-[#F85E46] font-medium mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Number of participants: <span className="text-gray-500 text-sm font-normal">(You can select up to {maxPax} guests per item)</span>
                 </div>

                 {/* Guests Row */}
                 <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                    <span className="font-bold text-lg md:text-[22px] text-[#181E4B]">Guests</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleGuestChange(-1)} className="w-10 h-10 rounded-full bg-[#F85E46] text-white flex items-center justify-center hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">−</button>
                        <span className="w-8 text-center font-bold text-lg md:text-[22px] text-[#F85E46]">{guests}</span>
                        <button onClick={() => handleGuestChange(1)} className="w-10 h-10 rounded-full bg-[#F85E46] text-white flex items-center justify-center hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                    </div>
                 </div>

                 {/* Items Row */}
                 <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="font-bold text-lg md:text-[20px] text-[#181E4B] block">{title}</span>
                        <span className="text-sm md:text-[16px] text-[#000000]">({maxPax} Seater)</span>
                    </div>
                    <div className="flex items-center gap-4">
                         {/* Disabled Minus if at minimum */}
                        <button 
                             onClick={() => handleItemChange(-1)} 
                             className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition shadow-sm ${items <= Math.ceil(guests / (maxPax || 1)) ? 'bg-white text-gray-400 cursor-not-allowed' : 'bg-white text-[#F85E46] hover:bg-gray-50'}`}
                             disabled={items <= Math.ceil(guests / (maxPax || 1))}
                        >
                            −
                        </button>
                        <span className="w-8 text-center font-bold text-lg md:text-[22px] text-[#F85E46]">{items}</span>
                        <button onClick={() => handleItemChange(1)} className="w-10 h-10 rounded-full bg-[#F85E46] text-white flex items-center justify-center hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                    </div>
                 </div>
              </div>
            ) : (
              /* PERSON MODE UI */
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-base md:text-[18px] text-[#F85E46] font-medium mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Number Of Participants:
                </div>

                {/* Adults */}
                <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg md:text-[22px] text-[#181E4B]">Adults <span className="text-sm md:text-[18px] font-normal text-gray-600">(Age: 12-99)</span></span>
                    <p className="text-sm md:text-[18px] text-[#000000] mt-1">From {finalAdultPrice} {currency}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm font-bold text-xl">−</button>
                    <span className="w-8 text-center font-bold text-lg md:text-[22px] text-[#000000]">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="w-10 h-10 bg-[#F85E46] rounded-full flex items-center justify-center text-white hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                  </div>
                </div>

                {/* Children */}
                <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg md:text-[22px] text-[#181E4B]">Children <span className="text-sm md:text-[18px] font-normal text-gray-600">(Age: 2-11)</span></span>
                    <p className="text-sm md:text-[18px] text-[#000000] mt-1">From {finalChildPrice} {currency}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm font-bold text-xl">−</button>
                    <span className="w-8 text-center font-bold text-lg md:text-[22px] text-[#000000]">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="w-10 h-10 bg-[#F85E46] rounded-full flex items-center justify-center text-white hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                  </div>
                </div>

                {/* Infants */}
                <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-lg md:text-[22px] text-[#181E4B]">Infants <span className="text-sm md:text-[18px] font-normal text-gray-600">(Age: 0-1)</span></span>
                    <p className="text-sm md:text-[18px] text-[#000000] mt-1">{finalInfantPrice === 0 ? 'Free' : `From ${finalInfantPrice} ${currency}`}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setInfants(Math.max(0, infants - 1))} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm font-bold text-xl">−</button>
                    <span className="w-8 text-center font-bold text-lg md:text-[22px] text-[#000000]">{infants}</span>
                    <button onClick={() => setInfants(infants + 1)} className="w-10 h-10 bg-[#F85E46] rounded-full flex items-center justify-center text-white hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                  </div>
                </div>
              </div>
            )}

             {/* Feature: Pickup Included Option (No Extra Cost) */}
             {isPickupIncluded && (
                <div 
                    className={`mb-6 p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${pickupIncludedChecked ? 'bg-[#F0FFF4] border-green-200 shadow-sm' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPickupIncludedChecked(!pickupIncludedChecked)}
                >
                    {/* Checkbox */}
                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${pickupIncludedChecked ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                        {pickupIncludedChecked && (
                             <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                             </svg>
                        )}
                    </div>

                    {/* Text Content */}
                    <div>
                         <h5 className={`font-bold text-base md:text-lg mb-1 ${pickupIncludedChecked ? 'text-green-800' : 'text-gray-800'}`}>
                             Free Pickup & dropoff
                         </h5>
                         <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                            Available from all hotels and general areas in Dubai and Sharjah.
                         </p>
                    </div>
                </div>
             )}

            {/* Extra Services - Rendered if available */}
            {extraServices.length > 0 && (
              <div className="mb-6">
                <h4 className="text-base md:text-[20px] font-semibold text-[#181E4B] mb-3">Extra Services:</h4>
                <div className="space-y-3">
                  {extraServices.map((service, idx) => {
                    const quantity = extrasQuantities[idx] || 0;
                    return (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                            {/* Checkbox for simple toggle feeling, effectively 0 or 1, but we want counters */}
                            {/* Let's just use counters for "increase and decrease" functionality */}
                            <span className="text-sm md:text-[18px] text-gray-800 select-none font-medium">
                                {service.name}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => handleExtraChange(idx, -1)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition ${quantity === 0 ? 'bg-gray-200 text-gray-400' : 'bg-white text-[#F85E46] border border-[#F85E46] hover:bg-gray-50'}`}
                                    disabled={quantity === 0}
                                >
                                    −
                                </button>
                                <span className={`w-6 text-center font-bold text-[18px] ${quantity > 0 ? 'text-[#181E4B]' : 'text-gray-400'}`}>{quantity}</span>
                                <button 
                                    onClick={() => handleExtraChange(idx, 1)}
                                    className="w-8 h-8 rounded-full bg-[#F85E46] text-white flex items-center justify-center hover:bg-[#e54d36] transition shadow-sm font-bold text-lg"
                                >
                                    +
                                </button>
                             </div>
                             <span className="font-medium text-[#F85E46] w-16 text-right">{(parseFloat(service.price) * (quantity || 1)).toFixed(0)} {currency}</span>
                        </div>
                        </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conditional Pick Up Location Input */}
            {((extraServices.findIndex(s => s.name === 'Private Transfer') !== -1 && (extrasQuantities[extraServices.findIndex(s => s.name === 'Private Transfer')] || 0) > 0) || (isPickupIncluded && pickupIncludedChecked)) && (
                <div className="mb-6">
                    <label htmlFor="pickup-location" className="block text-sm md:text-[18px] font-semibold text-[#181E4B] mb-2">
                        Pick Up Location <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="pickup-location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Enter your hotel name or address"
                        className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#F85E46] focus:border-transparent"
                    />
                </div>
            )}


            {/* Inclusions */}
            {inclusions && inclusions.length > 0 && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <div>
                  <h4 className="text-base md:text-[20px] font-semibold text-[#181E4B] mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm md:text-[18px] text-[#000000]">
                        <svg className="w-5 h-5 text-[#F85E46] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Footer - Only when expanded */}
      {/* Footer - Only when expanded */}
        {expanded && (() => {
           // Helper logic for button state
           const isTimeSelectionRequired = tourDurationType === 'hours' && timeSlots && timeSlots.length > 0;
           const isBookable = !isTimeSelectionRequired || !!selectedTimeSlot;

           // Dynamic Classes
           const addToCartClass = `px-4 py-2 md:px-6 md:py-3 border text-lg md:text-[24px] font-medium rounded-lg transition-colors whitespace-nowrap ${
             !isBookable
               ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
               : 'bg-white border-gray-300 text-[#000000] hover:bg-gray-50'
           }`;

           const bookNowClass = `px-5 py-2 md:px-8 md:py-3 text-lg md:text-[24px] font-medium rounded-lg transition-colors whitespace-nowrap ${
             !isBookable
               ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
               : 'bg-[#F85E46] text-white hover:bg-[#e54d36]'
           }`;

           return (
            <div className="bg-[#E8E8E8] px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-lg md:text-[24px] text-[#000000]">Total Price</p>
                <p className="text-[#181E4B] font-bold text-xl md:text-[24px]">{calculateTotal()} {currency}</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleBooking('add_to_cart')}
                  disabled={!isBookable}
                  className={addToCartClass}
                >
                  Add To Cart
                </button>
                <button 
                  onClick={() => handleBooking('book_now')}
                  disabled={!isBookable}
                  className={bookNowClass}
                >
                  Book Now
                </button>
              </div>
            </div>
           );
        })()}
    </div>
  );
};

export default TourOptionCard;

