import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  return (
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
                  <Clock className="w-5 h-5" />
                  <span>Prendre rendez-vous en ligne</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;