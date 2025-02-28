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

// Service functions
export const bookingService = {
  // Create a new booking
  async createBooking(bookingData: Omit<BookingData, 'status' | 'createdAt'>): Promise<string> {
    try {
      const booking: FirestoreBookingData = {
        ...bookingData,
        status: 'pending',
        date: Timestamp.fromDate(bookingData.date),
        createdAt: Timestamp.fromDate(new Date())
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
      // Convert date to Firestore Timestamp for the start of the day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const startTimestamp = Timestamp.fromDate(startDate);
      
      // For the end of the day
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      // Query bookings for the specified date and time
      const q = query(
        bookingsCollection, 
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        where('time', '==', time),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      
      // If there are no bookings at this time, it's available
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },

  // Get available time slots for a specific date
  async getAvailableTimeSlots(date: Date, allTimeSlots: string[]): Promise<string[]> {
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
        where('date', '<=', endTimestamp),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      
      // Get already booked time slots
      const bookedTimeSlots = querySnapshot.docs.map(doc => doc.data().time);
      
      // Filter out booked slots from all time slots
      return allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot));
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
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status });
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
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate()
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
    return this.updateBookingStatus(bookingId, 'cancelled');
  },

  // Delete a booking
  async deleteBooking(bookingId: string): Promise<void> {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
};