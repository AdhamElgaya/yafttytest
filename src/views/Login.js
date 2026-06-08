'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGuestOnly } from '../hooks/useGuestOnly';
import toast from 'react-hot-toast';
import './Auth.css';
import { AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';

const Login = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const isArabic = currentLanguage === 'ar';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, setUser, setAccountType } = useAuth();
  const { ready: guestReady } = useGuestOnly();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!guestReady) {
    return (
      <div className="auth-page auth-page--redirecting">
        <div className="auth-guest-loading" aria-label="Loading" />
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error(t('auth.login.fillAllFields'));
      return;
    }
    setIsLoading(true);
    try {
      // Custom login handler to catch require2FA
      const result = await login(formData.email, formData.password, undefined, rememberMe);
      if (result && result.require2FA) {
        router.push(
          `/2fa-verification?email=${encodeURIComponent(formData.email)}&accountType=${encodeURIComponent(result.accountType || 'advertiser')}`
        );
      }
      // Handle post-login redirect
      const next = searchParams.get('next');
      if (next) router.push(next);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <motion.div
      className="auth-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.h2
            className="auth-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t('auth.login.welcomeBack')}
          </motion.h2>
          <form
            className={`auth-form${isArabic ? ' auth-form-rtl' : ''}`}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <motion.div
                className="input-wrapper animated-input"
                whileFocus={{ scale: 1.03, borderColor: '#123a8f' }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ position: 'relative' }}
              >
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder=" "
                  className="auth-input"
                  required
                  autoComplete="username"
                  id="login-email"
                />
                <label htmlFor="login-email">{t('auth.login.email')}</label>
              </motion.div>
            </motion.div>
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="input-wrapper animated-input"
                whileFocus={{ scale: 1.03, borderColor: '#123a8f' }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ position: 'relative' }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder=" "
                  className="auth-input"
                  required
                  autoComplete="current-password"
                  id="login-password"
                />
                <label htmlFor="login-password">{t('auth.login.password')}</label>
                <motion.button
                  type="button"
                  className="password-toggle"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPassword((v) => !v);
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    left: isArabic ? 12 : 'auto',
                    right: isArabic ? 'auto' : 12,
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </motion.button>
              </motion.div>
            </motion.div>
            {/* Remember Me Checkbox */}
            <motion.div
              className="remember-me-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, borderRadius: 8, padding: '4px 8px' }}
            >
              <label
                className="remember-me-label"
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', fontWeight: 500, color: '#123a8f', fontSize: '1rem' }}
              >
                <motion.span
                  className="custom-checkbox"
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={rememberMe}
                  style={{
                    width: 22,
                    height: 22,
                    border: `2px solid ${rememberMe ? '#123a8f' : '#b0b0b0'}`,
                    borderRadius: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    background: rememberMe ? '#123a8f22' : '#fff',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                    outline: 'none',
                    position: 'relative',
                  }}
                  whileHover={{ borderColor: '#123a8f' }}
                  whileFocus={{ borderColor: '#123a8f', boxShadow: '0 0 0 2px #123a8f33' }}
                  onClick={e => { e.preventDefault(); setRememberMe(v => !v); }}
                  onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setRememberMe(v => !v); } }}
                >
                  <motion.span
                    style={{
                      position: 'absolute',
                      width: 18,
                      height: 18,
                      borderRadius: 20,
                      background: rememberMe ? '#123a8f' : 'transparent',
                      transition: 'background 0.2s',
                      zIndex: 1,
                    }}
                    animate={{ background: rememberMe ? '#123a8f' : 'transparent' }}
                  />
                  <AnimatePresence>
                    {rememberMe && (
                      <motion.span
                        key="check"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.7 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#fff',
                          position: 'absolute',
                          left: 2,
                          top: 2,
                          zIndex: 2,
                        }}
                      >
                        <Check size={15} strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                {t('auth.login.rememberMe')}
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </label>
            </motion.div>
            <div className="form-actions">
              <motion.button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
                whileHover={{ scale: 1.05, color: '#123a8f' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {t('auth.login.forgotPassword')}
              </motion.button>
            </div>
            <motion.button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
              whileHover={{ scale: 1.04, backgroundColor: '#123a8f' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ marginBottom: 0 }}
            >
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                t('auth.login.title')
              )}
            </motion.button>
          </form>
          {/* Footer */}
          <motion.div
            className="auth-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ marginTop: 0 }}
          >
            <p>
              {t('auth.login.noAccount')}{' '}
              <Link href="/signup" className="auth-link">
                {t('auth.login.signUp')}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login; 