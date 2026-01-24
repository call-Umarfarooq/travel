import React from 'react';
import Image from 'next/image';

const CurrentPackagesSection: React.FC = () => {
  const features = [
    {
      icon: '🌍',
      title: 'Handpicked Experiences by Local Experts',
      description: 'Explore Dubai’s top attractions, activities, and hidden gems recommended by professionals.',
    },
    {
      icon: '📍',
      title: 'City Highlights, Adventures & Hidden Gems',
      description: 'From iconic landmarks to thrilling adventures and off-the-beaten-path experiences.',
    },
    {
      icon: '🤝',
      title: 'Personalized Service Across the UAE',
      description: 'Dedicated support to ensure a smooth, comfortable, and memorable journey.',
    },
  ];

  return (
    <section className="py-4 lg:py-6 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left - Image */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden  h-full w-full relative">
              <Image
                src="/images/CorporateGroup.png"
                alt="Dubai Frame"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Right - Content Card */}
          <div className="lg:w-1/2">
            <div 
              className="h-full rounded-2xl py-5 px-5 lg:p-6"
              style={{ backgroundColor: '#EDEDED' }}
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                Custom Tour Packages
              </h2>
              <p className="text-gray-500 text-xs md:text-sm mb-4 leading-relaxed">
                Create your perfect Dubai itinerary based on your interests, schedule, and travel style.

              </p>

              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index}>
                    <div className="text-[20px] mb-1">{feature.icon}</div>
                    <h3 className="font-bold text-gray-800 text-base md:text-lg leading-snug mb-0.5">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentPackagesSection;
