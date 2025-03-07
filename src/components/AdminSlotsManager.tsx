import React, { useState } from 'react';
import { Calendar, RefreshCw, CheckCircle, AlertTriangle, Loader, Trash2 } from 'lucide-react';
import { availableSlotsService } from '../firebase/availableSlotsService';
import { syncService } from '../firebase/syncService';

// Créneaux horaires disponibles par défaut
const DEFAULT_TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Jours exclus par défaut (dimanche = 0)
const DEFAULT_EXCLUDED_DAYS = [0];

const AdminSlotsManager: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [timeSlots, setTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
    const [excludedDays, setExcludedDays] = useState<number[]>(DEFAULT_EXCLUDED_DAYS);
    const [months, setMonths] = useState<number>(2);
    const [newTimeSlot, setNewTimeSlot] = useState<string>('');

    // Initialiser les créneaux pour les prochains mois
    const handleInitializeSlots = async () => {
        setIsLoading(true);
        setMessage({ text: 'Initialisation des créneaux en cours...', type: 'info' });

        try {
            // Calculer la date de fin
            const today = new Date();
            const endDate = new Date();
            endDate.setMonth(today.getMonth() + months);

            // Générer les créneaux
            await availableSlotsService.generateAvailableSlotsForDateRange(
                today,
                endDate,
                timeSlots,
                excludedDays
            );

            setMessage({
                text: `Créneaux initialisés avec succès pour les ${months} prochains mois !`,
                type: 'success'
            });
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des créneaux:', error);
            setMessage({
                text: `Erreur lors de l'initialisation des créneaux: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCleanupSlots = async () => {
        setIsLoading(true);
        setMessage({ text: 'Nettoyage des créneaux et réservations obsolètes...', type: 'info' });

        try {
            // 1. Nettoyer les créneaux des dates passées
            const obsoleteSlotsCount = await availableSlotsService.cleanupObsoleteSlots();

            // 2. Nettoyer les créneaux des réservations annulées
            const updatedSlotsCount = await availableSlotsService.cleanupCancelledBookings();

            // 3. NOUVEAU: Nettoyer les réservations obsolètes
            const deletedBookingsCount = await availableSlotsService.cleanupObsoleteBookings();

            setMessage({
                text: `Nettoyage terminé ! ${obsoleteSlotsCount} créneaux obsolètes supprimés, ${updatedSlotsCount} créneaux de réservations annulées mis à jour, et ${deletedBookingsCount} réservations obsolètes supprimées.`,
                type: 'success'
            });

            // Actualiser la page
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors du nettoyage:', error);
            setMessage({
                text: `Erreur lors du nettoyage: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };


    // Synchroniser les créneaux avec les réservations existantes
    const handleSyncSlots = async () => {
        setIsLoading(true);
        setMessage({ text: 'Synchronisation des créneaux en cours...', type: 'info' });

        try {
            const today = new Date();
            const endDate = new Date();
            endDate.setMonth(today.getMonth() + months);

            // Pour chaque jour
            const currentDate = new Date(today);
            let syncedDays = 0;

            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();

                // Si ce n'est pas un jour exclu
                if (!excludedDays.includes(dayOfWeek)) {
                    await syncService.syncSlotsForDate(new Date(currentDate), timeSlots);
                    syncedDays++;
                }

                // Jour suivant
                currentDate.setDate(currentDate.getDate() + 1);
            }

            setMessage({
                text: `Synchronisation terminée ! ${syncedDays} jours ont été synchronisés.`,
                type: 'success'
            });
        } catch (error) {
            console.error('Erreur lors de la synchronisation des créneaux:', error);
            setMessage({
                text: `Erreur lors de la synchronisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Ajouter un créneau horaire
    const handleAddTimeSlot = () => {
        if (newTimeSlot && !timeSlots.includes(newTimeSlot)) {
            setTimeSlots([...timeSlots, newTimeSlot].sort());
            setNewTimeSlot(''); // Réinitialiser le champ après l'ajout
        }
    };

    // Supprimer un créneau horaire
    const handleRemoveTimeSlot = (time: string) => {
        setTimeSlots(timeSlots.filter(slot => slot !== time));
    };

    // Mettre à jour les jours exclus
    const handleExcludedDayChange = (day: number) => {
        if (excludedDays.includes(day)) {
            setExcludedDays(excludedDays.filter(d => d !== day));
        } else {
            setExcludedDays([...excludedDays, day].sort());
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-silver-500" />
                Gestion des créneaux disponibles
            </h2>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' :
                    message.type === 'error' ? 'bg-red-50 text-red-700' :
                        'bg-blue-50 text-blue-700'
                    }`}>
                    <div className="flex items-start">
                        {message.type === 'success' && <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />}
                        {message.type === 'error' && <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />}
                        {message.type === 'info' && <RefreshCw className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 animate-spin" />}
                        <p>{message.text}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Configuration des créneaux horaires */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Créneaux horaires</h3>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {timeSlots.map(time => (
                                <div key={time} className="bg-silver-100 text-silver-800 px-3 py-1 rounded-full flex items-center">
                                    <span>{time}</span>
                                    <button
                                        onClick={() => handleRemoveTimeSlot(time)}
                                        className="ml-1 text-silver-500 hover:text-silver-700"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex">
                            <input
                                type="time"
                                className="border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-silver-500 focus:border-silver-500"
                                value={newTimeSlot}
                                onChange={(e) => setNewTimeSlot(e.target.value)}
                            />
                            <button
                                className="bg-silver-500 text-white px-4 py-2 rounded-r-lg hover:bg-silver-600 transition-colors"
                                onClick={handleAddTimeSlot}
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>

                    <h3 className="text-lg font-medium mb-2 mt-6">Jours de fermeture</h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { day: 0, label: 'Dimanche' },
                            { day: 1, label: 'Lundi' },
                            { day: 2, label: 'Mardi' },
                            { day: 3, label: 'Mercredi' },
                            { day: 4, label: 'Jeudi' },
                            { day: 5, label: 'Vendredi' },
                            { day: 6, label: 'Samedi' }
                        ].map(({ day, label }) => (
                            <label key={day} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={excludedDays.includes(day)}
                                    onChange={() => handleExcludedDayChange(day)}
                                    className="rounded text-silver-500 focus:ring-silver-500"
                                />
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Actions</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre de mois à initialiser :
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={months}
                                    onChange={(e) => setMonths(parseInt(e.target.value))}
                                    className="border border-gray-300 rounded-lg px-3 py-2 w-24 focus:outline-none focus:ring-silver-500 focus:border-silver-500"
                                />
                                <span className="ml-2 text-gray-600">mois</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleInitializeSlots}
                                disabled={isLoading}
                                className="w-full bg-silver-500 hover:bg-silver-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin w-5 h-5 mr-2" />
                                        Initialisation...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Initialiser les créneaux
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleSyncSlots}
                                disabled={isLoading}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin w-5 h-5 mr-2" />
                                        Synchronisation...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-5 h-5 mr-2" />
                                        Synchroniser avec les réservations
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCleanupSlots}
                                disabled={isLoading}
                                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-3"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader className="animate-spin w-5 h-5 mr-2" />
                                        Nettoyage en cours...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-5 h-5 mr-2" />
                                        Nettoyer les créneaux obsolètes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSlotsManager;