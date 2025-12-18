import React from 'react';

const ViewPackagesSection = () => {
  return (
    <section 
      className="py-24 lg:py-32"
      style={{
        background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
        backgroundColor: '#888888',
      }}
    >
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-32 lg:gap-64">
          {/* Left Button */}
          <button className="px-8 py-3 border-2 border-white/80 rounded-[10px] text-white font-medium text-sm hover:bg-white/10 transition-all duration-300">
            View Packages
          </button>

          {/* Right Button */}
          <button className="px-8 py-3 border-2 border-white/80 rounded-[10px] text-white font-medium text-sm hover:bg-white/10 transition-all duration-300">
            View Packages
          </button>
        </div>
      </div>
    </section>
  );
};

export default ViewPackagesSection;
