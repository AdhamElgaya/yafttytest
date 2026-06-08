'use client';

import React, { useState, useEffect } from 'react';
import BannerForm from './BannerForm';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MapGL, { Marker } from 'react-map-gl';
import { MapPin, X, Upload, FileText, Shield, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import './BannerVerification.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { submitBannerRequest } from '../lib/banners';
import { createLocaleFormatters } from '../lib/localeFormat';

import { MAPBOX_TOKEN } from '../lib/mapboxToken';

const locale = createLocaleFormatters('ar');

const BannerVerificationAr = () => {
  const { user } = useAuth();
  const router = useRouter();
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

  const handleDocsUpload = async e => {
    e.preventDefault();
    setMessage('');
    setMessageStyle({});
    if (docs.length === 0) return setMessage('يرجى رفع المستندات');
    if (!bannerImageFile && !bannerImageUrl) return setMessage('يرجى رفع صورة اليافطة أولاً.');
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
      setMessage('تم إرسال طلب إضافة اليافطة! سيقوم المدير بمراجعة مستنداتك.');
      setMessageStyle({ color: 'green', fontWeight: 'bold' });
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(error.message || 'فشل الإرسال');
      setMessageStyle({ color: 'red', fontWeight: 'bold' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="banner-verification-container card-style" dir="rtl" style={{ fontFamily: 'var(--font-family-ar)' }}>
      <h2 className="section-title" style={{ textAlign: 'right', color: '#1F2937' }}>إضافة والتحقق من اليافطة</h2>
      <div className="section-subtitle" style={{ textAlign: 'right', color: '#6B7280' }}>اتبع الخطوات أدناه لإضافة يافطتك للتحقق.</div>
      
      <div className="instructions-box instructions-box--steps" style={{ textAlign: 'right' }}>
        <div className="instructions-box-header">
          <span className="instructions-box-icon" aria-hidden>
            <Info size={16} />
          </span>
          <strong className="instructions-box-title">تعليمات الأضافه</strong>
        </div>
        <ol>
          <li>
            حدد <b>الموقع الدقيق</b> ليافطتك على الخريطة أدناه.
            <span className="instruction-hint">(يمكنك سحب الدبوس لتعديل الموقع)</span>
          </li>
          <li>
            ارفع <b>صورة واضحة</b> ليافطتك.
          </li>
          <li>
            ارفع <b>جميع المستندات المطلوبة</b> (مثل إثبات الملكية، التصريح، إلخ).
          </li>
          <li>
            جميع الحقول <b>مطلوبة</b> للتحقق.
          </li>
        </ol>
      </div>

      <div className="banner-verification-content">
        <div className="map-section">
          <label className="map-label" style={{ textAlign: 'right', color: '#1F2937', fontWeight: '600' }}>
            1. تحديد موقع اليافطة <span style={{ color: 'red', fontWeight: 700 }}>*</span>
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
                direction: 'rtl'
              }}>
                <MapPin size={16} color={isDragging ? "#dc2626" : "#123a8f"} />
                <span style={{ color: isDragging ? '#dc2626' : '#475569', fontSize: '14px' }}>
                  {isDragging ? 'جاري تحريك الدبوس...' : `تم التثبيت في: ${locale.decimal(form.coordinates.latitude, 5)}, ${locale.decimal(form.coordinates.longitude, 5)}`}
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: isDragging ? '#dc2626' : '#059669', 
                  fontStyle: 'italic',
                  marginRight: 'auto'
                }}>
                  {isDragging ? 'اترك لتحديد الموقع' : 'اسحب للتعديل'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="instructions-box" style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
            color: '#123a8f', 
            borderRadius: 10, 
            padding: 16, 
            marginBottom: 16, 
            fontWeight: 600, 
            fontSize: 15, 
            boxShadow: '0 2px 8px rgba(18, 58, 143, 0.08)',
            border: '1px solid #e2e8f0',
            textAlign: 'right'
          }}>
            2. ارفع صورة واضحة ليافطتك <span style={{ color: 'red', fontWeight: 700 }}>*</span>
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
              <div className="instructions-box" style={{ 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                color: '#123a8f', 
                borderRadius: 10, 
                padding: 16, 
                marginBottom: 12, 
                fontWeight: 600, 
                fontSize: 15, 
                boxShadow: '0 2px 8px rgba(18, 58, 143, 0.08)',
                border: '1px solid #e2e8f0',
                textAlign: 'right'
              }}>
                3. ارفع جميع المستندات المطلوبة (PDF، إثبات الملكية، التصريح، إلخ) <span style={{ color: 'red', fontWeight: 700 }}>*</span>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                border: '2px solid #f59e0b', 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 12,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'right'
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
                  direction: 'rtl'
                }}>
                  <span id="fraud-arrow" style={{ 
                    transition: 'transform 0.3s ease',
                    fontSize: '16px'
                  }}>▶</span>
                  <span>لماذا نطلب هذه المستندات؟</span>
                </div>
                <div id="fraud-prevention-details" style={{ 
                  display: 'none',
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #fbbf24',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#92400e',
                  textAlign: 'right'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>🛡️ منع الاحتيال:</strong> نطلب هذه المستندات للتحقق من ملكية اليافطة الشرعية ومنع القوائم الاحتيالية.
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>📋 الامتثال القانوني:</strong> يضمن أن جميع اليافطات تلتزم باللوائح المحلية ولديها التصاريح المناسبة.
                  </p>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>✅ ضمان الجودة:</strong> يساعد في الحفاظ على معايير عالية وحماية أصحاب اليافطات والمعلنين.
                  </p>
                  <p style={{ margin: '0' }}>
                    <strong>🔒 أمان البيانات:</strong> جميع المستندات مشفرة ومخزنة بأمان. نحن لا نشارك معلوماتك الشخصية أبداً.
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
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#123a8f';
              e.currentTarget.style.background = 'linear-gradient(135deg, #edf2f7 0%, #f7fafc 100%)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e0';
              e.currentTarget.style.background = 'linear-gradient(135deg, #f7fafc 0%, #ffffff 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
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
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)'
                  }}>
                    <Upload size={32} color="white" />
                  </div>
                  <h4 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#2d3748', 
                    marginBottom: '12px' 
                  }}>
                    رفع المستندات
                  </h4>
                  <p style={{ 
                    fontSize: '15px', 
                    color: '#4a5568',
                    marginBottom: '16px',
                    fontWeight: '500'
                  }}>
                    انقر للرفع أو اسحب وأفلت
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
                      📄 ملفات PDF فقط • حد أقصى 4 ملفات
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
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                    title="إزالة جميع المستندات"
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
                      <CheckCircle size={24} color="white" />
                    </div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: '700', 
                      color: '#059669',
                      marginBottom: '8px'
                    }}>
                      تم اختيار المستندات ({locale.n(docs.length)})
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#059669',
                      fontWeight: '500',
                      marginBottom: '16px'
                    }}>
                      {locale.n(docs.length)} ملف PDF جاهز للرفع
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
                        direction: 'rtl',
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
                          textAlign: 'right',
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
                    انقر لإضافة المزيد أو استخدم X لإزالة الملفات الفردية
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
                minHeight: '48px',
                width: '100%',
                background: 'linear-gradient(135deg, #123a8f 0%, #123a8f 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                padding: '12px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(18, 58, 143, 0.3)'
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
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                'إرسال المستندات'
              )}
            </button>
          </form>

          {docUrls.length > 0 && (
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #f0fff4 0%, #dcfce7 100%)', 
              borderRadius: '12px',
              border: '2px solid #9ae6b4',
              textAlign: 'right'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#22543d', fontSize: '16px', fontWeight: '600' }}>
                ✅ المستندات المرفوعة ({locale.n(docUrls.length)})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {docUrls.map((url, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: 'white',
                    borderRadius: '8px',
                    border: '1px solid #9ae6b4',
                    direction: 'rtl'
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
                      📄 المستند {i + 1}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {message && <p className="message-info" style={{...messageStyle, textAlign: 'right', padding: '12px', borderRadius: '8px', margin: '16px 0'}}>{message}</p>}
          {submitted && <p style={{ color: '#fbbf24', fontWeight: 'bold', textAlign: 'right' }}>طلبك في انتظار مراجعة المدير.</p>}
          
          {/* Validation Status */}
          {!submitted && (
            <div style={{ 
              marginTop: '16px', 
              padding: '16px', 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              fontSize: '14px',
              textAlign: 'right'
            }}>
              <h5 style={{ margin: '0 0 12px 0', color: '#2d3748', fontWeight: '600' }}>حالة الحقول المطلوبة:</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <span style={{ color: form.coordinates ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.coordinates ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  تحديد موقع اليافطة على الخريطة
                </span>
                <span style={{ color: (bannerImageFile || bannerImageUrl) ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {bannerImageFile || bannerImageUrl ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  رفع صورة اليافطة
                </span>
                <span style={{ color: form.location.trim() ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.location.trim() ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  وصف الموقع
                </span>
                <span style={{ color: form.size.trim() ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.size.trim() ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  حجم اليافطة
                </span>
                <span style={{ color: form.type ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {form.type ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  نوع اليافطة المحدد
                </span>
                <span style={{ color: docs.length > 0 ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {docs.length > 0 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                  المستندات المختارة ({locale.n(docs.length)})
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerVerificationAr;
