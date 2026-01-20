'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  image: string;
  title: string;
  _id?: string;
}

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
           const mapped = data.data.map((cat: any) => ({
            image: cat.image,
            title: cat.name,
            _id: cat._id
          }));
          setCategories(mapped);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
      return <div className="py-16 text-center">Loading Categories...</div>;
  }

  if (categories.length === 0) {
      return (
          <section className="py-16 bg-white overflow-hidden">
             <div className="max-w-7xl mx-auto px-2 text-center">
                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-8">Tour Categories</h2>
                 <p className="text-gray-500">No categories found. Please add some from the dashboard.</p>
             </div>
          </section>
      );
  }

  return (
    <section className="md:pb-16 py-8 bg-white overflow-hidden">
      <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-dark text-center mb-12">
          Tour Categories
        </h2>

        {/* Desktop View: Straight 4 Cards (Hidden on mobile) */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              <div 
                className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 w-full aspect-square"
              >
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-dark">{category.title}</h3>
                <Link 
                  href={category._id ? `/travel-with-us?category=${category._id}` : '/travel-with-us'}
                  className="text-sm text-gray-400 hover:text-primary transition-colors inline-block mt-1"
                >
                  See More
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Simple Grid (Hidden on desktop) */}
        <div className="md:hidden grid grid-cols-2 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md mb-3">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-bold text-dark text-center">{category.title}</h3>
              <Link 
                href={category._id ? `/travel-with-us?category=${category._id}` : '/travel-with-us'}
                className="text-xs text-gray-500 hover:text-primary transition-colors mt-1"
              >
                See More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
