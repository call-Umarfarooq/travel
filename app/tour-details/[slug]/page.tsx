'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TourOptionCard from '../components/TourOptionCard';
import CalendarWidget from '../components/CalendarWidget';
import FeatureCard from '../components/FeatureCard';
import Image from 'next/image';
import RecentGallery from '@/components/sections/RecentGallery';
import ReviewsSection from '@/components/sections/ReviewsSection';

import { useParams } from 'next/navigation';
import BookingModal from '../components/BookingModal';

export default function CityTourPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  
  const [showOptions, setShowOptions] = useState(false);
  const [packageData, setPackageData] = useState<any>(null); // Use a proper interface ideally
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  
  // Default static data (fallback)
  const defaultData = {
    title: 'City Tour',
    gallery: [], // Will use default in component
    description: "Discover Moscow Onboard The Mercedes Van Or Our Classic Soviet Van...",
    highlights: `<ul>
        <li>Water, beers and champagne onboard</li>
        <li>7 stops at Moscow's key sights</li>
        <li>A peaceful morning or a dazzling evening tour</li>
        <li>The best tour to explore Moscow in a fun way!</li>
    </ul>`,
    includes: `<ul>
        <li>Transfer onboard our classic Soviet Van</li>
        <li>Knowledgeable and fun English or Arabic speaking guide</li>
        <li>Teleferic (Cable car) across the Moscow river</li>
    </ul>`,
    features: [
        { icon: '🎭', title: 'Experience Duration:', description: '1 to 4 hours' },
        { icon: '🚗', title: 'Transportation:', description: 'With Pickup and Drop-off' },
        { icon: '💰', title: 'Price Range:', description: 'Moderate Pricing' }
    ],
    tourOptions: [
        { 
          title: 'City Tour (Group)', 
          duration: '4 Hours', 
          active: true,
          adultPrice: 253.50,
          childPrice: 177.45,
          infantPrice: 0,
          features: [], 
          time: '14:45' 
        }
    ]
  };

  useEffect(() => {
    if (slug) {
        const fetchPackage = async () => {
            try {
                const res = await fetch(`/api/packages?slug=${slug}`);
                const json = await res.json();
                if (json.success && json.data && json.data.length > 0) {
                     setPackageData(json.data[0]); // API returns array
                }
            } catch (err) {
                console.error("Failed to fetch package", err);
            }
        };
        fetchPackage();
    }
  }, [slug]);

  const activeData = packageData || defaultData;
  const isDynamic = !!packageData;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowOptions(true);
    // Future: API call for date-specific availability
    // fetchAvailability(date);
  };

  const handleBookNow = (option: any, guestDetails: any) => {
    setBookingDetails({
      title: option.title,
      date: selectedDate || new Date(),
      time: option.time,
      guests: {
        adults: guestDetails.adults,
        children: guestDetails.children,
        infants: guestDetails.infants,
      },
      totalPrice: guestDetails.totalPrice,
      currency: 'AED',
    });
    setIsBookingOpen(true);
  };


  // Use dynamic options if available, otherwise default
  const tourOptions = isDynamic && activeData.tourOptions.length > 0 ? activeData.tourOptions : [
    {
      title: 'City Tour (Group)',
      duration: activeData.duration || '4 Hours',
      features: [
        { icon: 'car', label: 'Pickup Included' },
        { icon: 'bus', label: 'Drop Off Included' },
        { icon: 'guide', label: 'Tour Guide' },
      ],
      penalty: 'Less Than 1 Days Before Start Of The Experience: 100% Penalty',
      time: '14:45',
      pricePerPerson: activeData.price || 253.50,
      adultPrice: activeData.price || 253.50,
      childPrice: (activeData.price ? activeData.price * 0.7 : 177.45),
      infantPrice: 0,
      currency: 'AED',
    },
    {
      title: 'Extended City Tour',
      duration: '6 Hours',
      features: [
        { icon: 'car', label: 'Private Transport' },
        { icon: 'guide', label: 'Best Tour Guide' },
      ],
      penalty: 'Less Than 2 Days Before Start Of The Experience: 50% Penalty',
      time: '10:00',
      pricePerPerson: (activeData.price ? activeData.price * 1.5 : 450.00),
      adultPrice: (activeData.price ? activeData.price * 1.5 : 450.00),
      childPrice: 350.00,
      infantPrice: 0,
      currency: 'AED',
    },
    {
      title: 'City Tour Premium',
      duration: '8 Hours',
      features: [
        { icon: 'car', label: 'Luxury Transport' },
        { icon: 'bus', label: 'Drop Off Included' },
        { icon: 'guide', label: 'Private Guide' },
      ],
      penalty: 'Less Than 3 Days Before Start Of The Experience: 25% Penalty',
      time: '09:00',
      pricePerPerson: (activeData.price ? activeData.price * 2 : 600.00),
      adultPrice: (activeData.price ? activeData.price * 2 : 600.00),
      childPrice: 450.00,
      infantPrice: 0,
      currency: 'AED',
    },
  ];

  const features = activeData.features && activeData.features.length > 0 ? activeData.features : [
    {
      icon: '🎭',
      title: 'Experience Duration:',
      description: activeData.duration || '1 to 4 hours',
    },
    {
      icon: '🚗',
      title: 'Transportation:',
      description: 'With Pickup and Drop-off',
    },
    {
      icon: '💬',
      title: 'Available Languages:',
      description: 'English, Spanish, French, German, Chinese, Arabic',
    },
    {
      icon: '💰',
      title: 'Price Range:',
      description: 'Moderate Pricing, Premium Experiences',
    },
    {
      icon: '🎉',
      title: 'Great For:',
      description: 'Birthdays, Anniversaries, Family Outings, Corporate Events, Retirement',
    },
    {
      icon: '⏰',
      title: 'Best Time to Visit:',
      description: 'Morning, Afternoon, Evening and night',
    },
    {
      icon: '👫',
      title: 'Perfect For:',
      description: 'Couples, Families, Friends, Seniors, Employee Teams, Him, Her',
    },
  ];

  // Helper to safely render HTML or list
  const getHtmlContent = (content: any) => {
      if (typeof content === 'string') return content;
      if (Array.isArray(content)) return content.map(item => `<li>${item}</li>`).join('');
      return '';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section
        className="relative h-[30vh] min-h-[250px] w-full bg-cover bg-center flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/images/travel-with-us.svg')",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3 opacity-90">
            Tour Details
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal">
            {activeData.title}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10">


           <RecentGallery images={activeData.gallery} />

          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {/* Left - Tour Options & Content */}
            <div className="w-full lg:w-[70%]">
              {showOptions && (
                <>
                  <h2 className="text-[48px] font-bold text-[#000000] mb-8">
                    Choose your option
                  </h2>
                  {tourOptions.map((option: any, index: number) => (
                    <TourOptionCard
                      key={index}
                      {...option}
                      isExpanded={index === 0}
                      selectedDate={selectedDate || undefined}
                      onBookNow={(details) => handleBookNow(option, details)}
                    />
                  ))}
                </>
              )}

              {/* About This Activity */}
              <section className="mt-16">
                <h2 className="text-[32px] font-bold text-[#1E3A5F] mb-4">
                  About This Activity
                </h2>
                <p className="text-[20px] text-[#000000] leading-relaxed mb-8">
                  {activeData.description}
                </p>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature: any, index: number) => (
                    <FeatureCard
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  ))}
                </div>
              </section>

              {/* Horizontal Separator */}
              <hr className="mt-14 border-t border-[#000000]" />

            {/* Highlights Section */}
            <section className="mt-8">
              <h3 className="text-[24px] font-bold text-[#181E4B] mb-4">Highlights</h3>
              <div 
                className="text-[20px] text-[#000000] space-y-2 [&>ul]:list-disc [&>ul]:list-inside"
                dangerouslySetInnerHTML={{ __html: getHtmlContent(activeData.highlights) }}
              />
            </section>

            {/* Horizontal Separator */}
            <hr className="mt-10 border-t border-[#000000]" />

            {/* Includes Section */}
            <section className="mt-8">
              <h3 className="text-[24px] font-bold text-[#181E4B] mb-4">Includes</h3>
              <div 
                className="text-[20px] text-[#000000] space-y-2 [&>ul]:list-disc [&>ul]:list-inside"
                dangerouslySetInnerHTML={{ __html: getHtmlContent(activeData.includes) }}
              />
            </section>

              {/* Horizontal Separator */}
              <hr className="mt-10 border-t border-[#000000]" />

              {/* Details Section */}
              <section className="mt-8 mb-8">
                <h3 className="text-24px] font-bold text-[#181E4B] mb-4">Details</h3>
                <p className="text-[20px] text-[#000000] leading-relaxed">
                   {activeData.description}
                </p>
              </section>

              {isDynamic && activeData._id && (
                  <>
                    <hr className="mt-10 border-t border-[#000000]" />
                    <ReviewsSection packageId={activeData._id} />
                  </>
              )}
            </div>

            {/* Right - Calendar & Decoration */}
            <div className="w-full lg:w-[30%]">
              <CalendarWidget 
                pricePerPerson={activeData.price} 
                onDateSelect={handleDateSelect} 
              />
              
              {/* Travel Decoration Image */}
              <div className="relative h-72 mt-4">
                <Image
                  src={activeData.image || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"}
                  alt="Travel decoration"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
      </main>

      <Footer />
      
      {/* Booking Modal */}
      {bookingDetails && (
        <BookingModal 
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          bookingDetails={bookingDetails}
        />
      )}
    </div>
  );
}
