import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-silver-100 text-silver-600 text-sm mb-6">
            <span>PORTFOLIO</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">Découvrez nos réalisations</h2>
          <p className="text-gray-600">Avant/Après de nos transformations capillaires les plus marquantes.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              before: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              after: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              title: "Transformation Complète",
              description: "Coupe, coloration et brushing"
            },
            {
              before: "https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              after: "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              title: "Balayage Naturel",
              description: "Technique de balayage subtil"
            },
            {
              before: "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              after: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              title: "Coiffure de Mariage",
              description: "Chignon élégant pour cérémonie"
            }
          ].map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative h-96 w-full overflow-hidden">
                <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out group-hover:translate-x-full">
                  <img 
                    src={item.before} 
                    alt={`Avant - ${item.title}`} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                    AVANT
                  </div>
                </div>
                <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out -translate-x-full group-hover:translate-x-0">
                  <img 
                    src={item.after} 
                    alt={`Après - ${item.title}`} 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-silver-500 text-white text-xs px-3 py-1 rounded-full">
                    APRÈS
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-silver-200 mb-3">{item.description}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-1 bg-silver-400 rounded-full mr-2"></div>
                    <p className="text-sm opacity-80">Passez le curseur pour voir l'après</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/booking" className="inline-flex items-center justify-center bg-silver-500 hover:bg-silver-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg">
            Réserver votre transformation
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;