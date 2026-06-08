'use client';

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { applyBodyFont } from '../lib/fonts';
import {
  hasChosenLanguage,
  persistLanguageChoice,
  readStoredLanguage,
} from '../lib/languageStorage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

function applyLanguageToDocument(language) {
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
  document.body.dataset.font = language === 'ar' ? 'arabic' : 'latin';
  applyBodyFont(language);
}

export const LanguageProvider = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLanguageChosen, setIsLanguageChosen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [direction, setDirection] = useState('ltr');

  useLayoutEffect(() => {
    let chosen = hasChosenLanguage();
    const saved = readStoredLanguage();
    // Returning visitors who picked a language before the gate existed
    if (!chosen && saved) {
      persistLanguageChoice(saved);
      chosen = true;
    }
    setIsLanguageChosen(chosen);
    if (chosen && saved) {
      setCurrentLanguage(saved);
      setDirection(saved === 'ar' ? 'rtl' : 'ltr');
      applyLanguageToDocument(saved);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isLanguageChosen) return;
    persistLanguageChoice(currentLanguage);
    setDirection(currentLanguage === 'ar' ? 'rtl' : 'ltr');
    applyLanguageToDocument(currentLanguage);
  }, [currentLanguage, isLanguageChosen]);

  const chooseLanguage = useCallback((language) => {
    setCurrentLanguage(language);
    setIsLanguageChosen(true);
    persistLanguageChoice(language);
    setDirection(language === 'ar' ? 'rtl' : 'ltr');
    applyLanguageToDocument(language);
  }, []);

  const switchLanguage = useCallback((language) => {
    if (!isLanguageChosen) {
      chooseLanguage(language);
      return;
    }
    setCurrentLanguage(language);
  }, [isLanguageChosen, chooseLanguage]);

  const value = {
    currentLanguage,
    direction,
    isLanguageChosen,
    isHydrated,
    chooseLanguage,
    switchLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
