'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { currentLanguage, switchLanguage } = useLanguage();

  const handleLanguageSwitch = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    switchLanguage(newLanguage);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={handleLanguageSwitch}
        aria-label={`Switch to ${currentLanguage === 'en' ? 'Arabic' : 'English'}`}
      >
        {currentLanguage === 'en' ? 'العربية' : 'English'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
