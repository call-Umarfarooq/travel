'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const PromotionSection = () => {

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/google-reviews');
        const data = await res.json();
        if (data.success && data.data) {
          // Map API data to component format
          const formatted = data.data.map(review => ({
            avatar: review.profile_photo_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
            quote: review.text,
            name: review.author_name,
            title: review.relative_time_description || 'Reviewed on Google',
            link: review.author_url || '#'
          }));
          setTestimonials(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        // Fallback or empty state could be handled here
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Safe access
  const currentTestimonial = testimonials[currentIndex];

  if (loading) {
      return (
        <section className="relative py-20 lg:py-20 overflow-hidden min-h-[500px] flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 w-64 bg-gray-200 rounded"></div>
            </div>
        </section>
      );
  }

  if (testimonials.length === 0) return null; 

  return (
    <section className="relative py-20 lg:py-20 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/promotion-background-img.svg)',
        }}
      />

      {/* Bottom Left Decorative Image */}
      <div className="absolute bottom-0 left-0 w-48 lg:w-64">
        <Image
          src="/images/Travel_Concepts_left-botom.svg"
          alt="Travel decoration"
          width={250}
          height={200}
          className="w-full h-auto"
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[#F85E46] font-semibold text-sm tracking-wider uppercase mb-3 block">
            Promotion
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-gray-800 leading-tight font-serif italic">
            See What Our Clients Say<br />
            About Us
          </h2>
        </div>

        {/* Testimonial Card with Arrows */}
        <div className="max-w-3xl mx-auto relative">
          {/* Left Arrow - Overlapping Card Edge */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-14 h-14 bg-[#5E5E5E] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#4a4a4a] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5M5 12L11 6M5 12L11 18" />
            </svg>
          </button>

          {/* Right Arrow - Overlapping Card Edge */}
          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-14 h-14 bg-[#5E5E5E] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#4a4a4a] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12H19M19 12L13 6M19 12L13 18" />
            </svg>
          </button>

          {/* Card - Now Clickable */}
          <a 
            href={currentTestimonial.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-white rounded-2xl rounded-tl-[60px] p-8 pt-16 text-center shadow-sm relative transition-shadow hover:shadow-xl cursor-pointer">
              {/* Avatar */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="w-20 h-20 rounded-full border-4 border-gray-100 shadow-md overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  {currentTestimonial?.avatar && (
                      <Image
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      />
                  )}
                </div>
              </div>

              {/* Quote */}
              <div className="relative px-4 md:px-12">
                <span className="absolute -top-2 left-0 text-6xl text-[#F85E46] font-serif leading-none">"</span>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 pt-4 group-hover:text-gray-700 transition-colors">
                  {currentTestimonial?.quote}
                </p>
                <span className="absolute -bottom-2 right-4 text-6xl text-[#F85E46] font-serif leading-none">"</span>
              </div>

              {/* Author */}
              <div className="mt-6">
                <h4 className="font-bold text-gray-800 text-sm">
                  {currentTestimonial?.name} - <span className="text-[#F85E46]">{currentTestimonial?.title}</span>
                </h4>
              </div>
            </div>
          </a>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-[#F85E46]' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );

};

export default PromotionSection;
