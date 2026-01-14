'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section
        className="relative h-[50vh] min-h-[400px] w-full bg-cover bg-center flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/images/travel-with-us.svg')", 
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-24">
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] mb-4 opacity-90 font-medium">
            Discover Our Story
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif italic font-normal mb-4">
            About Us
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
             Your trusted partner for authentic desert experiences and curated city tours in the UAE.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        
        <section id="about-desert-smart-tourism" className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Left Column: Text Content */}
            <div className="w-full md:w-2/3 space-y-8">
                <div>
                   <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-6 font-serif">
                     About Desert Smart Tourism
                   </h2>
                   <div className="w-24 h-1 bg-[#F85E46] mb-8"></div>
                </div>

                <div className="text-base md:text-lg text-gray-700 leading-relaxed space-y-6">
                    <p>
                    <span className="font-bold text-[#F85E46]">Desert Smart Tourism</span> is a trusted travel and tourism company based in the UAE, specializing in authentic desert experiences and carefully curated city tours.
                    </p>

                    <p>
                    We connect travelers with the true spirit of the desert while delivering comfort, safety, and exceptional service at every step. From thrilling desert safaris and dune adventures to cultural experiences, city sightseeing, and luxury leisure activities, we offer a wide range of tours designed for individuals, families, groups, and corporate clients.
                    </p>

                    <p>
                    Our team is made up of experienced tourism professionals and licensed guides who understand the needs of modern travelers. We focus on quality, transparency, and reliability, ensuring every guest enjoys a smooth and memorable journey from booking to completion.
                    </p>
                    
                    <div className="bg-[#FFF8F6] border-l-4 border-[#F85E46] p-6 rounded-r-lg italic text-[#183B56]">
                        "Whether you are a first-time visitor or a long-term partner, we aim to build lasting relationships based on trust and performance."
                    </div>

                    <p>
                    At Desert Smart Tourism, we work closely with hotels, travel agencies, tour operators, and corporate partners to deliver flexible B2B solutions and competitive pricing.
                    </p>

                    <p>
                    With a strong local network, modern booking systems, and a customer-first approach, <span className="font-bold text-[#1E3A5F]">Desert Smart Tourism</span> is your smart choice for discovering the UAE’s desert and beyond.
                    </p>
                </div>
            </div>

            {/* Right Column: Visual/Decoration (Placeholder or minimal info) */}
            <div className="w-full md:w-1/3 space-y-8 sticky top-24">
                 <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                     <div className="relative z-10">
                        <h3 className="text-xl font-bold text-[#1E3A5F] mb-4">Why Choose Us?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <span className="text-[#F85E46] text-xl mt-1">✓</span>
                                <span className="text-gray-600">Authentic Desert Safaris</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#F85E46] text-xl mt-1">✓</span>
                                <span className="text-gray-600">Licensed Professional Guides</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <span className="text-[#F85E46] text-xl mt-1">✓</span>
                                <span className="text-gray-600">Flexible B2B Solutions</span>
                            </li>
                             <li className="flex items-start gap-3">
                                <span className="text-[#F85E46] text-xl mt-1">✓</span>
                                <span className="text-gray-600">Safety & Comfort First</span>
                            </li>
                        </ul>
                     </div>
                     
                     {/* Decorative subtle pattern */}
                     <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F85E46]/5 rounded-full blur-3xl"></div>
                 </div>

                 {/* Contact Teaser */}
                 <div className="bg-[#1E3A5F] text-white p-8 rounded-2xl shadow-lg text-center">
                    <h3 className="text-xl font-bold mb-2">Plan Your Trip</h3>
                    <p className="opacity-80 mb-6 text-sm">Ready to explore the dunes? Contact our team today.</p>
                    <button className="bg-[#F85E46] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#e54d36] transition w-full">
                        Contact Us
                    </button>
                 </div>
            </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}
