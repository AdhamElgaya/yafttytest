'use client';

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './YafttyLogo.css';

export const ENGLISH_LOGO_SRC = '/website_text_logo.png';
export const ENGLISH_FOOTER_LOGO_SRC = '/footer_logo.png';

/**
 * Brand mark: Arabic wordmark text, English PNG logo.
 * @param {'navbar'|'footer'|'checkout'|'loader'} variant
 * @param {boolean} [onDark] — lighten logo for navy/dark backgrounds
 * @param {boolean} [isArabic] — override language detection (e.g. checkout shell)
 */
export default function YafttyLogo({
  variant = 'navbar',
  onDark = false,
  className = '',
  isArabic: isArabicOverride,
  as: Tag = 'span',
}) {
  const { currentLanguage } = useLanguage();
  const isArabic = isArabicOverride ?? currentLanguage === 'ar';

  if (isArabic) {
    return (
      <Tag className={`yaftty-logo-text yaftty-logo-text--${variant} ${className}`.trim()}>
        يافطتي
      </Tag>
    );
  }

  const englishSrc = variant === 'footer' ? ENGLISH_FOOTER_LOGO_SRC : ENGLISH_LOGO_SRC;
  const englishImgClass =
    variant === 'footer'
      ? `yaftty-logo-img yaftty-logo-img--${variant} yaftty-logo-img--footer-file`
      : `yaftty-logo-img yaftty-logo-img--${variant}${onDark ? ' yaftty-logo-img--on-dark' : ''}`;

  return (
    <Tag className={`yaftty-logo-wrap yaftty-logo-wrap--${variant} ${className}`.trim()}>
      <img
        src={englishSrc}
        alt="Yaftty"
        className={englishImgClass}
        draggable={false}
      />
    </Tag>
  );
}
