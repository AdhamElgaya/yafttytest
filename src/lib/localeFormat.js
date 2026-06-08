const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function isArabicLanguage(language) {
  return language === 'ar';
}

/** Replace Western digits 0–9 in any string */
export function localizeDigitsInString(value, language = 'en') {
  const str = value == null ? '' : String(value);
  if (!isArabicLanguage(language)) return str;
  return str.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

export function formatLocaleNumber(value, language = 'en', options = {}) {
  const num = Number(value);
  if (Number.isNaN(num)) return localizeDigitsInString(String(value), language);

  if (!isArabicLanguage(language)) {
    return new Intl.NumberFormat('en-US', options).format(num);
  }

  try {
    return new Intl.NumberFormat('ar-EG', {
      numberingSystem: 'arab',
      ...options,
    }).format(num);
  } catch {
    const useGrouping = options.useGrouping !== false;
    const maxFd = options.maximumFractionDigits ?? 0;
    const minFd = options.minimumFractionDigits ?? maxFd;
    let raw = num.toFixed(Math.max(minFd, maxFd));
    if (!useGrouping) raw = raw.replace(/,/g, '');
    return localizeDigitsInString(raw, language);
  }
}

export function formatDisplayYear(year, language = 'en') {
  return formatLocaleNumber(year, language, {
    useGrouping: false,
    maximumFractionDigits: 0,
  });
}

export function formatLocaleDecimal(value, language = 'en', fractionDigits = 2) {
  return formatLocaleNumber(value, language, {
    useGrouping: false,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatLocaleDateTime(value, language = 'en', dateStyle = 'medium', timeStyle = 'short') {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const locale = isArabicLanguage(language) ? 'ar-EG' : 'en-GB';
  try {
    return new Intl.DateTimeFormat(locale, {
      numberingSystem: isArabicLanguage(language) ? 'arab' : 'latn',
      dateStyle,
      timeStyle,
    }).format(date);
  } catch {
    return localizeDigitsInString(date.toLocaleString(), language);
  }
}

export function createLocaleFormatters(language = 'en') {
  return {
    language,
    n: (value, options) => formatLocaleNumber(value, language, options),
    year: (y) => formatDisplayYear(y ?? new Date().getFullYear(), language),
    decimal: (value, fractionDigits = 2) =>
      formatLocaleDecimal(value, language, fractionDigits),
    text: (value) => localizeDigitsInString(value, language),
    dateTime: (value, dateStyle, timeStyle) =>
      formatLocaleDateTime(value, language, dateStyle, timeStyle),
  };
}
