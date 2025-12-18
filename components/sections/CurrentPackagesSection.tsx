import React from 'react';
import Image from 'next/image';

const CurrentPackagesSection: React.FC = () => {
  const features = [
    {
      icon: '🌍',
      title: 'Explore Destinations And Experiences Recommended By Travel Experts',
      description: 'Browse Through Curated Collections Of Things To Do Around The UAE',
    },
    {
      icon: '📍',
      title: 'Travel Destinations, Adventure Activities And Hidden Gems In The UAE',
      description: 'Discover The Best Destinations, Local Gems, Top Instagrammable Cafes And More',
    },
    {
      icon: '🤝',
      title: 'Best In Class Services And Support With Personnel All Around The UAE',
      description: 'Personal Relationship Manager For All Your Travel And Tour Needs',
    },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left - Image */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden border-[6px] border-gray-200 shadow-sm h-full">
              <Image
                src="/images/customtover.svg"
                alt="Dubai Frame"
                width={550}
                height={440}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right - Content Card */}
          <div className="lg:w-1/2">
            <div 
              className="h-full rounded-2xl py-8 px-8 lg:p-11"
              style={{ backgroundColor: '#EDEDED' }}
            >
              <h2 className="text-2xl md:text-[32px] font-bold text-gray-800 mb-4">
                Custom Tour Packages
              </h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                Create A Custom Itinerary Of Places That You Want To Visit Based On Your Interests, And Save Big.
              </p>

              <div className="space-y-5">
                {features.map((feature, index) => (
                  <div key={index}>
                    <div className="text-[24px] mb-4">{feature.icon}</div>
                    <h3 className="font-bold text-gray-800 text-[20px] leading-snug mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
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
