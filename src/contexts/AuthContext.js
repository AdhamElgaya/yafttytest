'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import {
  signIn,
  signUp,
  signOut,
  switchAccountType as switchAccountTypeApi,
  getInitialSession,
  resetPasswordForEmail,
  verifyEmailOtp,
  resendSignupOtp,
  verifyRecoveryOtp,
  updatePassword,
  resendRecoveryOtp,
  updateUserProfileInfo,
} from '../lib/authService';
import { ACTIVE_PROFILE_KEY } from '../lib/profileUtils';
import { localizeDigitsInString } from '../lib/localeFormat';

function getAccountTypeLabel(accountType, language = 'en') {
  const type =
    accountType === 'banner_owner' || accountType === 'bannerOwner'
      ? 'bannerOwner'
      : 'advertiser';
  const labels = {
    en: { advertiser: 'Advertiser', bannerOwner: 'Banner Owner' },
    ar: { advertiser: 'المعلن', bannerOwner: 'صاحب يافطات' },
  };
  return labels[language]?.[type] || labels.en[type] || accountType;
}

// Helper function to get translations
const getTranslation = (key, language = 'en', accountType = '') => {
  const translations = {
    en: {
      loginSuccessful: 'Login successful!',
      accountCreatedSuccessfully: 'Account created successfully!',
      loggedOutSuccessfully: 'Logged out successfully',
      switchedToAccount: 'Switched to {accountType} account',
      profileUpdatedSuccessfully: 'Profile updated successfully!',
      verificationSuccessful: 'Verification successful!',
      passwordResetEmailSent: 'Password reset email sent!',
      loginFailedMissingData: 'Login failed: missing user data.',
      loginFailedCheckCredentials: 'Login failed. Please check your credentials.',
      cannotConnectToServer: 'Cannot connect to server. Please make sure the backend is running.',
      signupFailedTryAgain: 'Signup failed. Please try again.',
      notLoggedInPleaseLogin: 'You are not logged in. Please log in again.',
      failedToSwitchAccount: 'Failed to switch account type',
      profileUpdateFailed: 'Profile update failed. Please try again.',
      verificationFailedCheckCode: 'Verification failed. Please check your code.',
      passwordResetFailed: 'Password reset failed. Please try again.',
    },
    ar: {
      loginSuccessful: 'تم تسجيل الدخول بنجاح!',
      accountCreatedSuccessfully: 'تم إنشاء الحساب بنجاح!',
      loggedOutSuccessfully: 'تم تسجيل الخروج بنجاح',
      switchedToAccount: 'تم التبديل إلى حساب {accountType}',
      profileUpdatedSuccessfully: 'تم تحديث الملف الشخصي بنجاح!',
      verificationSuccessful: 'تم التحقق بنجاح!',
      passwordResetEmailSent: 'تم إرسال بريد إعادة تعيين كلمة المرور!',
      loginFailedMissingData: 'فشل تسجيل الدخول: بيانات المستخدم مفقودة.',
      loginFailedCheckCredentials: 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.',
      cannotConnectToServer: 'لا يمكن الاتصال بالخادم. يرجى التأكد من تشغيل الخادم الخلفي.',
      signupFailedTryAgain: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
      notLoggedInPleaseLogin: 'أنت غير مسجل الدخول. يرجى تسجيل الدخول مرة أخرى.',
      failedToSwitchAccount: 'فشل في تبديل نوع الحساب',
      profileUpdateFailed: 'فشل تحديث الملف الشخصي. يرجى المحاولة مرة أخرى.',
      verificationFailedCheckCode: 'فشل التحقق. يرجى التحقق من الرمز.',
      passwordResetFailed: 'فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.',
    }
  };
  
  const message = translations[language]?.[key] || translations.en[key] || key;
  const withAccount = message.replace('{accountType}', accountType);
  return language === 'ar' ? localizeDigitsInString(withAccount, language) : withAccount;
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState(null);
  const router = useRouter();
  
  // Get current language from localStorage or default to 'en'
  const getCurrentLanguage = () => {
    return localStorage.getItem('language') || 'en';
  };

  /**
   * Remember Me Functionality:
   * - When "Remember Me" is CHECKED: Data is stored in localStorage (persists across browser sessions)
   * - When "Remember Me" is UNCHECKED: Data is stored in sessionStorage (cleared when browser closes)
   * - On app load: Checks localStorage first, then sessionStorage
   * - On browser close: sessionStorage is automatically cleared
   */

  // Helper function to determine dashboard route based on account type
  const getDashboardRoute = (accountType) => {
    switch (accountType) {
      case 'bannerOwner':
        return '/dashboard';
      case 'advertiser':
        return '/advertiser-dashboard';
      default:
        return '/profile'; // fallback for unknown account types
    }
  };

  const persistUserLocally = (userData, token, rememberMe) => {
    const userJson = JSON.stringify(userData);
    if (rememberMe) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userJson);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', userJson);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const payload = await getInitialSession();
        if (mounted && payload?.user) {
          setUser(payload.user);
          setAccountType(payload.user.accountType);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
        setAccountType(null);
        setLoading(false);
        return;
      }
      const payload = await getInitialSession();
      if (payload?.user) {
        setUser(payload.user);
        setAccountType(payload.user.accountType);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password, _phone, rememberMe = false) => {
    try {
      setLoading(true);
      const data = await signIn(email, password, rememberMe);
      if (data.user && data.token) {
        persistUserLocally(data.user, data.token, rememberMe);
        setUser(data.user);
        setAccountType(data.user.accountType);
        toast.success(getTranslation('loginSuccessful', getCurrentLanguage()));
        router.push('/profile');
      } else {
        toast.error(getTranslation('loginFailedMissingData', getCurrentLanguage()));
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.message || getTranslation('loginFailedCheckCredentials', getCurrentLanguage())
      );
    } finally {
      setLoading(false);
    }
    return undefined;
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const data = await signUp({
        email: userData.email,
        password: userData.password,
        fullName: userData.fullName,
        accountType: userData.accountType,
        bankAccount: userData.bankAccount,
      });

      if (data.needsConfirmation) {
        return {
          message: data.message || 'Verification code sent',
          needsConfirmation: true,
          existingAccountType: data.existingAccountType,
          newAccountType: data.newAccountType,
        };
      }

      if (data.user && data.token) {
        persistUserLocally(data.user, data.token, true);
        setUser(data.user);
        setAccountType(data.user.accountType);
        toast.success(getTranslation('accountCreatedSuccessfully', getCurrentLanguage()));
        router.push('/profile');
        return { ...data, needsConfirmation: false };
      }

      if (data.session?.access_token) {
        const payload = await signIn(userData.email, userData.password, true);
        persistUserLocally(payload.user, payload.token, true);
        setUser(payload.user);
        setAccountType(payload.user.accountType);
        toast.success(getTranslation('accountCreatedSuccessfully', getCurrentLanguage()));
        router.push('/profile');
      }
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || getTranslation('signupFailedTryAgain', getCurrentLanguage()));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem(ACTIVE_PROFILE_KEY);
    setUser(null);
    setAccountType(null);
    setLoading(false);
    toast.success(getTranslation('loggedOutSuccessfully', getCurrentLanguage()));
    router.push('/');
  };

  const switchAccountType = async (newType) => {
    try {
      setLoading(true);
      const data = await switchAccountTypeApi(newType);
      setAccountType(data.user.accountType);
      setUser(data.user);
      const rememberMe = Boolean(localStorage.getItem('token'));
      persistUserLocally(data.user, data.token, rememberMe);
      toast.success(
        getTranslation(
          'switchedToAccount',
          getCurrentLanguage(),
          getAccountTypeLabel(data.user.accountType, getCurrentLanguage())
        )
      );
    } catch (error) {
      console.error('Switch account type error:', error);
      toast.error(error.message || getTranslation('failedToSwitchAccount', getCurrentLanguage()));
    } finally {
      setLoading(false);
    }
  };

  // Update user profile (syncs name across all account types for same auth user)
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);

      const updatedUser = await updateUserProfileInfo({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
      });

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token =
        session?.access_token ||
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');
      const rememberMe = Boolean(localStorage.getItem('token'));
      const mergedUser = {
        ...updatedUser,
        company: profileData.company ?? user?.company ?? '',
      };

      setUser(mergedUser);
      if (token) {
        persistUserLocally(mergedUser, token, rememberMe);
      }

      toast.success(getTranslation('profileUpdatedSuccessfully', getCurrentLanguage()));
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(
        error.message || getTranslation('profileUpdateFailed', getCurrentLanguage())
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (email, code) => {
    try {
      setLoading(true);
      const payload = await verifyEmailOtp(email, code);
      if (payload.user && payload.token) {
        persistUserLocally(payload.user, payload.token, true);
        setUser(payload.user);
        setAccountType(payload.user.accountType);
        toast.success(getTranslation('verificationSuccessful', getCurrentLanguage()));
        return { user: payload.user, token: payload.token };
      }
      throw new Error('Invalid code');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(getTranslation('verificationFailedCheckCode', getCurrentLanguage()));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async (email) => resendSignupOtp(email);

  const requestPasswordReset = async (email) => {
    await resetPasswordForEmail(email);
  };

  const verifyRecoveryCode = async (email, code) => {
    await verifyRecoveryOtp(email, code);
  };

  const completePasswordReset = async (newPassword) => {
    await updatePassword(newPassword);
    await signOut();
    setUser(null);
    setAccountType(null);
  };

  const resendPasswordResetCode = async (email) => {
    await resendRecoveryOtp(email);
  };

  const value = {
    user,
    loading,
    accountType,
    login,
    signup,
    logout,
    switchAccountType,
    updateProfile,
    verifyCode,
    resendVerificationCode,
    requestPasswordReset,
    verifyRecoveryCode,
    completePasswordReset,
    resendPasswordResetCode,
    isAuthenticated: !!user,
    setUser,           // <-- add this
    setAccountType,    // <-- add this
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 