import React from 'react';
import Navbar from '../components/Navbar';
import Home from '../components/Home';
import About from '../components/About';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import BookingCta from '../components/BookingCta';
import Faq from '../components/Faq';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Home />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <BookingCta />
      <Faq />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomePage;