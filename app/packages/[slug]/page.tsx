import React from 'react';
import BookingWidget from '@/components/booking/BookingWidget';
import connectToDatabase from '@/lib/db';
import Package from '@/models/Package';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getPackage(slug: string) {
  await connectToDatabase();
  const pkg = await Package.findOne({ slug }).lean();
  if (!pkg) return null;
  return JSON.parse(JSON.stringify(pkg));
}

export default async function PackageDetailsPage({ params }: { params: { slug: string } }) {
  const pkg = await getPackage(params.slug);

  if (!pkg) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
         <Image 
            src={pkg.image} 
            alt={pkg.title} 
            fill 
            className="object-cover"
            priority
         />
         <div className="absolute inset-0 bg-black/30" />
         <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white bg-gradient-to-t from-black/80 to-transparent">
             <div className="max-w-7xl mx-auto">
                 <span className="bg-orange-500 text-xs font-bold px-2 py-1 rounded mb-4 inline-block uppercase tracking-wider">
                    {pkg.duration}
                 </span>
                 <h1 className="text-4xl md:text-5xl font-bold mb-4">{pkg.title}</h1>
                 <p className="text-lg opacity-90">{pkg.location}</p>
             </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-12">
             
             {/* Features */}
             <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {pkg.features?.map((f: any, i: number) => (
                     <div key={i} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl">
                         <span className="text-2xl mb-2">{f.icon}</span>
                         <span className="font-bold text-sm text-gray-800">{f.title}</span>
                         <span className="text-xs text-gray-500">{f.description}</span>
                     </div>
                 ))}
             </section>

             {/* Description */}
             <section>
                 <h2 className="text-2xl font-bold mb-4">About this activity</h2>
                 <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: pkg.description }} />
             </section>

             {/* Itinerary */}
             {pkg.itinerary && pkg.itinerary.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
                    <div className="border-l-2 border-orange-200 ml-4 space-y-8">
                        {pkg.itinerary.map((day: any, i: number) => (
                            <div key={i} className="relative pl-8">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm" />
                                <span className="text-orange-500 font-bold text-sm uppercase tracking-wide">Day {day.day}</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-1 mb-2">{day.title}</h3>
                                <p className="text-gray-600">{day.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
             )}

             {/* Highlights & Includes */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {pkg.highlights && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">Highlights</h2>
                        <div className="prose text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: pkg.highlights }} />
                    </section>
                 )}
                 {pkg.includes && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">What's Included</h2>
                         <div className="prose text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: pkg.includes }} />
                    </section>
                 )}
             </div>

          </div>

          {/* Right Column: Booking Widget */}
          <div className="relative">
              <BookingWidget 
                 price={pkg.price}
                 tourOptions={pkg.tourOptions || []} 
              />
          </div>

      </main>

      <Footer />
    </div>
  );
}
