// src/firebase/availableSlotsService.ts
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
    getDoc,
    setDoc
} from 'firebase/firestore';

// Types
export interface AvailableSlot {
    date: Date;
    time: string;
    isAvailable: boolean;
    serviceId?: string;
}

// Interface pour Firestore
interface FirestoreAvailableSlot {
    date: Timestamp;
    time: string;
    isAvailable: boolean;
    serviceId?: string;
    lastUpdated: Timestamp;
}

// Collection reference
const availableSlotsCollection = collection(db, 'availableSlots');

// Fonction utilitaire pour convertir une date JS en Timestamp Firestore
const dateToFirestoreTimestamp = (date: Date): Timestamp => {
    return Timestamp.fromDate(date);
};

// Fonction utilitaire pour convertir un Timestamp Firestore en date JS
const firestoreTimestampToDate = (timestamp: Timestamp): Date => {
    return timestamp.toDate();
};

// Génère un ID unique pour le créneau basé sur la date et l'heure
const generateSlotId = (date: Date, time: string): string => {
    const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    return `${dateString}_${time.replace(':', '')}`;
};

export const availableSlotsService = {
    // Modifier la fonction setSlotAvailability
    async setSlotAvailability(date: Date, time: string, isAvailable: boolean, serviceId?: string): Promise<string> {
        try {
            const slotId = generateSlotId(date, time);

            // Créer l'objet de base sans serviceId
            const slotData: Omit<FirestoreAvailableSlot, 'serviceId'> = {
                date: dateToFirestoreTimestamp(date),
                time: time,
                isAvailable: isAvailable,
                lastUpdated: dateToFirestoreTimestamp(new Date())
            };

            // Ajouter serviceId seulement s'il est défini
            if (serviceId !== undefined) {
                (slotData as FirestoreAvailableSlot).serviceId = serviceId;
            }

            // Utiliser setDoc avec merge: true pour créer ou mettre à jour
            const slotRef = doc(db, 'availableSlots', slotId);
            await setDoc(slotRef, slotData, { merge: true });

            return slotId;
        } catch (error) {
            console.error('Error setting slot availability:', error);
            throw error;
        }
    },


    // Nettoie les créneaux obsolètes (dates passées ou créneaux annulés)
    async cleanupObsoleteSlots(): Promise<number> {
        try {
            // Obtenir la date actuelle à minuit
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Convertir en timestamp Firestore
            const todayTimestamp = dateToFirestoreTimestamp(today);

            // Récupérer tous les documents de la collection
            const snapshotAll = await getDocs(availableSlotsCollection);

            // Compteur de créneaux supprimés
            let deletedCount = 0;

            // Tableau pour stocker les promesses de suppression
            const deletePromises: Promise<void>[] = [];

            // Analyser chaque document
            snapshotAll.forEach(doc => {
                const data = doc.data();

                // Vérifier si le document a un champ date
                if (data.date) {
                    // Convertir le Timestamp Firestore en Date JavaScript
                    const slotDate = data.date.toDate();

                    // Comparer les dates (uniquement les jours, sans les heures)
                    const slotDay = new Date(slotDate);
                    slotDay.setHours(0, 0, 0, 0);

                    // Si la date du créneau est antérieure à aujourd'hui
                    if (slotDay < today) {
                        // Ajouter la promesse de suppression au tableau
                        deletePromises.push(deleteDoc(doc.ref));
                        deletedCount++;
                    }
                }
            });

            // Attendre que toutes les suppressions soient terminées
            await Promise.all(deletePromises);

            return deletedCount;
        } catch (error) {
            console.error('Error cleaning up obsolete slots:', error);
            throw error;
        }
    },

    async cleanupObsoleteBookings(): Promise<number> {
        try {

            // Obtenir la date actuelle à minuit
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Convertir en timestamp Firestore
            const todayTimestamp = dateToFirestoreTimestamp(today);

            // 1. Récupérer toutes les réservations
            const bookingsRef = collection(db, 'bookings');
            const allBookingsSnapshot = await getDocs(bookingsRef);

            // Compteur de réservations supprimées
            let deletedCount = 0;

            // Tableau pour stocker les promesses de suppression
            const deletePromises: Promise<void>[] = [];

            // 2. Analyser chaque réservation
            allBookingsSnapshot.forEach(doc => {
                const bookingData = doc.data();

                // Vérifier si le document a un champ date
                if (bookingData.date) {
                    // Convertir le Timestamp Firestore en Date JavaScript
                    const bookingDate = bookingData.date.toDate();

                    // Comparer les dates (uniquement les jours, sans les heures)
                    const bookingDay = new Date(bookingDate);
                    bookingDay.setHours(0, 0, 0, 0);

                    // Obtenir le statut
                    const status = bookingData.status || 'pending';

                    // Supprimer si la date est passée OU si le statut est "cancelled"
                    if (bookingDay < today || status === 'cancelled') {
                        // Ajouter la promesse de suppression au tableau
                        deletePromises.push(deleteDoc(doc.ref));
                        deletedCount++;
                    }
                }
            });

            // Attendre que toutes les suppressions soient terminées
            await Promise.all(deletePromises);

            return deletedCount;
        } catch (error) {
            console.error('Error cleaning up obsolete bookings:', error);
            throw error;
        }
    },

    //Supprime les créneaux correspondant aux réservations annulées
    async cleanupCancelledBookings(): Promise<number> {
        try {

            // Obtenir toutes les réservations annulées
            const bookingsRef = collection(db, 'bookings');
            const q = query(
                bookingsRef,
                where('status', '==', 'cancelled')
            );

            const querySnapshot = await getDocs(q);

            // Compteur de créneaux mis à jour
            let updatedCount = 0;

            // Pour chaque réservation annulée, marquer le créneau comme disponible
            const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
                const booking = docSnapshot.data();

                // S'assurer que la date et l'heure existent
                if (booking.date && booking.time) {
                    const date = booking.date.toDate();
                    const time = booking.time;


                    // Générer l'ID du créneau
                    const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
                    const slotId = `${dateString}_${time.replace(':', '')}`;

                    // Vérifier si le créneau existe avant de le mettre à jour
                    const slotRef = doc(db, 'availableSlots', slotId);
                    const slotDoc = await getDoc(slotRef);

                    if (slotDoc.exists()) {
                        await setDoc(slotRef, {
                            isAvailable: true,
                            lastUpdated: dateToFirestoreTimestamp(new Date())
                        }, { merge: true });
                        updatedCount++;
                    } else {
                        await setDoc(slotRef, {
                            date: booking.date,
                            time: time,
                            isAvailable: true,
                            lastUpdated: dateToFirestoreTimestamp(new Date())
                        });
                        updatedCount++;
                    }
                }
            });

            // Attendre que toutes les mises à jour soient terminées
            await Promise.all(updatePromises);

            return updatedCount;
        } catch (error) {
            console.error('Error cleaning up cancelled bookings:', error);
            throw error;
        }
    },

    async getActuallyAvailableSlotsForDate(date: Date): Promise<AvailableSlot[]> {
        try {
            // 1. Récupérer les créneaux marqués comme disponibles
            const availableSlots = await this.getAvailableSlotsForDate(date);

            // Convertir en carte pour un accès facile
            const slotsMap = new Map();
            availableSlots.forEach(slot => {
                slotsMap.set(slot.time, true);
            });

            // 2. Vérifier s'il y a des réservations pour cette date
            try {
                // Définir le début et la fin de la journée
                const startDate = new Date(date);
                startDate.setHours(0, 0, 0, 0);

                const endDate = new Date(date);
                endDate.setHours(23, 59, 59, 999);

                // Créer la requête
                const q = query(
                    collection(db, 'bookings'),
                    where('date', '>=', dateToFirestoreTimestamp(startDate)),
                    where('date', '<=', dateToFirestoreTimestamp(endDate)),
                    where('status', 'in', ['pending', 'confirmed'])
                );

                const querySnapshot = await getDocs(q);

                // Marquer les créneaux réservés comme indisponibles
                querySnapshot.forEach(doc => {
                    const booking = doc.data();
                    slotsMap.set(booking.time, false);
                });
            } catch (error) {
                console.warn('Could not check bookings, proceeding with slots from availableSlots only', error);
            }

            // 3. Convertir la carte en tableau de créneaux
            return Array.from(slotsMap.entries())
                .filter(([, isAvailable]) => isAvailable)
                .map(([time]) => ({
                    date: date,
                    time: time,
                    isAvailable: true
                }));
        } catch (error) {
            console.error('Error getting actually available slots:', error);
            throw error;
        }
    },

    // Récupérer tous les créneaux pour une date donnée
    async getSlotsForDate(date: Date): Promise<AvailableSlot[]> {
        try {
            // Définir le début et la fin de la journée
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            // Créer la requête
            const q = query(
                availableSlotsCollection,
                where('date', '>=', dateToFirestoreTimestamp(startDate)),
                where('date', '<=', dateToFirestoreTimestamp(endDate))
            );

            const querySnapshot = await getDocs(q);

            // Convertir les données Firestore en objets AvailableSlot
            return querySnapshot.docs.map(doc => {
                const data = doc.data() as FirestoreAvailableSlot;
                return {
                    date: firestoreTimestampToDate(data.date),
                    time: data.time,
                    isAvailable: data.isAvailable,
                    serviceId: data.serviceId
                };
            });
        } catch (error) {
            console.error('Error getting slots for date:', error);
            throw error;
        }
    },

    // Récupérer uniquement les créneaux disponibles pour une date donnée
    async getAvailableSlotsForDate(date: Date): Promise<AvailableSlot[]> {
        try {
            const slots = await this.getSlotsForDate(date);
            return slots.filter(slot => slot.isAvailable);
        } catch (error) {
            console.error('Error getting available slots:', error);
            throw error;
        }
    },

    // Vérifier si un créneau spécifique est disponible
    async isSlotAvailable(date: Date, time: string): Promise<boolean> {
        try {
            const slotId = generateSlotId(date, time);
            const slotRef = doc(db, 'availableSlots', slotId);
            const slotSnap = await getDoc(slotRef);

            if (slotSnap.exists()) {
                const data = slotSnap.data() as FirestoreAvailableSlot;
                return data.isAvailable;
            }

            // Si le créneau n'existe pas encore dans la base, on considère qu'il est disponible
            return true;
        } catch (error) {
            console.error('Error checking slot availability:', error);
            throw error;
        }
    },

    // Générer des créneaux disponibles pour une plage de dates
    async generateAvailableSlotsForDateRange(
        startDate: Date,
        endDate: Date,
        timeSlots: string[],
        excludedDays: number[] = []  // 0 = Dimanche, 1 = Lundi, etc.
    ): Promise<void> {
        try {
            const currentDate = new Date(startDate);

            while (currentDate <= endDate) {
                // Vérifier si le jour est exclu (jour de fermeture par exemple)
                const dayOfWeek = currentDate.getDay();
                if (!excludedDays.includes(dayOfWeek)) {
                    // Pour chaque créneau horaire
                    for (const time of timeSlots) {
                        await this.setSlotAvailability(new Date(currentDate), time, true);
                    }
                }

                // Passer au jour suivant
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } catch (error) {
            console.error('Error generating available slots:', error);
            throw error;
        }
    }
};

export default availableSlotsService;