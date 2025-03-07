import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { bookingService } from './firebase/bookingService';
import availableSlotsService from './firebase/availableSlotsService';

function App() {
  // Initialisation des créneaux disponibles au démarrage de l'app
  useEffect(() => {
    const initializeSlots = async () => {
      try {
        // Vérifier s'il y a déjà des créneaux pour les prochains jours
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const tomorrowSlots = await availableSlotsService.getSlotsForDate(tomorrow);
        
        // Si aucun créneau n'est défini pour demain, initialiser les créneaux
        if (tomorrowSlots.length === 0) {
          await bookingService.initializeUpcomingSlots();
        }
      } catch (error) {
        console.error('Error checking slots:', error);
      }
    };
  
    initializeSlots();
  }, []);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Nous protégeons simplement l'accès au panneau d'administration */}
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;