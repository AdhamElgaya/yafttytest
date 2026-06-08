'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { isEmailVerificationSkipped } from '../lib/authConfig';
import { EMAIL_OTP_LENGTH, emptyOtpCode } from '../lib/otpConfig';
import OtpInput from '../components/OtpInput';

const getProfileRoute = () => '/profile';

const VerifyCode = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyCode, resendVerificationCode } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const email = searchParams.get('email');
  const accountType = searchParams.get('accountType');
  const [code, setCode] = useState(emptyOtpCode);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputsRef = useRef([]);
  const [flashIdx, setFlashIdx] = useState(null);

  useEffect(() => {
    if (isEmailVerificationSkipped()) {
      router.replace('/signup');
      return;
    }
    if (!email || !accountType) {
      router.push('/signup');
    }
  }, [email, accountType, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email || !accountType) {
      setError(t('messages.missingEmailOrAccountType') || 'Missing email or account type.');
      return;
    }
    const codeStr = code.join('');
    if (codeStr.length !== EMAIL_OTP_LENGTH) {
      setError(t('messages.pleaseEnterOtpCode', { length: EMAIL_OTP_LENGTH }));
      return;
    }
    setLoading(true);
    try {
      const data = await verifyCode(email, codeStr);
      if (data?.user) {
        setMessage(t('auth.verify.success') || 'Verification successful! Redirecting...');
        setTimeout(() => router.push(getProfileRoute()), 1200);
      } else {
        setError(t('messages.invalidCode') || 'Invalid code');
      }
    } catch (err) {
      setError(err.message || t('messages.verificationFailedCheckCode'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    if (!email || !accountType) {
      setError(t('messages.missingEmailOrAccountType') || 'Missing email or account type.');
      return;
    }
    setResendLoading(true);
    try {
      const data = await resendVerificationCode(email);
      setMessage(data.message || t('messages.verificationCodeSent'));
    } catch (err) {
      setError(err.message || t('messages.failedToSendVerificationCode'));
    } finally {
      setResendLoading(false);
    }
  };

  const otpHint = t('auth.verify.enterCode', { length: EMAIL_OTP_LENGTH });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div className="verify-container">
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#123a8f', letterSpacing: '-0.02em', textAlign: 'center' }}>{t('auth.verify.title')}</h2>
        <p style={{ marginBottom: 28, color: '#64748b', fontSize: 16, textAlign: 'center', fontWeight: 500 }}>{otpHint}</p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <OtpInput
            code={code}
            setCode={setCode}
            inputsRef={inputsRef}
            flashIdx={flashIdx}
            setFlashIdx={setFlashIdx}
          />
          <button type="submit" disabled={loading || code.join('').length !== EMAIL_OTP_LENGTH} style={{ width: '100%', padding: 14, borderRadius: 10, background: '#123a8f', color: '#fff', fontWeight: 700, border: 'none', fontSize: 19, marginBottom: 10, boxShadow: '0 2px 8px rgba(18, 58, 143, 0.08)', letterSpacing: 1, transition: 'background 0.2s' }}>
            {loading ? t('auth.verify.verifying') : t('auth.verify.submit')}
          </button>
        </form>
        <button type="button" onClick={handleResend} disabled={resendLoading} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#e0e7ef', color: '#123a8f', fontWeight: 600, border: 'none', fontSize: 16, marginBottom: 2, marginTop: 2, transition: 'background 0.2s' }}>
          {resendLoading ? t('auth.verify.resending') : t('auth.verify.resend')}
        </button>
        {error && <p style={{ color: '#ef4444', marginTop: 18, textAlign: 'center', fontWeight: 600, fontSize: 15 }}>{error}</p>}
        {message && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 18 }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 6, animation: 'pop 0.3s' }}>
              <circle cx="22" cy="22" r="22" fill="#22c55e" fillOpacity="0.15"/>
              <path d="M14 23.5L20 29L30 17" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ color: '#22c55e', fontWeight: 700, fontSize: 16, textAlign: 'center' }}>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyCode;
