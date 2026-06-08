'use client';

import { useCallback, useMemo } from 'react';
import { en } from './en';
import { ar } from './ar';
import {
  formatLocaleNumber,
  localizeDigitsInString,
} from '../lib/localeFormat';

export const translations = {
  en,
  ar
};

// Helper function to get nested translation values
export const getTranslation = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

// Hook to use translations
export const useTranslations = (language) => {
  const translation = useMemo(
    () => translations[language] || translations.en,
    [language]
  );

  const t = useCallback(
    (key, params = {}) => {
      let value = getTranslation(translation, key) || key;

      Object.keys(params).forEach((paramKey) => {
        const placeholder = `{${paramKey}}`;
        const raw = params[paramKey];
        const replacement =
          typeof raw === 'number'
            ? formatLocaleNumber(raw, language)
            : localizeDigitsInString(String(raw ?? ''), language);
        value = value.replace(new RegExp(placeholder, 'g'), replacement);
      });

      if (language === 'ar') {
        value = localizeDigitsInString(value, language);
      }

      return value;
    },
    [language, translation]
  );

  return { t, translation };
};
