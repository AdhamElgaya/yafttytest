'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { MapProvider } from '@/contexts/MapContext';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { ChatbotProvider, useChatbot } from '@/contexts/ChatbotContext';
import { BookingCartProvider } from '@/contexts/BookingCartContext';
import Navbar from '@/components/Navbar';
import YafttyLogo from '@/components/YafttyLogo';
import Chatbot from '@/components/Chatbot';
import LanguagePickerModal from '@/components/LanguagePickerModal';
import SiteAppFooter from '@/components/SiteAppFooter';
import {
  shouldShowSiteAppFooter,
  shouldShowSupportChat,
  normalizePathname,
} from '@/lib/siteFooter';

function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppShell({ children }) {
  const pathname = usePathname();
  const { currentLanguage, isLanguageChosen, isHydrated } = useLanguage();
  const { isOpen, setIsOpen } = useChatbot();
  const showSiteFooter = shouldShowSiteAppFooter(pathname);
  const showSupportChat = shouldShowSupportChat(pathname);

  useEffect(() => {
    if (!isLanguageChosen) return;
    let title =
      currentLanguage === 'ar'
        ? 'يافطتي – منصة الإعلانات الخارجية'
        : 'Yaftty – Outdoor Advertising Platform';
    if (pathname === '/help') {
      title = currentLanguage === 'ar' ? 'يافطتي – المساعدة' : 'Yaftty – Help';
    } else if (pathname === '/map') {
      title = currentLanguage === 'ar' ? 'يافطتي – الخريطة' : 'Yaftty – Map';
    }
    document.title = title;
  }, [pathname, currentLanguage, isLanguageChosen]);

  const siteReady = isHydrated && isLanguageChosen;
  const normalizedPath = normalizePathname(pathname);
  const isMapPage = normalizedPath === '/map';
  const isCheckoutPage = normalizedPath === '/checkout';

  return (
    <div
      className={
        isMapPage ? 'App App--map' : isCheckoutPage ? 'App App--checkout' : 'App'
      }
    >
      <LanguagePickerModal />
      {siteReady && (
        <>
          <ScrollToTop />
          {!isCheckoutPage && <Navbar />}
          {showSupportChat && <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />}
          {children}
          {showSiteFooter && <SiteAppFooter />}
        </>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loader-map" role="status" aria-live="polite">
        <div className="pin-wrap" aria-hidden="true">
          <div className="pin" />
          <div className="pin-shadow" />
          <span className="ripple r1" />
          <span className="ripple r2" />
        </div>
        <div className="loader-brand" aria-label="Yaftty">
          <YafttyLogo variant="loader" />
        </div>
        <div className="loader-sub">
          Loading<span className="ellipsis"><i></i><i></i><i></i></span>
        </div>
      </div>
    </div>
  );
}

export default function Providers({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <LanguageProvider>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <AuthProvider>
          <BookingCartProvider>
            <MapProvider>
              <ChatbotProvider>
                <AppShell>{children}</AppShell>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                      border: '1px solid #374151',
                    },
                  }}
                />
              </ChatbotProvider>
            </MapProvider>
          </BookingCartProvider>
        </AuthProvider>
      )}
    </LanguageProvider>
  );
}
