// src/firebase/bookingService.ts
import { db } from './config';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  getDoc
} from 'firebase/firestore';
import { availableSlotsService } from './availableSlotsService';
import { syncService } from './syncService';

// Types
export interface BookingData {
  service: string;
  date: Date;
  time: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
}

// Firebase stores dates as Timestamps, so we need to convert
interface FirestoreBookingData extends Omit<BookingData, 'date' | 'createdAt'> {
  date: Timestamp;
  createdAt: Timestamp;
}

// Collection reference
const bookingsCollection = collection(db, 'bookings');

// Fonction utilitaire pour convertir une date JS en Timestamp Firestore
const dateToFirestoreTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Fonction utilitaire pour convertir un Timestamp Firestore en date JS
const firestoreTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Liste des créneaux horaires disponibles
const allTimeSlots = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Service functions
export const bookingService = {
  // Create a new booking
  async createBooking(bookingData: Omit<BookingData, 'status' | 'createdAt'>): Promise<string> {
    try {
      const isAvailable = await availableSlotsService.isSlotAvailable(bookingData.date, bookingData.time);
      
      if (!isAvailable) {
        throw new Error('Ce créneau n\'est plus disponible');
      }
      
      const booking: FirestoreBookingData = {
        ...bookingData,
        status: 'pending',
        date: dateToFirestoreTimestamp(bookingData.date),
        createdAt: dateToFirestoreTimestamp(new Date())
      };
      
      const docRef = await addDoc(bookingsCollection, booking);

      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Check if a time slot is available
  async checkAvailability(date: Date, time: string): Promise<boolean> {
    try {
      return await availableSlotsService.isSlotAvailable(date, time);
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },

  // Get available time slots for a specific date
  async getAvailableTimeSlots(date: Date, allTimeSlots: string[]): Promise<string[]> {
    try {
      const availableSlots = await availableSlotsService.getAvailableSlotsForDate(date);

      // Si aucun créneau n'est défini, initialiser les créneaux pour cette date
      if (availableSlots.length === 0) {
        await syncService.syncSlotsForDate(date, allTimeSlots);
        const updatedSlots = await availableSlotsService.getAvailableSlotsForDate(date);
        return updatedSlots.map(slot => slot.time);
      }

      return availableSlots.map(slot => slot.time);
    } catch (error) {
      console.error('Error getting available time slots:', error);
      throw error;
    }
  },

  // Get bookings for a specific date
  async getBookingsForDate(date: Date): Promise<Array<BookingData & { id: string }>> {
    try {

      // Convert date to Firestore Timestamp for the start of the day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const startTimestamp = Timestamp.fromDate(startDate);

      // For the end of the day
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const endTimestamp = Timestamp.fromDate(endDate);


      // Query bookings for the specified date
      const q = query(
        bookingsCollection,
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp)
      );

      const querySnapshot = await getDocs(q);

      // Convert Firestore data to our BookingData format
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreBookingData;
        return {
          ...data,
          id: doc.id,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate()
        };
      });
    } catch (error) {
      console.error('Error getting bookings for date:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: BookingData['status']): Promise<void> {
    try {
      // 1. Récupérer la réservation
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);

      if (!bookingSnap.exists()) {
        throw new Error('Réservation non trouvée');
      }

      const bookingData = bookingSnap.data() as FirestoreBookingData;
      const booking: BookingData = {
        ...bookingData,
        date: firestoreTimestampToDate(bookingData.date),
        createdAt: firestoreTimestampToDate(bookingData.createdAt)
      };

      // 2. Mettre à jour le statut
      await updateDoc(bookingRef, { status });

      // 3. Mettre à jour la disponibilité du créneau
      // Si la réservation est annulée, le créneau redevient disponible
      if (status === 'cancelled') {
        await syncService.updateSlotBasedOnBooking(booking, true);
      }
      // Si la réservation est confirmée ou terminée, le créneau reste indisponible
      else if (status === 'confirmed' || status === 'completed') {
        await syncService.updateSlotBasedOnBooking(booking, false);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Get a single booking by ID
  async getBookingById(bookingId: string): Promise<(BookingData & { id: string }) | null> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);

      if (bookingSnap.exists()) {
        const data = bookingSnap.data() as FirestoreBookingData;
        return {
          ...data,
          id: bookingSnap.id,
          date: firestoreTimestampToDate(data.date),
          createdAt: firestoreTimestampToDate(data.createdAt)
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting booking:', error);
      throw error;
    }
  },

  // Cancel a booking
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      // 1. Récupérer les détails de la réservation
      const booking = await bookingService.getBookingById(bookingId);

      if (!booking) {
        throw new Error("Réservation non trouvée");
      }

      // 2. Annuler la réservation
      await bookingService.updateBookingStatus(bookingId, 'cancelled');

      // 3. Rendre le créneau à nouveau disponible
      await availableSlotsService.setSlotAvailability(booking.date, booking.time, true);

      // 4. Afficher un message de succès, etc.

    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      // Gérer l'erreur
    }
  },

  // Delete a booking
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      // 1. Récupérer la réservation avant de la supprimer
      const booking = await this.getBookingById(bookingId);

      if (!booking) {
        throw new Error('Réservation non trouvée');
      }

      // 2. Supprimer la réservation
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);

      // 3. Rendre le créneau à nouveau disponible
      await syncService.updateSlotBasedOnBooking(booking, true);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  // Initialiser les créneaux pour les prochains jours
  async initializeUpcomingSlots(): Promise<void> {
    try {
      await syncService.initializeUpcomingSlots(allTimeSlots, [0]); // Exclure le dimanche (0)
    } catch (error) {
      console.error('Error initializing upcoming slots:', error);
      throw error;
    }
  }
};