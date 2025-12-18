import React from 'react';
import Image from 'next/image';

const EuropeToursSection: React.FC = () => {
  const tourCards = [
    { image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=400&fit=crop', price: '$700', title: 'London' },
    { image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=400&fit=crop', price: '$800', title: 'Rome' },
    { image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=300&h=400&fit=crop', price: '$500', title: 'London Bridge' },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Left Content */}
          <div>
            {/* Subtitle */}
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">
              PROMOTION
            </span>
            
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark leading-tight mb-6">
              We Provide You Best
              Europe Sightseeing
              Tours
            </h2>
            
            {/* Description */}
            <p className="text-gray-500 text-base mb-8 leading-relaxed ">
              Et labore harum non nobis ipsum eum molestias mollitia et corporis praesentium a laudantium internos. Non quis eius quo eligendi corrupti et fugiat nulla qui soluta recusandae in maxime quasi aut ducimus illum aut optio quibusdam!
            </p>

            {/* View Packages Button */}
            <button className="bg-primary text-white px-8 py-3 rounded-[10px] font-medium hover:bg-primary-dark transition-colors mb-12">
              View Packages
            </button>

            {/* Tour Cards */}
            <div className="flex gap-4">
              {tourCards.map((card, index) => (
                <div 
                  key={index} 
                  className="relative w-36 h-44 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {card.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Curved Image */}
          <div className="relative flex justify-end items-end h-full">             
            <div 
              className="relative w-[552px] h-[650px] overflow-hidden"
            >
              <Image
                src="/images/breath-taking.png"
                alt="Breath Taking Views - Eiffel Tower"
                fill
                className="object-fill"
              />
            </div>
          </div>
         
        </div>
      </div>
    </section>
  );
};

export default EuropeToursSection;
