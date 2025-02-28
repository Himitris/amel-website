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

// Fonction utilitaire pour convertir une date JS en Timestamp Firestore
const dateToFirestoreTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Fonction utilitaire pour convertir un Timestamp Firestore en date JS
const firestoreTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Service functions
export const bookingService = {
  // Create a new booking
  async createBooking(bookingData: Omit<BookingData, 'status' | 'createdAt'>): Promise<string> {
    try {
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
      // Convert date to Firestore Timestamp for the start of the day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const startTimestamp = dateToFirestoreTimestamp(startDate);
      
      // For the end of the day
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const endTimestamp = dateToFirestoreTimestamp(endDate);
      
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
      const startTimestamp = dateToFirestoreTimestamp(startDate);
      
      // For the end of the day
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const endTimestamp = dateToFirestoreTimestamp(endDate);
      
      // Query bookings for the specified date
      const q = query(
        bookingsCollection, 
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      
      // Get already booked time slots
      const bookedTimeSlots = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return data.time;
      });
      
      console.log('Date query:', startDate.toISOString(), 'to', endDate.toISOString());
      console.log('Booked time slots:', bookedTimeSlots);
      
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
      console.log('Fetching bookings for date:', date.toISOString());
      
      // Convert date to Firestore Timestamp for the start of the day
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const startTimestamp = Timestamp.fromDate(startDate);
      
      // For the end of the day
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      const endTimestamp = Timestamp.fromDate(endDate);
      
      console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());
      
      // Query bookings for the specified date
      const q = query(
        bookingsCollection, 
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Found', querySnapshot.docs.length, 'bookings');
      
      // Convert Firestore data to our BookingData format
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreBookingData;
        console.log('Booking data:', doc.id, data);
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