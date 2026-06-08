'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { shouldShowSiteAppFooter } from '../lib/siteFooter';
import LanguageSwitcherButtons from './LanguageSwitcherButtons';
import FooterCopyright from './FooterCopyright';
import './LanguageSwitcherButtons.css';

export default function SiteAppFooter() {
  const pathname = usePathname();
  const { currentLanguage, isLanguageChosen } = useLanguage();
  const { t } = useTranslations(currentLanguage);

  if (!isLanguageChosen || !shouldShowSiteAppFooter(pathname)) return null;

  return (
    <footer className="site-app-footer">
      <div className="site-app-footer-inner">
        <div className="language-footer-block">
          <span className="language-footer-label">{t('footer.language')}</span>
          <LanguageSwitcherButtons variant="footer" />
        </div>
        <span className="site-app-footer-copy">
          <FooterCopyright />
        </span>
      </div>
    </footer>
  );
}
