import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="relative pb-16  overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/holiday.svg)',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="max-w-2xl py-8 md:py-12">
          <h2 className="text-white font-serif italic text-4xl md:text-5xl lg:text-6xl leading-tight">
            <span className="block">Let's Make Your</span>
            <span className="block">
              Next Holiday{' '}
              <span className="relative inline-block">
                Amazing
                {/* Decorative underline swash */}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 15C30 5 60 5 100 10C140 15 170 12 198 8"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M5 18C25 12 45 10 80 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
