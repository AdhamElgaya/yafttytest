'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import { EMAIL_OTP_LENGTH, emptyOtpCode } from '../lib/otpConfig';
import OtpInput from '../components/OtpInput';
import './Auth.css';

const ForgotPassword = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const [step, setStep] = useState(1);
  // Remove resetMethod and phone
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: emptyOtpCode(),
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    requestPasswordReset,
    verifyRecoveryCode,
    completePasswordReset,
    resendPasswordResetCode,
  } = useAuth();
  const codeInputsRef = useRef([]);
  const [flashIdx, setFlashIdx] = useState(null);

  const setVerificationCode = (updater) => {
    setFormData(prev => ({
      ...prev,
      verificationCode:
        typeof updater === 'function' ? updater(prev.verificationCode) : updater,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendCode = async (e) => {
    e?.preventDefault?.();
    if (!formData.email) {
      toast.error(t('messages.pleaseEnterEmail'));
      return;
    }
    setIsLoading(true);
    try {
      await requestPasswordReset(formData.email);
      toast.success(t('messages.verificationCodeSent') || 'Check your email for a reset code.');
      setStep(2);
    } catch (error) {
      toast.error(error.message || t('messages.failedToSendVerificationCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      toast.error(t('messages.pleaseEnterEmail'));
      return;
    }
    setIsLoading(true);
    try {
      await resendPasswordResetCode(formData.email);
      toast.success(t('messages.verificationCodeSent') || 'A new code has been sent.');
    } catch (error) {
      toast.error(error.message || t('messages.failedToSendVerificationCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const codeStr = formData.verificationCode.join('');
    if (!codeStr) {
      toast.error(t('messages.pleaseEnterVerificationCode'));
      return;
    }
    if (codeStr.length !== EMAIL_OTP_LENGTH) {
      toast.error(t('messages.pleaseEnterOtpCode').replace('{length}', String(EMAIL_OTP_LENGTH)));
      return;
    }
    setIsLoading(true);
    try {
      await verifyRecoveryCode(formData.email, codeStr);
      setStep(3);
    } catch (error) {
      toast.error(error.message || t('messages.verificationFailedCheckCode') || 'Invalid code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error(t('messages.pleaseFillAllFields'));
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t('messages.passwordsDoNotMatch'));
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error(t('messages.passwordMustBe8CharactersLong'));
      return;
    }
    setIsLoading(true);
    try {
      await completePasswordReset(formData.newPassword);
      toast.success(t('messages.passwordResetSuccessfully'));
      router.push('/login');
    } catch (error) {
      toast.error(error.message || t('messages.failedToResetPassword'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <div className="auth-overlay"></div>
      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="auth-header">
            <Link href="/login" className="back-button">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the verification code sent to your email'}
              {step === 3 && 'Create a new password for your account'}
            </p>
          </div>
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span>Email</span>
            </div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span>Verify</span>
            </div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span>Reset</span>
            </div>
          </div>
          {/* Step 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <Mail size={20} className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="auth-input"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          )}
          {/* Step 2: Verify Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="auth-form">
              <OtpInput
                code={formData.verificationCode}
                setCode={setVerificationCode}
                inputsRef={codeInputsRef}
                flashIdx={flashIdx}
                setFlashIdx={setFlashIdx}
              />
              <p className="verification-note">
                We've sent a verification code to your email
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <button
                  type="button"
                  className="resend-code"
                  onClick={handleResendCode}
                  disabled={isLoading}
                >
                  Resend Code
                </button>
              </div>
              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Verify Code'
                )}
              </button>
            </form>
          )}
          {/* Step 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="New Password"
                    className="auth-input"
                    required
                  />
                  <motion.button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 0, top: 0, height: '100%', zIndex: 2 }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm New Password"
                    className="auth-input"
                    required
                  />
                  <motion.button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: 0, top: 0, height: '100%', zIndex: 2 }}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
                </div>
              </div>
              <button
                type="submit"
                className="auth-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
          {/* Footer */}
          {step !== 2 && (
            <div className="auth-footer">
              <p>
                Remember your password?{' '}
                <Link href="/login" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword; 