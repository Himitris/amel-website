import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingCta: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 leopard-accent opacity-5"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-silver-500 rounded-full filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-silver-400 rounded-full filter blur-[100px] opacity-20"></div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Prêt(e) à transformer votre look ?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Prenez rendez-vous en quelques clics et je me déplace chez vous pour une expérience de coiffure personnalisée.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/booking" 
              className="inline-flex items-center justify-center bg-silver-500 hover:bg-silver-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
            >
              Me contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCta;