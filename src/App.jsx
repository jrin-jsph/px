import React from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WhatsAppBubble from './components/common/WhatsAppBubble';

import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import About from './pages/About';
import Contact from './pages/Contact';

function AppContent() {
  const location = useLocation();
  const navType = useNavigationType();

  // 1. Disable native scroll restoration to stop jumps during animations
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // 2. Track scroll position for the current route
  React.useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem(`scroll_${location.key}`, window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.key]);

  // 3. Global scroll restoration
  React.useEffect(() => {
    if (navType !== 'POP') {
      // New page: instant scroll to top
      window.scrollTo(0, 0);
    } else {
      // Re-entering page from 'back': wait for exit animation then restore
      const savedScroll = sessionStorage.getItem(`scroll_${location.key}`);
      if (savedScroll) {
        const timer = setTimeout(() => {
          window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.key, navType]);

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <WhatsAppBubble />
      <Footer />
    </>
  );
}

export default function App() {
  return <AppContent />;
}
