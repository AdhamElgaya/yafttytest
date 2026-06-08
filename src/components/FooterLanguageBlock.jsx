'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import LanguageSwitcherButtons from './LanguageSwitcherButtons';
import './LanguageSwitcherButtons.css';

/** Language switcher row for marketing page footers (footer-new). */
export default function FooterLanguageBlock() {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);

  return (
    <div className="language-footer-block language-footer-block--marketing">
      <span className="language-footer-label">{t('footer.language')}</span>
      <LanguageSwitcherButtons variant="footer" />
    </div>
  );
}
