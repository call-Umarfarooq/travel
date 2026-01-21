'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

const PromotionSection = () => {
  const widgetRef = useRef(null);

  useEffect(() => {
    if (widgetRef.current) {
      const script = document.createElement('script');
      script.src = "https://reviews.beaver.codes/widget/web-google-reviews.js";
      script.async = true;
      widgetRef.current.appendChild(script);

      return () => {
        try {
          if (widgetRef.current && widgetRef.current.contains(script)) {
            widgetRef.current.removeChild(script);
          }
        } catch (e) {
          console.error("Error removing script", e);
        }
      };
    }
  }, []);

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
        {/* Reviews Widget */}
        <div className="flex justify-center w-full">
            <div ref={widgetRef} data-instance-id="RK9lZtZYVLMEpI2Fl6qt" className="w-full"></div>
        </div>
      </div>
    </section>
  );
};

export default PromotionSection;
