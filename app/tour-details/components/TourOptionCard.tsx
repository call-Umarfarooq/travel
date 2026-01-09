'use client';

import React, { useState } from 'react';

interface TourOptionCardProps {
  title: string;
  duration: string;
  description?: string;
  features: { icon: string; label: string }[];
  penalty: string;
  time: string;
  
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
    totalPrice: string;
  }) => void;
}

const TourOptionCard: React.FC<TourOptionCardProps> = ({
  title,
  duration,
  description,
  features,
  penalty,
  time,
  pricingType = 'person',
  adultPrice,
  childPrice,
  infantPrice,
  groupPrice,
  maxPax,
  pricePerPerson,
  currency = 'AED',
  isExpanded = false,
  selectedDate,
  inclusions,
  extraServices = [],
  onBookNow,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  
  // Person Mode State
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Group Mode State
  const [guests, setGuests] = useState(1);
  const [items, setItems] = useState(1);

  // Extra Services State
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);

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

  const toggleExtraService = (index: number) => {
    setSelectedExtras(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
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
    const extrasTotal = selectedExtras.reduce((sum, idx) => {
      // Handle price as string or number
      const priceStr = extraServices[idx]?.price || '0';
      const price = parseFloat(priceStr.toString());
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    return (baseTotal + extrasTotal).toFixed(2);
  };

  return (
    <div className={`rounded-2xl overflow-hidden transition-all mb-4 border-2 ${expanded ? 'border-[#F85E46] bg-[#FFF8F6]' : 'border-gray-200 bg-white'}`}>
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
        <div className="flex items-center gap-2 text-[20px] text-[#000000] mb-6">
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
                <span className="text-[18px] text-[#181E4B] font-medium">
                  Selected Date: {selectedDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}

            {/* Time */}
            <div className="mb-6">
               <span className="px-6 py-2 bg-[#F85E46] text-white text-sm font-medium rounded-full">
                 {time}
               </span>
            </div>

    

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
                    <span className="font-bold text-[22px] text-[#181E4B]">Guests</span>
                    <div className="flex items-center gap-4">
                        <button onClick={() => handleGuestChange(-1)} className="w-10 h-10 rounded-full bg-[#F85E46] text-white flex items-center justify-center hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">−</button>
                        <span className="w-8 text-center font-bold text-[22px] text-[#F85E46]">{guests}</span>
                        <button onClick={() => handleGuestChange(1)} className="w-10 h-10 rounded-full bg-[#F85E46] text-white flex items-center justify-center hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                    </div>
                 </div>

                 {/* Items Row */}
                 <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <span className="font-bold text-[20px] text-[#181E4B] block">{title}</span>
                        <span className="text-[16px] text-[#000000]">({maxPax} Seater)</span>
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
                        <span className="w-8 text-center font-bold text-[22px] text-[#F85E46]">{items}</span>
                        <button onClick={() => handleItemChange(1)} className="w-10 h-10 rounded-full bg-[#F85E46] text-white flex items-center justify-center hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                    </div>
                 </div>
              </div>
            ) : (
              /* PERSON MODE UI */
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-[18px] text-[#F85E46] font-medium mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Number Of Participants:
                </div>

                {/* Adults */}
                <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[22px] text-[#181E4B]">Adults <span className="text-[18px] font-normal text-gray-600">(Age: 12-99)</span></span>
                    <p className="text-[18px] text-[#000000] mt-1">From {finalAdultPrice} {currency}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm font-bold text-xl">−</button>
                    <span className="w-8 text-center font-bold text-[22px] text-[#000000]">{adults}</span>
                    <button onClick={() => setAdults(adults + 1)} className="w-10 h-10 bg-[#F85E46] rounded-full flex items-center justify-center text-white hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                  </div>
                </div>

                {/* Children */}
                <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[22px] text-[#181E4B]">Children <span className="text-[18px] font-normal text-gray-600">(Age: 2-11)</span></span>
                    <p className="text-[18px] text-[#000000] mt-1">From {finalChildPrice} {currency}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm font-bold text-xl">−</button>
                    <span className="w-8 text-center font-bold text-[22px] text-[#000000]">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="w-10 h-10 bg-[#F85E46] rounded-full flex items-center justify-center text-white hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                  </div>
                </div>

                {/* Infants */}
                <div className="bg-[#E8E8E8] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[22px] text-[#181E4B]">Infants <span className="text-[18px] font-normal text-gray-600">(Age: 0-1)</span></span>
                    <p className="text-[18px] text-[#000000] mt-1">{finalInfantPrice === 0 ? 'Free' : `From ${finalInfantPrice} ${currency}`}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setInfants(Math.max(0, infants - 1))} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm font-bold text-xl">−</button>
                    <span className="w-8 text-center font-bold text-[22px] text-[#000000]">{infants}</span>
                    <button onClick={() => setInfants(infants + 1)} className="w-10 h-10 bg-[#F85E46] rounded-full flex items-center justify-center text-white hover:bg-[#e54d36] transition shadow-sm font-bold text-xl">+</button>
                  </div>
                </div>
              </div>
            )}

            {/* Extra Services - Rendered if available */}
            {extraServices.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[20px] font-semibold text-[#181E4B] mb-3">Extra Services:</h4>
                <div className="space-y-3">
                  {extraServices.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          id={`extra-${idx}`}
                          checked={selectedExtras.includes(idx)}
                          onChange={() => toggleExtraService(idx)}
                          className="w-5 h-5 text-[#F85E46] rounded focus:ring-[#F85E46]"
                        />
                        <label htmlFor={`extra-${idx}`} className="text-[18px] text-gray-800 cursor-pointer select-none">
                          {service.name}
                        </label>
                      </div>
                      <span className="font-medium text-[#F85E46]">{service.price} {currency}</span>
                     </div>
                  ))}
                </div>
              </div>
            )}


            {/* Inclusions */}
            {inclusions && inclusions.length > 0 && (
              <>
                <div className="border-t border-gray-200 my-4"></div>
                <div>
                  <h4 className="text-[20px] font-semibold text-[#181E4B] mb-3">Includes:</h4>
                  <ul className="space-y-2">
                    {inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[18px] text-[#000000]">
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
      {expanded && (
        <div className="bg-[#E8E8E8] px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[24px] text-[#000000]">Total Price</p>
            <p className="text-[#181E4B] font-bold text-[24px]">{calculateTotal()} {currency}</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => {
                 if (!selectedDate) { alert('Please select a date first'); return; }
                 const details = { 
                  adults: pricingType === 'person' ? adults : 0, 
                  children: pricingType === 'person' ? children : 0, 
                  infants: pricingType === 'person' ? infants : 0,
                  guests: pricingType === 'group' ? guests : 0,
                  items: pricingType === 'group' ? items : 0,
                  totalPrice: calculateTotal() 
                 };
                 if(onBookNow) onBookNow({...details, action: 'add_to_cart'} as any);
              }}
              className="px-6 py-3 bg-white border border-gray-300 text-[#000000] text-[24px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Add To Cart
            </button>
            <button 
              onClick={() => {
                if (!selectedDate) { alert('Please select a date first'); return; }
                const details = { 
                  adults: pricingType === 'person' ? adults : 0, 
                  children: pricingType === 'person' ? children : 0, 
                  infants: pricingType === 'person' ? infants : 0,
                  guests: pricingType === 'group' ? guests : 0,
                  items: pricingType === 'group' ? items : 0,
                  totalPrice: calculateTotal() 
                };
                if(onBookNow) onBookNow({...details, action: 'book_now'} as any);
              }}
              className="px-8 py-3 bg-[#F85E46] text-white text-[24px] font-medium rounded-lg hover:bg-[#e54d36] transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourOptionCard;
