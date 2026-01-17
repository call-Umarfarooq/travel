import React from "react";
import Image from "next/image";
import { TourPackage } from "../types";
import Link from "next/link";

interface PackageCardProps {
  data: TourPackage;
  isHighlighted?: boolean;
}

const TourPackageCard: React.FC<PackageCardProps> = ({ data, isHighlighted = false }) => {
  return (
    <Link href={`/tour-details/${data.slug}`} className={`group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-xl p-2    'hover:bg-white'}`}>
      {/* Image Container */}
      <div className="relative h-44 w-full overflow-hidden rounded-lg">
        <Image
          src={data.image}
          alt={data.city}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Date Badge - Top Left */}
        <div className="absolute top-2 left-2 bg-[#F85E46] text-white text-[9px] font-medium px-2 py-0.5 rounded">
          {data.date}
        </div>

        {/* Reviews Badge - Top Right */}
        <div className="absolute top-2 right-2 bg-white text-gray-600 text-[9px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          {data.reviews}+ People
        </div>
      </div>

      {/* Content - Below Image */}
      <div className="pt-3 px-1">
        <h3 className="text-sm font-bold text-gray-800 mb-1">{data.city}</h3>
        <p className="text-gray-400 text-[11px] mb-2 leading-relaxed line-clamp-2">
          {data.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-[#F85E46] font-bold text-xs">{data.price} AED</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-[10px]">★</span>
            <span className="text-gray-500 text-[10px]">{data.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourPackageCard;
