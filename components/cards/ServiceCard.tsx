import React from 'react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="relative bg-white rounded-2xl p-6 text-center group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden">
      {/* Decorative curved element - shows on hover */}
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-[#1a365d] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card content */}
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-[20px] font-semibold text-[#1E1D4C] mb-2">{title}</h3>
        <p className="text-[16px] text-[#5E6282] font-[500] leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
