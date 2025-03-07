import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Check,
  Loader
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../firebase/bookingService';
import availableSlotsService from '../firebase/availableSlotsService';
import syncService from '../firebase/syncService';

interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
}

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const services: Service[] = [
    { id: 'coupe-brushing', name: 'Coupe & Brushing', price: '45€', duration: '1h' },
    { id: 'coloration', name: 'Coloration', price: '60€', duration: '1h30' },
    { id: 'balayage', name: 'Balayage', price: '80€', duration: '2h' },
    { id: 'coiffure-evenement', name: 'Coiffure Événementielle', price: 'Sur devis', duration: 'Variable' },
    { id: 'coupe-homme', name: 'Coupe Homme', price: '30€', duration: '45min' },
    { id: 'coupe-enfant', name: 'Coupe Enfant', price: '25€', duration: '30min' },
  ];

  const allTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  // Générer des dates pour les 14 prochains jours
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const availableDates = generateDates();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep(2);
  };

  const handleDateSelect = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    setSelectedDate(date);

    try {
      // Utilisez la nouvelle méthode qui vérifie à la fois availableSlots et bookings
      const availableSlots = await availableSlotsService.getActuallyAvailableSlotsForDate(date);

      // Si aucun créneau n'est défini, initialiser avec les créneaux par défaut
      if (availableSlots.length === 0) {
        // Afficher un message ou proposer de choisir une autre date
        setAvailableTimeSlots([]);
      } else {
        setAvailableTimeSlots(availableSlots.map(slot => slot.time));
      }

      setStep(3);
    } catch (err) {
      console.error('Error fetching available time slots:', err);
      setError("Impossible de charger les créneaux disponibles. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedDate || !selectedTime) {
      setError("Informations de réservation incomplètes");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Vérifier si le créneau est encore disponible
      const isAvailable = await availableSlotsService.isSlotAvailable(selectedDate, selectedTime);

      if (!isAvailable) {
        setError("Ce créneau n'est plus disponible. Veuillez en choisir un autre.");
        setStep(3);
        setIsLoading(false);
        return;
      }

      // 2. Créer la réservation (mais sans tenter de modifier availableSlots)
      const newBookingId = await bookingService.createBooking({
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        ...formData
      });

      // 3. Ne pas essayer de mettre à jour directement availableSlots ici

      setBookingId(newBookingId);
      setIsSubmitted(true);

    } catch (err) {
      setError("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const getSelectedServiceName = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.name : '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-semibold">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Réservez votre séance</h1>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-medium">Erreur: </strong><span>{error}</span>
          </div>
        )}

        {!isSubmitted ? (
          <>
            {/* Progress Steps */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="flex justify-between">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`relative flex flex-col items-center ${i < step ? 'text-silver-600' : i === step ? 'text-silver-500' : 'text-gray-400'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${i < step
                        ? 'bg-silver-500 border-silver-500 text-white'
                        : i === step
                          ? 'border-silver-500 text-silver-500'
                          : 'border-gray-300 text-gray-400'
                        }`}
                    >
                      {i < step ? <Check className="w-5 h-5" /> : i}
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      {i === 1 && 'Service'}
                      {i === 2 && 'Date'}
                      {i === 3 && 'Heure'}
                      {i === 4 && 'Coordonnées'}
                    </div>
                    {i < 4 && (
                      <div
                        className={`absolute top-5 w-full h-0.5 left-1/2 ${i < step ? 'bg-silver-500' : 'bg-gray-300'}`}
                        style={{ width: 'calc(100% - 2.5rem)', left: '50%' }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
                  <Loader className="animate-spin w-6 h-6 text-silver-500" />
                  <p className="text-gray-700">Chargement en cours...</p>
                </div>
              </div>
            )}

            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Choisissez votre service</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service.id)}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-silver-300 focus:outline-none focus:border-silver-500"
                    >
                      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                      <div className="flex justify-between text-gray-600">
                        <span>{service.price}</span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date Selection */}
            {step === 2 && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center text-silver-600 hover:text-silver-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour
                  </button>
                  <h2 className="text-2xl font-semibold text-center">Choisissez une date</h2>
                  <div className="w-24"></div> {/* Spacer for centering */}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {availableDates.map((date, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        disabled={isLoading}
                        className="p-3 rounded-lg border-2 border-transparent hover:border-silver-300 focus:outline-none focus:border-silver-500 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="text-sm font-medium text-gray-500">
                          {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </div>
                        <div className="text-lg font-bold">
                          {date.getDate()}
                        </div>
                        <div className="text-sm">
                          {date.toLocaleDateString('fr-FR', { month: 'short' })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Time Selection */}
            {step === 3 && selectedDate && (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center text-silver-600 hover:text-silver-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour
                  </button>
                  <h2 className="text-2xl font-semibold text-center">
                    Choisissez une heure pour le {formatDate(selectedDate)}
                  </h2>
                  <div className="w-24"></div> {/* Spacer for centering */}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {availableTimeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className="py-3 px-4 rounded-lg border-2 border-transparent hover:border-silver-300 focus:outline-none focus:border-silver-500 text-center transition-colors flex items-center justify-center"
                        >
                          <Clock className="w-4 h-4 mr-2 text-silver-500" />
                          <span className="font-medium">{time}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Aucun créneau disponible pour cette date.</p>
                      <button
                        onClick={() => setStep(2)}
                        className="px-4 py-2 bg-silver-500 text-white rounded-lg hover:bg-silver-600 transition-colors"
                      >
                        Choisir une autre date
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Contact Information */}
            {step === 4 && selectedDate && selectedTime && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => setStep(3)}
                    className="flex items-center text-silver-600 hover:text-silver-800"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Retour
                  </button>
                  <h2 className="text-2xl font-semibold text-center">Vos coordonnées</h2>
                  <div className="w-24"></div> {/* Spacer for centering */}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Récapitulatif de votre réservation</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Service</p>
                        <p className="font-medium">{getSelectedServiceName()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(selectedDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Heure</p>
                        <p className="font-medium">{selectedTime}</p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-silver-500 focus:border-silver-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-silver-500 focus:border-silver-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-silver-500 focus:border-silver-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                          Adresse *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-silver-500 focus:border-silver-500"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message (optionnel)
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-silver-500 focus:border-silver-500"
                        placeholder="Précisez vos besoins spécifiques ou toute information utile..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-silver-500 hover:bg-silver-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ?
                        <span className="flex items-center justify-center">
                          <Loader className="animate-spin w-5 h-5 mr-2" />
                          Traitement en cours...
                        </span>
                        : 'Confirmer la réservation'
                      }
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Réservation confirmée !</h2>
              <p className="text-gray-600 mb-6">
                Merci pour votre réservation. Un email de confirmation a été envoyé à {formData.email}.
                Je vous contacterai prochainement pour confirmer les détails.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Récapitulatif</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Service</p>
                    <p className="font-medium">{getSelectedServiceName()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-medium">{selectedDate && formatDate(selectedDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Heure</p>
                    <p className="font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>
              {bookingId && (
                <p className="text-sm text-gray-500 mb-6">
                  Référence de réservation: <span className="font-mono font-medium">{bookingId}</span>
                </p>
              )}
              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/"
                  className="inline-block bg-silver-500 hover:bg-silver-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Retour à l'accueil
                </Link>
                <button
                  onClick={() => window.print()}
                  className="inline-block border border-silver-500 text-silver-500 hover:bg-silver-50 py-3 px-6 rounded-lg font-semibold transition-colors"
                >
                  Imprimer confirmation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Options */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8">Besoin d'aide avec votre réservation ?</h2>
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <a
                href="tel:+33600000000"
                className="flex-1 flex items-center justify-center space-x-2 bg-white py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Phone className="w-5 h-5 text-silver-500" />
                <span>Appeler</span>
              </a>
              <a
                href="https://wa.me/33600000000"
                className="flex-1 flex items-center justify-center space-x-2 bg-white py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <MessageCircle className="w-5 h-5 text-green-500" />
                <span>WhatsApp</span>
              </a>
              <a
                href="mailto:contact@coiffure-domicile.fr"
                className="flex-1 flex items-center justify-center space-x-2 bg-white py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Mail className="w-5 h-5 text-gray-700" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;