'use client';

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import './GoogleSignIn.css';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = window.location.origin + '/google-oauth-callback';
const SCOPE = 'openid email profile';
const AUTH_URL =
  'https://accounts.google.com/o/oauth2/v2/auth' +
  '?response_type=code' +
  `&client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=${encodeURIComponent(SCOPE)}` +
  '&prompt=select_account';

const GoogleSignIn = ({ mode = 'signin', className = '', rememberMe = false }) => {
  const { googleSignIn } = useAuth();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);

  const handleGoogleSignIn = () => {
    if (!GOOGLE_CLIENT_ID) {
      console.error('REACT_APP_GOOGLE_CLIENT_ID is not configured');
      alert(t('messages.googleSignInNotConfigured'));
      return;
    }
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      AUTH_URL,
      'GoogleSignIn',
      `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes,status=1`
    );
    // Listen for message from popup
    window.addEventListener('message', async function onMessage(event) {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'google-oauth-code') {
        // Let the popup close itself (avoids COOP blocking). The callback page already calls window.close().
        window.removeEventListener('message', onMessage);
        // Exchange code with backend and pass redirectUri to avoid redirect_uri_mismatch
        await googleSignIn(event.data.code, rememberMe, REDIRECT_URI);
      }
    });
  };

  return (
    <button className={`google-signin-btn ${className}`} onClick={handleGoogleSignIn}>
      <div className="google-btn-content">
        <div className="google-icon">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/1024px-Google_Favicon_2025.svg.png" alt="Google" width={24} height={24} />
        </div>
        <span className="google-btn-text">
          {mode === 'signup' ? t('auth.signup.googleSignUp') : t('auth.login.googleSignIn')}
        </span>
      </div>
    </button>
  );
};

export default GoogleSignIn; 