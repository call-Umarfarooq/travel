import React from 'react';
import Image from 'next/image';

interface CategoryCardProps {
  image: string;
  title: string;
  tours?: string;
  size?: 'small' | 'medium' | 'large';
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  image, 
  title, 
  tours,
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-80',
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-2xl overflow-hidden group cursor-pointer`}>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        {tours && <p className="text-sm text-white/80">{tours}</p>}
      </div>
    </div>
  );
};

export default CategoryCard;
