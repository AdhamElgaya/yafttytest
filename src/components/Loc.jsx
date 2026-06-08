'use client';

import React from 'react';
import { useLocaleFormat } from '../hooks/useLocaleFormat';
import { localizeDigitsInString } from '../lib/localeFormat';

/**
 * Renders numbers (or digit strings) in the active locale.
 * @param {number|string} [value] - number to format
 * @param {number} [fractionDigits] - fixed decimal places
 * @param {boolean} [grouping] - thousand separators (default true for integers)
 * @param {React.ReactNode} [children] - localize digits in string children (Arabic only)
 */
export default function Loc({ value, fractionDigits, grouping, children }) {
  const locale = useLocaleFormat();

  if (value !== undefined && value !== null) {
    if (fractionDigits != null) {
      return <>{locale.decimal(value, fractionDigits)}</>;
    }
    return (
      <>
        {locale.n(value, {
          useGrouping: grouping !== false,
          maximumFractionDigits: 0,
        })}
      </>
    );
  }

  if (children != null && children !== '') {
    return <>{localizeDigitsInString(children, locale.language)}</>;
  }

  return null;
}
