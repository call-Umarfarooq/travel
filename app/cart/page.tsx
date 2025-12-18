import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BuyerForm from './components/BuyerForm';
import OrderSummary from './components/OrderSummary';
import Image from 'next/image';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section
        className="relative h-[30vh] min-h-[250px] w-full bg-cover bg-center flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/images/travel-with-us.svg')",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3 opacity-90">
            Explore
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal">
            Shopping Cart
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#181E4B] mb-8">Shopping Cart</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Buyer Form */}
          <div className="w-full lg:w-[60%]">
            <BuyerForm />
          </div>

          {/* Right - Order Summary & Decoration */}
          <div className="w-full lg:w-[40%]">
            <OrderSummary />
            
            {/* Travel Decoration Image */}
            <div className="relative h-72 mt-8">
              <Image
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"
                alt="Travel decoration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
