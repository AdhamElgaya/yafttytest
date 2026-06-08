'use client';

import React, { useState, useEffect } from 'react';
import BannerForm from './BannerForm';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import MapGL, { Marker } from 'react-map-gl';
import { MapPin, X, Upload, FileText, Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import './BannerVerification.css';
import { useLocaleFormat } from '../hooks/useLocaleFormat';
import 'mapbox-gl/dist/mapbox-gl.css';
import { submitBannerRequest } from '../lib/banners';

import { MAPBOX_TOKEN } from '../lib/mapboxToken';

const BannerVerification = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const locale = useLocaleFormat();
  const [form, setForm] = useState({
    country: 'EG',
    location: '',
    size: '',
    type: 'RGB',
    traffic: 'moderate',
    pricePerMonth: 1000,
    coordinates: null,
  });
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [docs, setDocs] = useState([]);
  const [docUrls, setDocUrls] = useState([]);
  const [message, setMessage] = useState('');
  const [messageStyle, setMessageStyle] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 26.8206,
    longitude: 30.8025,
    zoom: 5.2,
    bearing: 0,
    pitch: 0,
  });
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains('dark-mode'));
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-mode'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!user || (user.accountType !== 'bannerOwner' && user.accountType !== 'banner_owner')) {
      router.push('/');
    }
  }, [user, router]);

  const handleMapClick = (e) => {
    const { lngLat } = e;
    setForm(f => ({ ...f, coordinates: { latitude: lngLat.lat, longitude: lngLat.lng } }));
    setViewport(v => ({ ...v, latitude: lngLat.lat, longitude: lngLat.lng, zoom: 13 }));
  };

  const handleMarkerDragStart = () => {
    setIsDragging(true);
  };

  const handleMarkerDrag = (e) => {
    const { lngLat } = e;
    setForm(f => ({ ...f, coordinates: { latitude: lngLat.lat, longitude: lngLat.lng } }));
  };

  const handleMarkerDragEnd = (e) => {
    const { lngLat } = e;
    setForm(f => ({ ...f, coordinates: { latitude: lngLat.lat, longitude: lngLat.lng } }));
    setIsDragging(false);
  };

  const handleDocs = e => {
    setDocs(Array.from(e.target.files));
  };

  const removeDocument = (index) => {
    setDocs(prevDocs => prevDocs.filter((_, i) => i !== index));
    setDocUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  const removeAllDocuments = () => {
    setDocs([]);
    setDocUrls([]);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Arabic translations
  const isArabic = currentLanguage === 'ar';
  
  const translations = {
    title: isArabic ? 'إضافة والتحقق من اليافطة' : 'Banner Add & Verification',
    subtitle: isArabic ? 'اتبع الخطوات أدناه لإضافة يافطتك للتحقق.' : 'Follow the steps below to add your banner for verification.',
    stepsNoticeTitle: isArabic ? 'تعليمات الأضافه' : 'Important Notice',
    instructions: isArabic ? [
      'حدد الموقع الدقيق ليافطتك على الخريطة أدناه. (يمكنك سحب الدبوس لتعديل الموقع)',
      'ارفع صورة واضحة ليافطتك.',
      'ارفع جميع المستندات المطلوبة (مثل إثبات الملكية، التصريح، إلخ).',
      'جميع الحقول مطلوبة للتحقق.'
    ] : [
      'Pin the exact location of your banner on the map below. (You can drag the pin to adjust the location)',
      'Upload a clear photo of your banner.',
      'Upload all required documents (e.g., ownership proof, permit, etc.).',
      'All fields are required for verification.'
    ],
    pinLocation: isArabic ? '1. تحديد موقع اليافطة' : '1. Pin Banner Location',
    uploadBanner: isArabic ? '2. ارفع صورة واضحة ليافطتك' : '2. Upload a clear photo of your banner',
    uploadDocs: isArabic ? '3. ارفع جميع المستندات المطلوبة (PDF، إثبات الملكية، التصريح، إلخ)' : '3. Upload all required documents (PDF, ownership proof, permit, etc.)',
    whyDocuments: isArabic ? 'لماذا نطلب هذه المستندات؟' : 'Why do we ask for these documents?',
    fraudPrevention: isArabic ? 'منع الاحتيال:' : '🛡️ Fraud Prevention:',
    fraudText: isArabic ? 'نطلب هذه المستندات للتحقق من ملكية اليافطة الشرعية ومنع القوائم الاحتيالية.' : 'We require these documents to verify legitimate banner ownership and prevent fraudulent listings.',
    legalCompliance: isArabic ? 'الامتثال القانوني:' : '📋 Legal Compliance:',
    legalText: isArabic ? 'يضمن أن جميع اليافطات تلتزم باللوائح المحلية ولديها التصاريح المناسبة.' : 'Ensures all banners meet local regulations and have proper permits.',
    qualityAssurance: isArabic ? 'ضمان الجودة:' : '✅ Quality Assurance:',
    qualityText: isArabic ? 'يساعد في الحفاظ على معايير عالية وحماية أصحاب اليافطات والمعلنين.' : 'Helps maintain high standards and protects both banner owners and advertisers.',
    dataSecurity: isArabic ? 'أمان البيانات:' : '🔒 Data Security:',
    securityText: isArabic ? 'جميع المستندات مشفرة ومخزنة بأمان. نحن لا نشارك معلوماتك الشخصية أبداً.' : 'All documents are encrypted and stored securely. We never share your personal information.',
    uploadDocuments: isArabic ? 'رفع المستندات' : 'Upload Documents',
    clickToUpload: isArabic ? 'انقر للرفع أو اسحب وأفلت' : 'Click to upload or drag and drop',
    pdfOnly: isArabic ? 'ملفات PDF فقط • حد أقصى 4 ملفات' : '📄 PDF files only • Max 4 files',
    documentsSelected: isArabic ? 'تم اختيار المستندات' : 'Documents Selected',
    filesReady: isArabic ? 'ملف PDF جاهز للرفع' : 'PDF file ready for upload',
    clickToAddMore: isArabic ? 'انقر لإضافة المزيد أو استخدم X لإزالة الملفات الفردية' : 'Click to add more or use X to remove individual files',
    sendDocuments: isArabic ? 'إرسال المستندات' : 'Send Documents',
    submitting: isArabic ? 'جاري الإرسال...' : 'Submitting...',
    uploadedDocuments: isArabic ? 'المستندات المرفوعة' : '✅ Uploaded Documents',
    document: isArabic ? 'المستند' : 'Document',
    requestPending: isArabic ? 'طلبك في انتظار مراجعة المدير.' : 'you can close the website',
    requiredFieldsStatus: isArabic ? 'حالة الحقول المطلوبة:' : 'Required Fields Status:',
    mapLocationPinned: isArabic ? 'تحديد موقع اليافطة على الخريطة' : 'Map Location Pinned',
    bannerImageUploaded: isArabic ? 'رفع صورة اليافطة' : 'Banner Image Uploaded',
    locationDescription: isArabic ? 'وصف الموقع' : 'Location Description',
    bannerSize: isArabic ? 'حجم اليافطة' : 'Banner Size',
    bannerTypeSelected: isArabic ? 'نوع اليافطة المحدد' : 'Banner Type Selected',
    documentsSelectedCount: isArabic ? 'المستندات المختارة' : 'Documents Selected',
    pleaseUploadDocuments: isArabic ? 'يرجى رفع المستندات' : 'Please upload documents',
    pleaseUploadBannerImage: isArabic ? 'يرجى رفع صورة اليافطة أولاً.' : 'Please upload a banner image first.',
    bannerAddRequestSubmitted: isArabic ? 'تم إرسال طلب إضافة اليافطة! سيقوم المدير بمراجعة مستنداتك.' : 'Banner add request submitted! your Documents are under review',
    submissionFailed: isArabic ? 'فشل الإرسال' : 'Submission failed',
    removeAllDocuments: isArabic ? 'إزالة جميع المستندات' : 'Remove all documents'
  };

  const handleDocsUpload = async e => {
    e.preventDefault();
    setMessage('');
    setMessageStyle({});
    if (docs.length === 0) return setMessage(translations.pleaseUploadDocuments);
    if (!bannerImageFile && !bannerImageUrl) return setMessage(translations.pleaseUploadBannerImage);
    setMessageStyle({ color: 'red', fontWeight: 'bold' });
    
    setIsSubmitting(true);

    try {
      await submitBannerRequest({
        ownerProfileId: user._id || user.id,
        location: form.location,
        size: form.size,
        type: form.type,
        traffic: form.traffic,
        pricePerMonth: form.pricePerMonth,
        coordinates: form.coordinates,
        bannerImageUrl,
        bannerImageFile,
        documentFiles: docs,
      });
      setSubmitted(true);
      setMessage(translations.bannerAddRequestSubmitted);
      setMessageStyle({ color: 'green', fontWeight: 'bold' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.message || translations.submissionFailed);
      setMessageStyle({ color: 'red', fontWeight: 'bold' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="banner-verification-container card-style" dir={isArabic ? 'rtl' : 'ltr'} style={{ fontFamily: isArabic ? 'var(--font-family-ar)' : 'inherit' }}>
      <h2 className="section-title" style={{ textAlign: isArabic ? 'right' : 'left', color: '#1F2937' }}>{translations.title}</h2>
      <div className="section-subtitle" style={{ textAlign: isArabic ? 'right' : 'left', color: '#6B7280' }}>{translations.subtitle}</div>
      <div
        className="instructions-box instructions-box--steps"
        style={{ textAlign: isArabic ? 'right' : 'left' }}
      >
        <div className="instructions-box-header">
          <span className="instructions-box-icon" aria-hidden>
            <Info size={16} />
          </span>
          <strong className="instructions-box-title">{translations.stepsNoticeTitle}</strong>
        </div>
        <ol>
          {translations.instructions.map((instruction, index) => (
            <li key={index}>
              {instruction.includes('exact location') || instruction.includes('الموقع الدقيق') ? (
                <>
                  {instruction.split('(')[0]}
                  <span className="instruction-hint">
                    ({instruction.split('(')[1]?.split(')')[0]})
                  </span>
                </>
              ) : (
                instruction
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className="banner-verification-content">
        <div className="map-section">
          <label className="map-label" style={{ textAlign: isArabic ? 'right' : 'left', color: '#1F2937', fontWeight: '600' }}>
            {translations.pinLocation} <span style={{ color: 'red', fontWeight: 700 }}>*</span>
          </label>
          <div className="mapbox-container">
            <MapGL
              {...viewport}
              width="100%"
              height="320px"
              mapStyle={'mapbox://styles/mapbox/streets-v11'}
              onMove={evt => setViewport(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              onClick={handleMapClick}
            >
              {form.coordinates && (
                <Marker 
                  latitude={form.coordinates.latitude} 
                  longitude={form.coordinates.longitude} 
                  anchor="bottom"
                  draggable={true}
                  onDragStart={handleMarkerDragStart}
                  onDrag={handleMarkerDrag}
                  onDragEnd={handleMarkerDragEnd}
                >
                  <MapPin 
                    size={32} 
                    color={isDragging ? "#dc2626" : "#123a8f"} 
                    fill={isDragging ? "#dc2626" : "#123a8f"} 
                    style={{ 
                      filter: `drop-shadow(0 2px 8px ${isDragging ? '#dc262633' : '#123a8f33'})`, 
                      cursor: isDragging ? 'grabbing' : 'grab',
                      transition: 'all 0.2s ease'
                    }} 
                  />
                </Marker>
              )}
            </MapGL>
            {form.coordinates && (
              <div className="coords-info" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                animation: 'fadeIn 0.3s ease',
                background: isDragging ? '#fef2f2' : '#f1f5f9',
                border: isDragging ? '1px solid #fecaca' : 'none',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '8px',
                direction: isArabic ? 'rtl' : 'ltr'
              }}>
                <MapPin size={16} color={isDragging ? "#dc2626" : "#123a8f"} />
                <span style={{ color: isDragging ? '#dc2626' : '#475569', fontSize: '14px' }}>
                  {isDragging ? (isArabic ? 'جاري تحريك الدبوس...' : 'Moving pin...') : 
                    (isArabic
                      ? `تم التثبيت في: ${locale.decimal(form.coordinates.latitude, 5)}, ${locale.decimal(form.coordinates.longitude, 5)}`
                      : `Pinned at: ${locale.decimal(form.coordinates.latitude, 5)}, ${locale.decimal(form.coordinates.longitude, 5)}`)}
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: isDragging ? '#dc2626' : '#059669', 
                  fontStyle: 'italic',
                  marginLeft: isArabic ? '0' : 'auto',
                  marginRight: isArabic ? 'auto' : '0'
                }}>
                  {isDragging ? (isArabic ? 'اترك لتحديد الموقع' : 'Release to set location') : 
                   (isArabic ? 'اسحب للتعديل' : 'Drag to adjust')}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="form-section">
          <div
            className="banner-section-label"
            style={{ textAlign: isArabic ? 'right' : 'left' }}
          >
            {translations.uploadBanner} <span style={{ color: 'red', fontWeight: 700 }}>*</span>
          </div>
                     <BannerForm
             onImageUploaded={(url, file) => {
               setBannerImageUrl(url);
               setBannerImageFile(file);
             }}
             onFormChange={setForm}
             form={form}
           />
          <form onSubmit={handleDocsUpload} style={{ marginTop: 24 }}>
                         <div style={{ marginBottom: 12 }}>
               <div
                 className="banner-section-label"
                 style={{ textAlign: isArabic ? 'right' : 'left', marginBottom: 12 }}
               >
                 {translations.uploadDocs} <span style={{ color: 'red', fontWeight: 700 }}>*</span>
               </div>
               <div style={{ 
                 background: '#fef3c7', 
                 border: '1px solid #f59e0b', 
                 borderRadius: '8px', 
                 padding: '12px', 
                 marginBottom: '8px',
                 cursor: 'pointer',
                 transition: 'all 0.2s ease'
               }}
               onClick={() => {
                 const details = document.getElementById('fraud-prevention-details');
                 const arrow = document.getElementById('fraud-arrow');
                 if (details.style.display === 'none' || !details.style.display) {
                   details.style.display = 'block';
                   arrow.style.transform = 'rotate(90deg)';
                 } else {
                   details.style.display = 'none';
                   arrow.style.transform = 'rotate(0deg)';
                 }
               }}
               >
                 <div style={{ 
                   display: 'flex', 
                   alignItems: 'center', 
                   gap: '8px',
                   color: '#92400e',
                   fontWeight: '600',
                   fontSize: '14px',
                   direction: isArabic ? 'rtl' : 'ltr'
                 }}>
                   <span id="fraud-arrow" style={{ 
                     transition: 'transform 0.3s ease',
                     fontSize: '16px'
                   }}>▶</span>
                   <span>{translations.whyDocuments}</span>
                 </div>
                 <div id="fraud-prevention-details" style={{ 
                   display: 'none',
                   marginTop: '12px',
                   paddingTop: '12px',
                   borderTop: '1px solid #fbbf24',
                   fontSize: '13px',
                   lineHeight: '1.6',
                   color: '#92400e',
                   textAlign: isArabic ? 'right' : 'left'
                 }}>
                   <p style={{ margin: '0 0 8px 0' }}>
                     <strong>{translations.fraudPrevention}</strong> {translations.fraudText}
                   </p>
                   <p style={{ margin: '0 0 8px 0' }}>
                     <strong>{translations.legalCompliance}</strong> {translations.legalText}
                   </p>
                   <p style={{ margin: '0 0 8px 0' }}>
                     <strong>{translations.qualityAssurance}</strong> {translations.qualityText}
                   </p>
                   <p style={{ margin: '0' }}>
                     <strong>{translations.dataSecurity}</strong> {translations.securityText}
                   </p>
                 </div>
               </div>
             </div>
                                                   <div style={{
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
                marginBottom: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#123a8f';
                e.currentTarget.style.background = 'linear-gradient(135deg, #edf2f7 0%, #f7fafc 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e0';
                e.currentTarget.style.background = 'linear-gradient(135deg, #f7fafc 0%, #ffffff 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
              }}
              onClick={() => document.getElementById('document-upload-input').click()}
              >
                <input 
                  id="document-upload-input"
                  type="file" 
                  accept="application/pdf" 
                  multiple 
                  onChange={handleDocs} 
                  required 
                  style={{
                    position: 'absolute',
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                />
                
                {docs.length === 0 ? (
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
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </div>
                    <h4 style={{ 
                      fontSize: '20px', 
                      fontWeight: '700', 
                      color: '#2d3748', 
                      marginBottom: '12px' 
                    }}>
                      {translations.uploadDocuments}
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
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '20px',
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                      <span style={{ fontSize: '12px', color: '#123a8f', fontWeight: '600' }}>
                        {translations.pdfOnly}
                      </span>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', position: 'relative', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAllDocuments();
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
                      title={translations.removeAllDocuments}
                    >
                      <X size={24} />
                    </button>
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M9 12l2 2 4-4"/>
                          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                        </svg>
                      </div>
                      <h4 style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: '#059669',
                        marginBottom: '8px'
                      }}>
                        {translations.documentsSelected} ({locale.n(docs.length)})
                      </h4>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#059669',
                        fontWeight: '500',
                        marginBottom: '16px'
                      }}>
                        {locale.n(docs.length)} {translations.filesReady}
                      </p>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '8px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      width: '100%',
                      minWidth: 0
                    }}>
                      {docs.map((doc, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          padding: '8px 12px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                          width: '100%',
                          minWidth: 0,
                          boxSizing: 'border-box'
                        }}>
                          <span style={{ 
                            fontSize: '13px', 
                            color: '#059669',
                            fontWeight: '500',
                            flex: 1,
                            minWidth: 0,
                            textAlign: 'left',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word'
                          }}>
                            📄 {doc.name}
                          </span>
                          
                        </div>
                      ))}
                    </div>
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#059669',
                      fontWeight: '600',
                      marginTop: '12px'
                    }}>
                      {translations.clickToAddMore}
                    </p>
                  </div>
                )}
              </div>
                         <button 
               type="submit" 
               disabled={(!bannerImageFile && !bannerImageUrl) || !form.location.trim() || !form.size.trim() || !form.coordinates || docs.length === 0 || submitted || isSubmitting} 
               className="btn-primary"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px',
                 position: 'relative',
                 minHeight: '48px'
               }}
             >
               {isSubmitting ? (
                 <>
                   <div 
                     style={{
                       width: '20px',
                       height: '20px',
                       border: '2px solid rgba(255,255,255,0.3)',
                       borderTop: '2px solid white',
                       borderRadius: '50%',
                       animation: 'spin 1s linear infinite'
                     }}
                   />
                   <span>{translations.submitting}</span>
                 </>
               ) : (
                 translations.sendDocuments
               )}
            </button>
          </form>
          

          {docUrls.length > 0 && (
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              background: '#f0fff4', 
              borderRadius: '8px',
              border: '1px solid #9ae6b4'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#22543d', fontSize: '16px', textAlign: isArabic ? 'right' : 'left' }}>
                {translations.uploadedDocuments} ({locale.n(docUrls.length)})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {docUrls.map((url, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: '6px',
                    border: '1px solid #9ae6b4'
                  }}>
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        fontSize: '14px', 
                        color: '#22543d',
                        textDecoration: 'none',
                        fontWeight: '500'
                      }}
                    >
                      📄 {translations.document} {i + 1}
                    </a>
                    
                  </div>
                ))}
              </div>
            </div>
          )}
          {message && <p className="message-info" style={{...messageStyle, textAlign: isArabic ? 'right' : 'left', padding: '12px', borderRadius: '8px', margin: '16px 0'}}>{message}</p>}
          {submitted && <p style={{ color: '#fbbf24', fontWeight: 'bold', textAlign: isArabic ? 'right' : 'left' }}>{translations.requestPending}</p>}
          
          {/* Validation Status */}
          {!submitted && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '14px'
            }}>
              <h5 style={{ margin: '0 0 8px 0', color: '#2d3748', textAlign: isArabic ? 'right' : 'left' }}>{translations.requiredFieldsStatus}</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                <span style={{ color: form.coordinates ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.coordinates ? '✅' : '❌'} {translations.mapLocationPinned}
                </span>
                <span style={{ color: (bannerImageFile || bannerImageUrl) ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {(bannerImageFile || bannerImageUrl) ? '✅' : '❌'} {translations.bannerImageUploaded}
                </span>
                <span style={{ color: form.location.trim() ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.location.trim() ? '✅' : '❌'} {translations.locationDescription}
                </span>
                <span style={{ color: form.size.trim() ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.size.trim() ? '✅' : '❌'} {translations.bannerSize}
                </span>
                <span style={{ color: form.type ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.type ? '✅' : '❌'} {translations.bannerTypeSelected}
                </span>
                <span style={{ color: docs.length > 0 ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {docs.length > 0 ? '✅' : '❌'} {translations.documentsSelectedCount} ({locale.n(docs.length)})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerVerification; 