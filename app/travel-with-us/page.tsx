'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TourPackageCard from "./components/TourPackageCard";
import TripSidebar from "./components/TripSidebar";
import SortBar, { SortOption } from "./components/SortBar";
import Pagination from "./components/Pagination";

function TravelContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [headerTitle, setHeaderTitle] = useState('Travel With Us');
  const [headerImage, setHeaderImage] = useState('/images/travel-with-us.svg');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = categoryId ? `?category=${categoryId}` : '';
        
        // Fetch Packages
        const packagesPromise = fetch(`/api/packages${query}`).then(res => res.json());
        
        // Fetch Category Name if categoryId exists
        let categoryPromise: Promise<any> = Promise.resolve(null);
        if (categoryId) {
            // Determine if passed ID is likely an ObjectId or Slug
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(categoryId);
            const paramName = isObjectId ? 'id' : 'slug';
            categoryPromise = fetch(`/api/categories?${paramName}=${categoryId}`).then(res => res.json());
        }

        const [packagesData, categoryData] = await Promise.all([packagesPromise, categoryPromise]);

        // Process Packages
        if (packagesData.success) {
          setPackages(packagesData.data.map((pkg: any) => ({
            id: pkg._id,
            image: pkg.image,
            date: pkg.duration,
            reviews: pkg.peopleGoing,
            city: pkg.title,
            description: pkg.description,
            price: pkg.price,
            rating: pkg.rating,
            slug: pkg.slug,
             title: pkg.title, // Ensure title is mapped for search
          })));
        }

        // Process Category Title & Image
        if (categoryData && categoryData.success && categoryData.data) {
            setHeaderTitle(categoryData.data.name);
            if (categoryData.data.image) {
                setHeaderImage(categoryData.data.image);
            } else {
                 setHeaderImage('/images/travel-with-us.svg');
            }
        } else {
            setHeaderTitle('Travel With Us');
            setHeaderImage('/images/travel-with-us.svg');
        }

      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const filteredPackages = packages.filter((pkg) => {
    const query = searchQuery.toLowerCase();
    return (
      pkg.city.toLowerCase().includes(query) || 
      pkg.description.toLowerCase().includes(query) ||
      (pkg.title && pkg.title.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      
      {/* Hero Section */}
      <section
        className="relative h-[35vh] min-h-[400px] w-full bg-cover bg-center flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('${headerImage}')`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 text-center text-white px-4">
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3 opacity-90">
            Search Tour
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic font-normal">
            {headerTitle} 
          </h1>
        </div>
      </section> 

      {/* Sort Bar - Overlapping Hero */}
      <div className="max-w-5xl mx-auto px-4 -mt-5  relative z-20">
        <SortBar activeSort={sortOption} onSortChange={setSortOption} />
      </div>

      {/* Main Content - White Card Container */}
      <main className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-[#FFFFFF] shadow-[0px_4px_48px_12px_#00000017] p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Package Cards Grid - LEFT */}
            <section className="w-full lg:w-[58%]">
              {loading ? (
                  <div className="text-center py-10">Loading packages...</div>
              ) : filteredPackages.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...filteredPackages].sort((a, b) => {
                          if (sortOption === 'price-low') {
                            return a.price - b.price;
                          } else if (sortOption === 'price-high') {
                            return b.price - a.price;
                          } else if (sortOption === 'name') {
                            return a.city.localeCompare(b.city);
                          } else {
                            // Default to date (assuming fetched in order, or use a date field if available)
                            // Since API returns createdAt:-1, they are already sorted by date desc
                            return 0; 
                          }
                        }).map((pkg, index) => (
                        <TourPackageCard 
                            key={pkg.id} 
                            data={pkg} 
                            isHighlighted={index === 0}
                        />
                        ))}
                    </div>
                    <Pagination totalPages={1} /> 
                  </>
              ) : (
                  <div className="text-center py-10 text-gray-500">No packages found for {headerTitle !== 'Travel With Us' ? headerTitle : 'this category'}.</div>
              )}
            </section>

            {/* Sidebar - RIGHT */}
            <aside className="w-full lg:w-[42%]">
              <TripSidebar onSearch={setSearchQuery} />
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TravelWithUsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TravelContent />
        </Suspense>
    );
}
