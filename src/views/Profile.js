'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hasAccountType } from '../lib/authService';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Shield, 
  Edit, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Star,
  Settings,
  LogOut,
  Camera,
  Key,
  Globe,
  Plus,
  RefreshCw,
  Lock,
  Trash2,
  ChevronDown
} from 'lucide-react';
import './Profile.css';
import LanguageSwitcherButtons from '../components/LanguageSwitcherButtons';
import Dashboard from './Dashboard';
import AdvertiserDashboard from './AdvertiserDashboard';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, logout, switchAccountType, setUser, setAccountType } = useAuth();
  

  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [tabMenuOpen, setTabMenuOpen] = useState(false);
  const tabNavRef = useRef(null);

  const profileTabs = useMemo(
    () => [
      { id: 'dashboard', label: t('profile.dashboard'), Icon: Globe },
      { id: 'profile', label: t('profile.profile'), Icon: User },
      { id: 'security', label: t('profile.security'), Icon: Shield },
      { id: 'preferences', label: t('profile.preferences'), Icon: Settings },
    ],
    [t]
  );

  const activeTabMeta = profileTabs.find((tab) => tab.id === activeTab) || profileTabs[1];
  const ActiveTabIcon = activeTabMeta.Icon;
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [hasOtherAccount, setHasOtherAccount] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [selectedAccountType, setSelectedAccountType] = useState(user?.accountType || 'advertiser');
  
  // Update selectedAccountType when user account type changes
  useEffect(() => {
    setSelectedAccountType(user?.accountType || 'advertiser');
  }, [user?.accountType]);
  
  // Simple function to handle account type switching
  const handleAccountTypeSwitch = (newType) => {
    setSelectedAccountType(newType);
    if (user?.accountType !== newType) {
      handleSetOrSwitch(newType);
    }
  };

  // Change Password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [changeStep, setChangeStep] = useState(1);
  const [changeForm, setChangeForm] = useState({
    currentPassword: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changeLoading, setChangeLoading] = useState(false);

  // 2FA state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState(1);
  const [twoFAForm, setTwoFAForm] = useState({ code: '' });
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.twoFactorEnabled || false);

  // Preferences state
  const [showEmailPrefs, setShowEmailPrefs] = useState(false);
  const [marketingUpdates, setMarketingUpdates] = useState(false);

  // Delete Account state
  const [deleteType, setDeleteType] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Helper to get first/last name from user or fullName
  function getFirstAndLastName(user) {
    let firstName = user?.firstName || '';
    let lastName = user?.lastName || '';
    if ((!firstName || !lastName) && user?.fullName) {
      const parts = user.fullName.trim().split(' ');
      firstName = firstName || parts[0] || '';
      lastName = lastName || (parts.length > 1 ? parts.slice(1).join(' ') : '');
    }
    return { firstName, lastName };
  }

  // Use helper to initialize formData
  const { firstName: initialFirstName, lastName: initialLastName } = getFirstAndLastName(user);
  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: user?.email || '',
    company: user?.company || ''
  });

  // When user changes, update formData
  useEffect(() => {
    const { firstName, lastName } = getFirstAndLastName(user);
    setFormData(prev => ({
      ...prev,
      firstName,
      lastName,
      email: user?.email || '',
      company: user?.company || ''
    }));
  }, [user]);


  useEffect(() => {
    async function checkOtherAccount() {
      if (!user) return;
      const otherType =
        user.accountType === 'advertiser' ? 'bannerOwner' : 'advertiser';
      try {
        const exists = await hasAccountType(otherType);
        setHasOtherAccount(exists);
      } catch {
        setHasOtherAccount(false);
      }
    }
    checkOtherAccount();
  }, [user]);

  useEffect(() => {
    setTwoFAEnabled(user?.twoFactorEnabled || false);
  }, [user]);

  useEffect(() => {
    if (!tabMenuOpen) return;

    const handlePointerDown = (event) => {
      if (tabNavRef.current && !tabNavRef.current.contains(event.target)) {
        setTabMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setTabMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [tabMenuOpen]);

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    setTabMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      company: user?.company || ''
    });
    setIsEditing(false);
  };


  const handleLogout = () => {
    logout();
  };

  const handleSetOrSwitch = async (desiredType) => {
    setSwitchLoading(true);
    try {
      await switchAccountType(desiredType);
      setSelectedAccountType(desiredType);
    } catch {
      setSelectedAccountType(user?.accountType || 'advertiser');
    } finally {
      setSwitchLoading(false);
    }
  };

  const handleChangePasswordInput = (e) => {
    const { name, value } = e.target;
    setChangeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSendChangeCode = async (e) => {
    e.preventDefault();
    if (!changeForm.currentPassword) {
      toast.error(t('messages.enterCurrentPassword'));
      return;
    }
    setChangeLoading(true);
    try {
      const res = await fetch('/api/auth/request-password-change-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, currentPassword: changeForm.currentPassword })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('messages.codeSentToEmail2'));
        setChangeStep(2);
      } else {
        toast.error(data.message || t('messages.failedToSendCode'));
      }
    } catch (err) {
      toast.error(t('messages.failedToSendCode'));
    } finally {
      setChangeLoading(false);
    }
  };

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();
    if (!changeForm.code || !changeForm.newPassword || !changeForm.confirmPassword) {
      toast.error(t('messages.fillInAllFields'));
      return;
    }
    if (changeForm.newPassword !== changeForm.confirmPassword) {
      toast.error(t('messages.passwordsDoNotMatch'));
      return;
    }
    if (changeForm.newPassword.length < 8) {
      toast.error(t('messages.passwordMustBe8Characters'));
      return;
    }
    setChangeLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          code: changeForm.code,
          newPassword: changeForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('messages.passwordChangedSuccessfully'));
        setShowChangePassword(false);
        setChangeStep(1);
        setChangeForm({ currentPassword: '', code: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.message || t('messages.failedToChangePassword'));
      }
    } catch (err) {
      toast.error(t('messages.failedToChangePassword'));
    } finally {
      setChangeLoading(false);
    }
  };

  const handleEnable2FA = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    try {
      const res = await fetch('/api/auth/enable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('messages.twoFactorCodeSent'));
        setTwoFAStep(2);
      } else {
        toast.error(data.message || t('messages.failedToSendCode'));
      }
    } catch (err) {
      toast.error(t('messages.failedToSendCode'));
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    if (!twoFAForm.code) {
      toast.error(t('messages.enterTheCode'));
      return;
    }
    setTwoFALoading(true);
    try {
      const res = await fetch('/api/auth/confirm-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code: twoFAForm.code })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('messages.twoFactorEnabled'));
        setShow2FAModal(false);
        setTwoFAStep(1);
        setTwoFAForm({ code: '' });
        setTwoFAEnabled(true);
        // Optionally update user context/state here
      } else {
        toast.error(data.message || t('messages.failedToEnable2FA'));
      }
    } catch (err) {
      toast.error(t('messages.failedToEnable2FA'));
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await fetch('/api/auth/disable-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(t('messages.twoFactorDisabled'));
        setTwoFAEnabled(false);
      } else {
        toast.error(data.message || t('messages.failedToDisable2FA'));
      }
    } catch (err) {
              toast.error(t('messages.failedToDisable2FA'));
    } finally {
      setTwoFALoading(false);
    }
  };

  // Add this handler for dashboard tab
  const handleDashboardRedirect = () => {
    if (user?.accountType === 'banner_owner') {
      router.push('/dashboard');
    } else if (user?.accountType === 'advertiser') {
      router.push('/advertiser-dashboard');
    } else {
      router.push('/');
    }
  };

  // Placeholder for delete account API call
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'deletemyaccount') {
              toast.error(t('messages.mustTypeToConfirm'));
      return;
    }
    if (!deleteType) {
              toast.error(t('messages.selectAccountTypesToDelete'));
      return;
    }
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        toast.error(t('messages.authenticationRequired'));
        return;
      }

      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deleteType })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Close the modal
      setShowDeleteModal(false);
      setDeleteConfirm('');
      setDeleteType('');
      
      // If user deleted their current account type, try to switch to the other one if exists; otherwise logout
      if (deleteType === 'both' || deleteType === user.accountType || (user.accountType === 'bannerOwner' && deleteType === 'banner_owner')) {
        // Attempt automatic switch
        const otherType = user.accountType === 'advertiser' ? 'bannerOwner' : 'advertiser';
        try {
          const switchRes = await fetch('/api/auth/switch-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          });
          if (switchRes.ok) {
            const data = await switchRes.json();
            const useLocal = Boolean(localStorage.getItem('token'));
            if (useLocal) {
              localStorage.setItem('token', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
            } else {
              sessionStorage.setItem('token', data.token);
              sessionStorage.setItem('user', JSON.stringify(data.user));
            }
            if (setUser) setUser(data.user);
            if (setAccountType) setAccountType(data.user.accountType);
            window.location.reload();
            return;
          }
        } catch (_) {}
        // If switch failed or other account doesn't exist, logout
        logout();
      } else {
        // Deleted other account type only; just refresh UI
        window.location.reload();
      }
    } catch (err) {
      console.error('Delete account error:', err);
              toast.error(err.message || t('messages.failedToDeleteAccount'));
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    button.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  }

  return (
    <div className="profile-page">
      <div className="profile-container profile-container-shell">
        <div className="profile-inner">
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="profile-header"
          >
            <div className="header-content" style={{flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
              <div className="user-avatar">
                <User size={32} />
              </div>
              <div className="header-text">
                <h1>{t('profile.welcomeUser', {
                  username: getFirstAndLastName(user).firstName || getFirstAndLastName(user).lastName
                    ? `${getFirstAndLastName(user).firstName || ''} ${getFirstAndLastName(user).lastName || ''}`.trim()
                    : user?.fullName
                      ? user.fullName
                      : user?.email
                        ? user.email
                        : 'User'
                })}</h1>
                <p>{t('profile.manageAccount')}</p>
              </div>
            </div>
            {/* Modern Account Type Switch */}
                        <div className="account-type-toggle-row">
              <div className="simple-toggle">
                <button
                  className={`simple-btn ${selectedAccountType === 'bannerOwner' ? 'active purple' : ''}`}
                  onClick={() => handleAccountTypeSwitch('bannerOwner')}
                  disabled={switchLoading}
                >
                  {t('profile.bannerOwner')}
                </button>
                <button
                  className={`simple-btn ${selectedAccountType === 'advertiser' ? 'active blue' : ''}`}
                  onClick={() => handleAccountTypeSwitch('advertiser')}
                  disabled={switchLoading}
                >
                  {t('profile.advertiser')}
                </button>
              </div>
            </div>
            <div className="header-actions">
              <motion.button
                className="logout-btn"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={16} />
                {t('profile.logout')}
              </motion.button>
            </div>
          </motion.div>

          {/* Account Switcher */}
          <AnimatePresence>
            {false && showAccountSwitcher && (
              <motion.div>REMOVED</motion.div>
            )}
          </AnimatePresence>

          <div className="profile-tab-nav" ref={tabNavRef}>
            <motion.div
              className="profile-tabs profile-tabs--desktop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {profileTabs.map(({ id, label, Icon }) => (
                <motion.button
                  key={id}
                  type="button"
                  className={`tab-btn ${activeTab === id ? 'active' : ''}`}
                  onClick={() => handleTabSelect(id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={16} />
                  {label}
                </motion.button>
              ))}
            </motion.div>

            <div className="profile-tabs-dropdown">
              <button
                type="button"
                className="profile-tabs-dropdown-trigger"
                aria-haspopup="listbox"
                aria-expanded={tabMenuOpen}
                onClick={() => setTabMenuOpen((open) => !open)}
              >
                <span className="profile-tabs-dropdown-current">
                  <ActiveTabIcon size={18} aria-hidden />
                  <span>{activeTabMeta.label}</span>
                </span>
                <ChevronDown
                  size={20}
                  className={`profile-tabs-dropdown-chevron${tabMenuOpen ? ' is-open' : ''}`}
                  aria-hidden
                />
              </button>
              <AnimatePresence>
                {tabMenuOpen && (
                  <motion.ul
                    className="profile-tabs-dropdown-menu"
                    role="listbox"
                    aria-label={currentLanguage === 'ar' ? 'أقسام الحساب' : 'Account sections'}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {profileTabs.map(({ id, label, Icon }) => (
                      <li key={id} role="option" aria-selected={activeTab === id}>
                        <button
                          type="button"
                          className={`profile-tabs-dropdown-item${activeTab === id ? ' active' : ''}`}
                          onClick={() => handleTabSelect(id)}
                        >
                          <Icon size={18} aria-hidden />
                          <span>{label}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                className="profile-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="profile-card"
                  variants={itemVariants}
                >
                  <div className="profile-card-header">
                    <div className="header-left">
                                          <h2>{t('profile.profileInformation')}</h2>
                    <p>{t('profile.updatePersonalInfo')}</p>
                    </div>
                    <motion.button
                      className="edit-btn"
                      onClick={() => setIsEditing(!isEditing)}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isEditing ? <X size={20} /> : <Edit size={20} />}
                    </motion.button>
                  </div>

                  <div className="profile-info">
                    <div className="info-section">
                      <motion.div 
                        className="info-item"
                        variants={itemVariants}
                      >
                        <label>
                          <User size={14} />
                          {t('profile.firstName')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="edit-input"
                            placeholder={t('profile.enterFirstName')}
                          />
                        ) : (
                          <span>{getFirstAndLastName(user).firstName || t('profile.notProvided')}</span>
                        )}
                      </motion.div>

                      <motion.div 
                        className="info-item"
                        variants={itemVariants}
                      >
                        <label>
                          <User size={14} />
                          {t('profile.lastName')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="edit-input"
                            placeholder={t('profile.enterLastName')}
                          />
                        ) : (
                          <span>{getFirstAndLastName(user).lastName || t('profile.notProvided')}</span>
                        )}
                      </motion.div>

                      <motion.div 
                        className="info-item"
                        variants={itemVariants}
                      >
                        <label>
                          <Mail size={14} />
                          {t('profile.email')}
                        </label>
                        <span>{user.email}</span>
                      </motion.div>

                      <motion.div 
                        className="info-item"
                        variants={itemVariants}
                      >
                        <label>
                          <Building size={14} />
                          {t('profile.company')}
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="edit-input"
                            placeholder={t('profile.enterCompanyName')}
                          />
                        ) : (
                          <span>{user.company || t('profile.notProvided')}</span>
                        )}
                      </motion.div>

                      <motion.div 
                        className="info-item"
                        variants={itemVariants}
                      >
                        <label>
                          <Globe size={14} />
                          {t('profile.accountType')}
                        </label>
                        <span className={`account-type account-type-pill ${user.accountType}`} style={user.accountType === 'bannerOwner' ? { background: '#ede9fe', color: '#8b5cf6', border: 'none', paddingLeft: '15px' } : { paddingLeft: '15px' }}>
                          {user.accountType === 'bannerOwner' ? <Building size={16} style={{ marginRight: 12, verticalAlign: 'middle', color: '#8b5cf6' }} /> : <User size={16} style={{marginRight: 6, verticalAlign: 'middle'}} />}
                          {user.accountType === 'bannerOwner' ? t('profile.bannerOwner') : t('profile.advertiser')}
                        </span>
                      </motion.div>

                    </div>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.div 
                          className="edit-actions"
                          initial={{ opacity: 0, y: 10, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -10, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.button
                            className="btn-save"
                            onClick={handleSave}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Save size={16} />
                            {t('profile.saveChanges')}
                          </motion.button>
                          <motion.button
                            className="btn-cancel"
                            onClick={handleCancel}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={16} />
                            {t('profile.cancel')}
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>


                </motion.div>

                {/* Account Statistics card removed entirely */}
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div 
                key="security"
                className="profile-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="profile-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="card-header">
                    <h2>{t('profile.securitySettings')}</h2>
                    <p>{t('profile.manageAccountSecurity')}</p>
                  </div>
                  <div className="security-options">
                    <div className="security-item">
                      <div className="security-icon">
                        <Key size={20} />
                      </div>
                      <div className="security-content">
                        <h3>{t('profile.changePassword')}</h3>
                        <p>{t('profile.updateAccountPassword')}</p>
                      </div>
                      <button className="security-btn" onClick={() => setShowChangePassword(true)}>{t('profile.update')}</button>
                    </div>
                    
                    {/* Change Password Modal */}
                    <AnimatePresence>
                      {showChangePassword && (
                        <motion.div
                          className="change-password-modal"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                            borderRadius: 18,
                            boxShadow: '0 8px 32px rgba(60,72,100,0.13)',
                            border: '1.5px solid #e0e7ef',
                            padding: '36px 32px 28px 32px',
                            marginTop: 16,
                            maxWidth: 420,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 18,
                            alignItems: 'center',
                            position: 'relative',
                          }}
                        >
                          <button style={{ float: 'right', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', position: 'absolute', top: 18, right: 18, color: '#64748b' }} onClick={() => { setShowChangePassword(false); setChangeStep(1); setChangeForm({ currentPassword: '', code: '', newPassword: '', confirmPassword: '' }); }}>&times;</button>
                          <h3 style={{ marginBottom: 18, fontWeight: 800, fontSize: 24, color: '#123a8f', letterSpacing: '-0.01em', textAlign: 'center' }}>{t('profile.changePassword')}</h3>
                          {changeStep === 1 && (
                            <form onSubmit={handleSendChangeCode}>
                              <div className="form-group">
                                <div className="input-wrapper animated-input">
                                  <Lock className="input-icon" size={18} />
                                  <input
                                    id="change-current-password"
                                    type="password"
                                    name="currentPassword"
                                    value={changeForm.currentPassword}
                                    onChange={handleChangePasswordInput}
                                    placeholder=" "
                                    className="auth-input"
                                    required
                                    autoComplete="current-password"
                                    style={{ paddingLeft: 44 }}
                                  />
                                  <label htmlFor="change-current-password" style={{ left: 44 }}>
                                    {t('profile.currentPassword')}
                                  </label>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
                                  <motion.button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() => router.push('/forgot-password')}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#123a8f',
                                      fontSize: 14,
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      textDecoration: 'underline',
                                      padding: 0,
                                      margin: 0,
                                      fontFamily: 'inherit'
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {t('profile.forgotPassword')}
                                  </motion.button>
                                </div>
                              </div>
                              <button type="submit" className="auth-submit" disabled={changeLoading}>
                                {changeLoading ? t('profile.sending') : t('profile.sendCode')}
                              </button>
                            </form>
                          )}
                          {changeStep === 2 && (
                            <form onSubmit={handleSubmitChangePassword}>
                              <div className="form-group">
                                <div className="input-wrapper animated-input">
                                  <input
                                    id="change-code"
                                    type="text"
                                    name="code"
                                    value={changeForm.code}
                                    onChange={handleChangePasswordInput}
                                    placeholder=" "
                                    className="auth-input"
                                    required
                                    maxLength={6}
                                    style={{ paddingLeft: 44 }}
                                  />
                                  <label htmlFor="change-code" style={{ left: 44 }}>
                                    {t('profile.verificationCode')}
                                  </label>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="input-wrapper animated-input">
                                  <Lock className="input-icon" size={18} />
                                  <input
                                    id="change-new-password"
                                    type="password"
                                    name="newPassword"
                                    value={changeForm.newPassword}
                                    onChange={handleChangePasswordInput}
                                    placeholder=" "
                                    className="auth-input"
                                    required
                                    autoComplete="new-password"
                                    style={{ paddingLeft: 44 }}
                                  />
                                  <label htmlFor="change-new-password" style={{ left: 44 }}>
                                    {t('profile.newPassword')}
                                  </label>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="input-wrapper animated-input">
                                  <Lock className="input-icon" size={18} />
                                  <input
                                    id="change-confirm-password"
                                    type="password"
                                    name="confirmPassword"
                                    value={changeForm.confirmPassword}
                                    onChange={handleChangePasswordInput}
                                    placeholder=" "
                                    className="auth-input"
                                    required
                                    autoComplete="new-password"
                                    style={{ paddingLeft: 44 }}
                                  />
                                  <label htmlFor="change-confirm-password" style={{ left: 44 }}>
                                    {t('profile.confirmNewPassword')}
                                  </label>
                                </div>
                              </div>
                              <button type="submit" className="auth-submit" disabled={changeLoading}>
                                {changeLoading ? t('profile.changing') : t('profile.changePassword')}
                              </button>
                            </form>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="security-item">
                      <div className="security-icon">
                        <Shield size={20} />
                      </div>
                      <div className="security-content">
                        <h3>{t('profile.twoFactorAuthentication')}</h3>
                        <p>{t('profile.addExtraSecurity')}</p>
                      </div>
                      {twoFAEnabled ? (
                        <button className="security-btn" onClick={handleDisable2FA} disabled={twoFALoading} style={{ background: '#ef4444', color: '#fff' }}>
                          {twoFALoading ? t('profile.disabling') : t('profile.disable')}
                        </button>
                      ) : (
                        <button className="security-btn" onClick={() => setShow2FAModal(true)}>{t('profile.enable')}</button>
                      )}
                    </div>
                    
                    {/* 2FA Modal */}
                    <AnimatePresence>
                      {show2FAModal && (
                        <motion.div
                          className="change-password-modal"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                            borderRadius: 18,
                            boxShadow: '0 8px 32px rgba(60,72,100,0.13)',
                            border: '1.5px solid #e0e7ef',
                            padding: '36px 32px 28px 32px',
                            marginTop: 16,
                            maxWidth: 420,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 18,
                            alignItems: 'center',
                            position: 'relative',
                          }}
                        >
                          <button style={{ float: 'right', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', position: 'absolute', top: 18, right: 18, color: '#64748b' }} onClick={() => { setShow2FAModal(false); setTwoFAStep(1); setTwoFAForm({ code: '' }); }}>&times;</button>
                          <h3 style={{ marginBottom: 18, fontWeight: 800, fontSize: 24, color: '#123a8f', letterSpacing: '-0.01em', textAlign: 'center' }}>{t('profile.enableTwoFactorAuthentication')}</h3>
                          {twoFAStep === 1 && (
                            <form onSubmit={handleEnable2FA}>
                              <button type="submit" className="auth-submit" disabled={twoFALoading}>
                                {twoFALoading ? t('profile.sending') : t('profile.sendCode')}
                              </button>
                            </form>
                          )}
                          {twoFAStep === 2 && (
                            <form onSubmit={handleVerify2FA}>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="code"
                                  value={twoFAForm.code}
                                  onChange={e => setTwoFAForm({ code: e.target.value })}
                                  placeholder={t('profile.enter6DigitCode')}
                                  className="auth-input"
                                  maxLength={6}
                                  required
                                />
                              </div>
                              <button type="submit" className="auth-submit" disabled={twoFALoading}>
                                {twoFALoading ? t('profile.verifying') : t('profile.verify')}
                              </button>
                            </form>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                            {/* Delete Account Button */}
        <div className="security-item">
          <div className="security-icon" style={{ background: '#dc2626', borderRadius: 8, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trash2 size={20} color="#ffffff" />
          </div>
          <div className="security-content">
            <h3 style={{ color: '#dc2626' }}>{t('profile.deleteAccount')}</h3>
            <p style={{ color: '#b91c1c' }}>{t('profile.permanentlyDeleteAccount')}</p>
          </div>
          <button
            className="security-btn"
            style={{ background: '#fee2e2', color: '#dc2626', fontWeight: 700, border: 'none', boxShadow: '0 2px 8px #fecaca22' }}
            onClick={() => setShowDeleteModal(true)}
          >
            {t('profile.deleteAccount')}
          </button>
        </div>
        
        {/* Delete Account Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className="change-password-modal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'linear-gradient(135deg, #fee2e2 60%, #fecaca 100%)',
                borderRadius: 18,
                boxShadow: '0 8px 32px rgba(220,38,38,0.13)',
                border: '1.5px solid #fecaca',
                padding: '36px 32px 28px 32px',
                marginTop: 16,
                maxWidth: 420,
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <button style={{ float: 'right', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', position: 'absolute', top: 18, right: 18, color: '#b91c1c' }} onClick={() => setShowDeleteModal(false)}>&times;</button>
                          <h3 style={{ color: '#dc2626', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Trash2 size={22} /> {t('profile.deleteAccount')}
            </h3>
                              <ul style={{ color: '#b91c1c', fontSize: 15, marginBottom: 12, marginTop: 0, paddingLeft: 20 }}>
                  <li>{t('profile.deleteWarning1')}</li>
                  <li>{t('profile.deleteWarning2')}</li>
                  <li>{t('profile.deleteWarning3')}</li>
                  <li>{t('profile.deleteWarning4')}</li>
                </ul>
                              <div style={{ marginBottom: 12 }}>
                  <label style={{ fontWeight: 600, color: '#b91c1c', marginRight: 12 }}>{t('profile.delete')}:</label>
                  <label style={{ marginRight: 16 }}>
                    <input type="radio" name="deleteType" value="advertiser" checked={deleteType === 'advertiser'} onChange={e => setDeleteType(e.target.value)} /> {t('profile.advertiser')}
                  </label>
                  <label style={{ marginRight: 16 }}>
                    <input type="radio" name="deleteType" value="bannerOwner" checked={deleteType === 'bannerOwner'} onChange={e => setDeleteType(e.target.value)} /> {t('profile.bannerOwner')}
                  </label>
                  <label>
                    <input type="radio" name="deleteType" value="both" checked={deleteType === 'both'} onChange={e => setDeleteType(e.target.value)} /> {t('profile.both')}
                  </label>
                </div>
                              <div style={{ marginBottom: 12 }}>
                  <label style={{ fontWeight: 600, color: '#b91c1c', marginRight: 8 }}>{t('profile.typeToConfirm')} <span style={{ fontFamily: 'monospace', background: '#fee2e2', padding: '2px 6px', borderRadius: 4 }}>deletemyaccount</span> {t('profile.toConfirm')}:</label>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={e => setDeleteConfirm(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: 6, border: '1.5px solid #fecaca', outline: 'none', fontSize: 15, width: 180, marginLeft: 8 }}
                  />
                </div>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                style={{ background: '#dc2626', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 28px', fontSize: 16, cursor: 'pointer', marginTop: 8, boxShadow: '0 2px 8px #fecaca22', transition: 'background 0.2s' }}
              >
                {deleteLoading ? t('profile.deleting') : t('profile.deleteAccount')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div 
                key="preferences"
                className="profile-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="profile-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="card-header">
                    <h2>{t('profile.preferences')}</h2>
                    <p>{t('profile.customizeExperience')}</p>
                  </div>
                  <div className="preferences-options">
                    <div className="preference-item">
                      <div className="preference-icon">
                        <Globe size={20} />
                      </div>
                      <div className="preference-content">
                        <h3>{t('profile.language')}</h3>
                        <p>{t('profile.languageDescription')}</p>
                        <div style={{ marginTop: 12 }}>
                          <LanguageSwitcherButtons variant="profile" />
                        </div>
                      </div>
                    </div>
                    <div className="preference-item">
                      <div className="preference-icon">
                        <Mail size={20} />
                      </div>
                      <div className="preference-content">
                        <h3>{t('profile.emailNotifications')}</h3>
                        <p>{t('profile.manageEmailPreferences')}</p>
                      </div>
                      <button className="preference-btn" onClick={() => setShowEmailPrefs(v => !v)}>
                        {t('profile.configure')}
                      </button>
                    </div>
                    {/* Email Preferences Modal/Inline */}
                    {showEmailPrefs && (
                      <div style={{
                        background: '#f8fafc',
                        border: '1.5px solid #e0e7ef',
                        borderRadius: 12,
                        boxShadow: '0 2px 12px rgba(60,72,100,0.07)',
                        padding: 24,
                        marginTop: 12,
                        marginBottom: 12,
                        maxWidth: 380,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 18
                      }}>
                        <h4 style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{t('profile.emailNotificationSettings')}</h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <label style={{ fontWeight: 500, fontSize: 16 }}>
                            <input
                              type="checkbox"
                              checked={marketingUpdates}
                              onChange={e => setMarketingUpdates(e.target.checked)}
                              style={{ marginRight: 8, width: 18, height: 18 }}
                            />
                            {t('profile.notifyMeWithUpdates')}
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="preference-item">
                      <div className="preference-icon">
                        <Settings size={20} />
                      </div>
                      <div className="preference-content">
                        <h3>{t('profile.privacySettings')}</h3>
                        <p>{t('profile.controlPrivacyOptions')}</p>
                      </div>
                      <button className="preference-btn">{t('profile.manage')}</button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                className="profile-content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {user?.accountType === 'bannerOwner' && <Dashboard />}
                {user?.accountType === 'advertiser' && <AdvertiserDashboard />}
              </motion.div>
            )}
          </AnimatePresence>


        </div>
      </div>
    </div>
  );
};

export default Profile; 
