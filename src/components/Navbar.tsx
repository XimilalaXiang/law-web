import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, ShieldCheckIcon } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/cases', label: '案例库' },
    { path: '/guide', label: '反诈指南' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-md border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--primary)]/20 rounded-lg transform scale-110 group-hover:scale-125 transition-transform duration-300 blur-sm"></div>
              <ShieldCheckIcon className="h-7 w-7 md:h-8 md:w-8 text-[var(--primary)] relative z-10" />
            </div>
            <span className="ml-3 text-lg md:text-xl font-semibold text-white tracking-tight">
              SafeCareer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link transition-colors duration-200 ${
                    isActive(link.path) ? 'nav-link-active' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors duration-200"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Content */}
        <div className={`relative z-10 py-8 px-6 transition-transform duration-300 ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-4'
        }`}>
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`font-mono text-lg uppercase tracking-wider py-3 transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-[var(--primary)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
