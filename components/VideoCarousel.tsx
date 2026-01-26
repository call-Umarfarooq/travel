'use client';

import React, { useState, useEffect, useRef } from 'react';

interface VideoCarouselProps {
  videos: string[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // activePlayer determines which video element is currently "front" and playing the current index
  // 0 -> Video 1 is active, Video 2 is next
  // 1 -> Video 2 is active, Video 1 is next
  const [activePlayer, setActivePlayer] = useState<0 | 1>(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

  // Determine indices for the two players
  // If activePlayer is 0, player 0 has currentIndex, player 1 has (currentIndex + 1)
  // If activePlayer is 1, player 1 has currentIndex, player 0 has (currentIndex + 1)
  
  const getSrc = (playerIndex: number) => {
      // If this player is the active one, it plays currentIndex
      if (playerIndex === activePlayer) return videos[currentIndex];
      // If this player is inactive, it preloads the NEXT index 
      // (which is currentIndex + 1, wrapped)
      return videos[(currentIndex + 1) % videos.length];
  };

  const handleVideoEnded = () => {
    setIsTransitioning(true);
    const nextIndex = (currentIndex + 1) % videos.length;
    const nextPlayer = activePlayer === 0 ? 1 : 0;
    
    // Start the next video
    if (videoRefs[nextPlayer].current) {
        videoRefs[nextPlayer].current!.currentTime = 0;
        videoRefs[nextPlayer].current!.play().catch(e => console.error("Play error", e));
    }

    // Fade out
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setActivePlayer(nextPlayer);
      setIsTransitioning(false);
    }, 800); // Wait for crossfade
  };

  useEffect(() => {
     // Initial play
     if (videoRefs[activePlayer].current) {
         videoRefs[activePlayer].current!.play().catch(() => {});
     }
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {[0, 1].map((playerIndex) => {
        const isActive = playerIndex === activePlayer;
        const src = getSrc(playerIndex);
        
        return (
          <video
            key={playerIndex} // Stable key, never changes
            ref={videoRefs[playerIndex]}
            src={src}
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isActive 
                ? (isTransitioning ? 'opacity-0' : 'opacity-100') // If active and transitioning, fade out
                : (isTransitioning ? 'opacity-100' : 'opacity-0') // If inactive (next) and transitioning, fade in (wait, logic below)
            } ${isActive ? 'z-10' : 'z-0'}`}
             // Logic check:
             // We want CROSSFADE.
             // Active (Old) -> Fade Out.
             // Inactive (New) -> Fade In.
             // When transitioning == true:
             // Old Active (still active in state) should fade OUT.
             // New Active (currently inactive in state) should fade IN.
             // So:
             // Player == activePlayer: isTransitioning ? opacity-0 : opacity-100
             // Player != activePlayer: isTransitioning ? opacity-100 : opacity-0
            
            onEnded={() => {
                if (isActive) handleVideoEnded();
            }}
          />
        );
      })}
      
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent z-20 pointer-events-none" />
      
      {/* Video indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 hidden md:flex gap-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => {
               // Manual navigation is tricky with double buffering but doable
               // Identify which player is active, set its src to target, play.
               // For simplicity in this fix, we just hard set state (might flash black)
               setCurrentIndex(index);
               setIsTransitioning(false);
               // Re-trigger play effect
               setTimeout(() => {
                  if (videoRefs[activePlayer].current) videoRefs[activePlayer].current!.play();
               }, 50);
            }}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
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
