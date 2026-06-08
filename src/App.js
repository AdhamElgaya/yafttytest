import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import HelpCenter from './pages/HelpCenter';
import BookingForm from './pages/BookingForm';
import Map from './pages/Map';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdvertiserDashboard from './pages/AdvertiserDashboard';
import BannerForm from './pages/BannerForm';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import VerifyCode from './pages/VerifyCode';
import ChooseAccountType from './pages/ChooseAccountType';
import { AuthProvider } from './contexts/AuthContext';
import { MapProvider } from './contexts/MapContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import './App.css';
import VerifyCode2FA from './pages/VerifyCode2FA';
import BannerVerification from './pages/BannerVerification';
import BannerVerificationAr from './pages/BannerVerificationAr';
import AdminChat from './pages/AdminChat';
import AdminDashboard from './pages/AdminDashboard';
import BannerManagement from './pages/BannerManagement';

// Custom hook to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to open chatbot from other components
  const openChatbot = () => {
    setChatbotOpen(true);
  };

  // Inner component that can access the language context
  const AppContent = () => {
    const pathname = usePathname();
    const { currentLanguage } = useLanguage();
    
    useEffect(() => {
      const path = pathname;
      let title = currentLanguage === 'ar' ? 'يافطتي – منصة الإعلانات الخارجية' : 'Yaftty – Outdoor Advertising Platform';
      
      if (path === '/help') {
        title = currentLanguage === 'ar' ? 'يافطتي – المساعدة' : 'Yaftty – Help';
      } else if (path === '/map') {
        title = currentLanguage === 'ar' ? 'يافطتي – الخريطة' : 'Yaftty – Map';
      } else if (path === '/login') {
        title = currentLanguage === 'ar' ? 'يافطتي – تسجيل الدخول' : 'Yaftty – Sign In';
      } else if (path === '/signup') {
        title = currentLanguage === 'ar' ? 'يافطتي – إنشاء حساب' : 'Yaftty – Sign up';
      } else if (path === '/forgot-password') {
        title = currentLanguage === 'ar' ? 'يافطتي – نسيت كلمة المرور' : 'Yaftty – Forgot Password';
      } else if (path === '/profile') {
        title = currentLanguage === 'ar' ? 'يافطتي – الملف الشخصي' : 'Yaftty – Profile';
      }
      
      document.title = title;
    }, [location, currentLanguage]);

    return (
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <Chatbot isOpen={chatbotOpen} setIsOpen={setChatbotOpen} />
        <AnimatePresence>
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Home />
                </motion.div>
              } 
            />
            <Route 
              path="/help" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <HelpCenter openChatbot={openChatbot} />
                </motion.div>
              } 
            />
            <Route 
              path="/booking" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <BookingForm />
                </motion.div>
              } 
            />
            <Route 
              path="/map" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Map />
                </motion.div>
              } 
            />
            <Route 
              path="/login" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Login />
                </motion.div>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <SignUp />
                </motion.div>
              } 
            />
            <Route 
              path="/forgot-password" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <ForgotPassword />
                </motion.div>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Dashboard />
                </motion.div>
              } 
            />
            <Route 
              path="/advertiser-dashboard" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <AdvertiserDashboard />
                </motion.div>
              } 
            />
            <Route 
              path="/banner-form/:bannerId" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <BannerForm />
                </motion.div>
              } 
            />
            <Route 
              path="/payment/:bookingId" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Payment />
                </motion.div>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <Profile />
                </motion.div>
              } 
            />
            <Route 
              path="/verify" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <VerifyCode />
                </motion.div>
              } 
            />
            <Route path="/2fa-verification" element={<VerifyCode2FA />} />
            <Route path="/choose-account-type" element={<ChooseAccountType />} />
            <Route 
              path="/banner-verification" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <BannerVerification />
                </motion.div>
              } 
            />
            <Route 
              path="/banner-verification-ar" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <BannerVerificationAr />
                </motion.div>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <AdminDashboard />
                </motion.div>
              } 
            />
            <Route 
              path="/admin/chat" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <AdminChat />
                </motion.div>
              } 
            />
            <Route 
              path="/admin/banner-management" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <BannerManagement />
                </motion.div>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader-map" role="status" aria-live="polite">
          <div className="pin-wrap" aria-hidden="true">
            <div className="pin" />
            <div className="pin-shadow" />
            <span className="ripple r1" />
            <span className="ripple r2" />
          </div>
          <div className="loader-brand" aria-label="Yaftty">Yaftty</div>
          <div className="loader-sub">
            Loading
            <span className="ellipsis"><i></i><i></i><i></i></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <AuthProvider>
        <MapProvider>
          <AppContent />
        </MapProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App; 