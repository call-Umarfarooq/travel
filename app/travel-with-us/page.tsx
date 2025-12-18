import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TourPackageCard from "./components/TourPackageCard";
import TripSidebar from "./components/TripSidebar";
import SortBar from "./components/SortBar";
import Pagination from "./components/Pagination";
import { packagesData } from "./types";

export default function TravelWithUsPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      
      {/* Hero Section */}
      <section
        className="relative h-[35vh] min-h-[400px] w-full bg-cover bg-center flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/images/travel-with-us.svg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3 opacity-90">
            Search Tour
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal">
            Travel With Us
          </h1>
        </div>
      </section>

      {/* Sort Bar - Overlapping Hero */}
      <div className="max-w-5xl mx-auto px-4 -mt-5  relative z-20">
        <SortBar />
      </div>

      {/* Main Content - White Card Container */}
      <main className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-[#FFFFFF] shadow-[0px_4px_48px_12px_#00000017] p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Package Cards Grid - LEFT */}
            <section className="w-full lg:w-[58%]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packagesData.map((pkg, index) => (
                  <TourPackageCard 
                    key={pkg.id} 
                    data={pkg} 
                    isHighlighted={index === 0}
                  />
                ))}
              </div>
              
              <Pagination totalPages={4} />
            </section>

            {/* Sidebar - RIGHT */}
            <aside className="w-full lg:w-[42%]">
              <TripSidebar />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
