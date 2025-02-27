import React from 'react';
import { 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  Users,
  Award,
  Scissors,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="relative h-screen bg-gradient-to-r from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 leopard-accent opacity-10"></div>
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Transformez votre style sans quitter votre domicile</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Coiffure à domicile
              <span className="block mt-2 text-silver-300 text-3xl md:text-4xl">Élégance et Expertise où que vous soyez</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 animate-fade-in-delay max-w-xl">
              Transformez votre look dans le confort de votre domicile avec notre service de coiffure personnalisé et professionnel.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-delay-2">
              <Link to="/booking" className="inline-flex items-center justify-center bg-silver-500 hover:bg-silver-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-lg">
                Prendre Rendez-vous
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#services" className="inline-flex items-center justify-center bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all">
                Découvrir nos services
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-white opacity-75 hover:opacity-100">
            <ChevronDown className="w-8 h-8" />
          </a>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-silver-500 rounded-full filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/5 w-96 h-96 bg-silver-400 rounded-full filter blur-[120px] opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-20">
            {[
              { icon: <Users className="w-6 h-6 text-silver-500" />, value: "500+", label: "Clients Satisfaits" },
              { icon: <Award className="w-6 h-6 text-silver-500" />, value: "10+", label: "Années d'Expérience" },
              { icon: <Scissors className="w-6 h-6 text-silver-500" />, value: "5000+", label: "Coupes Réalisées" },
              { icon: <Star className="w-6 h-6 text-silver-500" />, value: "4.9", label: "Note Moyenne" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 p-3 bg-gray-50 rounded-full">
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;