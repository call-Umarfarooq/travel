'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: "Dubai Desert Safari Experience, Adventure, Culture, and Entertainment",
      image: "/images/disert.webp",
      content: [
        "A Dubai desert safari is one of the most popular experiences for visitors to the UAE, offering a perfect mix of adventure, culture, and entertainment. This iconic experience takes you away from the city into the golden sand dunes of Dubai, creating memories that last a lifetime.",
        "Your desert safari tour in Dubai begins with a comfortable pickup in a 4x4 vehicle, followed by an exciting dune bashing Dubai session driven by licensed professionals. Riding over the rolling dunes delivers adrenaline and breathtaking desert views that make this adventure truly unforgettable.",
        "After dune bashing, guests can enjoy activities such as sandboarding, camel riding, and scenic photo stops during the desert sunset. These moments offer incredible photography opportunities and a chance to experience the peaceful beauty of the Arabian desert.",
        "The evening continues at a traditional Bedouin style camp, where guests enjoy a full desert safari with BBQ dinner. Live performances such as belly dance, Tanoura dance, and fire shows create a vibrant atmosphere. Henna painting, shisha, and Arabic hospitality add cultural charm to the experience.",
        "From evening desert safari Dubai packages to VIP desert safari options with premium seating and exclusive services, there is a tour suitable for every traveler. With Desert Smart Tourism, you can enjoy a safe, comfortable, and authentic desert safari experience in Dubai."
      ],
      tags: ["Adventure", "Culture", "Safari"]
    },
    {
      id: 2,
      title: "Old Dubai and Emirati Culture, Discover the Heritage of the UAE",
      image: "/images/customtover.svg",
      content: [
        "While Dubai is famous for its modern skyline, exploring Old Dubai reveals the city’s rich cultural heritage and traditional way of life. A journey through historic neighborhoods offers visitors a deeper understanding of Dubai culture and the roots of the UAE.",
        "One of the most important heritage areas is the Al Fahidi Historical Neighborhood, also known as Bastakiya. This district showcases traditional wind tower architecture, narrow alleyways, and restored homes that reflect early Emirati living. Museums and cultural centers provide valuable insight into Dubai’s history.",
        "A visit to Dubai Creek is essential when exploring traditional Dubai. Wooden abras continue to operate as they have for generations, offering an authentic experience of daily life. Nearby Deira souks and Bur Dubai markets are famous for gold, spices, perfumes, and textiles, attracting visitors from around the world.",
        "Modern heritage destinations like Al Seef blend history with contemporary comfort, making them ideal for cultural exploration. Guided Dubai heritage tours help travelers learn about Emirati traditions, hospitality, and customs in a meaningful way.",
        "Exploring traditional Dubai allows visitors to connect with the past while appreciating the city’s remarkable growth. With Desert Smart Tourism, discovering Old Dubai becomes an educational and enriching cultural experience."
      ],
      tags: ["Heritage", "Culture", "History"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header color="bg-transparent" />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
         
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-20">
          <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 opacity-90 font-medium">
            Stories & Insights
          </p>
          <h1 className="text-5xl md:text-7xl font-serif italic font-normal mb-6">
            Travel Journal
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
            Discover the hidden gems, culture, and adventures of the UAE through our curated stories.
          </p>
        </div>
      </section>

      {/* Blog Posts Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col gap-24">
          {posts.map((post, index) => (
            <article 
              key={post.id} 
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Container */}
              <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur-sm text-[#DF6951] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Container */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#181E4B] mb-6 leading-tight">
                  {post.title}
                </h2>
                <div className="w-20 h-1 bg-[#DF6951] mb-8" />
                
                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  {post.content.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between text-sm text-gray-400">
                  <span className='font-medium text-[#DF6951]'>By Desert Smart Tourism</span>
           
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Newsletter / CTA */}
      <section className="bg-[#FFF8F6] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#181E4B] mb-4">
            Start Your Own Adventure
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Inspired by our stories? Book your next unforgettable experience in Dubai with us today.
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#DF6951] text-white font-semibold rounded-full shadow-lg hover:bg-[#c85a43] transition-all transform hover:-translate-y-1"
          >
            Explore Packages
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPage;
