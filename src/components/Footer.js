'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import LanguageSwitcherButtons from './LanguageSwitcherButtons';
import FooterCopyright from './FooterCopyright';
import YafttyLogo from './YafttyLogo';
import './Footer.css';

const Footer = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  
  return (
    <footer className="footer yaftty-legacy-footer">
      <div className="footer-content">
        <div className="footer-section">
          <YafttyLogo variant="footer" as="h3" className="footer-logo" />
          <p className="footer-description">
            {t('footer.description')}
          </p>
        </div>
        
        <div className="footer-section">
          <h4>{t('footer.quickLinks')}</h4>
          <ul className="footer-links">
            <li><Link href="/">{t('nav.home')}</Link></li>
            <li><Link href="/help">{t('nav.help')}</Link></li>
            <li><Link href="/map">{t('nav.map')}</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>{t('nav.services')}</h4>
          <ul className="footer-links">
            <li><Link href="/booking">{currentLanguage === 'ar' ? 'حجز الإعلانات' : 'Book Advertising'}</Link></li>
            <li><Link href="/signup">{currentLanguage === 'ar' ? 'اعرض ممتلكاتك' : 'Advertise Your Property'}</Link></li>
            <li><Link href="/map">{currentLanguage === 'ar' ? 'اعثر على المواقع' : 'Find Locations'}</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>{currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact'}</h4>
          <ul className="footer-links">
            <li><a href="mailto:info@yaftty.com">info@yaftty.com</a></li>
            <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
            <li>{currentLanguage === 'ar' ? 'الدعم: 24/7' : 'Support: 24/7'}</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="language-footer-block">
          <span className="language-footer-label">{t('footer.language')}</span>
          <LanguageSwitcherButtons variant="footer" />
        </div>
        <div className="footer-bottom-content">
          <p>
            <FooterCopyright />
          </p>
          <div className="footer-bottom-links">
            <Link href="/privacy">{t('footer.privacy')}</Link>
            <Link href="/terms">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 