'use client';

import React, { useState } from 'react';
import { Upload, Image, MapPin, FileText, X, DollarSign, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { parseEgpAmount } from '../lib/money';
import './BannerVerification.css';

const BannerForm = ({ onImageUploaded, onFormChange, form }) => {
  const [imagePreview, setImagePreview] = useState('');
  const { currentLanguage } = useLanguage();
  
  // Arabic translations
  const isArabic = currentLanguage === 'ar';
  
  const translations = {
    bannerImage: isArabic ? 'صورة اليافطة' : 'Banner Image',
    uploadBannerImage: isArabic ? 'رفع صورة اليافطة' : 'Upload Banner Image',
    clickToUpload: isArabic ? 'انقر للرفع أو اسحب وأفلت' : 'Click to upload or drag and drop',
    fileFormats: isArabic ? '📁 JPG، PNG، GIF • حد أقصى 5 ميجابايت' : '📁 JPG, PNG, GIF • Max 5MB',
    removeImage: isArabic ? 'إزالة الصورة' : 'Remove image',
    imageUploadedSuccessfully: isArabic ? 'تم اختيار الصورة. سيتم رفعها عند إرسال المستندات.' : 'Image selected. It will upload when you send documents.',
    country: isArabic ? 'الدولة' : 'Country',
    egypt: isArabic ? 'مصر' : 'Egypt',
    locationDescription: isArabic ? 'وصف الموقع' : 'Location Description',
    locationPlaceholder: isArabic ? 'أدخل عنوان الشارع أو وصف الموقع (مثل "الشارع الرئيسي، منطقة وسط البلد")' : 'Enter the street address or location description (e.g., \'Main Street, Downtown Area\')',
    bannerSize: isArabic ? 'حجم اليافطة' : 'Banner Size',
    sizePlaceholder: isArabic ? 'أدخل الأبعاد (مثل "10x5" أو "20 x 15")' : 'Enter dimensions (e.g., \'10x5\' or \'20 x 15\')',
    sizeFormatError: isArabic ? 'يرجى استخدام التنسيق: رقم x رقم (مثل "10x5" أو "20 x 15")' : 'Please use format: number x number (e.g., "10x5" or "20 x 15")',
    validFormat: isArabic ? 'تنسيق صحيح! مثال: 10x5، 20 x 15، 3.5x2.1' : 'Valid format! Example: 10x5, 20 x 15, 3.5x2.1',
    bannerType: isArabic ? 'نوع اليافطة' : 'Banner Type',
    rgbFullColor: isArabic ? 'RGB (ألوان كاملة)' : 'RGB (Full Color)',
    monochrome: isArabic ? 'أحادي اللون (لون واحد)' : 'Monochrome (Single Color)',
    ledDisplay: isArabic ? 'شاشة LED' : 'LED Display',
    digitalScreen: isArabic ? 'شاشة رقمية' : 'Digital Screen',
    trafficLevel: isArabic ? 'مستوى المرور' : 'Traffic Level',
    lowTraffic: isArabic ? 'مرور منخفض' : 'Low Traffic',
    moderateTraffic: isArabic ? 'مرور متوسط' : 'Moderate Traffic',
    highTraffic: isArabic ? 'مرور عالي' : 'High Traffic',
    pricePerMonth: isArabic ? 'السعر شهرياً (جنيه مصري)' : 'Price per Month (EGP)',
    pricePlaceholder: isArabic ? 'أدخل السعر شهرياً بالجنيه المصري (مثل 5000)' : 'Enter price per month in EGP (e.g., 5000)',
    priceTip: isArabic ? '💡 نصيحة: ضع في اعتبارك الموقع والحجم والمرور عند تحديد السعر' : '💡 Tip: Consider location, size, and traffic when setting your price'
  };

  const handlePhoto = (e) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      onImageUploaded('', file);
    };
    reader.readAsDataURL(file);
    input.value = '';
  };

  const removeImage = () => {
    setImagePreview('');
    onImageUploaded('', null);
    const fileInput = document.getElementById('banner-image-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleInputChange = (field, value) => {
    // Special validation for size field
    if (field === 'size') {
      // Only allow numbers, 'x', 'X', spaces, and common units
      const cleanedValue = value.replace(/[^0-9xX\sftm\.]/g, '');
      
      // If user is typing, allow the input but show validation
      if (cleanedValue !== value) {
        // Don't update if invalid characters are entered
        return;
      }
      
      // Update the form with cleaned value
      onFormChange({ ...form, [field]: cleanedValue });
    } else {
      onFormChange({ ...form, [field]: value });
    }
  };

  const validateSizeFormat = (size) => {
    if (!size) return { isValid: false, message: '' };
    
    // Check for pattern like "10x5", "20 x 15", "3.5x2.1", etc.
    const sizePattern = /^\d+(\.\d+)?\s*[xX]\s*\d+(\.\d+)?(\s*[ftm]+)?$/;
    const isValid = sizePattern.test(size);
    
    let message = '';
    if (size && !isValid) {
      message = translations.sizeFormatError;
    }
    
    return { isValid, message };
  };

  return (
    <div dir={isArabic ? 'rtl' : 'ltr'} style={{ fontFamily: isArabic ? 'var(--font-family-ar)' : 'inherit' }}>
      {/* Banner Image Upload */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#2d3748', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: isArabic ? 'right' : 'left'
        }}>
          <Image size={20} color="#123a8f" />
          {translations.bannerImage}
        </label>
        <label
          htmlFor="banner-image-input"
          style={{
          border: '2px dashed #cbd5e0',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f7fafc 0%, #ffffff 100%)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          display: 'block'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#123a8f';
          e.currentTarget.style.background = 'linear-gradient(135deg, #edf2f7 0%, #f7fafc 100%)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(18, 58, 143, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#cbd5e0';
          e.currentTarget.style.background = 'linear-gradient(135deg, #f7fafc 0%, #ffffff 100%)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        }}
        >
          <input 
            id="banner-image-input"
            type="file" 
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handlePhoto}
            style={{ display: 'none' }}
          />
          
          {!imagePreview ? (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 15px rgba(18, 58, 143, 0.3)'
              }}>
                <Image size={40} color="white" />
              </div>
              <h4 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#2d3748', 
                marginBottom: '12px' 
              }}>
                {translations.uploadBannerImage}
              </h4>
              <p style={{ 
                fontSize: '15px', 
                color: '#4a5568',
                marginBottom: '16px',
                fontWeight: '500'
              }}>
                {translations.clickToUpload}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(18, 58, 143, 0.1)',
                borderRadius: '20px',
                border: '1px solid rgba(18, 58, 143, 0.2)'
              }}>
                <span style={{ fontSize: '12px', color: '#123a8f', fontWeight: '600' }}>
                  {translations.fileFormats}
                </span>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeImage();
                }}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}
                title={translations.removeImage}
              >
                <X size={24} />
              </button>
              <img 
                src={imagePreview} 
                alt="Banner preview" 
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
              <p style={{ 
                fontSize: '14px', 
                color: '#48bb78',
                fontWeight: '600'
              }}>
                {translations.imageUploadedSuccessfully}
              </p>
            </div>
          )}
        </label>
      </div>

      {/* Country */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="banner-country"
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '12px',
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          {translations.country}
        </label>
        <select
          id="banner-country"
          className="banner-form-select"
          value={form.country || 'EG'}
          onChange={(e) => handleInputChange('country', e.target.value)}
          style={{ direction: isArabic ? 'rtl' : 'ltr' }}
        >
          <option value="EG">{translations.egypt}</option>
        </select>
      </div>

      {/* Location Input */}
      <div style={{ marginBottom: '20px' }}>
        <label
          htmlFor="banner-location"
          style={{
            display: 'block',
            fontSize: '16px',
            fontWeight: '600',
            color: '#2d3748',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: isArabic ? 'right' : 'left',
          }}
        >
          <MapPin size={20} color="#123a8f" />
          {translations.locationDescription}
        </label>
        <input
          id="banner-location"
          type="text"
          placeholder={translations.locationPlaceholder}
          value={form.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            background: '#ffffff'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#123a8f';
            e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Size Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#2d3748', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: isArabic ? 'right' : 'left'
        }}>
          <FileText size={20} color="#123a8f" />
          {translations.bannerSize}
        </label>
        <input
          type="text"
          placeholder={translations.sizePlaceholder}
          value={form.size}
          onChange={(e) => handleInputChange('size', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            border: `2px solid ${validateSizeFormat(form.size).isValid ? '#10b981' : form.size ? '#ef4444' : '#e2e8f0'}`,
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            background: '#ffffff'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#123a8f';
            e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
          }}
          onBlur={(e) => {
            const validation = validateSizeFormat(form.size);
            e.target.style.borderColor = validation.isValid ? '#10b981' : form.size ? '#ef4444' : '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
        {form.size && !validateSizeFormat(form.size).isValid && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            {validateSizeFormat(form.size).message}
          </div>
        )}
        {form.size && validateSizeFormat(form.size).isValid && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '16px' }}>✅</span>
            {translations.validFormat}
          </div>
        )}
      </div>

      {/* Type Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#2d3748', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: isArabic ? 'right' : 'left'
        }}>
          <FileText size={20} color="#123a8f" />
          {translations.bannerType}
        </label>
        <select
          value={form.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            background: '#ffffff',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#123a8f';
            e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="RGB">{translations.rgbFullColor}</option>
          <option value="Monochrome">{translations.monochrome}</option>
          <option value="LED">{translations.ledDisplay}</option>
          <option value="Digital">{translations.digitalScreen}</option>
        </select>
      </div>

      {/* Traffic Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#2d3748', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: isArabic ? 'right' : 'left'
        }}>
          <FileText size={20} color="#123a8f" />
          {translations.trafficLevel}
        </label>
        <select
          value={form.traffic || 'moderate'}
          onChange={(e) => handleInputChange('traffic', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            background: '#ffffff',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#123a8f';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="low">{translations.lowTraffic}</option>
          <option value="moderate">{translations.moderateTraffic}</option>
          <option value="high">{translations.highTraffic}</option>
        </select>
      </div>

      {/* Price Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#2d3748', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: isArabic ? 'right' : 'left'
        }}>
          <DollarSign size={20} color="#123a8f" />
          {translations.pricePerMonth}
        </label>
        <input
          type="number"
          placeholder={translations.pricePlaceholder}
          value={form.pricePerMonth || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === '') {
              handleInputChange('pricePerMonth', '');
              return;
            }
            const digitsOnly = value.replace(/[^\d]/g, '');
            if (digitsOnly === '') {
              handleInputChange('pricePerMonth', '');
              return;
            }
            handleInputChange('pricePerMonth', parseEgpAmount(digitsOnly));
          }}
          min="0"
          step="1"
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            background: '#ffffff'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#123a8f';
            e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
        <div style={{ 
          fontSize: '14px', 
          color: '#64748b', 
          marginTop: '8px',
          fontStyle: 'italic',
          textAlign: isArabic ? 'right' : 'left'
        }}>
          {translations.priceTip}
        </div>
      </div>

      {/* User Type Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '16px', 
          fontWeight: '600', 
          color: '#2d3748', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textAlign: isArabic ? 'right' : 'left'
        }}>
          <FileText size={20} color="#123a8f" />
          {isArabic ? 'نوع المستخدم' : 'User Type'}
        </label>
        <select
          value={form.userType || ''}
          onChange={(e) => handleInputChange('userType', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            border: '2px solid #e2e8f0',
            borderRadius: '12px',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            background: '#ffffff',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#123a8f';
            e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        >
          <option value="">{isArabic ? 'اختر نوع المستخدم' : 'Select User Type'}</option>
          <option value="banner_owner">{isArabic ? 'مالك اليافطة' : 'Banner Owner'}</option>
          <option value="advertising_agency">{isArabic ? 'وكالة إعلانية' : 'Advertising Agency'}</option>
        </select>
        
        <div className="banner-info-notice" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="banner-info-notice-title">
            <span className="banner-info-notice-icon" aria-hidden>
              <Info size={16} />
            </span>
            {isArabic ? 'الفرق بين الأنواع:' : 'Difference between types:'}
          </div>
          <div>
            <div style={{ marginBottom: '6px' }}>
              <strong>{isArabic ? 'مالك اليافطة:' : 'Banner Owner:'} </strong>
              {isArabic ? 'تملك اليافطة بشكل دائم وتديره بنفسك' : 'You own the banner permanently and manage it yourself'}
            </div>
            <div>
              <strong>{isArabic ? 'وكالة إعلانية:' : 'Advertising Agency:'} </strong>
              {isArabic ? 'تستأجر اليافطة من الحكومة لفترة محددة' : 'You lease the banner from the government for a specific period'}
            </div>
          </div>
        </div>
      </div>

      {/* Contract Duration - Only show for Advertising Agency */}
      {form.userType === 'advertising_agency' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '16px', 
            fontWeight: '600', 
            color: '#2d3748', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: isArabic ? 'right' : 'left'
          }}>
            <FileText size={20} color="#123a8f" />
            {isArabic ? 'مدة العقد' : 'Contract Duration'}
          </label>
          
          {/* Forever Checkbox */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              padding: '12px 16px',
              background: form.contractForever ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#f8fafc',
              border: `2px solid ${form.contractForever ? '#10b981' : '#e2e8f0'}`,
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}>
              <input
                type="checkbox"
                checked={form.contractForever || false}
                onChange={(e) => handleInputChange('contractForever', e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  accentColor: '#10b981'
                }}
              />
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: form.contractForever ? '#059669' : '#374151'
              }}>
                {isArabic ? 'عقد دائم (بدون انتهاء)' : 'Permanent Contract (No Expiry)'}
              </span>
            </label>
          </div>

          {/* Date Range - Only show if not forever */}
          {!form.contractForever && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  {isArabic ? 'تاريخ البداية' : 'Start Date'}
                </label>
                <input
                  type="date"
                  value={form.contractStartDate || ''}
                  onChange={(e) => handleInputChange('contractStartDate', e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: '#ffffff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#123a8f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  {isArabic ? 'تاريخ الانتهاء' : 'End Date'}
                </label>
                <input
                  type="date"
                  value={form.contractEndDate || ''}
                  onChange={(e) => handleInputChange('contractEndDate', e.target.value)}
                  required
                  min={form.contractStartDate ? (() => {
                    const startDate = new Date(form.contractStartDate);
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    startDate.setDate(startDate.getDate() + 1);
                    // End date must be after start date AND not today (must be tomorrow or later)
                    const minDate = startDate > tomorrow ? startDate : tomorrow;
                    return minDate.toISOString().split('T')[0];
                  })() : (() => {
                    // If no start date, minimum is tomorrow (cannot be today)
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    return tomorrow.toISOString().split('T')[0];
                  })()}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: '#ffffff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#123a8f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(18, 58, 143, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Contract Duration Info */}
          <div style={{
            marginTop: '12px',
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '1px solid #f59e0b',
            borderRadius: '10px',
            fontSize: '13px',
            color: '#92400e'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {isArabic ? '📅 معلومات العقد:' : '📅 Contract Information:'}
            </div>
            <div style={{ lineHeight: '1.5' }}>
              {isArabic 
                ? 'سيتم إشعارك قبل انتهاء العقد بـ 7 أيام. يمكن تجديد العقد من خلال لوحة الإدارة.'
                : 'You will be notified 7 days before contract expiry. Contract can be renewed through admin dashboard.'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerForm; 