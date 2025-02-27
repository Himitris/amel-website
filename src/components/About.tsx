import React from 'react';
import { Clock, MapPin, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="transform transition-all duration-500 hover:scale-105">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-silver-100 text-silver-600 text-sm mb-6">
              <span>À PROPOS</span>
            </div>
            <h2 className="text-4xl font-bold mb-6 relative">
              L'Art de la Coiffure à Domicile
              <span className="absolute bottom-0 left-0 w-20 h-1 bg-silver-500"></span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Avec plus de 10 ans d'expérience dans le domaine de la coiffure, je vous propose mes services directement à votre domicile. Passionnée par mon métier, je m'engage à vous offrir des prestations de qualité salon, dans le confort de votre intérieur.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Formée aux dernières techniques et tendances, je m'adapte à tous les types de cheveux et à toutes les envies. Mon objectif est de vous faire vivre une expérience unique et personnalisée.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Pourquoi choisir une coiffeuse itinérante ?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-silver-100 rounded-full mt-1">
                    <Clock className="w-5 h-5 text-silver-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Gain de temps et flexibilité</h4>
                    <p className="text-sm text-gray-500">Fini les déplacements et l'attente en salon. Je m'adapte à votre emploi du temps.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-silver-100 rounded-full mt-1">
                    <MapPin className="w-5 h-5 text-silver-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Service à domicile personnalisé</h4>
                    <p className="text-sm text-gray-500">Une attention individuelle et des conseils adaptés à votre style de vie.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-2 bg-silver-100 rounded-full mt-1">
                    <Heart className="w-5 h-5 text-silver-500" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Confort et intimité garantis</h4>
                    <p className="text-sm text-gray-500">Profitez d'un moment de détente dans votre environnement familier.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-silver-400 to-silver-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 border-2 border-silver-200 rounded-lg z-0"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 border-2 border-silver-200 rounded-lg z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Coiffeuse au travail" 
                className="relative rounded-lg shadow-xl z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;