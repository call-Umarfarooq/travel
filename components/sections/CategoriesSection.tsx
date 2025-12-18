'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface Category {
  image: string;
  title: string;
}

const CategoriesSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const allCategories: Category[] = [
    { image: 'https://picsum.photos/300/450?random=coral-reef', title: 'Wildlife' },
    { image: 'https://picsum.photos/300/450?random=desert-walk', title: 'Walking' },
    { image: 'https://picsum.photos/300/450?random=cruise-ship', title: 'Cruises' },
    { image: 'https://picsum.photos/300/450?random=snow-hiking', title: 'Hiking' },
    { image: 'https://picsum.photos/300/450?random=seaplane', title: 'Airbirds' },
    { image: 'https://picsum.photos/300/450?random=beach-sunset', title: 'Beach' },
    { image: 'https://picsum.photos/300/450?random=mountain-view', title: 'Mountains' },
    { image: 'https://picsum.photos/300/450?random=safari', title: 'Safari' },
  ];

  // Get visible 5 cards based on current start index
  const getVisibleCategories = () => {
    const result = [];
    for (let i = 0; i < 5; i++) {
      const index = (startIndex + i) % allCategories.length;
      result.push(allCategories[index]);
    }
    return result;
  };

  const visibleCategories = getVisibleCategories();

  // Wave configuration for each of the 5 visible positions
  // Position 0: far left, Position 2: center (highest), Position 4: far right
  const waveConfig = [
    { translateY: 50, rotate: -10, aspectRatio: '4/4' },   // Far left - lowest
    { translateY: 30, rotate: -5, aspectRatio: '4/4' },    // Left
    { translateY: 0, rotate: 0, aspectRatio: '4/4' },      // Center - highest
    { translateY: 30, rotate: 5, aspectRatio: '4/4' },     // Right
    { translateY: 60, rotate: 10, aspectRatio: '4/4' },    // Far right - lowest
  ];

  // Cooldown to prevent rapid navigation
  const [isNavigating, setIsNavigating] = useState(false);
  const scrollAccumulator = useRef(0);
  const COOLDOWN_MS = 400; // Cooldown between navigations
  const SCROLL_THRESHOLD = 50; // Scroll amount needed to trigger navigation

  const handlePrev = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setStartIndex((prev) => (prev === 0 ? allCategories.length - 1 : prev - 1));
    setTimeout(() => setIsNavigating(false), COOLDOWN_MS);
  }, [allCategories.length, isNavigating]);

  const handleNext = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    setStartIndex((prev) => (prev + 1) % allCategories.length);
    setTimeout(() => setIsNavigating(false), COOLDOWN_MS);
  }, [allCategories.length, isNavigating]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const dragDistance = e.clientX - dragStartX;
    const threshold = 150; // Increased drag distance threshold for slower navigation
    
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

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-2">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark text-center mb-16">
          Tour Categories
        </h2>

        {/* Cards Container - Full Width with drag and scroll */}
        <div 
          ref={containerRef}
          className={`w-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        >
          {/* Cards Row - Wave Layout with percentage widths */}
          <div className="flex justify-between items-start w-full min-h-[380px] select-none">
            {visibleCategories.map((category, index) => {
              const config = waveConfig[index];
              
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
                    <button className="text-sm text-gray-400 hover:text-primary transition-colors">
                      See More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {allCategories.map((_, index) => (
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
