'use client';

import { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { createLocaleFormatters } from '../lib/localeFormat';

export function useLocaleFormat() {
  const { currentLanguage } = useLanguage();
  return useMemo(
    () => createLocaleFormatters(currentLanguage),
    [currentLanguage]
  );
}
