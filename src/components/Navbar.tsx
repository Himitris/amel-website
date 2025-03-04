import React, { useState, useEffect } from 'react';
import { Scissors, Menu, X, Phone, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu lors du changement de page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Accueil", href: "/#home" },
    { name: "À Propos", href: "/#about" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "Témoignages", href: "/#testimonials" },
    { name: "FAQ", href: "/#faq" },
    { name: "Contact", href: "/#contact" }
  ];

  const isHomePage = location.pathname === "/";

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollPosition > 50 || !isHomePage ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${scrollPosition > 50 || !isHomePage ? 'bg-silver-100' : 'bg-white/20'} transition-colors`}>
              <Scissors className={`w-6 h-6 ${scrollPosition > 50 || !isHomePage ? 'text-silver-600' : 'text-white'}`} />
            </div>
            <div>
              <span className={`text-xl font-bold ${scrollPosition > 50 || !isHomePage ? 'text-gray-800' : 'text-white'}`}>ACDC</span>
              <span className={`block text-xs ${scrollPosition > 50 || !isHomePage ? 'text-gray-500' : 'text-gray-200'}`}>Amel Coupe des cheveux</span>
            </div>
          </Link>

          {/* Desktop Contact Info */}
          <div className={`hidden xl:flex items-center space-x-4 ${scrollPosition > 50 || !isHomePage ? 'text-gray-700' : 'text-white'}`}>
            <a href="tel:+33600000000" className="flex items-center text-sm hover:text-silver-400 transition-colors">
              <Phone className="w-4 h-4 mr-1" />
              <span>06 00 00 00 00</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className={`text-sm font-medium hover:text-silver-400 transition-colors ${
                  scrollPosition > 50 || !isHomePage ? 'text-gray-700' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
            <Link 
              to="/booking" 
              className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                scrollPosition > 50 || !isHomePage
                  ? 'bg-silver-500 text-white hover:bg-silver-600' 
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
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
              <X className={`w-6 h-6 ${scrollPosition > 50 || !isHomePage ? 'text-gray-800' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrollPosition > 50 || !isHomePage ? 'text-gray-800' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="container mx-auto px-6 py-4 space-y-2">
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
          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link 
              to="/booking" 
              className="flex items-center justify-center w-full text-center bg-silver-500 text-white py-3 rounded-lg font-medium hover:bg-silver-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Réserver un rendez-vous
            </Link>
          </div>
          <div className="pt-4 border-t border-gray-100 mt-2">
            <a 
              href="tel:+33600000000" 
              className="flex items-center justify-center py-3 text-gray-700 hover:text-silver-500"
            >
              <Phone className="w-4 h-4 mr-2" />
              06 00 00 00 00
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;