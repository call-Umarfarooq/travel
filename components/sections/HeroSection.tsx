import React from 'react';
import Image from 'next/image';
import VideoCarousel from '@/components/VideoCarousel';

// Define the list of videos
const heroVideos = [
  '/videos/178130-858860163_small.mp4',
  '/videos/203951-922734722_small.mp4',
  '/videos/4368059-hd_1920_1080_30fps.mp4',
  '/videos/8464868-hd_1920_1080_30fps.mp4',
  '/videos/19448052-uhd_3840_2160_50fps.mp4',
  '/videos/6754121-uhd_3840_2160_30fps.mp4',
  '/videos/8359171-uhd_2560_1440_25fps.mp4',
  '/videos/5057526-uhd_3840_2160_25fps.mp4',
  '/videos/5057438-uhd_3840_2160_25fps.mp4',
  '/videos/13427706_3840_2160_25fps.mp4',
  '/videos/14900416_3840_2160_25fps.mp4',
  '/videos/12754278_3840_2160_30fps.mp4',
  '/videos/7169446-uhd_3840_2160_25fps.mp4',
  '/videos/5077164-uhd_3840_2160_25fps.mp4',
  '/videos/0_Woman_Desert_3840x2160.mov',
];

const HeroSection: React.FC = () => {
  return (
    <section className="relative max-h-[84vh] h-[66vh] md:h-[84vh] flex items-center">
      {/* Background Video Carousel */}
      <VideoCarousel videos={heroVideos} />
      
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 '>
      <div className="px-4 sm:px-6  relative z-10 pt-24 pb-16">
        <div className="max-w-xl">
          {/* Decorative Wave */}
          <div className="mb-6">
            <svg width="60" height="16" viewBox="0 0 60 16" fill="none" className="text-primary">
              <path 
                d="M2 8C6 2 10 14 14 8C18 2 22 14 26 8C30 2 34 14 38 8C42 2 46 14 50 8C54 2 58 14 58 8" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-poppins md:text-5xl lg:text-6xl font-bold text-white leading-tight ">
            Your Complete Dubai Experience Starts Here
          </h1>
          <p className='text-white/90 text-lg mb-4 mt-2'>From iconic landmarks to thrilling adventures, we handle it all</p>

          {/* Search Box */}
          <div className="bg-white rounded-full p-2 flex items-center shadow-lg max-w-lg">
            <input
              type="text"
              placeholder="Search for cities and activities"
              className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-dark placeholder:text-gray-400"
            />
            <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Trust Indicator */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <Image
                    src={`https://picsum.photos/80/80?random=person${i}`}
                    alt="Traveler"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-white/90 text-sm">
              <span className="font-semibold">2,500 people</span> booked Tommorrowland Event in last 24 hours
            </p>
          </div>
        </div>
      </div>
      <div></div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <div className="w-4 h-1 bg-white/60 rounded-full" />
      </div>
    </section>
  );
};

export default HeroSection;
