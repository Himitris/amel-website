import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Heart,
  Instagram,
  Facebook,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Award,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

function App() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const faqs = [
    {
      question: "Quelle zone géographique couvrez-vous ?",
      answer: "Je me déplace dans un rayon de 30 km autour de Paris. Pour les zones plus éloignées, des frais de déplacement supplémentaires peuvent s'appliquer."
    },
    {
      question: "Faites-vous des coiffures pour les mariages et événements spéciaux ?",
      answer: "Absolument ! Je propose des forfaits spéciaux pour les mariées et leurs invités. Je peux me déplacer directement sur le lieu de l'événement pour plus de commodité."
    },
    {
      question: "Quels sont vos tarifs ?",
      answer: "Mes tarifs commencent à 45€ pour une coupe femme avec brushing, 60€ pour une coloration, et les coiffures événementielles sont sur devis personnalisé. N'hésitez pas à me contacter pour un devis précis adapté à vos besoins."
    },
    {
      question: "Comment se déroule une séance à domicile ?",
      answer: "J'apporte tout le matériel nécessaire (fauteuil, produits, outils). Je vous demande simplement un point d'eau accessible et un espace suffisant. La séance dure entre 1h et 2h selon la prestation."
    },
    {
      question: "Acceptez-vous les paiements par carte bancaire ?",
      answer: "Oui, j'accepte les paiements par carte bancaire, espèces, et virement bancaire pour votre commodité."
    }
  ];

  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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

      {/* À propos */}
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

      {/* Services */}
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

      {/* Galerie / Portfolio */}
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

      {/* Témoignages */}
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

      {/* Booking CTA */}
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

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-silver-100 text-silver-600 text-sm mb-6">
              <span>FAQ</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">Questions Fréquentes</h2>
            <p className="text-gray-600">Tout ce que vous devez savoir sur nos services de coiffure à domicile.</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border-b border-gray-100 last:border-b-0 transition-colors ${
                    activeFaq === index ? 'bg-gray-50' : ''
                  }`}
                >
                  <button 
                    className="flex justify-between items-center w-full text-left font-semibold py-5 px-6 focus:outline-none"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={activeFaq === index}
                  >
                    <span className="pr-8">{faq.question}</span>
                    <div className={`flex-shrink-0 p-2 rounded-full transition-colors ${
                      activeFaq === index ? 'bg-silver-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {activeFaq === index ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  <div 
                    className={`px-6 transition-all duration-300 overflow-hidden ${
                      activeFaq === index ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Vous avez d'autres questions ?</p>
              <a 
                href="#contact" 
                className="inline-flex items-center text-silver-500 hover:text-silver-600 font-medium"
              >
                Contactez-moi directement
                <ArrowRight className="ml-1 w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-silver-100 text-silver-600 text-sm mb-6">
              <span>CONTACT</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">Contactez-moi</h2>
            <p className="text-gray-600">Besoin d'informations supplémentaires ? N'hésitez pas à me contacter.</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold mb-6">Informations de contact</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-silver-100 rounded-full">
                      <Phone className="w-5 h-5 text-silver-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Téléphone</h4>
                      <a href="tel:+33600000000" className="text-lg font-medium hover:text-silver-500 transition-colors">
                        06 00 00 00 00
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-silver-100 rounded-full">
                      <Mail className="w-5 h-5 text-silver-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                      <a href="mailto:contact@coiffure-domicile.fr" className="text-lg font-medium hover:text-silver-500 transition-colors">
                        contact@coiffure-domicile.fr
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-silver-100 rounded-full">
                      <MapPin className="w-5 h-5 text-silver-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Zone d'intervention</h4>
                      <p className="text-lg font-medium">
                        Paris et région parisienne (30km)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-3 bg-silver-100 rounded-full">
                      <Clock className="w-5 h-5 text-silver-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Horaires</h4>
                      <p className="text-lg font-medium">
                        Lun-Sam: 9h00 - 19h00
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="font-medium mb-4">Suivez-moi</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-silver-100 transition-colors">
                      <Instagram className="w-5 h-5 text-gray-700" />
                    </a>
                    <a href="#" className="p-3 bg-gray-100 rounded-full hover:bg-silver-100 transition-colors">
                      <Facebook className="w-5 h-5 text-gray-700" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-semibold mb-6">Contactez-moi rapidement</h3>
                
                <div className="flex flex-col space-y-4">
                  <a 
                    href="tel:+33600000000" 
                    className="flex items-center justify-center space-x-3 bg-silver-500 text-white py-4 px-6 rounded-lg hover:bg-silver-600 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Appeler maintenant</span>
                  </a>
                  <a 
                    href="https://wa.me/33600000000" 
                    className="flex items-center justify-center space-x-3 bg-green-500 text-white py-4 px-6 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                  <a 
                    href="mailto:contact@coiffure-domicile.fr" 
                    className="flex items-center justify-center space-x-3 bg-gray-800 text-white py-4 px-6 rounded-lg hover:bg-gray-900 transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Envoyer un email</span>
                  </a>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <Link 
                    to="/booking" 
                    className="flex items-center justify-center space-x-3 bg-white border-2 border-silver-500 text-silver-500 py-4 px-6 rounded-lg hover:bg-silver-50 transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Prendre rendez-vous en ligne</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 leopard-accent opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12"> {/* Section Informations */} <div> <h3 className="text-xl font-semibold mb-4">À propos</h3> <p className="text-gray-400 mb-6"> Élégance Coiffure vous propose des services de coiffure à domicile, pour une expérience personnalisée et confortable. </p> <Link to="/about" className="text-silver-500 hover:text-silver-400 transition-colors"> En savoir plus </Link> </div>        {/* Section Liens rapides */}
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
</div>
); }

export default App;