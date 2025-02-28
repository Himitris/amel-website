// src/services/emailService.ts
import emailjs from '@emailjs/browser';

// Remplacez ces valeurs par vos propres identifiants EmailJS
const SERVICE_ID = 'service_noov8mm';
const TEMPLATE_ID_CONFIRMATION = 'template_01pskua'; 
const TEMPLATE_ID_CANCELLATION = 'template_icdf27p'; 
const USER_ID = 'ztBP8me3lTmtYKbvC';

interface EmailParams extends Record<string, unknown> {
    to_name: string;
    to_email: string;
    booking_date: string;
    booking_time: string;
    service_name: string;
    booking_address: string;
    booking_reference: string;
  }
  
  export const emailService = {
    // Initialiser EmailJS
    init() {
      emailjs.init(USER_ID);
    },
  
    // Obtenir le nom du service à partir de son ID
    getServiceName(serviceId: string): string {
      const services: Record<string, string> = {
        'coupe-brushing': 'Coupe & Brushing',
        'coloration': 'Coloration',
        'balayage': 'Balayage',
        'coiffure-evenement': 'Coiffure Événementielle',
        'coupe-homme': 'Coupe Homme',
        'coupe-enfant': 'Coupe Enfant'
      };
  
      return services[serviceId] || serviceId;
    },
  
    // Formater la date pour l'affichage
    formatDate(date: Date): string {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    },
  
    // Envoyer un email de confirmation
    async sendConfirmationEmail(booking: any, bookingId: string) {
      try {
        const bookingDate = booking.date instanceof Date 
          ? booking.date 
          : booking.date.toDate();
  
        const templateParams: EmailParams = {
          to_name: booking.name,
          to_email: booking.email,
          booking_date: this.formatDate(bookingDate),
          booking_time: booking.time,
          service_name: this.getServiceName(booking.service),
          booking_address: booking.address,
          booking_reference: bookingId
        };
  
        const response = await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID_CONFIRMATION,
          templateParams
        );
  
        console.log('Email de confirmation envoyé avec succès:', response);
        return true;
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
        return false;
      }
    },
  
    // Envoyer un email d'annulation
    async sendCancellationEmail(booking: any, bookingId: string) {
      try {
        const bookingDate = booking.date instanceof Date 
          ? booking.date 
          : booking.date.toDate();
  
        const templateParams: EmailParams = {
          to_name: booking.name,
          to_email: booking.email,
          booking_date: this.formatDate(bookingDate),
          booking_time: booking.time,
          service_name: this.getServiceName(booking.service),
          booking_address: booking.address,
          booking_reference: bookingId
        };
  
        const response = await emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID_CANCELLATION,
          templateParams
        );
  
        console.log('Email d\'annulation envoyé avec succès:', response);
        return true;
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email d\'annulation:', error);
        return false;
      }
    }
  };