'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building, Eye, EyeOff, Check, AlertCircle, Info } from 'lucide-react';
import './Auth.css';
import { motion as m } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import { useGuestOnly } from '../hooks/useGuestOnly';

const SignUp = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  
  const [form, setForm] = useState({
    accountType: 'advertiser',
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
    bankAccount: {
      bankName: '',
      accountNumber: '',
      accountHolderName: '',
      branchCode: '',
      swiftCode: '',
      iban: ''
    }
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [existingAccountInfo, setExistingAccountInfo] = useState(null);
  const router = useRouter();
  const { signup } = useAuth();
  const { ready: guestReady } = useGuestOnly();

  if (!guestReady) {
    return (
      <div className="auth-page auth-page--redirecting">
        <div className="auth-guest-loading" aria-label="Loading" />
      </div>
    );
  }

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => {
    // Minimum 6 characters, at least one uppercase, one lowercase
    return password.length >= 6 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    
    if (name.startsWith('bankAccount.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        bankAccount: {
          ...prev.bankAccount,
          [field]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    
    setError('');
    setMessage('');
    setExistingAccountInfo(null);
  };

  const handleAccountType = (type) => {
    setForm({ ...form, accountType: type });
    setError('');
    setMessage('');
    setExistingAccountInfo(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setExistingAccountInfo(null);
    
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError(t('auth.signup.fillRequiredFields'));
      return;
    }
    if (!validateEmail(form.email)) {
      setError(t('auth.signup.validEmail'));
      return;
    }
    if (!validatePassword(form.password)) {
      setError(t('auth.signup.passwordRequirements'));
      return;
    }
    
    // Validate bank account fields for banner owners
    if (form.accountType === 'bannerOwner') {
      if (!form.bankAccount.bankName || !form.bankAccount.accountNumber || !form.bankAccount.accountHolderName) {
        setError(t('auth.signup.fillBankFields'));
        return;
      }
    }
    
    if (!agreed) {
      setError(t('auth.signup.agreeToTermsPolicy'));
      return;
    }
    setLoading(true);
    try {
      const formToSend = {
        ...form,
        fullName: `${form.firstName} ${form.lastName}`.trim(),
      };
      delete formToSend.firstName;
      delete formToSend.lastName;
      const data = await signup(formToSend);
      setMessage(data.message || t('auth.signup.checkEmail'));
      if (data.existingAccountType && data.newAccountType) {
        setExistingAccountInfo({
          existing: data.existingAccountType,
          new: data.newAccountType,
        });
      }
      if (data.needsConfirmation === true) {
        setTimeout(() => {
          router.push(
            `/verify?email=${encodeURIComponent(form.email)}&accountType=${encodeURIComponent(form.accountType)}`
          );
        }, 1200);
      } else if (data.user) {
        setTimeout(() => router.push('/profile'), 1200);
      }
    } catch (err) {
      setError(err.message || t('auth.signup.signupFailedTryAgain'));
    } finally {
      setLoading(false);
    }
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
            {t('auth.signup.title')}
          </motion.h2>
          
          <motion.div
            className="auth-notice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="auth-notice-header">
              <span className="auth-notice-icon" aria-hidden>
                <Info size={16} />
              </span>
              <strong className="auth-notice-title">{t('auth.signup.importantNotice')}</strong>
            </div>
            <p className="auth-notice-text">{t('auth.signup.passwordConsistency')}</p>
          </motion.div>
          {/* Account Type Selection */}
          <motion.div
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.22, duration: 0.5 }}
          >
            <div className="auth-account-type-group">
                                              <button
                   type="button"
                   className={`account-type-btn${form.accountType === 'advertiser' ? ' active' : ''}`}
                   onClick={() => handleAccountType('advertiser')}
                   style={{ 
                     width: '100%', 
                     position: 'relative',
                     flexDirection: currentLanguage === 'ar' ? 'row' : 'row',
                     textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                     justifyContent: currentLanguage === 'ar' ? 'flex-start' : 'flex-start',
                     padding: currentLanguage === 'ar' ? '16px 20px 16px 16px' : '16px 16px 16px 20px'
                   }}
                   data-rtl={currentLanguage === 'ar' ? 'true' : 'false'}
                 >
                <span className="account-type-icon"><User size={24} /></span>
                <span className="account-type-content" style={{
                  textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                  width: '100%'
                }}>
                  <h4 style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}>{t('auth.signup.advertiser')}</h4>
                  <p style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}>{t('auth.signup.advertiserDescription')}</p>
                </span>
                                
               </button>
                                               <button
                    type="button"
                    className={`account-type-btn${form.accountType === 'bannerOwner' ? ' active' : ''}`}
                    onClick={() => handleAccountType('bannerOwner')}
                    style={{ 
                      width: '100%', 
                      position: 'relative',
                      flexDirection: currentLanguage === 'ar' ? 'row' : 'row',
                      textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                      justifyContent: currentLanguage === 'ar' ? 'flex-start' : 'flex-start',
                      padding: currentLanguage === 'ar' ? '16px 20px 16px 16px' : '16px 16px 16px 20px'
                    }}
                    data-rtl={currentLanguage === 'ar' ? 'true' : 'false'}
                  >
                 <span className="account-type-icon"><Building size={24} /></span>
                 <span className="account-type-content" style={{
                   textAlign: currentLanguage === 'ar' ? 'right' : 'left',
                   width: '100%'
                 }}>
                   <h4 style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}>{t('auth.signup.bannerOwner')}</h4>
                   <p style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}>{t('auth.signup.bannerOwnerDescription')}</p>
                 </span>
                                 
               </button>
             </div>
           </motion.div>
           <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            {/* First Name */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
                             <div className="input-wrapper animated-input">
                 <User className="input-icon" size={18} style={{ 
                   position: 'absolute',
                   left: currentLanguage === 'ar' ? 'auto' : '12px',
                   right: currentLanguage === 'ar' ? '12px' : 'auto',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   zIndex: 1
                 }} />
                 <input
                   id="firstName"
                   name="firstName"
                   placeholder=" "
                   value={form.firstName}
                   onChange={handleChange}
                   className="auth-input"
                   autoComplete="given-name"
                   style={{ 
                     paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                     paddingRight: currentLanguage === 'ar' ? 44 : 16,
                     textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                   }}
                 />
                 <label htmlFor="firstName" style={{ 
                   left: currentLanguage === 'ar' ? 'auto' : 44,
                   right: currentLanguage === 'ar' ? 44 : 'auto'
                 }}>
                   {t('auth.signup.firstName')}
                 </label>
               </div>
            </motion.div>
            {/* Last Name */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
            >
                             <div className="input-wrapper animated-input">
                 <User className="input-icon" size={18} style={{ 
                   position: 'absolute',
                   left: currentLanguage === 'ar' ? 'auto' : '12px',
                   right: currentLanguage === 'ar' ? '12px' : 'auto',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   zIndex: 1
                 }} />
                 <input
                   id="lastName"
                   name="lastName"
                   placeholder=" "
                   value={form.lastName}
                   onChange={handleChange}
                   className="auth-input"
                   autoComplete="family-name"
                   style={{ 
                     paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                     paddingRight: currentLanguage === 'ar' ? 44 : 16,
                     textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                   }}
                 />
                 <label htmlFor="lastName" style={{ 
                   left: currentLanguage === 'ar' ? 'auto' : 44,
                   right: currentLanguage === 'ar' ? 44 : 'auto'
                 }}>
                   {t('auth.signup.lastName')}
                 </label>
               </div>
            </motion.div>
            {/* Company */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.31, duration: 0.5 }}
            >
                             <div className="input-wrapper animated-input">
                 <Building className="input-icon" size={18} style={{ 
                   position: 'absolute',
                   left: currentLanguage === 'ar' ? 'auto' : '12px',
                   right: currentLanguage === 'ar' ? '12px' : 'auto',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   zIndex: 1
                 }} />
                 <input
                   id="company"
                   name="company"
                   placeholder=" "
                   value={form.company}
                   onChange={handleChange}
                   className="auth-input"
                   autoComplete="organization"
                   style={{ 
                     paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                     paddingRight: currentLanguage === 'ar' ? 44 : 16,
                     textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                   }}
                 />
                 <label htmlFor="company" style={{ 
                   left: currentLanguage === 'ar' ? 'auto' : 44,
                   right: currentLanguage === 'ar' ? 44 : 'auto'
                 }}>
                   {t('auth.signup.company')}
                 </label>
               </div>
            </motion.div>
            {/* Email */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.34, duration: 0.5 }}
            >
                             <div className="input-wrapper animated-input">
                 <Mail className="input-icon" size={18} style={{ 
                   position: 'absolute',
                   left: currentLanguage === 'ar' ? 'auto' : '12px',
                   right: currentLanguage === 'ar' ? '12px' : 'auto',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   zIndex: 1
                 }} />
                 <input
                   id="email"
                   name="email"
                   type="email"
                   placeholder=" "
                   value={form.email}
                   onChange={handleChange}
                   className="auth-input"
                   autoComplete="email"
                   style={{ 
                     paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                     paddingRight: currentLanguage === 'ar' ? 44 : 16,
                     textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                   }}
                 />
                 <label htmlFor="email" style={{ 
                   left: currentLanguage === 'ar' ? 'auto' : 44,
                   right: currentLanguage === 'ar' ? 44 : 'auto'
                 }}>
                   {t('auth.signup.email')}
                 </label>
               </div>
            </motion.div>
            {/* Password */}
            <motion.div
              className="form-group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.37, duration: 0.5 }}
            >
                             <div className="input-wrapper animated-input" style={{ position: 'relative' }}>
                 <Lock className="input-icon" size={18} style={{ 
                   position: 'absolute',
                   left: currentLanguage === 'ar' ? 'auto' : '12px',
                   right: currentLanguage === 'ar' ? '12px' : 'auto',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   zIndex: 1
                 }} />
                 <input
                   id="password"
                   name="password"
                   type={showPassword ? 'text' : 'password'}
                   placeholder=" "
                   value={form.password}
                   onChange={handleChange}
                   className="auth-input"
                   autoComplete="new-password"
                   style={{ 
                     paddingLeft: currentLanguage === 'ar' ? 16 : 44, 
                     paddingRight: currentLanguage === 'ar' ? 44 : 16,
                     textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                   }}
                 />
                 <label htmlFor="password" style={{ 
                   left: currentLanguage === 'ar' ? 'auto' : 44,
                   right: currentLanguage === 'ar' ? 44 : 'auto'
                 }}>
                   {t('auth.signup.password')}
                 </label>
                                   <motion.button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    tabIndex={-1}
                    style={{ 
                      position: 'absolute', 
                      left: currentLanguage === 'ar' ? 12 : 'auto',
                      right: currentLanguage === 'ar' ? 'auto' : 12, 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      height: 'auto',
                      width: 'auto',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      zIndex: 2 
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.button>
               </div>
            </motion.div>
            
            {/* Bank Account Fields - Only for Banner Owners */}
            {form.accountType === 'bannerOwner' && (
              <>
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.37, duration: 0.5 }}
                  style={{ marginTop: '20px' }}
                >
                  <div className="auth-notice">
                    <div className="auth-notice-header">
                      <span className="auth-notice-icon" aria-hidden>
                        <Building size={16} />
                      </span>
                      <strong className="auth-notice-title">{t('auth.signup.bankAccountDetails')}</strong>
                    </div>
                    <p className="auth-notice-text">{t('auth.signup.bankAccountDescription')}</p>
                  </div>
                </motion.div>

                {/* Bank Name */}
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.38, duration: 0.5 }}
                >
                                     <div className="input-wrapper animated-input">
                     <Building className="input-icon" size={18} style={{ 
                       position: 'absolute',
                       left: currentLanguage === 'ar' ? 'auto' : '12px',
                       right: currentLanguage === 'ar' ? '12px' : 'auto',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       zIndex: 1
                     }} />
                     <input
                       id="bankAccount.bankName"
                       name="bankAccount.bankName"
                       placeholder=" "
                       value={form.bankAccount.bankName}
                       onChange={handleChange}
                       className="auth-input"
                       style={{ 
                         paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                         paddingRight: currentLanguage === 'ar' ? 44 : 16,
                         textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                       }}
                     />
                     <label htmlFor="bankAccount.bankName" style={{ 
                       left: currentLanguage === 'ar' ? 'auto' : 44,
                       right: currentLanguage === 'ar' ? 44 : 'auto'
                     }}>
                       {t('auth.signup.bankName')}
                     </label>
                   </div>
                </motion.div>

                {/* Account Number */}
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.39, duration: 0.5 }}
                >
                                     <div className="input-wrapper animated-input">
                     <Building className="input-icon" size={18} style={{ 
                       position: 'absolute',
                       left: currentLanguage === 'ar' ? 'auto' : '12px',
                       right: currentLanguage === 'ar' ? '12px' : 'auto',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       zIndex: 1
                     }} />
                     <input
                       id="bankAccount.accountNumber"
                       name="bankAccount.accountNumber"
                       placeholder=" "
                       value={form.bankAccount.accountNumber}
                       onChange={handleChange}
                       className="auth-input"
                       style={{ 
                         paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                         paddingRight: currentLanguage === 'ar' ? 44 : 16,
                         textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                       }}
                     />
                     <label htmlFor="bankAccount.accountNumber" style={{ 
                       left: currentLanguage === 'ar' ? 'auto' : 44,
                       right: currentLanguage === 'ar' ? 44 : 'auto'
                     }}>
                       {t('auth.signup.accountNumber')}
                     </label>
                   </div>
                </motion.div>

                {/* Account Holder Name */}
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.40, duration: 0.5 }}
                >
                                     <div className="input-wrapper animated-input">
                     <User className="input-icon" size={18} style={{ 
                       position: 'absolute',
                       left: currentLanguage === 'ar' ? 'auto' : '12px',
                       right: currentLanguage === 'ar' ? '12px' : 'auto',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       zIndex: 1
                     }} />
                     <input
                       id="bankAccount.accountHolderName"
                       name="bankAccount.accountHolderName"
                       placeholder=" "
                       value={form.bankAccount.accountHolderName}
                       onChange={handleChange}
                       className="auth-input"
                       style={{ 
                         paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                         paddingRight: currentLanguage === 'ar' ? 44 : 16,
                         textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                       }}
                     />
                     <label htmlFor="bankAccount.accountHolderName" style={{ 
                       left: currentLanguage === 'ar' ? 'auto' : 44,
                       right: currentLanguage === 'ar' ? 44 : 'auto'
                     }}>
                       {t('auth.signup.accountHolderName')}
                     </label>
                   </div>
                </motion.div>

                {/* Branch Code */}
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.41, duration: 0.5 }}
                >
                                     <div className="input-wrapper animated-input">
                     <Building className="input-icon" size={18} style={{ 
                       position: 'absolute',
                       left: currentLanguage === 'ar' ? 'auto' : '12px',
                       right: currentLanguage === 'ar' ? '12px' : 'auto',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       zIndex: 1
                     }} />
                     <input
                       id="bankAccount.branchCode"
                       name="bankAccount.branchCode"
                       placeholder=" "
                       value={form.bankAccount.branchCode}
                       onChange={handleChange}
                       className="auth-input"
                       style={{ 
                         paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                         paddingRight: currentLanguage === 'ar' ? 44 : 16,
                         textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                       }}
                     />
                     <label htmlFor="bankAccount.branchCode" style={{ 
                       left: currentLanguage === 'ar' ? 'auto' : 44,
                       right: currentLanguage === 'ar' ? 44 : 'auto'
                     }}>
                       {t('auth.signup.branchCode')}
                     </label>
                   </div>
                </motion.div>

                {/* SWIFT Code */}
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42, duration: 0.5 }}
                >
                                     <div className="input-wrapper animated-input">
                     <Building className="input-icon" size={18} style={{ 
                       position: 'absolute',
                       left: currentLanguage === 'ar' ? 'auto' : '12px',
                       right: currentLanguage === 'ar' ? '12px' : 'auto',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       zIndex: 1
                     }} />
                     <input
                       id="bankAccount.swiftCode"
                       name="bankAccount.swiftCode"
                       placeholder=" "
                       value={form.bankAccount.swiftCode}
                       onChange={handleChange}
                       className="auth-input"
                       style={{ 
                         paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                         paddingRight: currentLanguage === 'ar' ? 44 : 16,
                         textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                       }}
                     />
                     <label htmlFor="bankAccount.swiftCode" style={{ 
                       left: currentLanguage === 'ar' ? 'auto' : 44,
                       right: currentLanguage === 'ar' ? 44 : 'auto'
                     }}>
                       {t('auth.signup.swiftCode')}
                     </label>
                   </div>
                </motion.div>

                {/* IBAN */}
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.43, duration: 0.5 }}
                >
                                     <div className="input-wrapper animated-input">
                     <Building className="input-icon" size={18} style={{ 
                       position: 'absolute',
                       left: currentLanguage === 'ar' ? 'auto' : '12px',
                       right: currentLanguage === 'ar' ? '12px' : 'auto',
                       top: '50%',
                       transform: 'translateY(-50%)',
                       zIndex: 1
                     }} />
                     <input
                       id="bankAccount.iban"
                       name="bankAccount.iban"
                       placeholder=" "
                       value={form.bankAccount.iban}
                       onChange={handleChange}
                       className="auth-input"
                       style={{ 
                         paddingLeft: currentLanguage === 'ar' ? 16 : 44,
                         paddingRight: currentLanguage === 'ar' ? 44 : 16,
                         textAlign: currentLanguage === 'ar' ? 'right' : 'left'
                       }}
                     />
                     <label htmlFor="bankAccount.iban" style={{ 
                       left: currentLanguage === 'ar' ? 'auto' : 44,
                       right: currentLanguage === 'ar' ? 44 : 'auto'
                     }}>
                       {t('auth.signup.iban')}
                     </label>
                   </div>
                </motion.div>
              </>
            )}

            {/* Error/Success Feedback */}
            <AnimatePresence>
              {error && (
                <motion.div
                  key="error"
                  className="auth-alert auth-alert--error"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.98 }}
                  transition={{ duration: 0.35, type: 'spring', stiffness: 300, damping: 22 }}
                  role="alert"
                  aria-live="assertive"
                >
                  <AlertCircle size={22} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{error}</span>
                </motion.div>
              )}
              {message && (
                <motion.div
                  key="message"
                  className="auth-alert auth-alert--success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ flexDirection: 'column', alignItems: 'stretch' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Check size={20} style={{ flexShrink: 0 }} />
                    <span>{message}</span>
                  </div>
                  {existingAccountInfo && (
                    <div className="auth-alert-sub">
                      {t('auth.signup.bothAccountsInfo', {
                        existing: existingAccountInfo.existing,
                        new: existingAccountInfo.new,
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Required Checkbox */}
            <motion.div
              className="remember-me-row"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.39, duration: 0.5 }}
            >
              <label className="remember-me-label">
                <motion.span
                  className="custom-checkbox"
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={agreed}
                  style={{
                    width: 22,
                    height: 22,
                    border: `2px solid ${agreed ? '#123a8f' : '#b0b0b0'}`,
                    borderRadius: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    background: agreed ? '#123a8f22' : '#fff',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                    outline: 'none',
                    position: 'relative',
                  }}
                  whileHover={{ borderColor: '#123a8f' }}
                  whileFocus={{ borderColor: '#123a8f', boxShadow: '0 0 0 2px #123a8f33' }}
                  onClick={e => { e.preventDefault(); setAgreed(v => !v); }}
                  onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setAgreed(v => !v); } }}
                >
                  <motion.span
                    style={{
                      position: 'absolute',
                      width: 18,
                      height: 18,
                      borderRadius: 20,
                      background: agreed ? '#123a8f' : 'transparent',
                      transition: 'background 0.2s',
                      zIndex: 1,
                    }}
                    animate={{ background: agreed ? '#123a8f' : 'transparent' }}
                  />
                  <AnimatePresence>
                    {agreed && (
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
                <span style={{ 
                  color: '#111', 
                  fontWeight: 500,
                  marginLeft: currentLanguage === 'ar' ? '0px' : '8px',
                  marginRight: currentLanguage === 'ar' ? '12px' : '0px'
                }}>
                  {t('auth.signup.agreeToTerms')}
                </span>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </label>
            </motion.div>
            {/* Submit Button */}
            <motion.button
              type="submit"
              className="auth-submit"
              disabled={loading}
              whileHover={{ scale: 1.04, backgroundColor: '#123a8f' }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ marginTop: '20px', marginBottom: 0 }}
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                t('auth.signup.signUp')
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
              {t('auth.signup.alreadyHaveAccount')}{' '}
              <Link href="/login" className="auth-link">
                {t('auth.signup.signIn')}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUp; 