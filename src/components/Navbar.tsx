import React, { useState, useEffect } from 'react';
import { Scissors, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", href: "#home" },
    { name: "À Propos", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Témoignages", href: "#testimonials" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollPosition > 50 ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Scissors className={`w-8 h-8 ${scrollPosition > 50 ? 'text-silver-600' : 'text-white'}`} />
            <span className={`text-xl font-bold ${scrollPosition > 50 ? 'text-gray-800' : 'text-white'}`}>Élégance</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                className={`text-sm font-medium hover:text-silver-400 transition-colors ${
                  scrollPosition > 50 ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/booking" 
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                scrollPosition > 50 
                  ? 'bg-silver-500 text-white hover:bg-silver-600' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              Réserver
            </Link>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${scrollPosition > 50 ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrollPosition > 50 ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-6 py-4 space-y-3">
          {navLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.href} 
              className="block py-2 text-gray-700 hover:text-silver-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <Link 
            to="/booking" 
            className="block w-full text-center bg-silver-500 text-white py-3 rounded-lg font-medium hover:bg-silver-600 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Réserver
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;