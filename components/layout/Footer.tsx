import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const destinations = [
    'Maldives',
    'Los Angeles',
    'Las Vegas',
    'Toronto',
  ];

  return (
    <footer className="bg-[#FFFFFF] relative overflow-hidden">
      {/* Background decoration on right */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-1/3 bg-contain bg-right bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(/images/footer-bg.svg)',
        }}
      />

      <div className="container-custom py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-gray-800 font-serif">Travel</span>
                <svg className="w-4 h-4 text-[#F85E46]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Travel helps companies manage payments easily.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {/* LinkedIn */}
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-800 hover:text-[#F85E46] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-800 hover:text-[#F85E46] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-800 hover:text-[#F85E46] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              {/* Flickr */}
              <a href="#" className="w-8 h-8 flex items-center justify-center text-gray-800 hover:text-[#F85E46] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6" cy="12" r="4"/>
                  <circle cx="18" cy="12" r="4"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-gray-800 font-bold mb-5">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#F85E46] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-gray-800 font-bold mb-5">Destinations</h3>
            <ul className="space-y-3">
              {destinations.map((dest) => (
                <li key={dest}>
                  <Link
                    href="/destinations"
                    className="text-gray-400 text-sm hover:text-[#F85E46] transition-colors"
                  >
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gray-800 font-bold mb-5">Join Our Newsletter</h3>
            <form className="flex gap-0 mb-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-l-lg text-sm text-gray-600 placeholder:text-gray-400 focus:outline-none focus:border-[#F85E46] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#F85E46] text-white font-medium text-sm rounded-r-lg hover:bg-[#e54d36] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-gray-400 text-xs leading-relaxed">
              * Will send you weekly updates for your better tour packages.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
