import React from 'react';
import Image from 'next/image';

interface RecentGalleryProps {
  images?: string[];
}

const RecentGallery: React.FC<RecentGalleryProps> = ({ images }) => {
  // Use provided images or fallback to default
  const defaultImages = [
    'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1544551763-46a42a457118?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=900&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=400&q=80',
    'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&h=400&q=80',
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;

  // Helper to safely get image URL (repeats if not enough images)
  const getImg = (index: number) => displayImages[index % displayImages.length];

  return (
    <section className="w-full py-12">
      <h2 className="text-[40px] font-bold text-center text-[#183B56] mb-12 font-serif">
        Recent Gallery
      </h2>
      
      <div className="flex justify-center items-center gap-4 px-4 h-[500px]">
        {/* Column 1 - Single Image */}
        <div className="flex items-center h-full">
            <div className="relative w-[200px] h-[200px] rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image 
                    src={getImg(0)} 
                    alt="Gallery image 1" 
                    fill 
                    className="object-cover"
                />
            </div>
        </div>

        {/* Column 2 - Stacked Images */}
        <div className="flex flex-col gap-4 h-[80%] justify-center">
             <div className="relative w-[220px] h-[180px] rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image 
                    src={getImg(1)} 
                    alt="Gallery image 2" 
                    fill 
                    className="object-cover"
                />
            </div>
             <div className="relative w-[220px] h-[180px] rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image 
                    src={getImg(2)} 
                    alt="Gallery image 3" 
                    fill 
                    className="object-cover"
                />
            </div>
        </div>

        {/* Column 3 - Center Tall Image */}
        <div className="flex items-center h-full">
            <div className="relative w-[280px] h-[450px] rounded-[3rem] overflow-hidden shadow-xl z-10 hover:scale-105 transition-transform duration-300">
                <Image 
                    src={getImg(3)} 
                    alt="Gallery image 4" 
                    fill 
                    className="object-cover"
                />
            </div>
        </div>

        {/* Column 4 - Stacked Images */}
        <div className="flex flex-col gap-4 h-[80%] justify-center">
             <div className="relative w-[220px] h-[180px] rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image 
                    src={getImg(4)} 
                    alt="Gallery image 5" 
                    fill 
                    className="object-cover"
                />
            </div>
             <div className="relative w-[220px] h-[180px] rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image 
                    src={getImg(5)} 
                    alt="Gallery image 6" 
                    fill 
                    className="object-cover"
                />
            </div>
        </div>

        {/* Column 5 - Single Image */}
        <div className="flex items-center h-full">
            <div className="relative w-[200px] h-[200px] rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image 
                    src={getImg(6)} 
                    alt="Gallery image 7" 
                    fill 
                    className="object-cover"
                />
            </div>
        </div>

      </div>
    </section>
  );
};

export default RecentGallery;
