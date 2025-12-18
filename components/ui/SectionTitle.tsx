import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = true,
  light = false,
  className = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      {subtitle && (
        <p className={`text-[18px] font-poppins font-semibold uppercase tracking-wider mb-2 ${light ? 'text-white/80' : 'text-primary'}`}>
          {subtitle}
        </p>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-[50px] font-volkhov font-bold leading-tight ${light ? 'text-white' : 'text-[#181E4B]'}`}>
        {title}
      </h2>
    
    </div>
  );
};

export default SectionTitle;
