'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDisplayYear } from '../lib/localeFormat';

export default function FooterCopyright() {
  const { currentLanguage } = useLanguage();
  const year = formatDisplayYear(new Date().getFullYear(), currentLanguage);

  if (currentLanguage === 'ar') {
    return (
      <span>
        © {year} يافطتي. جميع الحقوق محفوظة.
      </span>
    );
  }

  return (
    <span>
      © {year} Yaftty. All rights reserved.
    </span>
  );
}
