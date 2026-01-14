'use client';

import React, { useState, useRef, useEffect } from 'react';
import PackageCard from '../cards/PackageCard';

interface CategoryRowProps {
  category: any;
  packages: any[];
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, packages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      
      // Approximate index update (simplified)
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      const width = scrollRef.current.clientWidth;
      // This is just for the dots UI, slightly imperfect on manual scroll but works for button clicks
      const index = Math.round(newScrollLeft / 300); 
      // Ensure bounds
      if (index >= 0 && index < packages.length) {
         setActiveIndex(index);
      }
    }
  };

  return (
    <div className="mb-12 last:mb-0">
        <div className="text-left mb-6 px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-dark leading-tight flex items-center gap-3">
                <span className="w-1.5 h-8 bg-[#DF6951] rounded-full block"></span>
                {category.name}
            </h2>
          
        </div>

        <div className="relative group">
            {/* Left Arrow */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 duration-300"
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Cards Container */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide px-8 pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {packages.map((pkg, index) => (
                    <div key={pkg._id || index} className="flex-shrink-0 w-80"> 
                        <PackageCard 
                            image={pkg.image}
                            title={pkg.title}
                            location={pkg.location}
                            duration={pkg.duration}
                            hours={pkg.tourOptions?.[0]?.duration || 'N/A'} 
                            peopleGoing={pkg.peopleGoing}
                            price={`${pkg.price} AED`}
                            rating={pkg.rating}
                            description={pkg.description}
                            slug={pkg.slug}
                        />
                    </div>
                ))}
            </div>

             {/* Right Arrow */}
             <button
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 duration-300"
            >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
  );
};

const PackagesOnTheBaseOfCategories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, packagesRes] = await Promise.all([
            fetch('/api/categories'),
            fetch('/api/packages')
        ]);

        const categoriesData = await categoriesRes.json();
        const packagesData = await packagesRes.json();

        if (categoriesData.success) {
            setCategories(categoriesData.data);
        }
        if (packagesData.success) {
            setPackages(packagesData.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
      return <div className="py-20 text-center text-gray-500">Loading tours...</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight font-volkhov">
            Top Destinations
          </h2>
          <p className="text-gray-500 mt-4">Discover best offers across different categories</p>
        </div>

        {/* Categories List */}
        <div>
            {categories.map((category) => {
                // Filter packages for this category
                // Handle both: category as Object (populated) or String (ID)
                const categoryPackages = packages.filter(pkg => {
                    const pkgCatId = typeof pkg.category === 'object' ? pkg.category?._id : pkg.category;
                    return pkgCatId === category._id;
                });

                if (categoryPackages.length === 0) return null;

                return (
                    <CategoryRow 
                        key={category._id} 
                        category={category} 
                        packages={categoryPackages} 
                    />
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default PackagesOnTheBaseOfCategories;
