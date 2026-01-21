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

  // Define the specific sequence for the first category
  const firstCategoryPackageOrder = [
    "696a6de9a6aa739d9f2a3ad8",
    "696a6c75a6aa739d9f2a38a5",
    "696a66b5a6aa739d9f2a3739",
    "696a7146a6aa739d9f2a3d56",
    "696a6fc2a6aa739d9f2a3d03"
  ];
const secondCategoryPackageOrder = [
    "696a7611a6aa739d9f2a45c3",
    "696a7393a6aa739d9f2a4202",
    "696e741ad0fa4bad67ae576f",
    "696e749bd0fa4bad67ae5a0a",
    
  ];


  const thirdCategoryPackageOrder = [
    "696a7ce4a6aa739d9f2a4960",
    "696a7abba6aa739d9f2a47f2",
    "696a79fba6aa739d9f2a4740",
    "696a784ca6aa739d9f2a46a5",
    "696a7e01a6aa739d9f2a4a34"
  ];

  const fourthCategoryPackageOrder = [
    "696a99e6a6aa739d9f2a8b26",
    "696a932ba6aa739d9f2a7217",
    "696a8ca7a6aa739d9f2a62af",
    "696a9ac2a6aa739d9f2a8d7d",
    
    
  ];

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
          const targetIds = [
            '696a6080a6aa739d9f2a372a',
            '696a722ba6aa739d9f2a405d',
            '696a71f9a6aa739d9f2a3faa',
            '696a720ea6aa739d9f2a400b'
          ];

          const filteredCategories = categoriesData.data
            .filter((cat: any) => targetIds.includes(cat._id))
            .sort((a: any, b: any) => targetIds.indexOf(a._id) - targetIds.indexOf(b._id));

          setCategories(filteredCategories);
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
      <div>
        {categories.map((category, catIndex) => {
          // 1. Get packages belonging to this category
          let categoryPackages = packages.filter(pkg => {
            const pkgCatId = typeof pkg.category === 'object' ? pkg.category?._id : pkg.category;
            return pkgCatId === category._id;
          });

          // 2. Apply custom sorting based on Category Index
          categoryPackages = categoryPackages.sort((a, b) => {
            let orderList: string[] = [];

            if (catIndex === 0) orderList = firstCategoryPackageOrder;
            else if (catIndex === 1) orderList = secondCategoryPackageOrder;
            else if (catIndex === 2) orderList = thirdCategoryPackageOrder;
            else if (catIndex === 3) orderList = fourthCategoryPackageOrder;

            // Agar koi order list mil jaye to sort karein
            if (orderList.length > 0) {
              const indexA = orderList.indexOf(a._id);
              const indexB = orderList.indexOf(b._id);

              // If ID is not in the list, move it to the end
              const finalIndexA = indexA === -1 ? 999 : indexA;
              const finalIndexB = indexB === -1 ? 999 : indexB;

              return finalIndexA - finalIndexB;
            }
            
            return 0; // Default no sorting for other categories
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
