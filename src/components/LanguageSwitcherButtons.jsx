'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSwitcherButtons.css';

/**
 * @param {'footer' | 'profile' | 'compact'} variant
 */
export default function LanguageSwitcherButtons({ variant = 'footer', className = '' }) {
  const { currentLanguage, switchLanguage } = useLanguage();

  return (
    <div
      className={`language-switch-buttons language-switch-buttons--${variant} ${className}`.trim()}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        className={`language-switch-btn${currentLanguage === 'en' ? ' active' : ''}`}
        onClick={() => switchLanguage('en')}
        aria-pressed={currentLanguage === 'en'}
      >
        English
      </button>
      <button
        type="button"
        className={`language-switch-btn${currentLanguage === 'ar' ? ' active' : ''}`}
        onClick={() => switchLanguage('ar')}
        aria-pressed={currentLanguage === 'ar'}
      >
        العربيه
      </button>
    </div>
  );
}
