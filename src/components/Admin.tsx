// Cette solution combine toutes les corrections précédentes
// Remplacez le contenu de votre fichier Admin.tsx par ce code mis à jour

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Check,
  X,
  Loader,
  AlertTriangle,
  Scissors
} from 'lucide-react';
import { bookingService, BookingData } from '../firebase/bookingService';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, doc, getDoc, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { emailService } from '../services/emailService';
import AdminSlotsManager from './AdminSlotsManager';

interface BookingWithId extends BookingData {
  id: string;
}

const Admin: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<BookingWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, login, logout } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithId | null>(null);
  const [selectedDayBookings, setSelectedDayBookings] = useState<BookingWithId[] | null>(null);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);

  // Formats for date display
  const monthYearFormat = { month: 'long', year: 'numeric' } as const;
  const dayFormat = { weekday: 'short', day: 'numeric' } as const;

  useEffect(() => {
    // Initialisez EmailJS lors du chargement du composant
    emailService.init();
  }, []);

  // Dans Admin.tsx
  useEffect(() => {
    if (currentUser) {
      const checkAdminStatus = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      };

      checkAdminStatus();
    }
  }, [currentUser]);

  // Get bookings for the current month
  useEffect(() => {
    if (currentUser) {
      fetchBookingsForMonth();

      // Réinitialiser les sélections
      setSelectedDayBookings(null);
      setSelectedDayDate(null);
      setSelectedBooking(null);
    }
  }, [currentUser]);

  // Fetch bookings when month changes
  useEffect(() => {
    if (currentUser) {
      fetchBookingsForMonth();
    }
  }, [currentDate, currentUser]);

  const mapBookingData = (doc: any): BookingWithId => {
    const data = doc.data();
    return {
      id: doc.id,
      date: data.date.toDate(),
      createdAt: data.createdAt.toDate(),
      service: data.service,
      time: data.time,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      message: data.message,
      status: data.status
    };
  };

  const fetchBookingsForMonth = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    setError(null);

    try {

      // Create a date range for the current month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);

      // Approach 1: Get all bookings at once instead of day by day
      // This requires a composite index on date
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('date', '>=', Timestamp.fromDate(startOfMonth)),
        where('date', '<=', Timestamp.fromDate(endOfMonth))
      );

      const querySnapshot = await getDocs(q);

      const monthBookings: BookingWithId[] = querySnapshot.docs.map(mapBookingData);

      // Suite du fichier Admin.tsx

      setBookings(monthBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);

      // Fallback approach if the direct query fails
      try {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Fallback: Get all bookings
        const bookingsRef = collection(db, 'bookings');
        const allBookingsSnapshot = await getDocs(bookingsRef);

        // Filter locally
        const monthBookings: BookingWithId[] = allBookingsSnapshot.docs
          .map(mapBookingData)
          .filter(booking => {
            const bookingDate = booking.date;
            return bookingDate >= startOfMonth && bookingDate <= endOfMonth;
          });

        setBookings(monthBookings);
      } catch (fallbackErr) {
        console.error('Fallback approach failed:', fallbackErr);
        setError('Impossible de charger les réservations. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sortBookingsByTime = (bookings: BookingWithId[]) => {
    return [...bookings].sort((a, b) => {
      // Convertir les heures en minutes pour comparer facilement
      const timeToMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };

      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(loginForm.email, loginForm.password);
    } catch (err) {
      console.error('Login error:', err);
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle booking status changes
  const updateBookingStatus = async (bookingId: string, newStatus: BookingData['status']) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);

      // Update the local state
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );

      // Récupérer les détails de la réservation
      const booking = bookings.find(b => b.id === bookingId);

      if (booking) {
        // Si le statut est "confirmed", envoyez un email de confirmation
        if (newStatus === 'confirmed') {
          // Envoyer l'email de confirmation
          const emailSent = await emailService.sendConfirmationEmail(booking, bookingId);
          if (emailSent) {
            setSuccessMessage(`La réservation a été confirmée avec succès et un email de confirmation a été envoyé à ${booking.email}.`);
          } else {
            setSuccessMessage(`La réservation a été confirmée, mais l'envoi de l'email a échoué.`);
          }
        }
        // Si le statut est "cancelled", envoyez un email d'annulation
        else if (newStatus === 'cancelled') {
          // Envoyer l'email d'annulation
          const emailSent = await emailService.sendCancellationEmail(booking, bookingId);
          if (emailSent) {
            setSuccessMessage(`La réservation a été annulée avec succès et un email d'annulation a été envoyé à ${booking.email}.`);
          } else {
            setSuccessMessage(`La réservation a été annulée, mais l'envoi de l'email a échoué.`);
          }
        } else {
          setSuccessMessage(`La réservation a été ${newStatus === 'completed' ? 'marquée comme terminée' : 'mise à jour'
            } avec succès.`);
        }
      } else {
        setSuccessMessage(`La réservation a été mise à jour avec succès.`);
      }

      // If we're viewing details, update the selected booking
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }

      // If we're viewing day details, update the bookings for that day
      if (selectedDayBookings && selectedDayDate) {
        const updatedDayBookings = selectedDayBookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        );
        setSelectedDayBookings(updatedDayBookings);
      }

    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Impossible de mettre à jour la réservation. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const openDayDetails = (date: Date) => {
    const dayBookings = getBookingsForDay(date);
    const sortedBookings = sortBookingsByTime(dayBookings);
    setSelectedDayBookings(sortedBookings);
    setSelectedDayDate(date);
  };

  const closeDayDetails = () => {
    setSelectedDayBookings(null);
    setSelectedDayDate(null);
  };

  const openBookingDetails = (booking: BookingWithId) => {
    setSelectedBooking(booking);
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Get the first day of the week (0 = Sunday, 1 = Monday, etc.)
    const startingDayOfWeek = firstDay.getDay();

    // Array to hold calendar days
    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    // Adjust to start week from Monday (1) instead of Sunday (0)
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = 0; i < adjustedStartingDay; i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      calendarDays.push(new Date(year, month, day));
    }

    return calendarDays;
  };

  // Get bookings for a specific day
  const getBookingsForDay = (date: Date) => {
    // S'assurer que la date est correctement traitée
    if (!date) return [];

    return bookings.filter(booking => {
      if (!booking.date) return false;

      const bookingDate = new Date(booking.date);
      const isSameDay =
        bookingDate.getFullYear() === date.getFullYear() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getDate() === date.getDate();

      return isSameDay;
    });
  };

  // Format booking time for display
  const formatTime = (time: string) => {
    return time;
  };

  // Get status class for color coding
  const getStatusClass = (status: BookingData['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label in French
  const getStatusLabel = (status: BookingData['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmé';
      case 'cancelled':
        return 'Annulé';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };

  // Get service name from ID
  const getServiceName = (serviceId: string) => {
    const services: Record<string, string> = {
      'coupe-brushing': 'Coupe & Brushing',
      'coloration': 'Coloration',
      'balayage': 'Balayage',
      'coiffure-evenement': 'Coiffure Événementielle',
      'coupe-homme': 'Coupe Homme',
      'coupe-enfant': 'Coupe Enfant'
    };

    return services[serviceId] || serviceId;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Determine if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Render login form
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Espace Administration</h2>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous pour gérer vos réservations
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Adresse email</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-silver-500 focus:border-silver-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-silver-500 focus:border-silver-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={loginForm.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-silver-600 hover:bg-silver-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-silver-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Connexion en cours...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link to="/" className="text-sm text-silver-600 hover:text-silver-500">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Espace Administration</h1>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm hover:underline">
                Retour au site
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Success message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{successMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccessMessage(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
              <Loader className="animate-spin w-6 h-6 text-silver-500" />
              <p className="text-gray-700">Chargement en cours...</p>
            </div>
          </div>
        )}

        {/* Calendar navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePreviousMonth}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1">Mois précédent</span>
          </button>
          <h2 className="text-2xl font-semibold">
            {currentDate.toLocaleDateString('fr-FR', monthYearFormat)}
          </h2>
          <button
            onClick={handleNextMonth}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <span className="mr-1">Mois suivant</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Days of the week */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
              <div key={index} className="bg-gray-50 text-center py-2 font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {generateCalendarDays().map((date, index) => {
              // Empty cell
              if (!date) {
                return <div key={`empty-${index}`} className="bg-white p-2 h-32 opacity-50"></div>;
              }

              // Day cell with bookings
              const dayBookings = getBookingsForDay(date);
              const sortedBookings = sortBookingsByTime(dayBookings);
              const isCurrentDay = isToday(date);
              const hasBookings = dayBookings.length > 0;

              return (
                <div
                  key={`day-${date.getDate()}`}
                  className={`bg-white p-2 h-32 overflow-y-auto relative ${isCurrentDay ? 'bg-blue-50' : ''} ${hasBookings ? 'cursor-pointer' : ''}`}
                  onClick={() => hasBookings ? openDayDetails(date) : null}
                >
                  <div className={`text-right font-medium mb-2 ${isCurrentDay ? 'text-blue-600' : ''}`}>
                    {date.toLocaleDateString('fr-FR', dayFormat)}
                  </div>
                  <div className="mt-2 space-y-1">
                    {sortedBookings.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Aucune réservation</p>
                    ) : (
                      <>
                        {sortedBookings.slice(0, 2).map(booking => (
                          <div
                            key={booking.id}
                            onClick={(e) => {
                              e.stopPropagation(); // Empêche le déclenchement du onClick du parent
                              openBookingDetails(booking);
                            }}
                            className={`block w-full text-left px-2 py-1 rounded text-xs ${getStatusClass(booking.status)} cursor-pointer hover:brightness-95`}
                          >
                            <div className="font-medium">{booking.time}</div>
                            <div className="truncate">{booking.name}</div>
                            <div className="truncate text-xs">{getServiceName(booking.service)}</div>
                          </div>
                        ))}
                        {sortedBookings.length > 2 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Empêche le déclenchement du onClick du parent
                              openDayDetails(date);
                            }}
                            className="block w-full text-center text-xs py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                          >
                            +{sortedBookings.length - 2} autres
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day details modal */}
        {selectedDayBookings && selectedDayDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-semibold">
                    Rendez-vous du {formatDate(selectedDayDate)}
                  </h3>
                  <button
                    onClick={closeDayDetails}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {selectedDayBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune réservation pour cette journée.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDayBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center p-4 border-b">
                          <div className="flex items-center">
                            <div className="mr-4">
                              <div className="text-lg font-semibold">{booking.time}</div>
                              <div className={`text-sm px-2 py-0.5 rounded-full inline-block ${getStatusClass(booking.status)}`}>
                                {getStatusLabel(booking.status)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-sm text-gray-600">{getServiceName(booking.service)}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => openBookingDetails(booking)}
                            className="px-3 py-1 bg-silver-500 text-white rounded-lg hover:bg-silver-600 text-sm"
                          >
                            Détails
                          </button>
                        </div>

                        <div className="p-4 bg-gray-50 text-sm grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 text-gray-400 mr-2" />
                              <a href={`tel:${booking.phone}`} className="hover:text-silver-600">
                                {booking.phone}
                              </a>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 text-gray-400 mr-2" />
                              <a href={`mailto:${booking.email}`} className="hover:text-silver-600">
                                {booking.email}
                              </a>
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="truncate">{booking.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking details modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">Détails de la réservation</h3>
                  <button
                    onClick={closeBookingDetails}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusClass(selectedBooking.status)}`}>
                    {getStatusLabel(selectedBooking.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-500 mb-2">Informations de réservation</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{formatDate(selectedBooking.date)}</p>
                          <p className="text-sm text-gray-500">Date</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedBooking.time}</p>
                          <p className="text-sm text-gray-500">Heure</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Scissors className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{getServiceName(selectedBooking.service)}</p>
                          <p className="text-sm text-gray-500">Service</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-500 mb-2">Informations client</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <User className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedBooking.name}</p>
                          <p className="text-sm text-gray-500">Nom</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedBooking.phone}</p>
                          <p className="text-sm text-gray-500">Téléphone</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedBooking.email}</p>
                          <p className="text-sm text-gray-500">Email</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">{selectedBooking.address}</p>
                          <p className="text-sm text-gray-500">Adresse</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedBooking.message && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-500 mb-2">Message</h4>
                    <p className="bg-gray-50 p-3 rounded text-gray-700">{selectedBooking.message}</p>
                  </div>
                )}

                <div className="mt-8 border-t pt-6">
                  <h4 className="font-medium text-gray-500 mb-3">Actions</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedBooking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center focus:outline-none"
                          disabled={isLoading}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Confirmer
                        </button>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center focus:outline-none"
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Annuler
                        </button>
                      </>
                    )}

                    {selectedBooking.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center focus:outline-none"
                          disabled={isLoading}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Marquer comme terminé
                        </button>
                        <button
                          onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center focus:outline-none"
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Annuler
                        </button>
                      </>
                    )}

                    {(selectedBooking.status === 'cancelled' || selectedBooking.status === 'completed') && (
                      <button
                        onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center focus:outline-none"
                        disabled={isLoading}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Réactiver
                      </button>
                    )}

                    <a
                      href={`tel:${selectedBooking.phone}`}
                      className="px-4 py-2 bg-silver-500 text-white rounded hover:bg-silver-600 flex items-center focus:outline-none"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Appeler
                    </a>

                    <a
                      href={`mailto:${selectedBooking.email}`}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center focus:outline-none"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Envoyer un email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total du mois', count: bookings.length, icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-500' },
            {
              label: 'En attente',
              count: bookings.filter(b => b.status === 'pending').length,
              icon: <AlertTriangle className="w-5 h-5" />,
              color: 'bg-yellow-500'
            },
            {
              label: 'Confirmées',
              count: bookings.filter(b => b.status === 'confirmed').length,
              icon: <Check className="w-5 h-5" />,
              color: 'bg-green-500'
            },
            {
              label: 'Annulées',
              count: bookings.filter(b => b.status === 'cancelled').length,
              icon: <X className="w-5 h-5" />,
              color: 'bg-red-500'
            }
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className={`${item.color} p-3 rounded-full text-white mr-4`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{item.count}</h3>
                  <p className="text-gray-500">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gestionnaire de créneaux */}
        <div className="mt-12">
          <AdminSlotsManager />
        </div>

      </main>
    </div>
  );
};

export default Admin;