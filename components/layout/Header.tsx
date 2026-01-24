'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const Header: React.FC<{ color?: string }> = ({ color  }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const { items } = useCart();

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Categories', href: '/', hasDropdown: true },
    { label: 'B2B Inquiries', href: '/b2b-corporate' },
    
  ];

  return (
    <header className={`absolute ${color} top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <Image src="/images/logo.webp" alt="Logo" width={190} height={90} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group/dropdown"> 
                {link.hasDropdown ? (
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="relative flex items-center gap-1 text-white font-medium transition-colors pb-1 group"
                    >
                      {link.label}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#DF6951] transition-all duration-300 group-hover:w-full"></span>
                    </button>

                    {/* Desktop Dropdown - Show on hover via CSS group or click */}
                    <div className={`absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl py-2 transition-all transform origin-top-left z-50 ${dropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                       {categories.length > 0 ? (
                          categories.map((cat) => (
                            <Link
                              key={cat._id}
                              href={`/travel-with-us?category=${cat.slug || cat._id}`} // Safer fallback to ID for legacy data
                              className="block px-4 py-3 text-gray-700 hover:bg-[#FFF8F6] hover:text-[#F85E46] transition-colors border-b border-gray-100 last:border-0"
                              onClick={() => setDropdownOpen(false)}
                            >
                               {cat.name}
                            </Link>
                          ))
                       ) : (
                         <div className="px-4 py-3 text-gray-400 text-sm">Loading...</div>
                       )}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="relative text-white font-medium transition-colors pb-1 group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#DF6951] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-2">
            <Link 
              href="/cart"
              className="relative  "
            >
              <div className="bg-white/20 p-1  rounded-full hover:bg-white/30 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {items.length > 0 && (
                  <span className="absolute bottom-7   bg-[#F85E46] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-transparent shadow-sm">
                    {items.length}
                  </span>
                )}
              </div>
            </Link>

            <Link 
              href="https://wa.me/971508778139"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#DF6951] text-white font-semibold rounded-[10px] hover:bg-primary-dark transition-all"
            >
              +971508778139
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md rounded-2xl p-4 mb-4 animate-fade-in">
            {navLinks.map((link) => (
               <div key={link.label}>
                  {link.hasDropdown ? (
                      <div className="py-2">
                          <button 
                             onClick={() => setDropdownOpen(!dropdownOpen)}
                             className="flex items-center justify-between w-full px-4 py-2 text-white hover:bg-white/10 rounded-lg"
                          >
                             {link.label}
                             <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                             </svg>
                          </button>
                          {dropdownOpen && (
                              <div className="pl-8 mt-1 space-y-1">
                                  {categories.map(cat => (
                                      <Link
                                          key={cat._id}
                                          href={`/travel-with-us?category=${cat.slug || cat._id}`}
                                          className="block py-2 px-4 text-gray-300 text-sm hover:text-white"
                                          onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                          {cat.name}
                                      </Link>
                                  ))}
                              </div>
                          )}
                      </div>
                  ) : (
                    <Link
                        href={link.href}
                        className="block py-3 px-4 text-white hover:bg-white/10 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        {link.label}
                    </Link>
                  )}
               </div>
            ))}
            <div className="mt-4 px-4">
              <Link 
                href="https://wa.me/971508778139"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-primary text-white font-semibold rounded-[10px] hover:bg-primary-dark transition-all"
              >
                +971508778139
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
