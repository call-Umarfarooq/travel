'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VideoCarouselProps {
  videos: string[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  // Preload next video
  useEffect(() => {
    setNextVideoIndex((currentVideoIndex + 1) % videos.length);
  }, [currentVideoIndex, videos.length]);

  // Handle video ended event to transition to next video
  const handleVideoEnded = () => {
    setIsTransitioning(true);
    
    // Fade transition
    setTimeout(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
      setIsTransitioning(false);
    }, 800);
  };

  // Ensure video plays when mounted
  useEffect(() => {
    if (currentVideoRef.current) {
      currentVideoRef.current.play().catch(error => {
        console.log('Auto-play prevented:', error);
      });
    }
  }, [currentVideoIndex]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Current video */}
      <video
        key={`current-${currentVideoIndex}`}
        ref={currentVideoRef}
        src={videos[currentVideoIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        } z-10`}
      />

      {/* Preload next video (hidden) */}
      <video
        key={`next-${nextVideoIndex}`}
        ref={nextVideoRef}
        src={videos[nextVideoIndex]}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-0 z-0"
      />
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-20" />
      
      {/* Video indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentVideoIndex(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentVideoIndex
                ? 'bg-white w-8'
                : 'bg-white/50 w-6 hover:bg-white/70'
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
