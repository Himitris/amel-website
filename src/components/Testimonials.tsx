import React, { useState } from 'react';
import { Star, ChevronUp, ChevronDown } from 'lucide-react';

const Testimonials: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sophie Martin",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      rating: 5,
      text: "Un service exceptionnel ! Marie s'est déplacée chez moi pour une coupe et un balayage. Le résultat est magnifique et j'ai adoré ne pas avoir à me déplacer."
    },
    {
      name: "Thomas Dubois",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      rating: 5,
      text: "Très professionnel et pratique. J'ai pu obtenir une coupe pendant ma pause déjeuner sans quitter mon bureau. Je recommande vivement !"
    },
    {
      name: "Émilie Rousseau",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      rating: 4,
      text: "Service impeccable pour mon mariage. Toute ma famille a été coiffée à domicile et le résultat était parfait pour les photos."
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-silver-300 rounded-full filter blur-[100px] opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-silver-300 rounded-full filter blur-[100px] opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-silver-100 text-silver-600 text-sm mb-6">
            <span>TÉMOIGNAGES</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">Ce que disent nos clients</h2>
          <p className="text-gray-600">Découvrez les expériences de nos clients satisfaits.</p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-silver-100 rounded-bl-full opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-silver-100 rounded-tr-full opacity-50"></div>
            
            <div className="flex flex-col md:flex-row items-center relative z-10">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-silver-300 shadow-lg">
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="flex mb-3">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4 text-lg">"{testimonials[activeTestimonial].text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-0.5 bg-silver-300 mr-3"></div>
                  <p className="font-semibold">{testimonials[activeTestimonial].name}</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {testimonials.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index 
                      ? 'bg-silver-500 w-6' 
                      : 'bg-silver-300'
                  }`}
                  aria-label={`Voir le témoignage ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 bg-white rounded-full p-3 shadow-lg hover:bg-silver-100 transition-colors"
            aria-label="Témoignage précédent"
          >
            <ChevronUp className="w-6 h-6 transform rotate-90" />
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 bg-white rounded-full p-3 shadow-lg hover:bg-silver-100 transition-colors"
            aria-label="Témoignage suivant"
          >
            <ChevronDown className="w-6 h-6 transform rotate-90" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;