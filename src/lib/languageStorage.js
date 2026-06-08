export const LANGUAGE_STORAGE_KEY = 'language';
export const LANGUAGE_CHOSEN_KEY = 'languageChosen';

export function readStoredLanguage() {
  if (typeof window === 'undefined') return null;
  const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return lang === 'ar' || lang === 'en' ? lang : null;
}

export function hasChosenLanguage() {
  if (typeof window === 'undefined') return false;
  return (
    localStorage.getItem(LANGUAGE_CHOSEN_KEY) === 'true' &&
    readStoredLanguage() !== null
  );
}

export function persistLanguageChoice(language) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  localStorage.setItem(LANGUAGE_CHOSEN_KEY, 'true');
}
