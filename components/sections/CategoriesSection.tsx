'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  image: string;
  title: string;
  _id?: string;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
           const mapped = data.data.map((cat: any) => ({
            image: cat.image,
            title: cat.name,
            _id: cat._id
          }));
          setCategories(mapped);
        } else {
             // Fallback to dummy data if DB is empty so UI doesn't look broken during demo
             // Or leave empty. User asked to "integrate", implying dynamic data.
             // But if I strictly rely on DB and it's empty, the UI will be empty.
             // I'll assume that's intended, but I'll add a check to not break the wave logic.
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Wave configuration for each of the 5 visible positions
  const waveConfig = [
    { translateY: 50, rotate: -10, aspectRatio: '4/4' },   // Far left - lowest
    { translateY: 30, rotate: -5, aspectRatio: '4/4' },    // Left
    { translateY: 0, rotate: 0, aspectRatio: '4/4' },      // Center - highest
    { translateY: 30, rotate: 5, aspectRatio: '4/4' },     // Right
    { translateY: 60, rotate: 10, aspectRatio: '4/4' },    // Far right - lowest
  ];

  // Helper to safely get length
  const totalCategories = categories.length;

  // Get visible 5 cards based on current start index
  const getVisibleCategories = () => {
    if (totalCategories === 0) return [];
    
    const result = [];
    for (let i = 0; i < 5; i++) {
      const index = (startIndex + i) % totalCategories;
      // Handle case where totalCategories < 5 by cycling existing ones
      result.push(categories[index]);
    }
    return result;
  };

  const visibleCategories = getVisibleCategories();

  // Cooldown to prevent rapid navigation
  const [isNavigating, setIsNavigating] = useState(false);
  const scrollAccumulator = useRef(0);
  const COOLDOWN_MS = 400; // Cooldown between navigations
  const SCROLL_THRESHOLD = 50; // Scroll amount needed to trigger navigation

  const handlePrev = useCallback(() => {
    if (isNavigating || totalCategories === 0) return;
    setIsNavigating(true);
    setStartIndex((prev) => (prev === 0 ? totalCategories - 1 : prev - 1));
    setTimeout(() => setIsNavigating(false), COOLDOWN_MS);
  }, [totalCategories, isNavigating]);

  const handleNext = useCallback(() => {
    if (isNavigating || totalCategories === 0) return;
    setIsNavigating(true);
    setStartIndex((prev) => (prev + 1) % totalCategories);
    setTimeout(() => setIsNavigating(false), COOLDOWN_MS);
  }, [totalCategories, isNavigating]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dragDistance = e.clientX - dragStartX;
    const threshold = 150; 
    
    if (dragDistance > threshold) {
      handlePrev();
      setDragStartX(e.clientX);
    } else if (dragDistance < -threshold) {
      handleNext();
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Mouse wheel handler with accumulation for smoother scrolling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    // Accumulate scroll delta
    scrollAccumulator.current += e.deltaY;
    
    if (scrollAccumulator.current > SCROLL_THRESHOLD) {
      handleNext();
      scrollAccumulator.current = 0;
    } else if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
      handlePrev();
      scrollAccumulator.current = 0;
    }
  }, [handleNext, handlePrev]);

  if (loading) {
      return <div className="py-16 text-center">Loading Categories...</div>;
  }

  if (totalCategories === 0) {
      return (
          <section className="py-16 bg-white overflow-hidden">
             <div className="max-w-7xl mx-auto px-2 text-center">
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-8">Tour Categories</h2>
                 <p className="text-gray-500">No categories found. Please add some from the dashboard.</p>
             </div>
          </section>
      );
  }

  return (
    <section className="md:py-16 py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-2">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark text-center mb-16">
          Tour Categories
        </h2>

        {/* Desktop View: Wave Animation (Hidden on mobile) */}
        <div 
          ref={containerRef}
          className={`hidden md:block w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
          {/* Cards Row - Wave Layout with percentage widths */}
          <div className="flex justify-between items-start w-full min-h-[380px] select-none">
            {visibleCategories.map((category, index) => {
              const config = waveConfig[index] || waveConfig[0];
              
              return (
                <div
                  key={`${startIndex}-${index}`}
                  className="flex flex-col items-center transition-all duration-500 ease-out"
                  style={{ 
                    width: '18%',
                    transform: `translateY(${config.translateY}px)`,
                  }}
                >
                  <div 
                    className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 w-full"
                    style={{ 
                      aspectRatio: config.aspectRatio,
                      transform: `rotate(${config.rotate}deg)`,
                    }}
                  >
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div 
                    className="mt-4 text-center transition-all duration-300"
                    style={{ transform: `rotate(${config.rotate}deg)` }}
                  >
                    <h3 className="text-base font-semibold text-dark">{category.title}</h3>
                    <Link 
                      href={category._id ? `/travel-with-us?category=${category._id}` : '/travel-with-us'}
                      className="text-sm text-gray-400 hover:text-primary transition-colors inline-block mt-1"
                    >
                      See More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile View: Simple Grid (Hidden on desktop) */}
        <div className="md:hidden grid grid-cols-2 sm:grid-cols-2 gap-4">
             {categories.map((category, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md mb-3">
                         <Image
                            src={category.image}
                            alt={category.title}
                            fill
                            className="object-cover"
                         />
                    </div>
                    <h3 className="text-sm font-bold text-dark text-center">{category.title}</h3>
                    <Link 
                      href={category._id ? `/travel-with-us?category=${category._id}` : '/travel-with-us'}
                      className="text-xs text-gray-500 hover:text-primary transition-colors mt-1"
                    >
                      See More
                    </Link>
                </div>
             ))}
        </div>

        {/* Pagination Dots (Desktop Only) */}
        <div className="hidden md:flex justify-center gap-2 mt-5">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => setStartIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === startIndex 
                  ? 'bg-secondary w-6' 
                  : 'bg-gray-300 hover:bg-gray-400 w-2.5'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
