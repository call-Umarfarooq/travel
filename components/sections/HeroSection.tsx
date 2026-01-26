'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import VideoCarousel from '@/components/VideoCarousel';

// Define the list of videos
const heroVideos = [
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/19448052-uhd_3840_2160_50fps.mp4',
    'http://dubaijourneytourism.com/wp-content/uploads/2026/01/5057438-uhd_3840_2160_25fps.mp4',

  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/13427706_3840_2160_25fps.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/7169446-uhd_3840_2160_25fps.mp4',
    'https://dubaijourneytourism.com/wp-content/uploads/2026/01/5077164-uhd_3840_2160_25fps.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/6754121-uhd_3840_2160_30fps.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/8464868-hd_1920_1080_30fps.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/8359171-uhd_2560_1440_25fps.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/4368059-hd_1920_1080_30fps.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/14900416_3840_2160_25fps.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/203951-922734722_small.mp4',
  'http://dubaijourneytourism.com/wp-content/uploads/2026/01/178130-858860163_small.mp4',
  
];

const HeroSection: React.FC = () => {
  const router = useRouter(); 
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  
  // Debounce logic
  React.useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      setShowDropdown(true); // Show immediately to show loading state if desired, or wait for results

      try {
        const res = await fetch(`/api/packages?search=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.success) {
           setResults(json.data.slice(0, 6)); // Limit to 6 results
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);
  
  // Click handler
  const handleSelect = (pkg: any) => {
    // Debugging
    console.log('Selected Package:', pkg);

    // Redirect logic
    if (pkg.category && pkg.category._id) {
       router.push(`/travel-with-us?category=${pkg.category._id}`);
    } else if (pkg.category && typeof pkg.category === 'string') {
        // Handle case where category is not populated (just ID)
       router.push(`/travel-with-us?category=${pkg.category}`);
    } else {
       // Fallback if no category
       console.log('No category found, redirecting to details');
       // If user insists on category page, we theoretically can't, but let's try just /travel-with-us?
       // or fallback to details
       router.push(`/tour-details/${pkg.slug}`); 
    }
    setShowDropdown(false);
  };
  
  // Close dropdown on outside click (optional, simple version)
  // For now, let's keep it simple.

  return (
    <section className="relative max-h-[84vh] h-[66vh] md:h-[84vh] flex items-center">
      {/* Background Video Carousel */}
      <VideoCarousel videos={heroVideos} />
      
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 '>
      <div className="px-4 sm:px-6  relative z-40 pt-24 pb-16">
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
          <h1 className="text-3xl font-poppins md:text-4xl lg:text-5xl font-bold text-white leading-tight ">
            Your Complete Dubai Experience Starts Here
          </h1>
          <p className='text-white/90 text-lg mb-4 mt-2'>From iconic landmarks to thrilling adventures, we handle it all</p>

          {/* Search Box */}
          <div className="relative max-w-lg">
              <div className="bg-white rounded-full p-2 flex items-center shadow-lg relative z-50">
                <input
                  type="text"
                  placeholder="Search for cities and activities"
                  className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => { if(query.length >= 2) setShowDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay to allow click
                />
                <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              {/* Dropdown Results */}
              {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-40 max-h-[400px] overflow-y-auto">
                      {isLoading ? (
                          <div className="p-4 text-center text-gray-500">Loading...</div>
                      ) : results.length > 0 ? (
                          <div>
                              {results.map((pkg: any) => (
                                  <div 
                                    key={pkg._id} 
                                    onMouseDown={(e) => { e.preventDefault(); handleSelect(pkg); }}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                                  >
                                      {/* Tiny Thumbnail */}
                                      <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-200">
                                           <Image 
                                              src={pkg.image || 'https://via.placeholder.com/100'} 
                                              alt={pkg.title} 
                                              fill 
                                              className="object-cover"
                                           />
                                      </div>
                                      
                                      {/* Info */}
                                      <div>
                                          <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{pkg.title}</h4>
                                          <div className="flex items-center gap-2 text-xs text-gray-500">
                                              <span>📍 {pkg.location}</span>
                                              {pkg.price && <span className="text-primary font-semibold">• {pkg.price} AED</span>}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="p-4 text-center text-gray-400">
                            {query.length > 0 ? 'No results found' : 'Type to search...'}
                          </div>
                      )}
                  </div>
              )}
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
              Join thousands of happy guests who explored Dubai with us
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
