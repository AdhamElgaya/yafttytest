import { formatLocaleNumber } from './localeFormat';

/** Whole EGP amounts — avoids 20000 → 19999 float display bugs from numeric/parseFloat. */

export function parseEgpAmount(value) {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const n = Number(cleaned);
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return Math.round(n);
}

export function formatEgpAmount(value, language = 'en') {
  return formatLocaleNumber(parseEgpAmount(value), language, {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
}

/** e.g. "EGP 20,000" or "٢٠٬٠٠٠ ج.م" */
export function formatEgpWithCurrency(value, language = 'en') {
  const amount = formatEgpAmount(value, language);
  if (language === 'ar') return `${amount} ج.م`;
  return `EGP ${amount}`;
}

/** Compact per-month label for map pins and similar UI */
export function formatEgpPerMonth(value, language = 'en') {
  const amount = formatEgpAmount(value, language);
  if (language === 'ar') return `${amount} ج.م / شهر`;
  return `EGP ${amount} / mo`;
}
