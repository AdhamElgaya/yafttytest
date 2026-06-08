'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Building, Check } from 'lucide-react';
import { motion as m } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import './Auth.css';
import toast from 'react-hot-toast';

// Helper function to determine profile route
const getProfileRoute = () => {
  return '/profile';
};

const ChooseAccountType = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleSelect = async (type) => {
    setSelected(type);
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/auth/set-account-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accountType: type })
      });
      const data = await res.json();
      if (res.ok) {
        // If backend returned a new token (e.g., when switching/creating the other type), store it alongside the user
        if (data.token) {
          if (localStorage.getItem('token')) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else if (sessionStorage.getItem('token')) {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.user));
          }
        } else {
          // Persist updated user in the same storage where token is stored
          if (localStorage.getItem('token')) {
            localStorage.setItem('user', JSON.stringify(data.user));
          } else if (sessionStorage.getItem('token')) {
            sessionStorage.setItem('user', JSON.stringify(data.user));
          }
        }
        setUser(data.user);
        router.push(getProfileRoute());
      } else {
        toast.error(data.message || t('auth.chooseAccountType.failedToSetAccountType'));
      }
    } catch (err) {
      toast.error(t('auth.chooseAccountType.failedToSetAccountType'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <m.div
          className="auth-card"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <m.h2
            className="auth-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t('auth.chooseAccountType.title')}
          </m.h2>
          <div style={{ marginBottom: 30 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6 }}>
            <button
              type="button"
              className={`account-type-btn${selected === 'advertiser' ? ' active' : ''}`}
              onClick={() => handleSelect('advertiser')}
              style={{ width: '100%', position: 'relative' }}
              disabled={loading}
            >
              <span className="account-type-icon"><User size={24} /></span>
              <span className="account-type-content">
                <h4>{t('auth.chooseAccountType.advertiser')}</h4>
                <p>{t('auth.chooseAccountType.advertiserDescription')}</p>
              </span>
              {selected === 'advertiser' && (
                <m.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  style={{ position: 'absolute', right: 28, top: 32, display: 'flex', alignItems: 'center', color: '#10b981', fontSize: 22 }}
                >
                  <Check className="check-icon" />
                </m.span>
              )}
            </button>
            <button
              type="button"
              className={`account-type-btn${selected === 'bannerOwner' ? ' active' : ''}`}
              onClick={() => handleSelect('bannerOwner')}
              style={{ width: '100%', position: 'relative' }}
              disabled={loading}
            >
              <span className="account-type-icon"><Building size={24} /></span>
              <span className="account-type-content">
                <h4>{t('auth.chooseAccountType.bannerOwner')}</h4>
                <p>{t('auth.chooseAccountType.bannerOwnerDescription')}</p>
              </span>
              {selected === 'bannerOwner' && (
                <m.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  style={{ position: 'absolute', right: 28, top: 32, display: 'flex', alignItems: 'center', color: '#10b981', fontSize: 22 }}
                >
                  <Check className="check-icon" />
                </m.span>
              )}
            </button>
          </div>
        </m.div>
      </div>
    </div>
  );
};

export default ChooseAccountType; 