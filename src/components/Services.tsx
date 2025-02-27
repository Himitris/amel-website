import React from 'react';
import { Scissors, Star, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-silver-300 rounded-full filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-silver-300 rounded-full filter blur-[100px] opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-silver-100 text-silver-600 text-sm mb-6">
            <span>NOS SERVICES</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">Des prestations sur mesure pour sublimer votre beauté</h2>
          <p className="text-gray-600">Découvrez l'ensemble de nos services de coiffure à domicile, adaptés à vos besoins et à vos envies.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Coupe & Brushing",
              price: "À partir de 45€",
              icon: <Scissors className="w-8 h-8" />,
              description: "Coupe personnalisée selon votre visage et style, suivie d'un brushing professionnel.",
              features: ["Consultation personnalisée", "Shampooing et soin", "Coupe adaptée", "Brushing"]
            },
            {
              title: "Coloration",
              price: "À partir de 60€",
              icon: <Star className="w-8 h-8" />,
              description: "Colorations de qualité salon, adaptées à vos envies et à votre teint.",
              features: ["Diagnostic couleur", "Produits premium", "Application précise", "Soin après-coloration"]
            },
            {
              title: "Coiffure Événementielle",
              price: "Sur devis",
              icon: <Heart className="w-8 h-8" />,
              description: "Coiffures élégantes pour mariages, soirées et occasions spéciales.",
              features: ["Essai préalable", "Techniques avancées", "Accessoires inclus", "Tenue longue durée"]
            }
          ].map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group"
            >
              <div className="p-4 bg-silver-100 rounded-full inline-block mb-6 group-hover:bg-silver-200 transition-colors">
                <div className="text-silver-500 group-hover:text-silver-600 transition-colors">{service.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-silver-400 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-silver-600 font-bold">{service.price}</p>
                <Link to="/booking" className="text-silver-500 hover:text-silver-600 font-medium text-sm flex items-center">
                  Réserver
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;