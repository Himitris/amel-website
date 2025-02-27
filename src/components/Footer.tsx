import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
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
    <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 leopard-accent opacity-5"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Section Informations */}
          <div>
            <h3 className="text-xl font-semibold mb-4">À propos</h3>
            <p className="text-gray-400 mb-6">
              Élégance Coiffure vous propose des services de coiffure à domicile, pour une expérience personnalisée et confortable.
            </p>
            <Link to="/about" className="text-silver-500 hover:text-silver-400 transition-colors">
              En savoir plus
            </Link>
          </div>

          {/* Section Liens rapides */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-silver-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Section Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-silver-500 mr-2" />
                <a href="tel:+33600000000" className="text-gray-400 hover:text-silver-400 transition-colors">
                  06 00 00 00 00
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-silver-500 mr-2" />
                <a href="mailto:contact@coiffure-domicile.fr" className="text-gray-400 hover:text-silver-400 transition-colors">
                  contact@coiffure-domicile.fr
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="w-5 h-5 text-silver-500 mr-2" />
                <span className="text-gray-400">Paris et sa région</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section Réseaux sociaux */}
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Élégance Coiffure - Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
              <Instagram className="w-5 h-5 text-gray-400" />
            </a>
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors">
              <Facebook className="w-5 h-5 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;