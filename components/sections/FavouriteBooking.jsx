import React from 'react';
import Image from 'next/image';

const FavouriteBooking = () => {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 8H17M7 12H17M7 16H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Corporate Inquiries',
      description: 'Tailor-made desert safaris and tours for companies, team outings, conferences, and incentive travel, handled by experienced professionals.',
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 9H21M8 2V5M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Group Events & Celebrations',
      description: 'From large group bookings to private events, we organize seamless experiences for birthdays, anniversaries, family gatherings, and special occasions.',
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21M5 21V11L12 4L19 11V21M9 21V15H15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "End-to-End Event Management",
      description: 'Transportation, activities, private camps, dining, entertainment, branding, and custom requirements — all managed under one roof.',
    },
  ];

  return (
    <section className="py-8 lg:pb-16 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left - Content */}
          <div className="lg:w-[40%] lg:pr-8">
            <span className="text-[#F85E46] font-medium text-sm mb-2 block">
              Fast & Easy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-3">
              Corporate & Group Experiences Made Easy
            </h2>
            <p className='text-gray-600 text-lg mb-8'>Plan unforgettable moments in the desert — professionally managed from start to finish.
</p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FFF0EE] rounded-lg flex items-center justify-center text-[#F85E46]">
                    {feature.icon}
                  </div>
                  <div className="max-w-xs">
                    <h3 className="font-bold text-gray-800 text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image (extends beyond container) */}
          <div className="lg:w-[60%] relative mt-12 lg:mt-0 lg:-mr-[15%]">
            <Image
              src="/images/favourite.svg"
              alt="Favourite Resort Bookings"
              width={700}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavouriteBooking;