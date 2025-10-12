import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ShieldCheckIcon } from 'lucide-react';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Check if a link is active
  const isActive = path => {
    return location.pathname === path;
  };
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full transform scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                <ShieldCheckIcon className="h-8 w-8 text-blue-600 relative z-10" />
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">
                SafeCareer
              </span>
            </Link>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              首页
            </Link>
            <Link to="/cases" className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/cases') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              案例库
            </Link>
            <Link to="/guide" className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/guide') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}>
              防骗攻略
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200" aria-expanded={isMenuOpen}>
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <XIcon className="block h-6 w-6" aria-hidden="true" /> : <MenuIcon className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'opacity-100 translate-y-0 shadow-lg' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
          <Link to="/" className={`block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
            首页
          </Link>
          <Link to="/cases" className={`block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/cases') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
            案例库
          </Link>
          <Link to="/guide" className={`block px-4 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive('/guide') ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
            防骗攻略
          </Link>
        </div>
      </div>
    </nav>;
};
export default Navbar;