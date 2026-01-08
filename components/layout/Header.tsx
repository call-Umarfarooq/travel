'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const Header: React.FC<{ color?: string }> = ({ color  }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { items } = useCart();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services', hasDropdown: true },
    { label: 'Upcoming Packages', href: '/packages' },
  ];

  return (
    <header className={`absolute ${color} top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <Image src="/images/logo.svg" alt="Logo" width={127} height={65} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {link.hasDropdown ? (
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="relative flex items-center gap-1 text-white font-medium transition-colors pb-1 group"
                  >
                    {link.label}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#DF6951] transition-all duration-300 group-hover:w-full"></span>
                  </button>
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
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#DF6951] text-white font-semibold rounded-[10px] hover:bg-primary-dark transition-all"
            >
              Get in Touch
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
          <div className="md:hidden bg-dark/95 backdrop-blur-md rounded-2xl p-4 mb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-4 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 px-4">
              <Link 
                href="/"
                className="block w-full text-center px-6 py-3 bg-primary text-white font-semibold rounded-[10px] hover:bg-primary-dark transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
