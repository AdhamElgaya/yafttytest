'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguagePickerModal.css';

export default function LanguagePickerModal() {
  const { isLanguageChosen, isHydrated, chooseLanguage } = useLanguage();

  useEffect(() => {
    if (!isHydrated || isLanguageChosen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isHydrated, isLanguageChosen]);

  if (!isHydrated || isLanguageChosen) return null;

  return (
    <div className="language-picker-overlay" role="dialog" aria-modal="true" aria-labelledby="language-picker-title">
      <div className="language-picker-modal">
        <h2 id="language-picker-title" className="language-picker-title">
          Please choose your language
        </h2>
        <p className="language-picker-title-ar" lang="ar">
          يرجى اختيار لغتك
        </p>
        <div className="language-picker-actions">
          <button
            type="button"
            className="language-picker-option"
            onClick={() => chooseLanguage('en')}
          >
            <span className="language-picker-label">English</span>
          </button>
          <button
            type="button"
            className="language-picker-option"
            onClick={() => chooseLanguage('ar')}
          >
            <span className="language-picker-label">العربيه</span>
          </button>
        </div>
      </div>
    </div>
  );
}
