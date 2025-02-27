import React from 'react';
import Booking from '../components/Booking';
import Footer from '../components/Footer';

const BookingPage: React.FC = () => {
  return (
    <>
      <Booking />
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>© {new Date().getFullYear()} Coiffure à Domicile - Tous droits réservés</p>
        </div>
      </footer>
    </>
  );
};

export default BookingPage;