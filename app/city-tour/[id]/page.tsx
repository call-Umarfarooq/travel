import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TourOptionCard from '../components/TourOptionCard';
import CalendarWidget from '../components/CalendarWidget';
import FeatureCard from '../components/FeatureCard';
import Image from 'next/image';

export default function CityTourPage() {
  const tourOptions = [
    {
      title: 'City Tour (Group)',
      duration: '4 Hours',
      features: [
        { icon: 'car', label: 'Pickup Included' },
        { icon: 'bus', label: 'Drop Off Included' },
        { icon: 'guide', label: 'Tour Guide' },
      ],
      penalty: 'Less Than 1 Days Before Start Of The Experience: 100% Penalty',
      time: '14:45',
      pricePerPerson: 253.50,
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
      pricePerPerson: 450.00,
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
      pricePerPerson: 600.00,
      currency: 'AED',
    },
  ];

  const features = [
    {
      icon: '🎭',
      title: 'Experience Duration:',
      description: '1 to 4 hours',
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

  const highlightsItems = [
    'Water, beers and champagne onboard',
    "7 stops at Moscow's key sights",
    'A peaceful morning or a dazzling evening tour',
    'The best tour to explore Moscow in a fun way!',
  ];

  const includesItems = [
    'Transfer onboard our classic Soviet Van (can be replaced with a comfortable Mercedes van)',
    'Knowledgeable and fun English or Arabic speaking guide',
    'Teleferic (Cable car) across the Moscow river',
  ];

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
            City Tour
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Choose Your Option Section */}
        <h2 className="text-[48px]  font-bold text-[#000000] mb-8">
          Choose your option
        </h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left - Tour Options */}
          <div className="w-full lg:w-[70%]">
            {tourOptions.map((option, index) => (
              <TourOptionCard
                key={index}
                {...option}
                isExpanded={index === 0}
              />
            ))}
          </div>

          {/* Right - Calendar & Decoration */}
          <div className="w-full lg:w-[30%]">
            <CalendarWidget />
            
            {/* Travel Decoration Image */}
            <div className="relative h-72 mt-4">
              <Image
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"
                alt="Travel decoration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* About This Activity */}
        <section className="mt-16 lg:w-[70%] ">
          <h2 className="text-[32px] font-bold text-[#1E3A5F] mb-4">
            About This Activity
          </h2>
          <p className="text-[20px] text-[#000000] leading-relaxed mb-8">
            Discover Moscow Onboard The Mercedes Van Or Our Classic Soviet Van. Drive Around And Discover The Best Spots In Moscow. Comfortably Seated Inside The Cozy Van, Enjoying Some Russian Snacks And Drinks That We&apos;ll Provide, You Will Experience An Amazing 3-Hour Guided Tour Around This Epic City. We Will Stop At 7 Fascinating Instagood Spots And Come Across 12 Of Moscow&apos;s Main Sights.
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
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
        <hr className="mt-14 border-t border-[#000000] lg:w-[70%]" />

        {/* Highlights Section */}
        <section className="mt-8 lg:w-[70%]">
          <h3 className="text-[24px] font-bold text-[#181E4B] mb-4">Highlights</h3>
          <ul className="space-y-2 list-disc list-inside">
            {highlightsItems.map((item, index) => (
              <li key={index} className="text-[20px] text-[#000000]">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Horizontal Separator */}
        <hr className="mt-10 border-t border-[#000000] lg:w-[70%]" />

        {/* Includes Section */}
        <section className="mt-8 lg:w-[70%]">
          <h3 className="text-[24px] font-bold text-[#181E4B] mb-4">Includes</h3>
          <ul className="space-y-2 list-disc list-inside">
            {includesItems.map((item, index) => (
              <li key={index} className="text-[20px] text-[#000000]">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Horizontal Separator */}
        <hr className="mt-10 border-t border-[#000000] lg:w-[70%]" />

        {/* Details Section */}
        <section className="mt-8 mb-8 lg:w-[70%]">
          <h3 className="text-[24px] font-bold text-[#181E4B] mb-4">Details</h3>
          <p className="text-[20px] text-[#000000] leading-relaxed">
            Discover Moscow onboard the Mercedes van or our classic Soviet van. Drive around and discover the best spots in Moscow. Comfortably seated inside the cozy van, enjoying some Russian snacks and drinks that we&apos;ll provide, you will experience an amazing 3-hour guided tour around this epic city. We will stop at 7 fascinating instagood spots and come across 12 of Moscow&apos;s main sights.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
