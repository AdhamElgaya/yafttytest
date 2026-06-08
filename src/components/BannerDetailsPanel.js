'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Calendar, Ruler, Tag, MapPin, ExternalLink, Clock, User, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useBookingCart } from '../contexts/BookingCartContext';
import { bookingAuthHeaders } from '../lib/bookingClient';
import { uploadBookingContentFile } from '../lib/cartContentUpload';
import { validateBookingDates } from '../lib/bookingValidation';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../translations';
import { formatEgpWithCurrency } from '../lib/money';
import { localizeDigitsInString } from '../lib/localeFormat';
import { useLocaleFormat } from '../hooks/useLocaleFormat';

function isSuccessBookingMessage(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes('successfully') ||
    message.includes('تم ارسال') ||
    message.includes('تم رفع') ||
    message.includes('بنجاح')
  );
}

const BannerDetailsPanel = ({ banner, isOpen, onClose, isMobile }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { addItem, items: cartItems } = useBookingCart();
  const { currentLanguage } = useLanguage();
  const { t } = useTranslations(currentLanguage);
  const locale = useLocaleFormat();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    campaignDescription: '',
    contentType: 'photo'
  });
  const [contentFiles, setContentFiles] = useState([]);
  const [uploadedContentUrls, setUploadedContentUrls] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  if (!isOpen || !banner) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    return type === 'RGB' ? '#10b981' : '#123a8f';
  };

  const getTrafficColor = (traffic) => {
    switch (traffic) {
      case 'low':
        return '#10b981'; // Green
      case 'moderate':
        return '#f59e0b'; // Orange
      case 'high':
        return '#ef4444'; // Red
      default:
        return '#64748b'; // Gray
    }
  };

  const getTrafficText = (traffic) => {
    switch (traffic) {
      case 'low':
        return t('map.banner.trafficLevels.low');
      case 'moderate':
        return t('map.banner.trafficLevels.moderate');
      case 'high':
        return t('map.banner.trafficLevels.high');
      default:
        return t('map.banner.trafficLevels.notSpecified');
    }
  };

  const formatEGP = (amount) => {
    if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
      return t('map.banner.notAvailable');
    }
    return formatEgpWithCurrency(amount, currentLanguage);
  };

  const isAdvertiser = user && (user.accountType === 'advertiser' || user.accountType === 'advertiser');

  const handleContentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setBookingMessage('');

    try {
      setUploadedContentUrls((prev) => {
        prev.forEach((url) => {
          if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
        });
        return [URL.createObjectURL(file)];
      });
      setContentFiles([file]);
      setBookingMessage(t('map.banner.messages.contentUploaded'));
      setTimeout(() => setBookingMessage(''), 3000);
    } catch (error) {
      console.error('Content preview error:', error);
      setBookingMessage(t('map.banner.messages.uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  const removeContentFile = (index) => {
    setUploadedContentUrls((prev) => {
      const url = prev[index];
      if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setContentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const buildCartPayload = () => ({
    bannerId: banner._id,
    banner: {
      _id: banner._id,
      location: banner.location,
      size: banner.size,
      type: banner.type,
      pricePerMonth: banner.pricePerMonth,
      bannerImageUrl: banner.bannerImageUrl || banner.image || banner.banner_image_url,
      start_date: banner.start_date,
      end_date: banner.end_date,
    },
    startDate: bookingForm.startDate,
    endDate: bookingForm.endDate,
    campaignDescription: bookingForm.campaignDescription,
    contentType: bookingForm.contentType,
    contentUrls: [],
  });

  const validateBookingForm = () => {
    const dateError = validateBookingDates(
      banner,
      bookingForm.startDate,
      bookingForm.endDate,
      t
    );
    if (dateError) {
      setValidationMessage(dateError);
      return false;
    }
    setValidationMessage('');
    return true;
  };

  const resetBookingForm = () => {
    uploadedContentUrls.forEach((url) => {
      if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    setShowBookingForm(false);
    setBookingForm({ startDate: '', endDate: '', campaignDescription: '', contentType: 'photo' });
    setContentFiles([]);
    setUploadedContentUrls([]);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    setBookingMessage('');
    if (!validateBookingForm()) return;

    const hadItem = cartItems.some((i) => i.bannerId === banner._id);
    addItem(buildCartPayload(), contentFiles[0] || null);
    toast.success(hadItem ? t('map.banner.alreadyInCart') : t('map.banner.addedToCart'));
    resetBookingForm();
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    if (!validateBookingForm()) return;
    if (!user?._id) {
      router.push('/login?next=/map');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('bannerId', banner._id);
      formData.append('startDate', bookingForm.startDate);
      formData.append('endDate', bookingForm.endDate);
      formData.append('campaignDescription', bookingForm.campaignDescription);
      formData.append('contentType', bookingForm.contentType);

      let contentUrls = [];
      if (contentFiles[0]) {
        contentUrls = await uploadBookingContentFile(contentFiles[0]);
      }
      contentUrls.forEach((url) => formData.append('contentUrls', url));

      const headers = await bookingAuthHeaders();
      const response = await fetch('/api/booking/create', {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const successMessage =
          currentLanguage === 'ar' ? 'تم ارسال طلبك' : t('map.banner.messages.bookingSubmitted');
        toast.success(successMessage);
        resetBookingForm();
        onClose?.();
        router.push('/advertiser-dashboard');
      } else {
        setBookingMessage(data.message || t('map.banner.messages.bookingFailed'));
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingMessage(t('map.banner.messages.bookingError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  const panelStyle = {
    position: 'fixed',
    top: '50%',
    left: isMobile ? '50%' : '60px',
    width: isMobile ? '94vw' : '460px',
    maxWidth: isMobile ? '94vw' : '480px',
    maxHeight: isMobile ? '88vh' : '82vh',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
    zIndex: 1000,
    transform: isOpen 
      ? (isMobile ? 'translate(-50%, -50%) scale(1)' : 'translateY(-50%) scale(1)')
      : (isMobile ? 'translate(-50%, -50%) scale(0.97)' : 'translateY(-48%) scale(0.98)'),
    opacity: isOpen ? 1 : 0,
    transition: 'transform 0.25s ease, opacity 0.25s ease',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)',
    color: 'white',
    flexShrink: 0,
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '20px',
    minHeight: 0,
    background: '#ffffff',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 999,
        }}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div style={panelStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
              {t('map.banner.details')}
            </h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
              {banner.location}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Success Message - Prominent Display */}
          {bookingMessage && isSuccessBookingMessage(bookingMessage) && (
            <div style={{
              padding: '20px',
              borderRadius: '16px',
              marginBottom: '24px',
              fontSize: '16px',
              fontWeight: '600',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              color: '#166534',
              border: '2px solid #bbf7d0',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)',
              textAlign: 'center',
              lineHeight: '1.6',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #10b981, #059669, #047857)',
                borderRadius: '16px 16px 0 0'
              }} />
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
              {bookingMessage}
            </div>
          )}

          {/* Banner Image */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              width: '100%',
              height: '200px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#f8fafc',
              border: '2px dashed #cbd5e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={banner.bannerImageUrl}
                alt="Banner"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <div style={{ marginTop: '12px', textAlign: 'center' }}>
              <a
                href={banner.bannerImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: '#f1f5f9',
                  borderRadius: '8px',
                  color: '#475569',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.background = '#e2e8f0'}
                onMouseLeave={(e) => e.target.style.background = '#f1f5f9'}
              >
                            <ExternalLink size={14} />
            {t('map.banner.viewFullSize')}
              </a>
            </div>
          </div>

          {/* Banner Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px' }}>
              📋 {t('map.banner.information')}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                <MapPin size={16} color="#64748b" />
                <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              {t('map.banner.location')}
            </div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                    {banner.location}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                <Ruler size={16} color="#64748b" />
                <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              {t('map.banner.size')}
            </div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                    {localizeDigitsInString(banner.size, currentLanguage)}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                <Tag size={16} color="#64748b" />
                <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              {t('map.banner.type')}
            </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: getTypeColor(banner.type), 
                    fontWeight: '600' 
                  }}>
                    {banner.type}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#64748b'
                }}>
                  🚗
                </div>
                <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              {t('map.banner.traffic')}
            </div>
                                     <div style={{ 
                     fontSize: '14px', 
                     color: getTrafficColor(banner.traffic), 
                     fontWeight: '600',
                     textTransform: 'capitalize'
                   }}>
                     {getTrafficText(banner.traffic)}
                   </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#64748b'
                }}>
                  💰
                </div>
                <div>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              {t('map.banner.pricePerMonth')}
            </div>
                  <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '700' }}>
                    {formatEGP(banner.pricePerMonth)}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '8px',
              }}>
                                 <Calendar size={16} color="#64748b" />
                 <div>
                   <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                     {t('map.banner.added')}
                   </div>
                   <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600' }}>
                     {formatDate(banner.createdAt)}
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Check Availability Button for Advertisers */}
          {isAdvertiser && (
            <div style={{ marginBottom: '24px' }}>
                          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px' }}>
              🎯 {t('map.banner.bookThisBanner')}
            </h3>
              
              {!showBookingForm ? (
                <button
                  onClick={() => setShowBookingForm(true)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(18, 58, 143, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(18, 58, 143, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(18, 58, 143, 0.3)';
                  }}
                >
                              <Clock size={20} />
            {t('map.banner.checkAvailability')}
                </button>
              ) : (
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                }}>
                  <h4 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '16px' }}>
                    📅 Booking Request
                  </h4>
                  
                                     <form onSubmit={handleBookingSubmit} noValidate>
                                         <div style={{ marginBottom: '16px' }}>
                                   <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              {t('map.banner.startDate')} *
            </label>
                       <input
                         type="date"
                         name="startDate"
                         value={bookingForm.startDate}
                         onChange={handleInputChange}
                          lang="en-GB"
                          placeholder="dd/mm/yyyy"
                         required
                         min={(() => {
                           const today = new Date().toISOString().split('T')[0];
                           if (banner.start_date) {
                             const contractStart = new Date(banner.start_date).toISOString().split('T')[0];
                             return contractStart > today ? contractStart : today;
                           }
                           return today;
                         })()}
                         max={banner.end_date ? new Date(banner.end_date).toISOString().split('T')[0] : undefined}
                         style={{
                           width: '100%',
                           padding: '16px 20px',
                           border: '2px solid #e5e7eb',
                           borderRadius: '12px',
                           fontSize: '16px',
                           backgroundColor: '#ffffff',
                           transition: 'all 0.3s ease',
                           outline: 'none',
                         }}
                         onFocus={(e) => {
                           e.target.style.borderColor = '#123a8f';
                           e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
                         }}
                         onBlur={(e) => {
                           e.target.style.borderColor = '#e5e7eb';
                           e.target.style.boxShadow = 'none';
                         }}
                       />
                     </div>
                     
                     <div style={{ marginBottom: '16px' }}>
                                   <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              {t('map.banner.endDate')} *
            </label>
                       <input
                         type="date"
                         name="endDate"
                         value={bookingForm.endDate}
                         onChange={handleInputChange}
                          lang="en-GB"
                          placeholder="dd/mm/yyyy"
                         required
                         min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                         max={banner.end_date ? new Date(banner.end_date).toISOString().split('T')[0] : undefined}
                         style={{
                           width: '100%',
                           padding: '16px 20px',
                           border: '2px solid #e5e7eb',
                           borderRadius: '12px',
                           fontSize: '16px',
                           backgroundColor: '#ffffff',
                           transition: 'all 0.3s ease',
                           outline: 'none',
                         }}
                         onFocus={(e) => {
                           e.target.style.borderColor = '#123a8f';
                           e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
                         }}
                         onBlur={(e) => {
                           e.target.style.borderColor = '#e5e7eb';
                           e.target.style.boxShadow = 'none';
                         }}
                       />
                     </div>
                     
                     <div style={{ marginBottom: '20px' }}>
                                   <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              {t('map.banner.campaignDescription')} <span style={{ color: '#6b7280', fontWeight: '400', fontSize: '12px' }}>({t('map.banner.optional')})</span>
            </label>
                       <textarea
                         name="campaignDescription"
                         value={bookingForm.campaignDescription}
                         onChange={handleInputChange}
                         placeholder="Describe your campaign and what you want to advertise..."
                         rows="4"
                         style={{
                           width: '100%',
                           padding: '16px 20px',
                           border: '2px solid #e5e7eb',
                           borderRadius: '12px',
                           fontSize: '16px',
                           backgroundColor: '#ffffff',
                           transition: 'all 0.3s ease',
                           outline: 'none',
                           resize: 'vertical',
                           fontFamily: 'inherit',
                         }}
                         onFocus={(e) => {
                           e.target.style.borderColor = '#123a8f';
                           e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
                         }}
                         onBlur={(e) => {
                           e.target.style.borderColor = '#e5e7eb';
                           e.target.style.boxShadow = 'none';
                         }}
                       />
                     </div>

                    

                                         {/* Content Upload Section */}
                     <div style={{ marginBottom: '20px' }}>
                       <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                         Upload Content (Photos/Videos)
                       </label>
                       <div style={{ 
                         marginBottom: '12px', 
                         padding: '10px 12px', 
                         background: '#fef3c7', 
                         border: '1px solid #f59e0b', 
                         borderRadius: '8px',
                         fontSize: '13px',
                         color: '#92400e',
                         fontWeight: '500'
                       }}>
                         ⚠️ Please make sure to upload high quality content 
                       </div>
                                                                      <div style={{
                          border: '2px dashed #d1d5db',
                          borderRadius: '8px',
                          padding: '20px',
                          textAlign: 'center',
                          background: '#f9fafb',
                          transition: 'border-color 0.2s ease',
                          position: 'relative',
                          cursor: isUploading ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => {
                          if (!isUploading) {
                            document.getElementById('content-upload-input').click();
                          }
                        }}
                        >
                          <input
                            id="content-upload-input"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleContentUpload}
                            disabled={isUploading}
                            style={{
                              display: 'none',
                            }}
                          />
                         <div style={{ position: 'relative', zIndex: 1 }}>
                           {isUploading ? (
                             <div style={{ color: '#6b7280' }}>
                               <div style={{
                                 width: '20px',
                                 height: '20px',
                                 border: '2px solid #d1d5db',
                                 borderTop: '2px solid #123a8f',
                                 borderRadius: '50%',
                                 animation: 'spin 1s linear infinite',
                                 margin: '0 auto 8px'
                               }} />
                               <span>Uploading...</span>
                             </div>
                           ) : (
                             <div>
                               <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                               <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                                 Click to upload or drag file here
                               </div>
                               <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                 Supports: JPG, PNG, MP4 (Max 1 file)
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                      
                      {uploadedContentUrls.length > 0 && (
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#374151', fontWeight: '500', marginBottom: '8px' }}>
                            {currentLanguage === 'ar'
                              ? `الملفات المرفوعة (${locale.n(uploadedContentUrls.length)}):`
                              : `Uploaded Files (${locale.n(uploadedContentUrls.length)}):`}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {uploadedContentUrls.map((url, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: '#f3f4f6',
                                borderRadius: '6px',
                                fontSize: '12px'
                              }}>
                                <span style={{ color: '#374151' }}>
                                  📎 {contentFiles[index]?.name || 'Unknown File'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeContentFile(index)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                                         {validationMessage && (
                       <div className="validation-message">
                         {validationMessage}
                       </div>
                     )}
                     
                     {bookingMessage && (
                       <div style={{
                         padding: '16px',
                         borderRadius: '12px',
                         marginBottom: '20px',
                         fontSize: '15px',
                         fontWeight: '500',
                         background: isSuccessBookingMessage(bookingMessage) ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#fef2f2',
                         color: isSuccessBookingMessage(bookingMessage) ? '#166534' : '#dc2626',
                         border: `2px solid ${isSuccessBookingMessage(bookingMessage) ? '#bbf7d0' : '#fecaca'}`,
                         boxShadow: isSuccessBookingMessage(bookingMessage) ? '0 4px 12px rgba(16, 185, 129, 0.15)' : '0 4px 12px rgba(220, 38, 38, 0.15)',
                         textAlign: currentLanguage === 'ar' ? 'right' : 'center',
                         lineHeight: '1.5',
                         direction: currentLanguage === 'ar' ? 'rtl' : 'ltr',
                         fontFamily: currentLanguage === 'ar' ? 'var(--font-family-ar)' : 'inherit'
                       }}>
                         {bookingMessage}
                       </div>
                     )}
                    
                                                               {/* Custom validation message styling */}
                      <style>
                        {`
                          .validation-message {
                            display: flex;
                            align-items: center;
                            background: linear-gradient(90deg, #fff1f2 80%, #ffe4e6 100%);
                            color: #b91c1c;
                            border: 1.5px solid #fecaca;
                            border-radius: 12px;
                            padding: 14px 20px;
                            margin-top: 14px;
                            margin-bottom: 16px;
                            font-weight: 600;
                            font-size: 16px;
                            box-shadow: 0 4px 16px rgba(220,38,38,0.10);
                            gap: 14px;
                            text-align: left;
                            min-height: 48px;
                            letter-spacing: 0.01;
                          }
                          
                          .validation-message::before {
                            content: "⚠️";
                            font-size: 18px;
                            margin-right: 8px;
                          }

                          

                          
                        `}
                      </style>
                     
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                       <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                         <button
                           type="button"
                           onClick={handleAddToCart}
                           style={{
                             flex: 1,
                             minWidth: '140px',
                             padding: '12px 16px',
                             background: '#fff',
                             color: '#123a8f',
                             border: '2px solid #123a8f',
                             borderRadius: '8px',
                             fontSize: '14px',
                             fontWeight: '600',
                             cursor: 'pointer',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             gap: '6px',
                           }}
                         >
                           <ShoppingCart size={16} />
                           {t('map.banner.addToCart')}
                         </button>
                         <button
                           type="submit"
                           disabled={isSubmitting}
                           style={{
                             flex: 1,
                             minWidth: '140px',
                             padding: '12px 16px',
                             background: isSubmitting ? '#9ca3af' : '#123a8f',
                             color: 'white',
                             border: 'none',
                             borderRadius: '8px',
                             fontSize: '14px',
                             fontWeight: '600',
                             cursor: isSubmitting ? 'not-allowed' : 'pointer',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center',
                             gap: '6px',
                           }}
                         >
                           {isSubmitting ? (
                             <>
                               <div
                                 style={{
                                   width: '16px',
                                   height: '16px',
                                   border: '2px solid rgba(255,255,255,0.3)',
                                   borderTop: '2px solid white',
                                   borderRadius: '50%',
                                   animation: 'spin 1s linear infinite',
                                 }}
                               />
                               …
                             </>
                           ) : (
                             <>
                               <User size={16} />
                               {t('map.banner.submitRequest')}
                             </>
                           )}
                         </button>
                       </div>
                       <button
                         type="button"
                         onClick={() => {
                           resetBookingForm();
                           setBookingMessage('');
                         }}
                         style={{
                           padding: '10px 16px',
                           background: '#f3f4f6',
                           color: '#374151',
                           border: 'none',
                           borderRadius: '8px',
                           fontSize: '14px',
                           fontWeight: '600',
                           cursor: 'pointer',
                         }}
                       >
                         Cancel
                       </button>
                     </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BannerDetailsPanel; 