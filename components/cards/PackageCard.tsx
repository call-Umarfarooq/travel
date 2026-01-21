import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PackageCardProps {
  slug?: string;
  image: string;
  title: string;
  location: string;
  duration: string;
  hours: string;
  peopleGoing: number;
  price: string;
  rating: number;
  description: string;
}

const PackageCard: React.FC<PackageCardProps> = ({
  slug,
  image,
  title,
  location,
  duration,
  hours,
  peopleGoing,
  price,
  rating,
  description,
}) => {
  const CardContent = (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#BCCED2] h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-52 rounded-tr-2xl rounded-tl-2xl overflow-hidden shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Duration and People Info */}
        <div className="flex items-center justify-between min-w-max text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} />
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} />
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} />
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} />
            </svg>
            <span>{duration}</span>
            <span className="text-gray-400">/{hours}</span>
          </div>
          
          {/* Conditional People Going Rendering */}
          {peopleGoing > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700">{peopleGoing} People Going</span>
            </div>
          )}
        </div>

        {/* Title and Rating */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-dark line-clamp-1" title={title}>{title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            <div className="flex text-amber-400">
              {/* Single Star Display */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-primary font-bold text-lg">{price}</span>
          <span className="text-gray-500 text-sm"> / Per Person</span>
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex gap-3 mt-auto">
          <span className="flex-1 bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm text-center cursor-pointer flex items-center justify-center">
            Explore Now
          </span>
          <span className="flex-1 bg-primary text-white py-2.5 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors text-sm text-center cursor-pointer flex items-center justify-center">
            Book Now
          </span>
        </div>
      </div>
    </div>
  );

  if (slug) {
    return (
      <Link href={`/tour-details/${slug}`} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default PackageCard;
