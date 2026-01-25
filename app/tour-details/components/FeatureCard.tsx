import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="flex items-start gap-4 p-5 border-2 border-[#000000] rounded-xl bg-white">
     
      <div>
        <h4 className="text-base md:text-xl flex items-center font-bold text-[#1E3A5F] mb-1">
           <div className="text-base md:text-xl flex-shrink-0">
        {icon}
      </div>
          {title}
          </h4>
        <p className="text-sm md:text-base text-[#000000] leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
