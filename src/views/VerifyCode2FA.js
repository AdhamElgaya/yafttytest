'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { motion } from 'framer-motion';
import { EMAIL_OTP_LENGTH, emptyOtpCode } from '../lib/otpConfig';
import OtpInput from '../components/OtpInput';

const getProfileRoute = () => '/profile';

const VerifyCode2FA = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const accountType = searchParams.get('accountType') || 'advertiser';
  const [code, setCode] = useState(emptyOtpCode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputsRef = useRef([]);
  const [flashIdx, setFlashIdx] = useState(null);
  const { setUser, setAccountType } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !accountType) {
      setError('Missing email or account type.');
      return;
    }
    const codeStr = code.join('');
    if (codeStr.length !== EMAIL_OTP_LENGTH) {
      setError(t('messages.pleaseEnterOtpCode').replace('{length}', String(EMAIL_OTP_LENGTH)));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, accountType, code: codeStr }),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (setUser) setUser(data.user);
        if (setAccountType) setAccountType(data.user.accountType);
        toast.success(t('messages.verificationSuccessful'));
        router.push(getProfileRoute());
      } else {
        setError(data.message || 'Invalid code');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendLoading(true);
    try {
      const res = await fetch('/api/auth/enable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('messages.codeSentToEmail'));
      } else {
        setError(data.message || 'Failed to resend code.');
      }
    } catch {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div className="verify-container">
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#123a8f', letterSpacing: '-0.02em', textAlign: 'center' }}>Two-Factor Authentication</h2>
        <p style={{ marginBottom: 28, color: '#64748b', fontSize: 16, textAlign: 'center', fontWeight: 500 }}>
          {t('messages.pleaseEnterOtpCode').replace('{length}', String(EMAIL_OTP_LENGTH))}
        </p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <OtpInput
            code={code}
            setCode={setCode}
            inputsRef={inputsRef}
            flashIdx={flashIdx}
            setFlashIdx={setFlashIdx}
          />
         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
           <button
             type="button"
             onClick={handleResend}
             disabled={resendLoading}
             style={{
               background: 'none',
               border: 'none',
               color: '#123a8f',
               textDecoration: 'underline',
               fontWeight: 600,
               fontSize: 16,
               cursor: resendLoading ? 'not-allowed' : 'pointer',
               outline: 'none',
               padding: 0,
               margin: 0,
               display: 'block',
               textAlign: 'center',
               transition: 'color 0.18s',
             }}
           >
             {resendLoading ? 'Resending...' : 'Resend Code'}
           </button>
         </div>
          <button type="submit" disabled={loading || code.join('').length !== EMAIL_OTP_LENGTH} style={{ width: '100%', padding: 14, borderRadius: 10, background: '#123a8f', color: '#fff', fontWeight: 700, border: 'none', fontSize: 19, marginBottom: 10, boxShadow: '0 2px 8px rgba(18, 58, 143, 0.08)', letterSpacing: 1, transition: 'background 0.2s' }}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        {error && <p style={{ color: '#ef4444', marginTop: 18, textAlign: 'center', fontWeight: 600, fontSize: 15 }}>{error}</p>}
      </div>
    </div>
  );
};

export default VerifyCode2FA;
