'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { updatePassword, signOut } from '../lib/authService';
import { EMAIL_OTP_LENGTH } from '../lib/otpConfig';
import './Auth.css';

const ResetPassword = () => {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(newPassword);
      await signOut();
      toast.success('Password updated. You can sign in now.');
      router.push('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Failed to reset password.');
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
          <div className="auth-header">
            <Link href="/login" className="back-button">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-subtitle">
              {ready
                ? 'Choose a new password for your account'
                : 'Open the reset link from your email, or use the code on the forgot password page.'}
            </p>
          </div>

          {ready ? (
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <Lock size={20} className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <div className="loading-spinner"></div> : 'Update Password'}
              </button>
            </form>
          ) : (
            <div className="auth-footer" style={{ marginTop: 24 }}>
              <p>
                <Link href="/forgot-password" className="auth-link">
                  Enter an {EMAIL_OTP_LENGTH}-digit code instead
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
