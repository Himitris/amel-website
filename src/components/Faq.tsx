import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';

const Faq: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

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

  return (
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
  );
};

export default Faq;