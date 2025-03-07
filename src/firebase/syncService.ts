// src/firebase/syncService.ts
import { bookingService, BookingData } from './bookingService';
import { availableSlotsService } from './availableSlotsService';

/**
 * Service pour synchroniser les réservations avec les créneaux disponibles
 */
export const syncService = {
  /**
   * Met à jour la disponibilité d'un créneau en fonction d'une réservation
   */
  async updateSlotBasedOnBooking(booking: BookingData, isAvailable: boolean): Promise<void> {
    try {
      await availableSlotsService.setSlotAvailability(
        booking.date,
        booking.time,
        isAvailable,
        booking.service
      );
    } catch (error) {
      console.error('Error updating slot based on booking:', error);
      throw error;
    }
  },

  /**
   * Synchronise tous les créneaux disponibles pour une date donnée
   * en fonction des réservations existantes
   */
  async syncSlotsForDate(date: Date, allTimeSlots: string[]): Promise<void> {
    try {
      // 1. D'abord, marquer tous les créneaux comme disponibles
      for (const time of allTimeSlots) {
        await availableSlotsService.setSlotAvailability(date, time, true);
      }

      // 2. Récupérer toutes les réservations pour cette date
      const bookings = await bookingService.getBookingsForDate(date);

      // 3. Marquer les créneaux comme indisponibles pour les réservations confirmées ou en attente
      for (const booking of bookings) {
        if (booking.status === 'confirmed' || booking.status === 'pending') {
          await availableSlotsService.setSlotAvailability(booking.date, booking.time, false, booking.service);
        }
      }
    } catch (error) {
      console.error('Error syncing slots for date:', error);
      throw error;
    }
  },

  /**
   * Initialise les créneaux disponibles pour le prochain mois
   */
  async initializeUpcomingSlots(timeSlots: string[], excludedDays: number[] = [0]): Promise<void> {
    try {
      const today = new Date();
      const endDate = new Date();
      endDate.setMonth(today.getMonth() + 2); // Initialiser pour les deux prochains mois
      
      await availableSlotsService.generateAvailableSlotsForDateRange(
        today,
        endDate,
        timeSlots,
        excludedDays
      );
    } catch (error) {
      console.error('Error initializing upcoming slots:', error);
      throw error;
    }
  }
};

export default syncService;