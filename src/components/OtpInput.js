'use client';

import React from 'react';
import { EMAIL_OTP_LENGTH } from '../lib/otpConfig';
import './OtpInput.css';

const LAST_IDX = EMAIL_OTP_LENGTH - 1;

export default function OtpInput({
  code,
  setCode,
  inputsRef,
  flashIdx,
  setFlashIdx,
  className = '',
}) {
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setCode(prev => prev.map((c, i) => (i === idx ? '' : c)));
      setFlashIdx?.(null);
      return;
    }
    const chars = val.split('');
    setCode(prev => {
      const newCode = [...prev];
      for (let i = 0; i < chars.length && idx + i < EMAIL_OTP_LENGTH; i++) {
        newCode[idx + i] = chars[i];
      }
      return newCode;
    });
    setFlashIdx?.(idx);
    setTimeout(() => setFlashIdx?.(null), 120);
    if (idx < LAST_IDX && chars.length === 1) {
      inputsRef.current[idx + 1]?.focus();
    } else if (chars.length > 1) {
      const nextIdx = Math.min(idx + chars.length, LAST_IDX);
      inputsRef.current[nextIdx]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      setCode(prev => prev.map((c, i) => (i === idx - 1 ? '' : c)));
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '');
    if (pasted.length >= EMAIL_OTP_LENGTH) {
      e.preventDefault();
      setCode(pasted.split('').slice(0, EMAIL_OTP_LENGTH));
      inputsRef.current[LAST_IDX]?.focus();
    }
  };

  return (
    <div className={`otp-row ${className}`.trim()} onPaste={handlePaste}>
      {code.map((digit, idx) => (
        <input
          key={idx}
          ref={el => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={idx === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          className={[
            'otp-digit',
            digit ? 'otp-digit--filled' : '',
            flashIdx === idx ? 'otp-digit--flash' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          autoFocus={idx === 0}
          aria-label={`Digit ${idx + 1}`}
        />
      ))}
    </div>
  );
}
