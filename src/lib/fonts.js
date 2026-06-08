/**
 * Fonts load via @import in index.css (browser), not next/font/google.
 * Avoids dev/build failures when Google Fonts is slow or unreachable.
 */
export function applyBodyFont(language) {
  if (typeof document === 'undefined') return;
  const isArabic = language === 'ar';
  document.body.dataset.font = isArabic ? 'arabic' : 'latin';
  document.documentElement.classList.toggle('lang-ar', isArabic);
  document.documentElement.classList.toggle('lang-en', !isArabic);
}
